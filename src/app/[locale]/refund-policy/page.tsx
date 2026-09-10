'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
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
              <span>Consumer Cancellation &amp; Refund Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cancellation and Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Effective Date: January 1, 2024 • Last Updated: 2024
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            This policy outlines the terms of subscription cancellation, credit provisioning, and refund requests for services provided by <strong>askus studio</strong> under the brand <strong>Instask</strong> at <strong>instask.in</strong>.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Subscription Cancellations</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Users can cancel their recurring subscription (monthly, quarterly, semi-annual, or annual) at any time through their dashboard settings or customer billing portal.
              </p>
              <p>
                Upon cancellation, automated recurring debits will stop immediately. You will retain full access to Instask until the conclusion of your current paid billing period.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>Strict No-Refund Policy for Digital Services</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Instask provides immediate access to digital infrastructure, automated scraping pipelines, AI generation tokens, and third-party media rendering compute upon payment confirmation.
              </p>
              <p>
                Because system resources, compute units, and API access are provisioned instantly: <strong>All transactions, subscription fees, credit pack purchases, and renewals are final and non-refundable.</strong>
              </p>
              <p>
                No prorated or partial refunds are provided for unused portions of an active subscription cycle or unused generation credits.
              </p>
              <p>
                Dissatisfaction with social media reach, follower growth, or third-party platform algorithm fluctuations does not constitute grounds for a monetary refund.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Billing Errors &amp; Chargebacks</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                In the event of an accidental double debit or technical payment processing error verified by our payment gateway partners, the duplicate charge will be refunded back to the original source payment method within <strong>5–7 business days</strong>.
              </p>
              <p>
                For transaction inquiries, write to <a href="mailto:support@instask.in" className="font-bold underline text-slate-900">support@instask.in</a> before contacting card networks or initiating formal disputes.
              </p>
            </div>
          </section>

          {/* Contact Details */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            Support contact: <a href="mailto:support@instask.in" className="font-bold underline">support@instask.in</a> • Operational: <a href="mailto:askusstudio@gmail.com" className="font-bold underline">askusstudio@gmail.com</a> • Helpline: <span className="font-bold">+91 8009227002</span>
          </div>

          {/* Legal Footer Attribution */}
          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>askus studio</strong> • Brand: <strong>Instask</strong></span>
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