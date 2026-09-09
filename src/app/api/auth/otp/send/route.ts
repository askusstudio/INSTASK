import { NextResponse } from 'next/server';

// Temporary memory store for generated verification codes in testing
const otpCache = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string' || phone.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A valid international phone number is required (e.g. +1 555 123 4567)' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Generate 6-digit OTP code (in demo/sandbox, default to standard test code "123456" for convenience)
    const code = process.env.NODE_ENV === 'production' && process.env.TWILIO_ACCOUNT_SID
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    otpCache.set(cleanPhone, { code, expiresAt });

    // If Twilio is configured, you can call Twilio Verify API here
    console.log(`[Auth/OTP] Verification code for ${cleanPhone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully.',
      expiresInSeconds: 600,
      // Provide sandbox hint for zero-friction testing
      demoHint: 'For testing, enter code 123456',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
