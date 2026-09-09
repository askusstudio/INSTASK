'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface PolicyPageProps {
  params: { locale: string };
}

export default function PrivacyPolicyPage({ params: { locale } }: PolicyPageProps) {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Protection &amp; Confidentiality</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              INSTASK • Last Updated: September 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • <strong>Account Identifiers:</strong> Email address, mobile phone number, and basic billing metadata processed through Stripe. (Instask never views, logs, or stores raw credit card details).
              </p>
              <p>
                • <strong>Meta Account Data:</strong> Instagram Business ID, Facebook Page Access Tokens, and profile usernames authorized securely via Meta OAuth 2.0.
              </p>
              <p>
                • <strong>Brand Strategy Data:</strong> Submitted competitor account handles, brand color hex codes, uploaded logos, and generated asset history.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>How Data Is Handled with Third Parties</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • <strong>Stripe:</strong> Utilized for 256-bit encrypted payment processing and subscription billing state management.
              </p>
              <p>
                • <strong>Meta Graph API:</strong> Directly utilized to create media containers and publish authorized content to your Instagram professional feed.
              </p>
              <p>
                • <strong>LLM &amp; Rendering Engines:</strong> Copy prompts and brand data are routed via encrypted endpoints (Gemini API &amp; Creatomate) solely for dynamic graphic and copy creation. <strong>Your data is never sold to external third-party data brokers or ad networks.</strong>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Data Retention and Account Disconnection</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You can disconnect Instask from your Meta account at any moment through Instagram Settings -&gt; &quot;Apps and Websites&quot; or directly via the Instask dashboard. All cached access tokens are revoked immediately upon disconnection.
            </p>
          </section>

          {/* Legal Footer Attribution */}
          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>INSTASK</strong> • All Rights Reserved</span>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/terms`} className="hover:underline">Terms of Service</Link>
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
