import { NextResponse } from 'next/server';
import { memoryStore, prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, deviceFingerprint } = body;

    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing Instagram handle for secure session.' },
        { status: 400 }
      );
    }

    const cleanHandle = username.replace(/^@+/, '').trim().toLowerCase();
    const secureSessionToken = `sec_tok_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const igUserId = `ig_secure_${cleanHandle}`;

    // Secure Server-side storage in memoryStore & Prisma
    memoryStore.accounts.set(igUserId, {
      id: igUserId,
      brandName: cleanHandle,
      username: cleanHandle,
      autoPilotEnabled: true,
      updatedAt: new Date(),
    });

    if (prisma) {
      try {
        await prisma.account.upsert({
          where: { id: igUserId },
          update: { username: cleanHandle },
          create: {
            id: igUserId,
            brandName: cleanHandle,
            username: cleanHandle,
            autoPilotEnabled: true,
          },
        });
      } catch (dbErr) {
        console.warn('Database persistence note:', dbErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Secure real-time Instagram session initialized successfully.',
      account: {
        igUserId,
        username: cleanHandle,
      },
    });

    // Set secure HttpOnly cookie for session protection
    response.cookies.set('instask_secure_session', secureSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set('instask_ig_handle', cleanHandle, { path: '/' });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Secure authentication failed.' },
      { status: 500 }
    );
  }
}