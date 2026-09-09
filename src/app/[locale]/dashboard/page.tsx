'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/ui/Navbar';
import { StepWizard } from '@/components/onboarding/StepWizard';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { GrowthForecast } from '@/components/analytics/GrowthForecast';
import { StrategyBlueprintModal } from '@/components/strategy/StrategyBlueprintModal';
import { StrategyBlueprint } from '@/lib/recommendations';
import { BusinessProfileData } from '@/components/onboarding/StepBusinessProfile';
import { useGuidance } from '@/context/GuidanceContext';
import { PostRecord } from '@/lib/prisma';
import {
  Calendar,
  Wand2,
  Sparkles,
  Instagram,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface DashboardPageProps {
  params: { locale: string };
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const tNav = useTranslations('nav');
  const tOnboarding = useTranslations('onboarding');
  const tCommon = useTranslations('common');
  const { dismissAllGuidance } = useGuidance();

  const [activeTab, setActiveTab] = useState<'calendar' | 'wizard'>('calendar');
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [strategyBlueprint, setStrategyBlueprint] = useState<StrategyBlueprint | null>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(60);

  // Active business context
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

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success' || params.get('activated') === 'true') {
        setIsPaymentSuccess(true);
      }
      if (params.get('credits_added') === 'true') {
        fetchCredits();
      }
    }
  }, []);

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
        setShowBlueprintModal(false);
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
      {/* Navigation Bar */}
      <Navbar
        currentLocale={locale}
        autoPilotEnabled={autoPilotEnabled}
        onToggleAutopilot={handleToggleAutopilot}
        creditsBalance={creditsBalance}
        connectedAccount={account}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        
        {/* Payment Success & Subscription Active Celebration Banner */}
        {isPaymentSuccess && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-5 text-white shadow-soft-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-400/40 animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg tracking-tight">
                    Access Unlocked: Pro Growth Plan (50% Off First Month Applied)
                  </h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    COUPON: FIRST50
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1 font-medium leading-relaxed">
                  Your 30-day autonomous content calendar is running. Creatomate templates and Meta Graph API auto-publishing are enabled.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentSuccess(false)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex-shrink-0 self-end sm:self-center"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Header & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{account?.brandName || 'INSTASK'}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80">
                30-Day Autonomous Dashboard
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Autonomous Instagram growth platform with certified Meta Graph API v21.0 container posting.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-soft-sm self-start">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'calendar'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{tNav('calendar')} ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'wizard'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate New Plan</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 30-Day Visual Calendar */}
        {activeTab === 'calendar' && (
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

        {/* Tab 2: Setup Wizard */}
        {activeTab === 'wizard' && (
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
        )}
      </div>

      {/* Strategy Blueprint Review Modal */}
      {strategyBlueprint && (
        <StrategyBlueprintModal
          blueprint={strategyBlueprint}
          isOpen={showBlueprintModal}
          onClose={() => setShowBlueprintModal(false)}
          onApplyStrategy={handleApplyStrategy}
        />
      )}

      {/* Footer */}
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
    </div>
  );
}
