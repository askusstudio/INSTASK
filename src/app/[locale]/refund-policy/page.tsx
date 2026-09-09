'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Instagram, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface PolicyPageProps {
  params: { locale: string };
}

export default function RefundPolicyPage({ params: { locale } }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Instask</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/pricing`}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl transition"
            >
              Pricing &amp; Plans
            </Link>
          </div>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md p-6 sm:p-12 space-y-8">
          
          {/* Header Banner */}
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Contractual Consumer Waiver</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Strict No-Refund Policy for INSTASK • Last Updated: September 2026
            </p>
          </div>

          {/* Critical Notice Alert */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 text-xs leading-relaxed space-y-2">
            <p className="font-extrabold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Important Notice: Immediate Computational Delivery &amp; Waiver</span>
            </p>
            <p>
              All services, compute processing, and subscription memberships are provided directly by <strong>INSTASK</strong>. All transactions made on INSTASK are strictly final and non-refundable. INSTASK provides immediate, automated computational execution (AI copy generation via Google Gemini, competitor scraping via Apify, and high-resolution rendering via Creatomate). By initiating subscription checkout, you explicitly consent to immediate service activation and contractually waive any statutory cooling-off or withdrawal refund rights under the EU/UK Consumer Rights Directives and global consumer protection statutes.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>General Policy Overview</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All services, compute processing, and subscription memberships are provided directly by <strong>INSTASK</strong>. All transactions made on INSTASK are strictly final and non-refundable. INSTASK delivers instantaneous digital assets, computational API services, automated competitor data intelligence, and third-party media scheduling upon subscription activation. Because computational resources, AI tokens (Gemini), scraping credits (Apify), and visual rendering servers (Creatomate) are consumed immediately upon onboarding, <strong>all purchases, monthly subscriptions, and renewal transactions are strictly non-refundable</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>First-Month Promotional Rate &amp; Renewal</span>
            </h2>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                The introductory 50% discount (applied with code <strong>FIRST50</strong>) applies strictly to your first 30-day billing cycle.
              </li>
              <li>
                Following the first cycle, subscriptions renew automatically at the full published recurring rate unless cancelled prior to the renewal billing timestamp.
              </li>
              <li>
                Failure to cancel before the billing cycle date does not qualify for a retroactive refund.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Digital Delivery &amp; Immediate Consumption Waiver</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              By completing the Stripe checkout flow and submitting your brand details, you explicitly consent to the immediate provision of digital content and acknowledge that you forfeit any statutory right of withdrawal or cooling-off period (including rights under the EU/UK Consumer Rights Directives and similar global consumer protection laws). Once your 30-day queue is initialized, computational delivery is deemed 100% complete.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">4</span>
              <span>External Platform Disclaimers &amp; Algorithm Caveats</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instask does not issue refunds based on:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 pl-4 border-l-2 border-slate-200">
              <p>
                <strong>Account Reach or Engagement Variance:</strong> Social media algorithms, follower growth, reach, impressions, and viral outcomes remain subject to Instagram/Meta platform discretion. We do not guarantee arbitrary quantitative growth metrics.
              </p>
              <p>
                <strong>User-Initiated Token Disconnection:</strong> If you disconnect your Instagram account, change your Facebook password, or revoke OAuth tokens, Instask remains available and your subscription stays active; unposted days due to user disconnection are non-refundable.
              </p>
              <p>
                <strong>Third-Party Service Outages:</strong> Occasional downtime or rate limiting caused by Meta Graph API, Apify, or Creatomate does not entitle the subscriber to monetary refunds.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">5</span>
              <span>How to Cancel</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You may cancel your subscription at any time via your Instask Account Billing Settings or directly through your Stripe customer portal. Upon cancellation, auto-billing halts immediately, and your dashboard access remains active until the end of your current paid billing period.
            </p>
          </section>

          {/* Legal Footer Attribution */}
          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>INSTASK</strong> • All Rights Reserved</span>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/terms`} className="hover:underline">Terms of Service</Link>
              <Link href={`/${locale}/privacy`} className="hover:underline">Privacy Policy</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
