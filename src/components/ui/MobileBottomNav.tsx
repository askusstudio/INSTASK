'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  Wand2,
  Zap,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Globe,
  ShieldCheck,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useGuidance } from '@/context/GuidanceContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileBottomNavProps {
  currentLocale: string;
  activeTab: 'calendar' | 'wizard';
  onSelectTab: (tab: 'calendar' | 'wizard') => void;
  autoPilotEnabled: boolean;
  onToggleAutopilot: (enabled: boolean) => void;
  creditsBalance?: number;
  connectedAccount?: {
    username?: string | null;
    brandName?: string | null;
  } | null;
}

export function MobileBottomNav({
  currentLocale,
  activeTab,
  onSelectTab,
  autoPilotEnabled,
  onToggleAutopilot,
  creditsBalance = 60,
  connectedAccount,
}: MobileBottomNavProps) {
  const t = useTranslations('nav');
  const { guidanceEnabled, toggleGuidance } = useGuidance();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    if (sheetOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const cleanBrandName =
    connectedAccount?.brandName && !connectedAccount.brandName.includes('Luna Artisan')
      ? connectedAccount.brandName
      : 'Your Business Brand';

  const cleanHandle =
    connectedAccount?.username && !connectedAccount.username.includes('artisan_luna')
      ? connectedAccount.username.replace(/^@+/, '')
      : null;

  return (
    <>
      {/* Plixi-Style Floating Mobile Tab Bar */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl py-1.5 px-2 transition-all duration-200"
      >
        <div className="grid grid-cols-4 items-center gap-1">
          {/* Tab 1: Calendar */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('calendar');
              setSheetOpen(false);
            }}
            className={`min-h-[46px] py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-rose-50 text-rose-600 font-extrabold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Calendar View"
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'calendar' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-none tracking-tight">Calendar</span>
          </button>

          {/* Tab 2: New Plan Wizard */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('wizard');
              setSheetOpen(false);
            }}
            className={`min-h-[46px] py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition cursor-pointer relative ${
              activeTab === 'wizard'
                ? 'bg-purple-50 text-purple-600 font-extrabold shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Generate Plan Wizard"
          >
            <div className="relative">
              <Wand2 className={`w-4 h-4 ${activeTab === 'wizard' ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
            </div>
            <span className="text-[10px] leading-none tracking-tight">Wizard</span>
          </button>

          {/* Tab 3: Autopilot Toggle */}
          <button
            type="button"
            onClick={() => onToggleAutopilot(!autoPilotEnabled)}
            className={`min-h-[46px] py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition cursor-pointer ${
              autoPilotEnabled
                ? 'bg-amber-50 text-amber-700 font-extrabold shadow-2xs'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
            aria-label={`Autopilot: ${autoPilotEnabled ? 'Active' : 'Paused'}`}
          >
            <Zap
              className={`w-4 h-4 ${
                autoPilotEnabled ? 'text-amber-500 fill-amber-500 stroke-[2.5]' : ''
              }`}
            />
            <span className="text-[10px] leading-none tracking-tight">
              {autoPilotEnabled ? 'Autopilot' : 'Manual'}
            </span>
          </button>

          {/* Tab 4: More Menu */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`min-h-[46px] py-1 flex flex-col items-center justify-center gap-1 rounded-xl transition cursor-pointer relative ${
              sheetOpen
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
            aria-label="Open Controls and Account Sheet"
          >
            <div className="relative">
              <Menu className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-rose-600 text-white text-[8px] font-black rounded-full shadow-2xs">
                {creditsBalance}
              </span>
            </div>
            <span className="text-[10px] leading-none tracking-tight">Menu</span>
          </button>
        </div>
      </nav>

      {/* Plixi-Style Bottom Sheet Drawer */}
      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Controls and Account Sheet"
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div
            className="flex-1 w-full"
            onClick={() => setSheetOpen(false)}
            aria-label="Dismiss sheet"
          />

          {/* Drawer Container */}
          <div className="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 pb-8 space-y-4 max-h-[85dvh] overflow-y-auto">
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            {/* Profile Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  {cleanBrandName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{cleanBrandName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Verified
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {cleanHandle ? `@${cleanHandle}` : 'Connected Account'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plixi-Style Credit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between shadow-md border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Available Credits
                </span>
                <span className="text-2xl font-black tracking-tight">{creditsBalance}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  10 credits / 30-day strategy run
                </span>
              </div>
              <Link
                href={`/${currentLocale}/pricing`}
                onClick={() => setSheetOpen(false)}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition"
              >
                Top Up
              </Link>
            </div>

            {/* Autopilot Row */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    autoPilotEnabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Meta Graph API Autopilot
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {autoPilotEnabled ? 'Live container automatic posting' : 'Paused (Manual approval)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleAutopilot(!autoPilotEnabled)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoPilotEnabled ? 'bg-rose-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={autoPilotEnabled}
                aria-label="Toggle Autopilot"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoPilotEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                Preferences
              </span>

              {/* Guidance Mode Toggle */}
              <button
                type="button"
                onClick={toggleGuidance}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-left transition hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Interactive Guidance Tips
                  </span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                    guidanceEnabled ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {guidanceEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-800">Language</span>
                </div>
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href={`/${currentLocale}/onboarding/brand`}
                onClick={() => setSheetOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Edit Brand Profile &amp; Assets</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href={`/${currentLocale}/pricing`}
                onClick={() => setSheetOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Upgrade / Pro Plans (50% Off)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href={`/${currentLocale}/refund-policy`}
                onClick={() => setSheetOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Refund &amp; Cancellation Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}