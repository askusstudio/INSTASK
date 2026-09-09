// INSTASK - 30-Day Growth Plan Generation Engine
// POST /api/generate-plan

import { NextResponse } from 'next/server';
import { generate30DayGrowthPlan } from '@/lib/gemini';
import { renderPostAsset } from '@/lib/creatomate';
import { scrapeCompetitorInstagram } from '@/lib/apify';
import { prisma, memoryStore, PostRecord } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      brandName,
      location,
      productSummary,
      brandColor = '#e1306c',
      logoUrl,
      competitors = [],
      language = 'en',
      handle = 'my_artisan_shop',
      igUserId,
    } = body;

    if (!brandName || !productSummary) {
      return NextResponse.json(
        { error: 'Brand name and product summary are required.' },
        { status: 400 }
      );
    }

    // Step A: Competitor Intelligence Ingestion
    const competitorInsights = await scrapeCompetitorInstagram(competitors);

    // Step B: Gemini 2.5 Flash Strategy & Multilingual Copywriting
    const generatedItems = await generate30DayGrowthPlan({
      brandName,
      location,
      productSummary,
      competitors,
      language,
    });

    // Step C: Parallel Asset Rendering via Creatomate (Strict 1:1 & 4:5 ratios + SVG fallback)
    const renderPromises = generatedItems.map(async (item) => {
      const renderResult = await renderPostAsset({
        templateId: item.template_id,
        aspectRatio: item.aspect_ratio,
        brandName,
        brandColor,
        handle,
        headline: item.headline,
        bullets: item.body_bullets,
        theme: item.theme,
        dayNumber: item.day,
        logoUrl,
      });

      return {
        ...item,
        mediaUrl: renderResult.mediaUrl,
        mediaAspectRatio: renderResult.aspectRatio,
        isFallbackAsset: renderResult.isFallback,
      };
    });

    const renderedPosts = await Promise.all(renderPromises);

    // Step D: Persistence in Prisma / Supabase (with resilient memory fallback)
    const accountId = 'acc_user_main';
    const now = new Date();

    // Store in memoryStore first to guarantee immediate availability
    memoryStore.accounts.set(accountId, {
      id: accountId,
      userId: 'usr_main',
      igUserId: igUserId || '17841400000000000',
      username: handle,
      brandName,
      city: location,
      productSummary,
      brandColor,
      logoUrl,
      targetTimezone: 'UTC',
      language,
      autoPilotEnabled: false,
      createdAt: now,
      updatedAt: now,
    });

    // Save competitors
    for (const comp of competitorInsights) {
      const compId = `comp_${comp.handle}_${Date.now()}`;
      memoryStore.competitors.set(compId, {
        id: compId,
        accountId,
        handle: comp.handle,
        scrapedPostsCount: comp.totalPostsAnalyzed,
        avgEngagementRate: comp.avgEngagementRate,
        hashtagClusters: comp.hashtagClusters,
        topHooks: comp.topHooks,
        rawMetrics: comp.formatBreakdown,
        lastScrapedAt: now,
        createdAt: now,
      });
    }

    // Save posts
    const createdPosts: PostRecord[] = [];
    // Clear old posts for this account in demo memory store
    for (const [id, post] of Array.from(memoryStore.posts.entries())) {
      if (post.accountId === accountId) memoryStore.posts.delete(id);
    }

    for (const post of renderedPosts) {
      const postId = `post_day_${post.day}_${Date.now()}`;
      const postRecord: PostRecord = {
        id: postId,
        accountId,
        dayNumber: post.day,
        scheduledTime: new Date(post.scheduled_time),
        theme: post.theme,
        headline: post.headline,
        bodyBullets: post.body_bullets,
        caption: post.caption,
        hashtags: post.hashtags,
        templateId: post.template_id,
        mediaType: 'IMAGE',
        mediaUrl: post.mediaUrl,
        mediaAspectRatio: post.mediaAspectRatio,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };

      memoryStore.posts.set(postId, postRecord);
      createdPosts.push(postRecord);
    }

    // Also attempt PostgreSQL persistence if Prisma client is connected
    if (prisma) {
      try {
        await prisma.account.upsert({
          where: { id: accountId },
          update: {
            brandName,
            city: location,
            productSummary,
            brandColor,
            logoUrl,
            language,
            updatedAt: now,
          },
          create: {
            id: accountId,
            userId: 'usr_main',
            brandName,
            city: location,
            productSummary,
            brandColor,
            logoUrl,
            language,
          },
        });

        // Batch insert or replace posts
        await prisma.post.deleteMany({ where: { accountId } });
        await prisma.post.createMany({
          data: createdPosts.map((p) => ({
            id: p.id,
            accountId: p.accountId,
            dayNumber: p.dayNumber,
            scheduledTime: new Date(p.scheduledTime),
            theme: p.theme,
            headline: p.headline,
            bodyBullets: p.bodyBullets,
            caption: p.caption,
            hashtags: p.hashtags,
            templateId: p.templateId,
            mediaType: p.mediaType,
            mediaUrl: p.mediaUrl,
            mediaAspectRatio: p.mediaAspectRatio,
            status: p.status,
          })),
        });
      } catch (dbErr) {
        console.warn('Postgres database write skipped, served from memory store:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '30-day autonomous growth plan generated successfully.',
      competitorInsightsCount: competitorInsights.length,
      postsCount: createdPosts.length,
      posts: createdPosts,
    });
  } catch (error: any) {
    console.error('Error generating growth plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate growth plan' },
      { status: 500 }
    );
  }
}
