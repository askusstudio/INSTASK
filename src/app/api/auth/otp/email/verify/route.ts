import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, code, otpSession } = await req.json();

    if (!email || !code || !otpSession) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    let sessionData: { hash: string; expiresAt: number; email: string };
    try {
      sessionData = JSON.parse(Buffer.from(otpSession, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid OTP session.' }, { status: 400 });
    }

    if (Date.now() > sessionData.expiresAt) {
      return NextResponse.json({ success: false, error: 'OTP code has expired. Please request a new one.' }, { status: 400 });
    }

    if (sessionData.email !== cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email mismatch. Please request a new OTP.' }, { status: 400 });
    }

    const secret = process.env.NEXTAUTH_SECRET || 'instask-secret-otp-key';
    const computedHash = crypto
      .createHmac('sha256', secret)
      .update(`${cleanEmail}:${cleanCode}:${sessionData.expiresAt}`)
      .digest('hex');

    if (computedHash !== sessionData.hash) {
      return NextResponse.json({ success: false, error: 'Incorrect verification code. Please check your inbox.' }, { status: 400 });
    }

    const userId = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    return NextResponse.json({
      success: true,
      message: 'Verified successfully',
      userId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}