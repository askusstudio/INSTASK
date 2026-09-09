import { NextResponse } from 'next/server';
import { upsertBrand, memoryStore, prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'usr_demo_001',
      brandName,
      industry = 'General',
      primaryColor,
      accentColor,
      country = 'US',
      currency = 'USD',
      website = '',
      instagramHandle = '',
      logoUrl = '',
    } = body;

    if (!brandName) {
      return NextResponse.json(
        { success: false, error: 'Brand name is required.' },
        { status: 400 }
      );
    }

    const cleanHandle = (instagramHandle || '').replace(/^@/, '').trim();

    const brand = await upsertBrand({
      userId,
      brandName: brandName.trim(),
      industry: (industry || 'General').trim(),
      country,
      currency,
      website: website ? website.trim() : null,
      instagramHandle: cleanHandle || null,
      logoUrl: logoUrl ? logoUrl.trim() : null,
    });

    // Update linked account if present in PostgreSQL or memory
    if (prisma) {
      try {
        await prisma.account.updateMany({
          where: { userId },
          data: {
            brandName: brand.brandName,
            brandColor: primaryColor || '#0F172A',
            logoUrl: brand.logoUrl,
          },
        });
      } catch (dbErr) {
        console.warn('Prisma account update skipped:', dbErr);
      }
    }

    const account = Array.from(memoryStore.accounts.values()).find(a => a.userId === userId) || Array.from(memoryStore.accounts.values())[0];
    if (account) {
      account.brandName = brand.brandName;
      if (primaryColor) account.brandColor = primaryColor;
      if (brand.logoUrl) account.logoUrl = brand.logoUrl;
    }

    return NextResponse.json({
      success: true,
      message: 'Brand assets and configuration saved successfully.',
      brand,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
