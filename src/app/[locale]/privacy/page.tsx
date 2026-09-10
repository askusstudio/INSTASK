'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
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
              Effective Date: January 1, 2024 • Last Updated: 2024
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>askus studio</strong> (&quot;Instask&quot;, &quot;we&quot;, &quot;our&quot;) values your trust and is committed to protecting your privacy. This Privacy Policy details how we collect, store, and process personal and business data across our website <strong>instask.in</strong> and related software services.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                • <strong>Account Information:</strong> Name, email address, phone number (+91), and billing information provided during registration.
              </p>
              <p>
                • <strong>Brand Assets:</strong> Business handles, brand colors, uploaded logos, and target competitor account identifiers.
              </p>
              <p>
                • <strong>System Identifiers:</strong> IP addresses, browser types, session tokens, and access timestamps.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>• To provision your automated marketing calendar and process graphic rendering.</p>
              <p>• To manage recurring billing, authentication, and token deductions.</p>
              <p>• To communicate platform alerts, queue updates, and support notices.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Data Protection and Third-Party Disclosures</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>We do not sell or rent user data to third parties or data brokers.</p>
              <p>Necessary metadata is transmitted via secure, encrypted protocols to verified infrastructure providers:</p>
              <p>• <strong>Payment Gateways:</strong> Razorpay / Stripe (for encrypted payment and autopay processing).</p>
              <p>• <strong>API Integrations:</strong> Meta Graph API, rendering servers, and language model providers solely for post execution.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">4</span>
              <span>Data Security</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We maintain industry-standard administrative, technical, and physical safeguards (including SSL/TLS encryption and restricted database access) to protect against unauthorized access or alteration of your personal data.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">5</span>
              <span>User Rights and Data Erasure</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Users may request access to, correction of, or permanent deletion of their account data by contacting our grievance team at <a href="mailto:support@instask.in" className="font-bold underline text-slate-900">support@instask.in</a>.
            </p>
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
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}