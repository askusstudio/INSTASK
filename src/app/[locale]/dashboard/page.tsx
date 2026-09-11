'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/ui/Navbar';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { StrategyBlueprint } from '@/lib/recommendations';
import { BusinessProfileData } from '@/components/onboarding/StepBusinessProfile';
import { useGuidance } from '@/context/GuidanceContext';
import { PostRecord } from '@/lib/prisma';
import {
  Calendar,
  Wand2,
  Sparkles,
} from 'lucide-react';

const StepWizard = dynamic(
  () => import('@/components/onboarding/StepWizard').then((m) => m.StepWizard),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-xs text-slate-500 font-medium">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Setup Wizard...
      </div>
    ),
  }
);

const GrowthForecast = dynamic(
  () => import('@/components/analytics/GrowthForecast').then((m) => m.GrowthForecast),
  { ssr: false }
);

const StrategyBlueprintModal = dynamic(
  () => import('@/components/strategy/StrategyBlueprintModal').then((m) => m.StrategyBlueprintModal),
  { ssr: false }
);

interface DashboardPageProps {
  params: { locale: string };
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const tNav = useTranslations('nav');
  const tOnboarding = useTranslations('onboarding');
  const { dismissAllGuidance } = useGuidance();
  const searchParams = useSearchParams();

  // Login ke just baad always wizard open hoga
  const [activeTab, setActiveTab] = useState<'calendar' | 'wizard'>('wizard');

  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [strategyBlueprint, setStrategyBlueprint] = useState<StrategyBlueprint | null>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(60);

  const [pendingProfile, setPendingProfile] = useState<BusinessProfileData | null>(null);
  const [pendingMetaAccount, setPendingMetaAccount] = useState<{ igUserId: string; username: string } | null>(null);

  const [account, setAccount] = useState<{
    brandName?: string | null;
    username?: string | null;
    location?: string | null;
  } | null>({
    brandName: 'Luna Artisan Bakery',
    username: 'artisan_luna_bakery',
    location: 'Austin, TX',
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
        if (data.account) {
          setAccount({
            brandName: data.account.brandName,
            username: data.account.username,
            location: data.account.city,
          });
          setAutoPilotEnabled(Boolean(data.account.autoPilotEnabled));
        }
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/billing/topup');
        const data = await res.json();
        if (data.creditsBalance !== undefined) {
          setCreditsBalance(data.creditsBalance);
        }
      } catch {
        // Fallback
      }
    };
    fetchCredits();

    if (searchParams.get('payment') === 'success' || searchParams.get('activated') === 'true') {
      setIsPaymentSuccess(true);
    }
    if (searchParams.get('credits_added') === 'true') {
      fetchCredits();
    }

