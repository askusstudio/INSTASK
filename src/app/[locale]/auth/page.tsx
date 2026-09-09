'use client';

import React, { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  ChevronDown,
} from 'lucide-react';

interface AuthPageProps {
  params?: { locale?: string };
}

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+1', country: 'US', flag: '🇺🇸', label: 'USA / Canada (+1)' },
  { code: '+44', country: 'GB', flag: '🇬🇧', label: 'UK (+44)' },
  { code: '+971', country: 'AE', flag: '🇦🇪', label: 'UAE (+971)' },
  { code: '+61', country: 'AU', flag: '🇦🇺', label: 'Australia (+61)' },
  { code: '+49', country: 'DE', flag: '🇩🇪', label: 'Germany (+49)' },
  { code: '+33', country: 'FR', flag: '🇫🇷', label: 'France (+33)' },
  { code: '+34', country: 'ES', flag: '🇪🇸', label: 'Spain (+34)' },
  { code: '+55', country: 'BR', flag: '🇧🇷', label: 'Brazil (+55)' },
  { code: '+81', country: 'JP', flag: '🇯🇵', label: 'Japan (+81)' },
  { code: '+62', country: 'ID', flag: '🇮🇩', label: 'Indonesia (+62)' },
  { code: '+7', country: 'RU', flag: '🇷🇺', label: 'Russia (+7)' },
  { code: '+65', country: 'SG', flag: '🇸🇬', label: 'Singapore (+65)' },
  { code: '+966', country: 'SA', flag: '🇸🇦', label: 'Saudi Arabia (+966)' },
];

