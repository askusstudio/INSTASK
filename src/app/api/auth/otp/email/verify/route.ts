import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code, otpSession: bodySession } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    // Body ya Cookie dono me se token pick karega
    const cookieStore = cookies();
    const activeSession = bodySession || cookieStore.get('instask_otp_session')?.value;

    if (!activeSession) {
      return NextResponse.json(
        { success: false, error: 'Verification session expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    let sessionData: { hash: string; expiresAt: number; email: string };
    try {
      sessionData = JSON.parse(Buffer.from(activeSession, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid verification token. Please re-send OTP.' },
        { status: 400 }
      );
    }

    if (Date.now() > sessionData.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    if (sessionData.email !== cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Email does not match the active session.' },
        { status: 400 }
      );
    }

    const secret = process.env.NEXTAUTH_SECRET || 'instask-secret-otp-key';
    const computedHash = crypto
      .createHmac('sha256', secret)
      .update(`${cleanEmail}:${cleanCode}:${sessionData.expiresAt}`)
      .digest('hex');

    if (computedHash !== sessionData.hash) {
      return NextResponse.json(
        { success: false, error: 'Incorrect verification code. Please check your email.' },
        { status: 400 }
      );
    }

    const userId = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    const res = NextResponse.json({
      success: true,
      message: 'Verified successfully',
      userId,
    });

    res.cookies.delete('instask_otp_session');
    return res;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}