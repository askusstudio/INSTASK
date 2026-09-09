// INSTASK - Industry Strategy & Trend Recommendation API Route
// POST /api/recommendations/generate

import { NextResponse } from 'next/server';
import { generateIndustryRecommendations } from '@/lib/recommendations';
import { scrapeCompetitorInstagram } from '@/lib/apify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      brandName = 'Our Brand',
      industry = 'Artisan Bakery & Cafe',
      location = 'Local',
      productSummary = 'Handcrafted quality products made daily with premium ingredients.',
      competitors = [],
      language = 'en',
    } = body;

    // Step 1: Ingest competitor metrics
    const competitorInsights = await scrapeCompetitorInstagram(competitors);

    // Step 2: Generate Niche Intelligence Synthesis & Blueprint
    const blueprint = await generateIndustryRecommendations({
      brandName,
      industry,
      location,
      productSummary,
      competitors,
      competitorInsights,
      language,
    });

    return NextResponse.json({
      success: true,
      blueprint,
      competitorCount: competitorInsights.length,
    });
  } catch (error: any) {
    console.error('Error generating strategy blueprint recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
