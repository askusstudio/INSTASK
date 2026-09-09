// INSTASK - Meta OAuth 2.0 & Token Exchange Route
// GET/POST /api/meta/auth

import { NextResponse } from 'next/server';
import { exchangeForLongLivedToken } from '@/lib/meta-graph';
import { memoryStore } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { shortLivedToken, igUserId = '17841458920194827', username = 'artisan_luna_bakery' } = body;

    // Exchange for 60-day long-lived token
    const tokenResult = await exchangeForLongLivedToken(shortLivedToken);

    // Update account with token and expiration
    const account = memoryStore.accounts.get('acc_user_main') || memoryStore.accounts.get('acc_demo_001');
    if (account) {
      account.igUserId = igUserId;
      account.username = username;
      account.accessToken = tokenResult.accessToken;
      account.tokenExpiresAt = tokenResult.expiresAt;
      account.updatedAt = new Date();
    }

    return NextResponse.json({
      success: true,
      message: 'Meta Instagram Professional account connected successfully.',
      account: {
        igUserId,
        username,
        tokenExpiresAt: tokenResult.expiresAt,
        daysRemaining: 60,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Meta connection error' }, { status: 500 });
  }
}

export async function GET() {
  const account = memoryStore.accounts.get('acc_user_main') || memoryStore.accounts.get('acc_demo_001');
  const hasToken = Boolean(account?.accessToken || process.env.META_ACCESS_TOKEN);

  return NextResponse.json({
    connected: hasToken,
    account: account
      ? {
          igUserId: account.igUserId,
          username: account.username,
          brandName: account.brandName,
          tokenExpiresAt: account.tokenExpiresAt,
        }
      : null,
  });
}
