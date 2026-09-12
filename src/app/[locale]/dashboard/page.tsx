'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Store,
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
  const router = useRouter();
  const tNav = useTranslations('nav');
  const tOnboarding = useTranslations('onboarding');
  const { dismissAllGuidance } = useGuidance();
  const searchParams = useSearchParams();

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
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const savedBrand = localStorage.getItem('instask_brand_name');
      const savedHandle = localStorage.getItem('instask_ig_handle');
      if (
        savedBrand &&
        !savedBrand.toLowerCase().includes('luna') &&
        !savedBrand.toLowerCase().includes('glamflow')
      ) {
        return {
          brandName: savedBrand,
          username: savedHandle || '',
          location: null,
        };
      }
    }
    return null;
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();

      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
        if (data.account && data.account.username) {
          setAccount({
            brandName: data.account.brandName,
            username: data.account.username,
            location: data.account.city,
          });
          setAutoPilotEnabled(Boolean(data.account.autoPilotEnabled));
        }
      } else {
        // Naye user ke liye automated fallback create nahi karna hai jab tak wizard complete na ho
        setPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

    const isActivated =
      searchParams.get('activated') === 'true' ||
      searchParams.get('payment') === 'success' ||
      (typeof window !== 'undefined' && localStorage.getItem('instask_plan_activated') === 'true');

    if (isActivated) {
      setIsPaymentSuccess(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('instask_plan_activated', 'true');
        localStorage.setItem('instask_wizard_completed', 'true');
      }
    }

    if (searchParams.get('credits_added') === 'true') {
      fetchCredits();
    }

    const viewParam = searchParams.get('view');
    // Agar account ya posts nahi hain toh direct Setup Wizard dikhana hai
    if (viewParam === 'wizard' || !isActivated || posts.length === 0) {
      setActiveTab('wizard');
    } else {
      setActiveTab('calendar');
    }
  }, [searchParams, fetchPosts, posts.length]);

  const handleStrategyReady = (
    blueprint: StrategyBlueprint,
    profile: BusinessProfileData,
    metaAcc: { igUserId: string; username: string }
  ) => {
    setStrategyBlueprint(blueprint);
    setPendingProfile(profile);
    setPendingMetaAccount(metaAcc);
    setAccount({
      brandName: profile.brandName,
      username: metaAcc.username,
      location: profile.location,
    });
    setShowBlueprintModal(true);
  };

  const handleApplyStrategy = async (selectedTemplateId: string) => {
    dismissAllGuidance();

    const profile = pendingProfile || {
      brandName: account?.brandName || 'My Business',
      industry: 'Business & Retail',
      location: account?.location || '',
      productSummary: 'Premium lifestyle products and quality customer services.',
      brandColor: '#e1306c',
      logoUrl: '',
    };

    const handle = pendingMetaAccount?.username || account?.username || 'brand';
    const igUserId = pendingMetaAccount?.igUserId || `ig_${Date.now()}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_brand_name', profile.brandName);
      localStorage.setItem('instask_ig_handle', handle);
      localStorage.setItem('instask_selected_template', selectedTemplateId);
      localStorage.setItem('instask_wizard_completed', 'true');
    }

    setLoading(true);
    setShowBlueprintModal(false);

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
      }
    } catch (err) {
      console.warn('Plan generation error:', err);
    } finally {
      setLoading(false);
    }

    router.push(`/${locale}/onboarding/payment?userId=usr_main&plan=pro_monthly`);
  };

  const handleSelectTab = (tab: 'calendar' | 'wizard') => {
    if (tab === 'calendar' && !isPaymentSuccess && posts.length === 0) {
      router.push(`/${locale}/onboarding/payment?userId=usr_main&required=true`);
      return;
    }
    setActiveTab(tab);
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

  // Naye user ke liye clean brand identity logic
  const hasConfiguredBrand = Boolean(
    (account?.brandName && !account.brandName.toLowerCase().includes('glamflow')) ||
    pendingProfile?.brandName
  );

  const currentDisplayName = hasConfiguredBrand
    ? account?.brandName || pendingProfile?.brandName || 'My Brand'
    : 'Brand Setup';

  const currentHandle =
    account?.username && !account.username.toLowerCase().includes('glamflow')
      ? account.username
      : pendingMetaAccount?.username || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Navbar
        currentLocale={locale}
        autoPilotEnabled={autoPilotEnabled}
        onToggleAutopilot={handleToggleAutopilot}
        creditsBalance={creditsBalance}
        connectedAccount={account}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8 flex-1 w-full space-y-4">
        
        {/* Payment Confirmation Banner */}
        {isPaymentSuccess && (
          <div className="bg-emerald-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Growth Plan Active</h3>
                <p className="text-xs text-emerald-100">
                  Your 30-day autonomous Instagram calendar is live.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentSuccess(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Clean Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              {hasConfiguredBrand ? currentDisplayName.charAt(0).toUpperCase() : <Store className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentDisplayName}
                </h1>
                {currentHandle ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    @{currentHandle.replace('@', '')}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Step 1: Connect
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {activeTab === 'wizard' ? 'Setup your 30-day autonomous strategy' : '30-Day Growth Pipeline'}
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto self-start">
            <button
              type="button"
              onClick={() => handleSelectTab('calendar')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tNav('calendar')} ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('wizard')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'wizard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Setup Wizard</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        {activeTab === 'wizard' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8">
            <div className="max-w-xl mx-auto text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {tOnboarding('title')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {tOnboarding('subtitle')}
              </p>
            </div>

            <StepWizard
              onStrategyReady={handleStrategyReady}
              currentLocale={locale}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-600">
                  Loading your scheduled posts...
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

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">INSTASK</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Meta Verified Graph API</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href={`/${locale}/terms`} className="hover:text-slate-900">Terms</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Nav */}
      <MobileBottomNav
        currentLocale={locale}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        autoPilotEnabled={autoPilotEnabled}
        onToggleAutopilot={handleToggleAutopilot}
        creditsBalance={creditsBalance}
        connectedAccount={account}
      />
    </div>
  );
}