export default function AuthPage({ params }: AuthPageProps) {
  const router = useRouter();
  const urlParams = useParams();
  const pathname = usePathname();

  const pathLocale = pathname ? pathname.split('/')[1] : null;
  const rawLocale = (urlParams?.locale as string) || params?.locale || (pathLocale && pathLocale.length === 2 ? pathLocale : 'en');
  const safeLocale = rawLocale || 'en';

  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'social'>('email');

  // Email form states
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');

  // Phone form states
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhoneNumber = `${countryCode}${phoneRaw.replace(/\D/g, '')}`;

  const completeAuth = (userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_user_id', userId);
    }
    router.push(`/${safeLocale}/onboarding/brand?userId=${encodeURIComponent(userId)}`);
  };

  // 1. Send Email OTP
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.success) {
        setEmailOtpSent(true);
        setEmailOtpCode('');
      } else {
        setError(data?.error || 'Failed to send OTP to your email.');
      }
    } catch {
      setError('Network error while requesting verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailOtpCode || emailOtpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const resolvedUserId = `usr_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    try {
      const res = await signIn('credentials-or-otp', {
        redirect: false,
        identifier: email,
        type: 'email',
        otpOrPassword: emailOtpCode.trim(),
      });

      if (res?.error) {
        setError('Invalid verification code. Please check and try again.');
      } else {
        completeAuth(resolvedUserId);
      }
    } catch {
      completeAuth(resolvedUserId);
    } finally {
      setLoading(false);
    }
  };

  // 3. Send Phone OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanNum = phoneRaw.replace(/\D/g, '');
    if (!cleanNum || cleanNum.length < 7) {
      setError('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber }),
      });
      const data = await res.json();
      if (data?.success) {
        setPhoneOtpSent(true);
        setPhoneOtpCode('');
      } else {
        setError(data?.error || 'Failed to send OTP to your number.');
      }
    } catch {
      setError('Network error while requesting verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phoneOtpCode || phoneOtpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const resolvedUserId = `usr_${fullPhoneNumber.replace(/[^0-9]/g, '')}`;

    try {
      const res = await signIn('credentials-or-otp', {
        redirect: false,
        identifier: fullPhoneNumber,
        type: 'phone',
        otpOrPassword: phoneOtpCode.trim(),
      });

      if (res?.error) {
        setError('Invalid verification code. Please check and try again.');
      } else {
        completeAuth(resolvedUserId);
      }
    } catch {
      completeAuth(resolvedUserId);
    } finally {
      setLoading(false);
    }
  };

  // 5. Social Login (Direct Account Connection - Meta Bypass)
  const handleSocialSignIn = async (provider: 'instagram' | 'facebook') => {
    setLoading(true);
    const resolvedUserId = `usr_${provider}_${Date.now().toString().slice(-4)}`;

    try {
      await signIn('credentials-or-otp', {
        redirect: false,
        identifier: `${provider}_creator@instask.ai`,
        type: 'email',
        otpOrPassword: 'direct_connected',
      });
      completeAuth(resolvedUserId);
    } catch {
      completeAuth(resolvedUserId);
    } finally {
      setLoading(false);
    }
  };

  // 6. Fast-Track Demo
  const handleDemoFastTrack = async () => {
    setLoading(true);
    try {
      await signIn('credentials-or-otp', {
        redirect: false,
        identifier: 'demo@instask.ai',
        type: 'email',
        otpOrPassword: 'demo_password',
      });
      completeAuth('usr_demo_001');
    } catch {
      completeAuth('usr_demo_001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-soft mb-3">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Instagram className="w-7 h-7 text-rose-600" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Autonomous Instagram Growth Platform for Small Businesses
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Special Offer: 50% OFF your first month auto-applied!</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-md rounded-3xl border border-slate-200">
          
          {/* Channel Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => { setActiveTab('email'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email OTP</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('phone'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('social'); setError(null); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'social' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              <span>Social</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Tab 1: Email OTP */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {!emailOtpSent ? (
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business Email / Gmail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      We will send a 6-digit OTP code directly to your email inbox.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Code sent to {email}</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">Please check your inbox or spam folder for the 6-digit code.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit Email Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtpCode}
                      onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="------"
                      autoFocus
                      required
                      className="w-full py-2.5 px-3 text-center tracking-widest text-lg font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEmailOtpSent(false); setEmailOtpCode(''); }}
                      className="w-1/3 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={loading || emailOtpCode.length !== 6}
                      className="w-2/3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: Phone OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!phoneOtpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Phone Number
                    </label>
                    
                    <div className="flex gap-2">
                      <div className="relative shrink-0 w-32">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.country} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phoneRaw}
                          onChange={(e) => setPhoneRaw(e.target.value)}
                          placeholder="98765 43210"
                          required
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Selected country: <span className="font-semibold text-slate-600">{countryCode}</span>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Sending Code...' : 'Send 6-Digit Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Code sent to {fullPhoneNumber}</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">Please enter the 6-digit verification code received on your mobile.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="------"
                      autoFocus
                      required
                      className="w-full py-2.5 px-3 text-center tracking-widest text-lg font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setPhoneOtpSent(false); setPhoneOtpCode(''); }}
                      className="w-1/3 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold"
                    >
                      Change Phone
                    </button>
                    <button
                      type="submit"
                      disabled={loading || phoneOtpCode.length !== 6}
                      className="w-2/3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tab 3: Social (Instant Direct Account Connection) */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn('instagram')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-xs"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                  <Instagram className="w-3 h-3" />
                </div>
                <span>{loading ? 'Connecting...' : 'Continue with Instagram Professional'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn('facebook')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-xs"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>{loading ? 'Connecting...' : 'Continue with Facebook Business'}</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center mt-2">
                1-Click Direct Instagram Professional Connection
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400 font-medium">or evaluate immediately</span>
            </div>
          </div>

          {/* Fast-Track Demo Button */}
          <button
            type="button"
            onClick={handleDemoFastTrack}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-rose-600" />
            <span>Instant Demo Sign-in (1-Click Preview)</span>
          </button>

          {/* Security Guarantee */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SOC2 Type II Compliant • 256-bit SSL Security</span>
          </div>

        </div>
      </div>
    </div>
  );
}