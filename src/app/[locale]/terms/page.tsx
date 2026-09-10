'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
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
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Effective Date: January 1, 2024 • Last Updated: 2024
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            This document is an electronic record under the Information Technology Act, 2000, and rules thereunder. This website, <strong>instask.in</strong> (alongside its official domains), is operated by <strong>askus studio</strong> under the brand name <strong>Instask</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing or using our platform, services, and automated software, you agree to be bound by these Terms and Conditions.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Service Scope</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instask provides cloud-based autonomous software-as-a-service (SaaS) that assists users in competitor research, automated social media content generation, visual asset rendering, and schedule management via official platform APIs.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">2</span>
              <span>Account Registration and Security</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You must provide accurate, current, and complete details during registration. You are solely responsible for maintaining the confidentiality of your credentials and tokens. Users must be at least 18 years of age or possess legal business authority to enter into these terms.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Intellectual Property Rights</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All software, interfaces, algorithms, trademarks, and codebases remain the exclusive property of <strong>askus studio</strong>. Content, logos, brand colors, and assets uploaded by the user remain the property of the respective user.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">4</span>
              <span>Acceptable Use and Third-Party Compliance</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Users agree not to use Instask for publishing defamatory, infringing, obscene, hateful, or unlawful material.
              </p>
              <p>
                Users warrant compliance with the platform terms of any integrated services (including Meta Platform Terms and Instagram Community Guidelines).
              </p>
              <p>
                We reserve the right to immediately suspend or terminate accounts engaging in abusive behavior, unauthorized scraping, or API spamming.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">5</span>
              <span>Limitation of Liability</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To the maximum extent permitted by applicable law, <strong>askus studio</strong> shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, reach, account restrictions, or business interruptions arising out of the use of our services.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">6</span>
              <span>Governing Law and Jurisdiction</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in <strong>Uttar Pradesh, India</strong>.
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
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
              <Link href={`/${locale}/privacy`} className="hover:underline">Privacy Policy</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}