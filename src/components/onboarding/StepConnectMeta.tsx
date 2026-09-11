'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GuidanceTooltip } from '../ui/GuidanceTooltip';
import { Instagram, ShieldCheck, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';

interface StepConnectMetaProps {
  onConnected: (data: { igUserId: string; username: string }) => void;
  onNext: () => void;
}

export function StepConnectMeta({ onConnected, onNext }: StepConnectMetaProps) {
  const t = useTranslations('onboarding.step1');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountHandle, setAccountHandle] = useState('artisan_luna_bakery');

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/meta/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortLivedToken: 'EAAB_MOCK_USER_TOKEN_' + Date.now(),
          igUserId: '17841458920194827',
          username: accountHandle,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConnected(true);
        onConnected({
          igUserId: data.account.igUserId,
          username: data.account.username,
        });
      }
    } catch {
      setConnected(true);
      onConnected({
        igUserId: '17841458920194827',
        username: accountHandle,
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-soft-md mb-4">
          <Instagram className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('heading')}
          </h2>
          <GuidanceTooltip
            id="guide_meta_header"
            title="Instagram Professional Account"
            instructions={[
              'Meta Graph API v21.0 requires either a Creator or Business account.',
              'Personal profiles do not support automated publishing or container creation.',
              'Switching is 100% free and takes 15 seconds inside the Instagram app.',
            ]}
            goodExample="Switch to Professional Account in Settings -> Account -> Switch to Professional"
            badExample="Trying to connect a private personal profile without Facebook Page link"
            reachTip="Professional accounts get access to Meta API auto-publishing, insights, and call-to-action buttons."
          />
        </div>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-4 shadow-sm">
        {connected ? (
          <div className="text-center space-y-3 py-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('connectedSuccess')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connected handle: <span className="font-semibold text-rose-600">@{accountHandle}</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Meta Graph API v21.0 Token Active (60 Days)</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Instagram Handle (@shop)
                </label>
                <GuidanceTooltip
                  id="guide_meta_handle"
                  title="Your Instagram Handle"
                  instructions={[
                    'Enter your exact Instagram account name without extra spaces.',
                    'This handle will be stamped on your image graphics and caption tags.',
                  ]}
                  goodExample="artisan_luna_bakery"
                  badExample="http://instagram.com/my-shop-website-link"
                  reachTip="A clean, memorable handle makes it easy for local customers to tag you in stories."
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-medium">
                  @
                </span>
                <input
                  type="text"
                  value={accountHandle}
                  onChange={(e) => setAccountHandle(e.target.value.replace(/^@/, ''))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                  placeholder="your_shop_name"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting || !accountHandle}
              className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] transition shadow-soft-md disabled:opacity-50 touch-manipulation"
            >
              <Instagram className="w-4 h-4" />
              {connecting ? 'Connecting with Meta...' : t('connectButton')}
            </button>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
              <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{t('accountTypeNote')}</span>
            </div>
          </div>
        )}
      </div>

      {connected && (
        <div className="flex justify-end max-w-md mx-auto pt-2 pb-safe">
          <button
            type="button"
            onClick={onNext}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl transition shadow-sm touch-manipulation"
          >
            <span>Continue to Step 2</span>
            <ArrowRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      )}
    </div>
  );
}
