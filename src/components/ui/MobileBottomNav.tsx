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
  const tCommon = useTranslations('common');
  const { guidanceEnabled, toggleGuidance } = useGuidance();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Close sheet on escape key
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

  // Clean dynamic business identity
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
      {/* 1. Mobile Persistent Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe shadow-lg gpu-layer"
      >
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto items-center px-2">
          {/* Tab 1: Calendar */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('calendar');
              setSheetOpen(false);
            }}
            className={`touch-target-48 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1 transition rounded-xl ${
              activeTab === 'calendar'
                ? 'text-rose-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
            aria-label="Calendar View"
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-none">Calendar</span>
          </button>

          {/* Tab 2: New Plan Wizard */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('wizard');
              setSheetOpen(false);
            }}
            className={`touch-target-48 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1 transition rounded-xl ${
              activeTab === 'wizard'
                ? 'text-purple-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
            aria-label="Generate Plan Wizard"
          >
            <div className="relative">
              <Wand2 className={`w-5 h-5 ${activeTab === 'wizard' ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full animate-ping" />
            </div>
            <span className="text-[10px] leading-none">New Plan</span>
          </button>

          {/* Tab 3: Autopilot Master Control */}
          <button
            type="button"
            onClick={() => onToggleAutopilot(!autoPilotEnabled)}
            className={`touch-target-48 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1 transition rounded-xl ${
              autoPilotEnabled
                ? 'text-amber-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
            aria-label={`Autopilot: ${autoPilotEnabled ? 'Active' : 'Paused'}`}
          >
            <Zap
              className={`w-5 h-5 ${
                autoPilotEnabled ? 'text-amber-500 fill-amber-500 stroke-[2.5]' : ''
              }`}
            />
            <span className="text-[10px] leading-none">
              {autoPilotEnabled ? 'Active' : 'Paused'}
            </span>
          </button>

          {/* Tab 4: More / Bottom Sheet Trigger */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`touch-target-48 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1 transition rounded-xl ${
              sheetOpen ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
            aria-label="Open Controls and Account Sheet"
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 px-1 py-0.2 bg-rose-500 text-white text-[8px] font-extrabold rounded-full">
                {creditsBalance}
              </span>
            </div>
            <span className="text-[10px] leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* 2. Slide-Up Bottom Sheet Drawer */}
      {sheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Controls and Account Sheet"
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in"
        >
          {/* Backdrop Touch Dismiss */}
          <div
            className="flex-1 w-full"
            onClick={() => setSheetOpen(false)}
            aria-label="Dismiss sheet"
          />

          {/* Sheet Container */}
          <div className="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 pb-safe space-y-5 max-h-[85dvh] overflow-y-auto gpu-layer">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1" />

            {/* Header: Dynamic Brand Profile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  {cleanBrandName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {cleanBrandName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {cleanHandle ? `@${cleanHandle}` : 'Setup in Progress'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="touch-target-48 p-2 text-slate-400 hover:text-slate-800 rounded-xl transition cursor-pointer"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credit Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between shadow-soft">
              <div>
                <span className="text-[11px] font-semibold text-rose-200 uppercase tracking-wider block">
                  Available Credits
                </span>
                <span className="text-2xl font-black tracking-tight">{creditsBalance} Credits</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">
                  60 credits/month included in Base Plan
                </span>
              </div>
              <Link
                href={`/${currentLocale}/pricing`}
                onClick={() => setSheetOpen(false)}
                className="touch-target-48 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Top Up
              </Link>
            </div>

            {/* Autopilot Master Row */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${autoPilotEnabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Meta Graph API Autopilot
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {autoPilotEnabled ? 'Publishing daily without manual intervention' : 'Paused — manual approval required'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleAutopilot(!autoPilotEnabled)}
                className={`touch-target-48 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoPilotEnabled ? 'bg-rose-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={autoPilotEnabled}
                aria-label="Toggle Autopilot"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoPilotEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Preferences &amp; Language
              </span>

              {/* Guidance Mode Toggle */}
              <button
                type="button"
                onClick={toggleGuidance}
                className="w-full touch-target-48 flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-left transition hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Interactive Guidance Tips
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    guidanceEnabled ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {guidanceEnabled ? 'ENABLED' : 'OFF'}
                </span>
              </button>

              {/* Language Switcher in Sheet */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">Language</span>
                </div>
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
            </div>

            {/* Links & Account Navigation */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <Link
                href={`/${currentLocale}/onboarding/brand`}
                onClick={() => setSheetOpen(false)}
                className="touch-target-48 w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Edit Brand Assets &amp; Colors</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href={`/${currentLocale}/pricing`}
                onClick={() => setSheetOpen(false)}
                className="touch-target-48 w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Growth Plans &amp; Autopay (50% Off)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href={`/${currentLocale}/refund-policy`}
                onClick={() => setSheetOpen(false)}
                className="touch-target-48 w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-500"
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