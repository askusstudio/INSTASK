'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useGuidance } from '@/context/GuidanceContext';
import { Sparkles, ShieldCheck, Zap, Instagram, HelpCircle } from 'lucide-react';
import CreditBadge from '@/components/credits/CreditBadge';

interface NavbarProps {
  currentLocale: string;
  autoPilotEnabled: boolean;
  onToggleAutopilot: (enabled: boolean) => void;
  creditsBalance?: number;
  connectedAccount?: {
    username?: string | null;
    brandName?: string | null;
  } | null;
}

export function Navbar({
  currentLocale,
  autoPilotEnabled,
  onToggleAutopilot,
  creditsBalance = 60,
  connectedAccount,
}: NavbarProps) {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { guidanceEnabled, toggleGuidance } = useGuidance();

  // Strict check: sirf tab true hoga jab user ka real handle ho aur artisan_luna na ho
  const cleanUsername = connectedAccount?.username?.replace(/^@+/, '').trim();
  const isConnected = Boolean(
    cleanUsername &&
    cleanUsername.length > 1 &&
    !cleanUsername.toLowerCase().includes('artisan_luna') &&
    cleanUsername !== 'shop'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Meta v21.0
                </span>
              </div>
              <div className="hidden md:block text-[11px] font-medium">
                {isConnected ? (
                  <span className="text-slate-700 font-semibold">
                    {tNav('connectedAs')} <strong className="text-rose-600">@{cleanUsername}</strong>
                  </span>
                ) : (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 font-semibold">
                    Account Setup in Progress
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <CreditBadge balance={creditsBalance} />

            <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
              <a
                href={`/${currentLocale}/onboarding/payment`}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition shadow-xs"
                title="Pro Plan: 50% Off Month 1 Active"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pro Plan (50% Off)</span>
              </a>

              <a
                href={`/${currentLocale}/auth`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Multi-channel Account Sign In & Brand Setup"
              >
                <span>Account</span>
              </a>

              {/* Guidance Mode Toggle */}
              <button
                type="button"
                onClick={toggleGuidance}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs cursor-pointer ${
                  guidanceEnabled
                    ? 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
                }`}
                title="Toggle interactive guidance tips across the dashboard"
              >
                <HelpCircle className={`w-3.5 h-3.5 ${guidanceEnabled ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="hidden lg:inline">Guidance Mode</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${guidanceEnabled ? 'bg-rose-200/70 text-rose-800' : 'bg-slate-100 text-slate-500'}`}>
                  {guidanceEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Autopilot Switch */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${autoPilotEnabled ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                    {autoPilotEnabled ? t('autopilotActive') : t('autopilotPaused')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAutopilot(!autoPilotEnabled)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 ${
                    autoPilotEnabled ? 'bg-gradient-to-r from-rose-500 to-purple-600' : 'bg-slate-200'
                  }`}
                  role="switch"
                  aria-checked={autoPilotEnabled}
                  aria-label="Toggle Autopilot"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoPilotEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <LanguageSwitcher currentLocale={currentLocale} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}