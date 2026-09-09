// INSTASK - Competitor Ingestion API Route with Credit Gatekeeper
// POST /api/competitors/scrape

import { NextResponse } from 'next/server';
import { scrapeCompetitorInstagram } from '@/lib/apify';
import { deductCredits, addCredits } from '@/lib/credits';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  let userId: string | null = null;
  let creditsCost = 0;
  let creditsDeducted = false;

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    const handles = body?.handles;

    if (!Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of competitor handles (e.g. ["@brand1", "@brand2"])' },
        { status: 400 }
      );
    }

    // 1. Strict User Authentication Resolution
    try {
      const session = await getServerSession(authOptions);
      if (session?.user && (session.user as { id?: string }).id) {
        userId = (session.user as { id?: string }).id!;
      }
    } catch {
      // Session fetch error handled below
    }

    if (!userId && body?.userId) {
      userId = body.userId;
    }

    // Block unauthenticated requests in production
    if (!userId) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized: User authentication required' }, { status: 401 });
      }
      userId = 'usr_demo_001';
    }

    // 2. Cost Calculation: Multi-audit (15 credits) vs Single (5 credits)
    creditsCost = handles.length > 1 ? 15 : 5;

    // 3. Deduct Credits
    const deduction = await deductCredits(
      userId,
      creditsCost,
      'COMPETITOR_SCRAPE',
      `Competitor audit for ${handles.length} handle(s): ${handles.slice(0, 3).join(', ')}`
    );

    if (!deduction.success) {
      return NextResponse.json(
        { error: deduction.error || 'Insufficient credits balance', code: 'CREDITS_EXHAUSTED' },
        { status: 402 }
      );
    }

    creditsDeducted = true;

    // 4. Perform Intelligence Scrape
    const sanitizedHandles = handles.map((h: string) => h.trim().replace(/^@/, ''));
    const insights = await scrapeCompetitorInstagram(sanitizedHandles);

    return NextResponse.json({
      success: true,
      count: insights?.length || 0,
      insights: insights || [],
      creditsRemaining: deduction.balanceRemaining,
    });
  } catch (error: any) {
    console.error('Error scraping competitors:', error);

    // Rollback: Refund user credits if scraping failed after deduction
    if (creditsDeducted && userId && creditsCost > 0) {
      try {
        await addCredits(
          userId,
          creditsCost,
          'PAID_TOPUP',
          'Refund: Competitor scrape job execution failed'
        );
      } catch (refundErr) {
        console.error('Failed to refund credits during execution error:', refundErr);
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to scrape competitors' },
      { status: 500 }
    );
  }
}