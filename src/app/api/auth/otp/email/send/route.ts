import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const secret = process.env.NEXTAUTH_SECRET || 'instask-secret-otp-key';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(`${cleanEmail}:${code}:${expiresAt}`)
      .digest('hex');

    const token = Buffer.from(JSON.stringify({ hash, expiresAt, email: cleanEmail })).toString('base64');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'askusstudio@gmail.com',
        pass: process.env.EMAIL_PASS || 'rslkxckfdsfyedru',
      },
    });

    await transporter.sendMail({
      from: `"INSTASK AI" <${process.env.EMAIL_USER || 'askusstudio@gmail.com'}>`,
      to: cleanEmail,
      subject: `Your INSTASK AI Login Code: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to INSTASK AI</h2>
          <p style="color: #64748b; font-size: 14px;">Use the verification code below to complete your sign in:</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #e11d48; padding: 16px 0; text-align: center;">
            ${code}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    const response = NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otpSession: token,
    });

    // Client state miss hone se bachane ke liye cookie bhi set karein
    response.cookies.set('instask_otp_session', token, {
      path: '/',
      httpOnly: true,
      maxAge: 600,
      sameSite: 'lax',
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}