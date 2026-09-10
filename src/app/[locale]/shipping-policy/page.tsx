'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface PolicyPageProps {
  params: { locale: string };
}

export default function ShippingPolicyPage({ params: { locale } }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md p-6 sm:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Digital Fulfillment Statement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Effective Date: January 1, 2024 • Last Updated: 2024
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. Nature of Service</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instask is a completely software-based digital platform operated by <strong>askus studio</strong>. We do not manufacture, package, or ship any physical goods or tangible merchandise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. Digital Delivery Timelines</h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • <strong>Instant Account Activation:</strong> Access to the platform dashboard, onboarding wizard, and generation credits is provisioned electronically immediately upon successful payment verification.
              </p>
              <p>
                • <strong>Asset &amp; Generation Delivery:</strong> Strategy recommendations, generated copywriting, and rendered graphical assets are delivered directly inside the user dashboard queue within minutes of initiating the generation sequence.
              </p>
              <p>
                • <strong>Confirmation:</strong> An electronic payment receipt and invoice containing full subscription details will be dispatched immediately to your registered email address (<a href="mailto:askusstudio@gmail.com" className="font-semibold underline">askusstudio@gmail.com</a> dispatch records).
              </p>
            </div>
          </section>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            Support contact: <a href="mailto:support@instask.in" className="font-bold underline">support@instask.in</a> • Operational: <a href="mailto:askusstudio@gmail.com" className="font-bold underline">askusstudio@gmail.com</a> • Helpline: <span className="font-bold">+91 8009227002</span>
          </div>

          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>askus studio</strong> • Brand: <strong>Instask</strong></span>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/terms`} className="hover:underline">Terms of Service</Link>
              <Link href={`/${locale}/privacy`} className="hover:underline">Privacy Policy</Link>
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}