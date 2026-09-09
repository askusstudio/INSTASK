'use client';

import React from 'react';
import Link from 'next/link';
import {
  Instagram,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  Users,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface LandingPageProps {
  params: { locale: string };
}

export default function PublicLandingPage({ params: { locale } }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                INSTASK<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"> AI</span>
              </span>
              <span className="hidden sm:inline-flex ml-2 items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Meta v21.0 Certified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/pricing`}
              className="hidden md:inline-flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              Pricing (50% Off)
            </Link>
            <Link
              href={`/${locale}/login`}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-xs"
            >
              Sign In
            </Link>
            <Link
              href={`/${locale}/login`}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* 50% Off Banner Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>First-Time Creator Welcome Offer: 50% OFF Applied (Coupon: FIRST50)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Instagram on Full Autopilot in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500">
              3 Easy Clicks.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Generate 30 days of high-converting graphics, viral captions, and 3-tier hashtags. We scrape your top competitors and publish directly via Meta&apos;s official Graph API.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/${locale}/login`}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Start 30-Day Growth Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/${locale}/pricing`}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm transition-all border border-slate-200 shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>View Pricing ($24.50 First Month)</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official Meta Graph API v21.0
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              Stripe 256-Bit Encrypted Payments
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              100% Money-Back Guarantee
            </span>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xl p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-slate-700">INSTASK • 30-Day Autonomous Calendar</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Autopilot: ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
                {[
                  { day: 'Day 1', theme: 'Behind The Scenes', hook: 'The 36-Hour Sourdough Secret', status: 'Published' },
                  { day: 'Day 2', theme: 'Social Proof', hook: 'Why Austin Foodies Drive 20 Miles', status: 'Published' },
                  { day: 'Day 3', theme: 'Educational', hook: '3 Flours Every Baker Must Know', status: 'Scheduled' },
                  { day: 'Day 4', theme: 'Problem & Solution', hook: 'Never Settle For Stale Bread Again', status: 'Scheduled' },
                ].map((post, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">{post.day}</span>
                      <span className={`px-1.5 py-0.2 rounded-full ${post.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-2">{post.hook}</p>
                    <span className="text-[9px] font-medium text-slate-400 block">{post.theme}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Architecture Flow */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              Zero-Friction Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              From zero to 30 days published in 3 steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Built specifically for small businesses with no dedicated marketing team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Multi-Channel Connect</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign in with Email, Phone OTP, or Instagram/Facebook Meta OAuth in under 15 seconds. No passwords stored.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Niche Intelligence Analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our Apify engine scrapes your top competitors&apos; top-performing reels and carousel posts to extract winning hooks and hashtag tiers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Autopilot Publishing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gemini 2.5 Flash crafts 30 days of copy, Creatomate renders high-res graphics, and Meta Graph API auto-publishes on your exact schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Welcome Discount
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Simple, transparent pricing. 50% off today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cancel anytime in 1 click. Zero lock-in contracts.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-rose-500/40 p-8 sm:p-10 shadow-soft-md max-w-xl mx-auto text-left space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Pro Growth Plan</h3>
                <p className="text-xs text-slate-500">Autonomous Instagram growth engine</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through mr-1.5">$49</span>
                <span className="text-4xl font-black text-slate-900">$24.50</span>
                <span className="text-[11px] text-emerald-600 font-bold block">for month 1 with FIRST50</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                '30 AI-generated visual templates (1:1 & 4:5 aspect ratio)',
                '5 Competitor intelligence scraping with 2s safety limits',
                'Gemini 2.5 Flash caption & 3-tier hashtag automation',
                'Certified Meta Graph API v21.0 container publishing',
                '10 Global languages with native Arabic RTL support',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/pricing`}
              className="w-full py-4 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Claim 50% Off &amp; Activate Now</span>
              <ArrowRight className="w-4 h-4 text-rose-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-800">Instask</span>
            <span className="hidden sm:inline">•</span>
            <span>Operated by <strong>INSTASK</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium">Meta Graph API v21.0 Certified</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <Link href={`/${locale}/pricing`} className="hover:text-slate-900 font-medium">Pricing</Link>
            <Link href={`/${locale}/terms`} className="hover:text-slate-900 font-medium">Terms of Service</Link>
            <Link href={`/${locale}/refund-policy`} className="hover:text-slate-900 font-medium">Refund Policy</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900 font-medium">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
