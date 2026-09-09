// INSTASK - Automated Publishing Worker
// POST /api/cron/publish or GET /api/cron/publish (for web-based triggers & QStash)

import { NextResponse } from 'next/server';
import { verifyCronRequest } from '@/lib/qstash';
import { publishToInstagram } from '@/lib/meta-graph';
import { prisma, memoryStore, PostRecord } from '@/lib/prisma';

export async function POST(request: Request) {
  return handlePublishCron(request);
}

export async function GET(request: Request) {
  return handlePublishCron(request);
}

async function handlePublishCron(request: Request) {
  try {
    // 1. Authenticate cron trigger
    const auth = await verifyCronRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized cron request', reason: auth.reason }, { status: 401 });
    }

    const now = new Date();
    const publishedResults: Array<{ postId: string; livePostId?: string; status: string; error?: string }> = [];

    // 2. Fetch candidates: posts WHERE scheduledTime <= NOW() AND status = 'APPROVED'
    let duePosts: PostRecord[] = [];

    if (prisma) {
      try {
        const dbPosts = await prisma.post.findMany({
          where: {
            scheduledTime: { lte: now },
            status: 'APPROVED',
          },
          include: { account: true },
        });

        duePosts = dbPosts.map((p) => ({
          ...p,
          scheduledTime: p.scheduledTime,
          bodyBullets: p.bodyBullets as string[],
          hashtags: p.hashtags as string[],
          mediaType: p.mediaType as 'IMAGE' | 'CAROUSEL' | 'REEL',
          mediaAspectRatio: p.mediaAspectRatio as '1:1' | '4:5',
          status: p.status as 'APPROVED',
        }));
      } catch (dbErr) {
        console.warn('Prisma query failed, falling back to memory store:', dbErr);
      }
    }

    // Fallback: Check memoryStore if DB returned empty or wasn't connected
    if (duePosts.length === 0) {
      for (const post of Array.from(memoryStore.posts.values())) {
        const postTime = new Date(post.scheduledTime).getTime();
        // Also allow publishing approved posts for test triggers
        if (post.status === 'APPROVED' && postTime <= now.getTime()) {
          duePosts.push(post);
        }
      }

      // If no past posts are due but approved posts exist, pick the first approved post for immediate test execution if explicitly requested
      const url = new URL(request.url);
      if (duePosts.length === 0 && url.searchParams.get('force') === 'true') {
        for (const post of Array.from(memoryStore.posts.values())) {
          if (post.status === 'APPROVED') {
            duePosts.push(post);
            break;
          }
        }
      }
    }

    if (duePosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts currently due for publication.',
        publishedCount: 0,
        timestamp: now.toISOString(),
      });
    }

    // 3. Process each due post through Meta Graph API v21.0 workflow
    for (const post of duePosts) {
      const account = memoryStore.accounts.get(post.accountId);
      const accessToken = account?.accessToken || process.env.META_ACCESS_TOKEN || '';
      const igUserId = account?.igUserId || process.env.META_IG_USER_ID || '17841400000000000';

      const fullCaption = `${post.caption}\n\n${(post.hashtags || []).join(' ')}`;

      // Execute container create -> poll -> media_publish
      const result = await publishToInstagram({
        igUserId,
        accessToken,
        imageUrl: post.mediaUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1080&auto=format&fit=crop',
        caption: fullCaption,
      });

      if (result.success && result.livePostId) {
        // Update in memory store
        post.status = 'PUBLISHED';
        post.containerId = result.containerId;
        post.livePostId = result.livePostId;
        post.publishedAt = now;
        post.errorMessage = null;
        post.updatedAt = now;
        memoryStore.posts.set(post.id, post);

        // Update in Postgres if available
        if (prisma) {
          try {
            await prisma.post.update({
              where: { id: post.id },
              data: {
                status: 'PUBLISHED',
                containerId: result.containerId,
                livePostId: result.livePostId,
                publishedAt: now,
                errorMessage: null,
              },
            });
          } catch (err) {
            console.warn('DB update failed for published post:', err);
          }
        }

        publishedResults.push({
          postId: post.id,
          livePostId: result.livePostId,
          status: 'PUBLISHED',
        });
      } else {
        // Mark as failed
        post.status = 'FAILED';
        post.errorMessage = result.error || 'Meta publishing failed';
        post.updatedAt = now;
        memoryStore.posts.set(post.id, post);

        if (prisma) {
          try {
            await prisma.post.update({
              where: { id: post.id },
              data: {
                status: 'FAILED',
                errorMessage: result.error || 'Meta publishing failed',
              },
            });
          } catch (err) {
            console.warn('DB update failed for failed post:', err);
          }
        }

        publishedResults.push({
          postId: post.id,
          status: 'FAILED',
          error: result.error,
        });
      }
    }

    return NextResponse.json({
      success: true,
      publishedCount: publishedResults.filter((r) => r.status === 'PUBLISHED').length,
      failedCount: publishedResults.filter((r) => r.status === 'FAILED').length,
      results: publishedResults,
      timestamp: now.toISOString(),
    });
  } catch (err: any) {
    console.error('Publishing worker encountered unhandled error:', err);
    return NextResponse.json(
      { error: err.message || 'Cron publishing error' },
      { status: 500 }
    );
  }
}
