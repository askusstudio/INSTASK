// INSTASK - Competitor Ingestion API Route
// POST /api/competitors/scrape

import { NextResponse } from 'next/server';
import { scrapeCompetitorInstagram } from '@/lib/apify';

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

    const insights = await scrapeCompetitorInstagram(handles);

    return NextResponse.json({
      success: true,
      count: insights.length,
      insights,
    });
  } catch (error: any) {
    console.error('Error scraping competitors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape competitors' },
      { status: 500 }
    );
  }
}
