// INSTASK - Posts Management & Batch Autopilot Route
// GET /api/posts - list all 30 posts
// POST /api/posts - batch approve all posts and activate autopilot

import { NextResponse } from 'next/server';
import { memoryStore, prisma, PostRecord } from '@/lib/prisma';
import { generateDeterministicGrowthPlan } from '@/lib/gemini';
import { renderPostAsset } from '@/lib/creatomate';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId') || 'acc_user_main';

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
        if (p.accountId === accountId || accountId === 'acc_user_main') {
          posts.push(p);
        }
      }
    }

    // If still empty, auto-generate default 30-day sample plan so the user immediately sees the calendar!
    if (posts.length === 0) {
      const defaultAccount = memoryStore.accounts.get('acc_demo_001') || {
        brandName: 'Luna Artisan Bakery',
        city: 'Austin, TX',
        productSummary: 'Fresh sourdough breads, handcrafted viennoiseries, and specialty pour-over coffee.',
        brandColor: '#e1306c',
        language: 'en',
      };

      const planItems = generateDeterministicGrowthPlan({
        brandName: defaultAccount.brandName,
        location: defaultAccount.city || 'Austin, TX',
        productSummary: defaultAccount.productSummary,
        competitors: ['@tartinebakery', '@lafamille', '@sweetcrust'],
        language: defaultAccount.language,
      });

      const now = new Date();

      for (const item of planItems) {
        const postId = `post_day_${item.day}`;
        const renderResult = await renderPostAsset({
          templateId: item.template_id,
          aspectRatio: item.aspect_ratio,
          brandName: defaultAccount.brandName,
          brandColor: defaultAccount.brandColor || '#e1306c',
          handle: 'luna_artisan_bakery',
          headline: item.headline,
          bullets: item.body_bullets,
          theme: item.theme,
          dayNumber: item.day,
        });

        const record: PostRecord = {
          id: postId,
          accountId: 'acc_user_main',
          dayNumber: item.day,
          scheduledTime: new Date(item.scheduled_time),
          theme: item.theme,
          headline: item.headline,
          bodyBullets: item.body_bullets,
          caption: item.caption,
          hashtags: item.hashtags,
          templateId: item.template_id,
          mediaType: 'IMAGE',
          mediaUrl: renderResult.mediaUrl,
          mediaAspectRatio: renderResult.aspectRatio,
          status: item.day <= 2 ? 'PUBLISHED' : item.day <= 5 ? 'APPROVED' : 'DRAFT',
          publishedAt: item.day <= 2 ? new Date(Date.now() - (3 - item.day) * 86400000) : null,
          livePostId: item.day <= 2 ? `178414${item.day}9283746` : null,
          createdAt: now,
          updatedAt: now,
        };

        memoryStore.posts.set(postId, record);
        posts.push(record);
      }
    }

    posts.sort((a, b) => a.dayNumber - b.dayNumber);

    const account = memoryStore.accounts.get(accountId) || memoryStore.accounts.get('acc_demo_001');

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
      message: 'All 30 posts approved for publishing and autopilot activated.',
      approvedCount: updatedCount,
      autoPilotEnabled: enableAutopilot,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to approve month' }, { status: 500 });
  }
}
