'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface PolicyPageProps {
  params: { locale: string };
}

export default function TermsPage({ params: { locale } }: PolicyPageProps) {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
              <Scale className="w-3.5 h-3.5 text-slate-700" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              INSTASK • Last Updated: September 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Service Scope &amp; Role of INSTASK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All services, compute processing, and subscription memberships are provided directly by <strong>INSTASK</strong>. All transactions made on INSTASK are strictly final and non-refundable. INSTASK is an autonomous software tool that integrates approved third-party APIs (including Meta Platforms, Inc., Stripe, Google AI, Apify, and Creatomate) to streamline social media research, design generation, and publishing automation for businesses.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>Meta / Instagram Platform Compliance</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • You warrant that you are the verified administrator or authorized operator of the connected Instagram Business or Creator account and associated Facebook Page.
              </p>
              <p>
                • You agree not to use Instask to post spam, copyright-infringing media, hate speech, or content that violates the Meta Community Standards or Instagram Platform Terms.
              </p>
              <p>
                • INSTASK holds no liability for actions taken by Meta against your social account (e.g., account flags, shadowbans, or rate restrictions) resulting from your chosen brand prompts or excessive API calls.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>AI-Generated Output &amp; Review Obligation</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • Content copy, captions, keywords, and graphical outputs are generated autonomously via AI models (including Gemini 2.5 Flash and Creatomate).
              </p>
              <p>
                • While Instask provides automated scheduling, the <strong>user maintains full legal editorial responsibility</strong> for reviewing, approving, and verifying that all generated copy and graphics are factual, original, and compliant with local advertising guidelines before publication.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">4</span>
              <span>Chargebacks and Disputes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Initiating an unjustified dispute or credit card chargeback through your financial institution instead of utilizing standard account cancellation violates these Terms. In the event of an illegitimate chargeback, Instask reserves the right to immediately terminate the user account, ban associated Meta credentials, and submit server access logs, IP verification, and API generation records to the processing bank as conclusive proof of delivery.
            </p>
          </section>

          {/* Legal Footer Attribution */}
          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>INSTASK</strong> • All Rights Reserved</span>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
              <Link href={`/${locale}/privacy`} className="hover:underline">Privacy Policy</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
