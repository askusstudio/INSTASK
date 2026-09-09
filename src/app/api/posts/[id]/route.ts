// INSTASK - Single Post Management & Re-generation Route
// PATCH /api/posts/[id] - update post fields or status
// POST /api/posts/[id] - re-render graphic or re-generate copy

import { NextResponse } from 'next/server';
import { memoryStore, prisma, PostRecord } from '@/lib/prisma';
import { renderPostAsset } from '@/lib/creatomate';
import { deductCredits } from '@/lib/credits';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();

    let post = memoryStore.posts.get(postId);
    if (!post) {
      if (postId.startsWith('post_demo')) {
        post = {
          id: postId,
          accountId: 'acc_demo_001',
          dayNumber: 1,
          scheduledTime: new Date(),
          theme: 'Behind the Scenes & Craft',
          headline: 'Fresh Out of the Oven',
          bodyBullets: ['Fermented 36 hours', '100% wild yeast starter'],
          caption: 'The secret to sourdough is patience.',
          hashtags: ['#artisanbread', '#sourdough'],
          templateId: 'template_quote',
          mediaType: 'IMAGE',
          mediaAspectRatio: '1:1',
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.posts.set(postId, post);
      } else {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    if (body.headline !== undefined) post.headline = body.headline;
    if (body.bodyBullets !== undefined) post.bodyBullets = body.bodyBullets;
    if (body.caption !== undefined) post.caption = body.caption;
    if (body.hashtags !== undefined) post.hashtags = body.hashtags;
    if (body.scheduledTime !== undefined) post.scheduledTime = new Date(body.scheduledTime);
    if (body.status !== undefined) post.status = body.status;
    if (body.mediaAspectRatio !== undefined) post.mediaAspectRatio = body.mediaAspectRatio;
    post.updatedAt = new Date();

    memoryStore.posts.set(postId, post);

    if (prisma) {
      try {
        await prisma.post.update({
          where: { id: postId },
          data: {
            headline: post.headline,
            bodyBullets: post.bodyBullets,
            caption: post.caption,
            hashtags: post.hashtags,
            scheduledTime: new Date(post.scheduledTime),
            status: post.status,
            mediaAspectRatio: post.mediaAspectRatio,
          },
        });
      } catch (err) {
        console.warn('Prisma single post update skipped:', err);
      }
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update post' }, { status: 500 });
  }
}

// POST: Re-generate graphic or re-render (2 credits)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json().catch(() => ({}));

    let post = memoryStore.posts.get(postId);
    if (!post) {
      if (postId.startsWith('post_demo')) {
        post = {
          id: postId,
          accountId: 'acc_demo_001',
          dayNumber: 1,
          scheduledTime: new Date(),
          theme: 'Behind the Scenes & Craft',
          headline: 'Fresh Out of the Oven',
          bodyBullets: ['Fermented 36 hours', '100% wild yeast starter'],
          caption: 'The secret to sourdough is patience.',
          hashtags: ['#artisanbread', '#sourdough'],
          templateId: 'template_quote',
          mediaType: 'IMAGE',
          mediaAspectRatio: '1:1',
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.posts.set(postId, post);
      } else {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
    }

    const account = memoryStore.accounts.get(post.accountId) || {
      userId: 'usr_demo_001',
      brandName: 'Luna Artisan Bakery',
      brandColor: '#e1306c',
      username: 'artisan_luna_bakery',
    };

    const userId = body.userId || account.userId || 'usr_demo_001';

    // Deduct 2 credits for regenerating a single post creative
    const deduction = await deductCredits(
      userId,
      2,
      'REGENERATION',
      `Regenerated creative for post ${postId}`
    );

    if (!deduction.success) {
      return NextResponse.json(
        { error: deduction.error, code: 'CREDITS_EXHAUSTED' },
        { status: 402 } // Payment Required
      );
    }

    // Toggle aspect ratio if requested or re-render
    const targetAspectRatio = body.aspectRatio || post.mediaAspectRatio || '1:1';

    const renderResult = await renderPostAsset({
      templateId: post.templateId || undefined,
      aspectRatio: targetAspectRatio,
      brandName: account.brandName,
      brandColor: account.brandColor || '#e1306c',
      handle: account.username || 'artisan_shop',
      headline: body.headline || post.headline,
      bullets: body.bodyBullets || post.bodyBullets,
      theme: post.theme,
      dayNumber: post.dayNumber,
    });

    post.mediaUrl = renderResult.mediaUrl;
    post.mediaAspectRatio = renderResult.aspectRatio;
    post.updatedAt = new Date();
    memoryStore.posts.set(postId, post);

    if (prisma) {
      try {
        await prisma.post.update({
          where: { id: postId },
          data: {
            mediaUrl: post.mediaUrl,
            mediaAspectRatio: post.mediaAspectRatio,
          },
        });
      } catch (err) {
        console.warn('Prisma asset update skipped:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Graphic asset re-rendered successfully.',
      post,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to regenerate post asset' }, { status: 500 });
  }
}
