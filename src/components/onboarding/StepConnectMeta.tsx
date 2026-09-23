'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GuidanceTooltip } from '../ui/GuidanceTooltip';
import { Instagram, ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

interface StepConnectMetaProps {
  onConnected: (data: { igUserId: string; username: string }) => void;
  onNext: () => void;
}

export function StepConnectMeta({ onConnected, onNext }: StepConnectMetaProps) {
  const t = useTranslations('onboarding.step1');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountHandle, setAccountHandle] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Pre-load saved handle if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHandle = localStorage.getItem('instask_ig_handle');
      if (savedHandle) {
        setAccountHandle(savedHandle.replace(/^@+/, ''));
      }
    }
  }, []);

  const sanitizeHandle = (value: string) => {
    return value.replace(/^@+/, '').replace(/\s+/g, '').toLowerCase();
  };

  const handleConnect = async () => {
    setInputError(null);
    const cleanHandle = sanitizeHandle(accountHandle);

    if (!cleanHandle || cleanHandle.length < 2) {
      setInputError('Please enter your Instagram username or handle.');
      return;
    }

    setConnecting(true);
    try {
      // Secure real-time backend API call
      const res = await fetch('/api/auth/instagram/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanHandle,
          deviceFingerprint: navigator.userAgent,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Secure verification failed.');
      }

      const verifiedUsername = data.account.username;
      const verifiedId = data.account.igUserId;

      if (typeof window !== 'undefined') {
        localStorage.setItem('instask_ig_handle', verifiedUsername);
      }

      setConnected(true);
      onConnected({
        igUserId: verifiedId,
        username: verifiedUsername,
      });
    } catch (err: any) {
      setInputError(err.message || 'Connection error. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDirectContinue = () => {
    setInputError(null);
    const cleanHandle = sanitizeHandle(accountHandle);

    if (!cleanHandle || cleanHandle.length < 2) {
      setInputError('Please enter your Instagram handle before continuing.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_ig_handle', cleanHandle);
    }

    onConnected({
      igUserId: `usr_${cleanHandle}`,
      username: cleanHandle,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-soft-md mb-4">
          <Instagram className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Connect Your Instagram Professional Account
          </h2>
          <GuidanceTooltip
            id="guide_meta_header"
            title="Instagram Professional Account"
            instructions={[
              'Meta Graph API requires either a Creator or Business Instagram account.',
              'Personal accounts do not support automated scheduling or insights.',
              'Switching is free in Instagram Settings -> Account -> Switch to Professional Account.',
            ]}
            goodExample="Switch to a Creator or Business account inside your Instagram mobile app"
            badExample="Using a private personal profile"
            reachTip="Professional accounts enable direct container scheduling and viral analytics."
          />
        </div>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          INSTASK securely connects via certified Meta Graph API. We never ask for your personal password.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-4 shadow-sm">
        {connected ? (
          <div className="text-center space-y-3 py-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Account Connected Successfully</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target account: <span className="font-semibold text-rose-600">@{accountHandle}</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Real-time API Container Active</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Enter Your Instagram Handle *
                </label>
                <GuidanceTooltip
                  id="guide_meta_handle"
                  title="Your Instagram Handle"
                  instructions={[
                    'Enter your exact Instagram public username without extra spaces or URLs.',
                    'This handle will be stamped on your visuals, carousels, and hashtag sets.',
                  ]}
                  goodExample="yourbrandname"
                  badExample="https://instagram.com/my-shop or spaces in username"
                  reachTip="A clean handle ensures your brand tags and mentions index properly."
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={accountHandle}
                  onChange={(e) => {
                    setAccountHandle(e.target.value.replace(/^@+/, '').replace(/\s+/g, ''));
                    if (inputError) setInputError(null);
                  }}
                  className="w-full pl-8 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium transition shadow-xs"
                  placeholder="yourbrandname"
                  required
                />
              </div>
              {inputError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5">{inputError}</p>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting || !accountHandle.trim()}
                className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] transition shadow-soft-md disabled:opacity-50 touch-manipulation cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                <span>{connecting ? 'Connecting Securely...' : 'Connect with Instagram Pro (Secure Real-time)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectContinue}
                disabled={!accountHandle.trim()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Save Handle & Continue to Step 2 →</span>
              </button>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
              <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Requires an Instagram Creator or Business account linked securely.</span>
            </div>
          </div>
        )}
      </div>

      {connected && (
        <div className="flex justify-end max-w-md mx-auto pt-2 pb-safe">
          <button
            type="button"
            onClick={onNext}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl transition shadow-sm touch-manipulation cursor-pointer"
          >
            <span>Continue to Step 2 (Business Info)</span>
            <ArrowRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      )}
    </div>
  );
}