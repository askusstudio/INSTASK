import { NextResponse } from 'next/server';
import { getBrandByUserId, upsertBrand, memoryStore } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_demo_001';

    const brand = await getBrandByUserId(userId);
    if (!brand) {
      // Fall back to first stored brand or demo
      const firstBrand = Array.from(memoryStore.brands.values())[0] || null;
      return NextResponse.json({ success: true, brand: firstBrand });
    }

    return NextResponse.json({ success: true, brand });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'usr_demo_001',
      brandName,
      industry,
      country = 'US',
      currency = 'USD',
      website = '',
      instagramHandle = '',
      logoUrl = '',
    } = body;

    if (!brandName || !industry) {
      return NextResponse.json(
        { success: false, error: 'Brand name and industry are required.' },
        { status: 400 }
      );
    }

    const cleanHandle = instagramHandle.replace(/^@/, '').trim();

    const brand = await upsertBrand({
      userId,
      brandName: brandName.trim(),
      industry: industry.trim(),
      country,
      currency,
      website: website ? website.trim() : null,
      instagramHandle: cleanHandle || null,
      logoUrl: logoUrl ? logoUrl.trim() : null,
    });

    // Also update linked account brandName in memoryStore for dashboard synchronization
    const account = Array.from(memoryStore.accounts.values())[0];
    if (account) {
      account.brandName = brand.brandName;
      if (cleanHandle) account.username = cleanHandle;
      if (country) account.country = country;
    }

    return NextResponse.json({ success: true, brand });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
