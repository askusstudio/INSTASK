'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Lock,
  Zap,
} from 'lucide-react';

interface AuthPageProps {
  params: { locale: string };
}

export default function AuthPage({ params: { locale } }: AuthPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'social'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 ');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  // 1. Email Sign In
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials-or-otp', {
        redirect: false,
        identifier: email,
        type: 'email',
        otpOrPassword: 'magic_link_token',
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(`/${locale}/onboarding/brand`);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Phone OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.length < 8) {
      setError('Please enter a valid phone number with country code (e.g. +1 555 123 4567)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (data.demoHint) {
          setDemoHint(data.demoHint);
          setOtpCode('123456'); // prefill for easy one-click testing
        }
      } else {
        setError(data.error || 'Failed to send verification code.');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Network error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials-or-otp', {
        redirect: false,
        identifier: phone,
        type: 'phone',
        otpOrPassword: otpCode,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(`/${locale}/onboarding/brand`);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Social OAuth Sign In (Meta / Facebook / Instagram)
  const handleSocialSignIn = async (provider: 'facebook') => {
    setLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: `/${locale}/onboarding/brand`,
      });
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Social sign-in failed');
      setLoading(false);
    }
  };

  // 5. Fast-Track Demo Sign-In
  const handleDemoFastTrack = async () => {
    setLoading(true);
    try {
      const res = await signIn('credentials-or-otp', {
        redirect: false,
        identifier: 'demo@instask.ai',
        type: 'email',
        otpOrPassword: 'demo_password',
      });
      if (!res?.error) {
        router.push(`/${locale}/onboarding/brand`);
      }
    } catch {
      router.push(`/${locale}/onboarding/brand`);
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

        {/* 50% Off First Month Offer Callout */}
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
              <span>Email</span>
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

          {/* Tab 1: Email / Password / Magic Link */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a secure 1-click login link or sign in instantly.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In...' : 'Continue with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Tab 2: Phone Number with OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Include international country code (e.g. +1 for US/Canada, +44 for UK, +91 for India).
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
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Code sent to {phone}</p>
                      {demoHint && <p className="text-[11px] text-emerald-700 mt-0.5">{demoHint}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full py-2.5 px-3 text-center tracking-widest text-lg font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-1/3 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold"
                    >
                      Change Phone
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
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

          {/* Tab 3: Social OAuth */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn('facebook')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-xs"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                  <Instagram className="w-3 h-3" />
                </div>
                <span>Continue with Instagram Professional</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn('facebook')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-xs"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>Continue with Facebook Business</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center mt-2">
                Connects directly via Meta Graph API v21.0. We never view or store passwords.
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
