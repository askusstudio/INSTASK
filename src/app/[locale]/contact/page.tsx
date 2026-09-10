'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Clock, MapPin, Building2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface PolicyPageProps {
  params: { locale: string };
}

export default function ContactPage({ params: { locale } }: PolicyPageProps) {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span>Grievance &amp; Operational Contact</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Contact &amp; Grievance Redressal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official entity details for inquiries, billing assistance, and grievance redressal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Brand Name</span>
              <p className="text-base font-black text-slate-900">Instask</p>
              <p className="text-xs text-slate-500">Domain: www.instask.in</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Legal Entity Name</span>
              <p className="text-base font-black text-slate-900">askus studio</p>
              <p className="text-xs text-slate-500">Jurisdiction: Uttar Pradesh, India</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> Customer Support
              </span>
              <a href="mailto:support@instask.in" className="text-sm font-bold text-emerald-700 underline block">
                support@instask.in
              </a>
              <span className="text-[11px] text-slate-500 block">Operational: askusstudio@gmail.com</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Direct Helpline
              </span>
              <a href="tel:+918009227002" className="text-sm font-bold text-slate-900 block">
                +91 8009227002
              </a>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Mon - Sat, 10:00 AM - 7:00 PM IST
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Response Timeline:</strong> All support tickets and grievance emails are acknowledged within <strong>24–48 working hours</strong>. For operational queries, billing assistance, platform feedback, or formal grievances, reach out directly through the official channels listed above.
          </div>

          <div className="pt-8 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Operated by <strong>askus studio</strong> • Brand: <strong>Instask</strong></span>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/terms`} className="hover:underline">Terms</Link>
              <Link href={`/${locale}/privacy`} className="hover:underline">Privacy</Link>
              <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund</Link>
              <Link href={`/${locale}/shipping-policy`} className="hover:underline">Shipping</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}