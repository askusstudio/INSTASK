import { headers } from "next/headers";
import Link from "next/link";
import { getPricingForCountry } from "@/lib/currency";
import { Sparkles, Check, Instagram, ShieldCheck, ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { PricingCheckoutSection } from "@/components/pricing/PricingCheckoutSection";

import PricingSelector from "@/components/pricing/PricingSelector";

export const dynamic = "force-dynamic";

interface PricingPageProps {
  params: { locale: string };
}

export default async function PricingPage({ params: { locale } }: PricingPageProps) {
  const headersList = await headers();
  const countryCode = headersList.get("x-user-country") || headersList.get("x-vercel-ip-country") || "US";
  const pricing = getPricingForCountry(countryCode);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to INSTASK</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/login`}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container: Multi-Tier Autopay Plans + Flexible Monthly Option */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-12 space-y-12">
        {/* Interactive Multi-Period Selector (3, 6, 12 Months with Autopay & Progressive Discounts) */}
        <PricingSelector
          locale={locale}
          initialCurrency={countryCode.toUpperCase() === 'IN' ? 'inr' : 'usd'}
        />

        {/* Separator / Alternative Option */}
        <div className="relative max-w-xl mx-auto text-center my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or Choose Single-Month Plan with First-Month Promotion
            </span>
          </div>
        </div>

        {/* Monthly Plan with 50% Off First Month */}
        <div className="max-w-md mx-auto w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            50% First-Month Discount Applied
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              INSTASK Pro Autopilot (Monthly)
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Publishing and competitor intelligence for your Instagram brand.
            </p>
          </div>

          {/* Dynamic Regional Price */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Billed Monthly ({pricing.code})
              </p>
              <p className="text-xs text-slate-400">Cancel anytime</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 line-through mr-1.5">
                {pricing.symbol}{pricing.regularPrice}
              </span>
              <span className="text-3xl font-extrabold text-slate-900">
                {pricing.symbol}{pricing.discountPrice}
              </span>
              <span className="text-xs text-slate-500 block">for 1st month</span>
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            {[
              "30 AI-designed branded creatives",
              "Continuous 5 competitor analysis",
              "Direct Instagram Graph API automated publishing",
              "High-engagement multi-language captions",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Client Checkout Section with Mandatory Waiver & Dynamic priceId */}
          <PricingCheckoutSection pricing={pricing} locale={locale} />
        </div>
      </main>

      {/* Global Legal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 INSTASK. All rights reserved. Operated by <strong>INSTASK</strong></span>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/refund-policy`} className="hover:underline">Refund Policy</Link>
            <Link href={`/${locale}/terms`} className="hover:underline">Terms of Service</Link>
            <Link href={`/${locale}/privacy`} className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
