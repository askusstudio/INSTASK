import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hnixeuqxdqrnkahjxfzb.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_g7OTHdRgTinSAXHD2UdxbQ_LLYYXc2S'
);

/**
 * Send OTP to user's phone via Supabase Auth (Twilio / SMS Gateway)
 * @param phone E.164 formatted phone number (e.g. +91XXXXXXXXXX or +1XXXXXXXXXX)
 */
export async function sendPhoneOtp(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });
  if (error) throw error;
  return data;
}

/**
 * Verify OTP token submitted by user
 * @param phone E.164 formatted phone number
 * @param token 6-digit SMS verification code
 */
export async function verifyPhoneOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw error;
  return data.session; // User is authenticated
}
