import { NextResponse } from 'next/server';

// "export" keyword removed so Next.js build passes cleanly without type error
const phoneOtpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string' || phone.length < 8) {
      return NextResponse.json(
        { success: false, error: 'A valid phone number is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    phoneOtpStore.set(cleanPhone, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    let smsDispatched = false;

    if (cleanPhone.startsWith('+91') && process.env.FAST2SMS_API_KEY) {
      try {
        const rawIndianNumber = cleanPhone.replace('+91', '').trim();
        const f2sRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: code,
            numbers: rawIndianNumber,
          }),
        });
        const f2sData = await f2sRes.json();
        if (f2sData?.return) {
          smsDispatched = true;
        }
      } catch (err) {
        console.error('[Fast2SMS Error]', err);
      }
    }

    console.log(`\n=============================================`);
    console.log(`[PHONE OTP] To: ${cleanPhone} | CODE: ${code} | SMS: ${smsDispatched ? 'Sent' : 'Printed (Console)'}`);
    console.log(`=============================================\n`);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}