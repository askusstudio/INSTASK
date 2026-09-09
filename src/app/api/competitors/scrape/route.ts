// INSTASK - Competitor Ingestion API Route with Credit Gatekeeper
// POST /api/competitors/scrape

import { NextResponse } from 'next/server';
import { scrapeCompetitorInstagram } from '@/lib/apify';
import { deductCredits } from '@/lib/credits';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handles = body.handles;

    if (!Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of competitor handles (e.g. ["@brand1", "@brand2"])' },
        { status: 400 }
      );
    }

    // Resolve requesting user
    let userId = body.userId || 'usr_demo_001';
    try {
      const session = await getServerSession(authOptions);
      if (session?.user && (session.user as { id?: string }).id) {
        userId = (session.user as { id?: string }).id!;
      }
    } catch {
      // Use fallback userId
    }

    // Initial 5-Competitor Audit: 15 credits. Ad-hoc single competitor deep-dive: 5 credits.
    const creditsCost = handles.length > 1 ? 15 : 5;
    const deduction = await deductCredits(
      userId,
      creditsCost,
      'COMPETITOR_SCRAPE',
      `Competitor intelligence audit for ${handles.length} handle(s): ${handles.slice(0, 3).join(', ')}`
    );

    if (!deduction.success) {
      return NextResponse.json(
        { error: deduction.error, code: 'CREDITS_EXHAUSTED' },
        { status: 402 } // Payment Required
      );
    }

    const insights = await scrapeCompetitorInstagram(handles);

    return NextResponse.json({
      success: true,
      count: insights.length,
      insights,
      creditsRemaining: deduction.balanceRemaining,
    });
  } catch (error: any) {
    console.error('Error scraping competitors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape competitors' },
      { status: 500 }
    );
  }
}