    // Check if user explicitly asked for calendar or completed wizard
    if (typeof window !== 'undefined') {
      const isCompleted = localStorage.getItem('instask_wizard_completed') === 'true';
      if (searchParams.get('view') === 'calendar' && isCompleted) {
        setActiveTab('calendar');
      } else {
        setActiveTab('wizard');
      }
    }
  }, [searchParams]);

  const handleStrategyReady = (
    blueprint: StrategyBlueprint,
    profile: BusinessProfileData,
    metaAcc: { igUserId: string; username: string }
  ) => {
    setStrategyBlueprint(blueprint);
    setPendingProfile(profile);
    setPendingMetaAccount(metaAcc);
    setShowBlueprintModal(true);
  };

  const handleApplyStrategy = async (selectedTemplateId: string) => {
    dismissAllGuidance();

    const profile = pendingProfile || {
      brandName: account?.brandName || 'Luna Artisan Bakery',
      industry: 'Artisan Bakery & Cafe',
      location: account?.location || 'Austin, TX',
      productSummary: 'Fresh sourdough pastries and specialty espresso made from organic local grains.',
      brandColor: '#e1306c',
      logoUrl: '',
    };

    const handle = pendingMetaAccount?.username || account?.username || 'artisan_luna_bakery';
    const igUserId = pendingMetaAccount?.igUserId || '17841400000000000';

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: profile.brandName,
          industry: profile.industry,
          location: profile.location,
          productSummary: profile.productSummary,
          brandColor: profile.brandColor,
          logoUrl: profile.logoUrl,
          language: locale,
          handle,
          igUserId,
          selectedTemplateId,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
        setAccount({
          brandName: profile.brandName,
          username: handle,
          location: profile.location,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('instask_wizard_completed', 'true');
        }
        setShowBlueprintModal(false);
        // Sirf ab teeno steps complete hone ke baad Calendar dikhega
        setActiveTab('calendar');
      }
    } catch (err) {
      console.error('Failed to apply strategy:', err);
    }
  };

  const handleToggleAutopilot = async (enabled: boolean) => {
    setAutoPilotEnabled(enabled);
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableAutopilot: enabled }),
      });
      if (enabled) {
        setPosts((prev) =>
          prev.map((p) => (p.status === 'DRAFT' ? { ...p, status: 'APPROVED' } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle autopilot:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentLocale={locale}
        autoPilotEnabled={autoPilotEnabled}
        onToggleAutopilot={handleToggleAutopilot}
        creditsBalance={creditsBalance}
        connectedAccount={account}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-8 flex-1 w-full space-y-6 sm:space-y-8">
        
        {/* Banner */}
        {isPaymentSuccess && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-5 text-white shadow-soft-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-400/40">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  Access Unlocked: Pro Growth Plan (50% Off First Month Applied)
                </h3>
                <p className="text-xs text-emerald-100 mt-1 font-medium">
                  Complete the 3-step setup below to generate your 30-day autonomous content calendar.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentSuccess(false)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex-shrink-0 self-end sm:self-center cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{account?.brandName || 'INSTASK AI'}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80">
                {activeTab === 'wizard' ? 'Step Setup Wizard' : '30-Day Autonomous Dashboard'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Autonomous Instagram growth platform with certified Meta Graph API container posting.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-soft-sm self-start">
            <button
              type="button"
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'wizard'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Setup Wizard (3 Steps)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tNav('calendar')} ({posts.length})</span>
            </button>
          </div>
        </div>

        {/* Condition: Login ke turant baad Setup Wizard page dikhega */}
        {activeTab === 'wizard' ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md p-4 sm:p-8">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Setup Wizard
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {tOnboarding('title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {tOnboarding('subtitle')}
              </p>
            </div>

            <StepWizard
              onStrategyReady={handleStrategyReady}
              currentLocale={locale}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3 shadow-soft">
                <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Loading your 30-day autonomous growth plan...
                </p>
              </div>
            ) : (
              <>
                <CalendarGrid
                  initialPosts={posts}
                  account={account}
                  onRefresh={fetchPosts}
                />
                <GrowthForecast />
              </>
            )}
          </div>
        )}
      </div>

      {strategyBlueprint && (
        <StrategyBlueprintModal
          blueprint={strategyBlueprint}
          isOpen={showBlueprintModal}
          onClose={() => setShowBlueprintModal(false)}
          onApplyStrategy={handleApplyStrategy}
        />
      )}

      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-800">Instask</span>
            <span className="hidden sm:inline">•</span>
            <span>Operated by <strong>INSTASK</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium">Meta Graph API v21.0 Certified</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <Link href={`/${locale}/terms`} className="hover:text-slate-900 font-medium">Terms of Service</Link>
            <Link href={`/${locale}/refund-policy`} className="hover:text-slate-900 font-medium">Refund Policy</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900 font-medium">Privacy Policy</Link>
          </div>
        </div>
      </footer>
      
      <MobileBottomNav
        currentLocale={locale}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        autoPilotEnabled={autoPilotEnabled}
        onToggleAutopilot={handleToggleAutopilot}
        creditsBalance={creditsBalance}
        connectedAccount={account}
      />
    </div>
  );
}