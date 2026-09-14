// INSTASK - Posts Management & Batch Autopilot Route
// GET /api/posts - list all posts
// POST /api/posts - batch approve all posts and activate autopilot

import { NextResponse } from 'next/server';
import { memoryStore, prisma, PostRecord } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId') || 'acc_user_main';
    const isReset = url.searchParams.get('reset') === 'true';

    // Fresh setup wipe trigger (clears cached test runs for dynamic client demos)
    if (isReset) {
      memoryStore.accounts.delete(accountId);
      for (const [id, post] of Array.from(memoryStore.posts.entries())) {
        if (post.accountId === accountId) {
          memoryStore.posts.delete(id);
        }
      }
      return NextResponse.json({
        success: true,
        count: 0,
        posts: [],
        account: null,
      });
    }

    let posts: PostRecord[] = [];

    // Check Postgres first
    if (prisma) {
      try {
        const dbPosts = await prisma.post.findMany({
          where: { accountId },
          orderBy: { dayNumber: 'asc' },
        });

        if (dbPosts.length > 0) {
          posts = dbPosts.map((p) => ({
            ...p,
            scheduledTime: p.scheduledTime,
            bodyBullets: p.bodyBullets as string[],
            hashtags: p.hashtags as string[],
            mediaType: p.mediaType as 'IMAGE' | 'CAROUSEL' | 'REEL',
            mediaAspectRatio: p.mediaAspectRatio as '1:1' | '4:5',
            status: p.status as any,
          }));
        }
      } catch (err) {
        console.warn('Prisma fetch failed, using memory store:', err);
      }
    }

    // Check memory store
    if (posts.length === 0) {
      for (const p of Array.from(memoryStore.posts.values())) {
        if (p.accountId === accountId) {
          posts.push(p);
        }
      }
    }

    posts.sort((a, b) => a.dayNumber - b.dayNumber);

    let account = memoryStore.accounts.get(accountId) || null;

    // Filter out dummy/stale cache entries
    if (
      account &&
      (account.username?.includes('artisan_luna') ||
        account.brandName?.includes('Luna Artisan') ||
        account.username === 'brand' ||
        account.username === 'yourbrand')
    ) {
      account = null;
    }

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
      account,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Batch approve all 30 posts ("Approve Entire Month & Turn On Auto-Pilot")
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const accountId = body.accountId || 'acc_user_main';
    const enableAutopilot = body.enableAutopilot !== false;

    let updatedCount = 0;

    // Update in memoryStore
    for (const post of Array.from(memoryStore.posts.values())) {
      if (post.status === 'DRAFT') {
        post.status = 'APPROVED';
        post.updatedAt = new Date();
        updatedCount++;
      }
    }

    // Update account autopilot
    const acc = memoryStore.accounts.get(accountId);
    if (acc) {
      acc.autoPilotEnabled = enableAutopilot;
      acc.updatedAt = new Date();
    }

    // Update in PostgreSQL if connected
    if (prisma) {
      try {
        await prisma.post.updateMany({
          where: {
            accountId,
            status: 'DRAFT',
          },
          data: {
            status: 'APPROVED',
          },
        });

        await prisma.account.update({
          where: { id: accountId },
          data: { autoPilotEnabled: enableAutopilot },
        });
      } catch (err) {
        console.warn('Prisma batch update skipped, handled by memory store:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All posts approved for publishing and autopilot activated.',
      approvedCount: updatedCount,
      autoPilotEnabled: enableAutopilot,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to approve month' }, { status: 500 });
  }
}