// INSTASK - 30-Day Growth Plan Generation Engine
// POST /api/generate-plan

import { NextResponse } from 'next/server';
import { generate30DayGrowthPlan } from '@/lib/gemini';
import { renderPostAsset } from '@/lib/creatomate';
import { scrapeCompetitorInstagram } from '@/lib/apify';
import { prisma, memoryStore, PostRecord } from '@/lib/prisma';
import { deductCredits } from '@/lib/credits';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      brandName,
      location,
      productSummary,
      industry = 'General Business',
      brandColor = '#e1306c',
      logoUrl,
      competitors = [],
      language = 'en',
      handle = 'yourbrand',
      igUserId,
      userId = 'usr_main',
      selectedTemplateId,
    } = body;

    // Step 1: Validate Brand Information
    if (!brandName || !productSummary) {
      return NextResponse.json(
        { error: 'Brand name and product summary are required.' },
        { status: 400 }
      );
    }

    // Safe Credit Deduction
    try {
      await deductCredits(
        userId,
        10,
        'COPY_GENERATION',
        `Monthly Strategy & 30-Day Copy generation for ${brandName}`
      );
    } catch (creditErr) {
      console.warn('Credit deduction warning (bypassed for trial generation):', creditErr);
    }

    // Step 2: Competitor Intelligence & Current Trend Research
    const competitorInsights = await scrapeCompetitorInstagram(competitors);

    // Generate trend-aware 30-day strategy using Gemini
    const generatedItems = await generate30DayGrowthPlan({
      brandName,
      location,
      productSummary,
      competitors,
      language,
    });

    // Step 3: Exact Graphic Rendering for Every Calendar Post (Industry & Brand Aware)
    const renderPromises = generatedItems.map(async (item: any) => {
      const templateId = selectedTemplateId || item.template_id || 'tpl_minimal_editorial';
      const aspectRatio = item.aspect_ratio || '1:1';

      try {
        const renderResult = await renderPostAsset({
          templateId,
          aspectRatio,
          brandName,
          industry,
          brandColor,
          handle,
          headline: item.headline,
          bullets: item.body_bullets || [],
          theme: item.theme,
          dayNumber: item.day,
          logoUrl,
        });

        return {
          ...item,
          mediaUrl: renderResult.mediaUrl,
          mediaAspectRatio: renderResult.aspectRatio || aspectRatio,
          isFallbackAsset: renderResult.isFallback || false,
        };
      } catch (renderErr) {
        console.warn(`Render retry triggered for Day ${item.day}:`, renderErr);
        
        // Re-call directly to obtain clean non-duplicating indexed fallback
        const recoveryAsset = await renderPostAsset({
          aspectRatio,
          brandName,
          industry,
          handle,
          headline: item.headline,
          bullets: item.body_bullets || [],
          theme: item.theme,
          dayNumber: item.day,
        });

        return {
          ...item,
          mediaUrl: recoveryAsset.mediaUrl,
          mediaAspectRatio: aspectRatio,
          isFallbackAsset: true,
        };
      }
    });

    const renderedPosts = await Promise.all(renderPromises);

    // Step 4: Storage Setup
    const accountId = 'acc_user_main';
    const now = new Date();

    memoryStore.accounts.set(accountId, {
      id: accountId,
      userId,
      igUserId: igUserId || 'pending_meta_auth',
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

    // Save competitor metrics
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

    // Clean old drafts and map new posts
    for (const [id, post] of Array.from(memoryStore.posts.entries())) {
      if (post.accountId === accountId) memoryStore.posts.delete(id);
    }

    const createdPosts: PostRecord[] = [];

    for (const post of renderedPosts) {
      const postId = `post_day_${post.day}_${Date.now()}`;
      const postRecord: PostRecord = {
        id: postId,
        accountId,
        dayNumber: post.day,
        scheduledTime: new Date(post.scheduled_time || Date.now() + post.day * 86400000),
        theme: post.theme,
        headline: post.headline,
        bodyBullets: post.body_bullets || [],
        caption: post.caption,
        hashtags: post.hashtags || [],
        templateId: post.template_id || 'tpl_minimal_editorial',
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

    // Postgres persistence fallback
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
            userId,
            brandName,
            city: location,
            productSummary,
            brandColor,
            logoUrl,
            language,
          },
        });

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
        console.warn('Postgres write bypassed, serving live memory store:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '30-day autonomous growth plan and exact post graphics generated successfully.',
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