import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const emailOtpCache = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpCache.set(cleanEmail, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    let sent = false;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"INSTASK AI" <${process.env.EMAIL_USER}>`,
          to: cleanEmail,
          subject: `${code} is your INSTASK AI verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #0f172a; margin-bottom: 8px;">INSTASK AI Verification</h2>
              <p style="color: #64748b; font-size: 14px;">Your 6-digit verification code is:</p>
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin: 18px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #e11d48;">${code}</span>
              </div>
              <p style="color: #94a3b8; font-size: 12px;">Valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        sent = true;
      } catch (mailErr) {
        console.error('[Gmail Dispatch Error]', mailErr);
      }
    }

    console.log(`\n=============================================`);
    console.log(`[EMAIL OTP] To: ${cleanEmail} | CODE: ${code} | Delivered: ${sent}`);
    console.log(`=============================================\n`);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (err: unknown) {
    const e = err as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}