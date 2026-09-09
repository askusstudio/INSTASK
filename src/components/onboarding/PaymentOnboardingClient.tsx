'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { CurrencyConfig } from '@/lib/currency';
import RazorpayButton from '@/components/RazorpayButton';

interface PaymentOnboardingClientProps {
  locale: string;
  pricing: CurrencyConfig;
}

export function PaymentOnboardingClient({ locale, pricing }: PaymentOnboardingClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>(
    pricing.code === 'INR' ? 'razorpay' : 'stripe'
  );

  // 1. Trigger Stripe Checkout or Sandbox simulation
  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_demo_001',
          planPriceId: pricing.stripePriceId,
        }),
      });

      const data = await res.json();

      if (data.mode === 'live' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const actRes = await fetch('/api/billing/simulate-activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'usr_demo_001' }),
        });
        const actData = await actRes.json();
        if (actData.success) {
          router.push(`/${locale}?activated=true`);
        } else {
          router.push(`/${locale}?activated=true`);
        }
      }
    } catch {
      setError('An error occurred connecting to the checkout gateway. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-soft-md p-6 sm:p-10 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-xs font-semibold text-slate-700">Step 3 of 3: Plan Activation</span>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            50% Welcome Discount Applied
          </span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Activate Your Autonomous Growth Plan
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Complete your subscription to unlock competitor analysis, AI post generation, Creatomate visual rendering, and automated Meta Graph API posting.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Dynamic Regional Pricing Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border-2 border-rose-500/30 shadow-soft space-y-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Pro Growth Plan</h3>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Billed Monthly ({pricing.code})</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 line-through mr-1.5">
                {pricing.symbol}{pricing.regularPrice}
              </span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {pricing.symbol}{pricing.discountPrice}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block">50% off first month</span>
            </div>
          </div>

          <div className="border-t border-slate-200/80 pt-4 space-y-2.5">
            {[
              '5 Competitor intelligence scraping with 2s rate limit safety',
              '30 High-res graphic templates rendered via Creatomate (1:1 & 4:5)',
              'Full caption & 3-tier hashtag automation (Gemini 2.5 Flash)',
              'Direct Meta Graph API v21.0 automatic container posting',
              'Cancel anytime with 1-click • No questions asked',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-700" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Billing Interval Clarification */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-700" />
              <span>Billed {pricing.symbol}{pricing.discountPrice} today • Renews at {pricing.symbol}{pricing.regularPrice}/mo thereafter</span>
            </p>
            <p className="text-amber-800/90 text-[10px]">
              You can pause or cancel your subscription at any time from your account settings with zero cancellation penalties.
            </p>
          </div>
        </div>

        {/* Payment Gateway Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Payment Method:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                paymentMethod === 'razorpay'
                  ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-slate-900'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
              }`}
            >
              <Smartphone className={`w-4 h-4 ${paymentMethod === 'razorpay' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div>
                <span className="block text-xs font-bold">UPI Autopay</span>
                <span className="block text-[10px] text-slate-400">Razorpay / GPay / Paytm</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                paymentMethod === 'stripe'
                  ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900 text-slate-900'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${paymentMethod === 'stripe' ? 'text-slate-900' : 'text-slate-400'}`} />
              <div>
                <span className="block text-xs font-bold">Credit / Debit Card</span>
                <span className="block text-[10px] text-slate-400">Stripe International</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mandatory Pre-Payment Waiver Checkbox */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
          <input
            type="checkbox"
            id="terms-check-onboarding"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer flex-shrink-0"
          />
          <label htmlFor="terms-check-onboarding" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
            I authorize <strong>INSTASK</strong> to charge my payment method for the introductory rate of 50% off ({pricing.symbol}{pricing.discountPrice}) for month 1, and recurring monthly thereafter ({pricing.symbol}{pricing.regularPrice}/mo). I agree to the{' '}
            <a href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-900 hover:text-rose-600">Terms of Service</a>{' '}
            and acknowledge the{' '}
            <a href={`/${locale}/refund-policy`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-900 hover:text-rose-600">Refund Policy</a>:{' '}
            because API, AI tokens, and design generation initialize immediately, <strong>all sales are final and non-refundable</strong>. I can cancel anytime before the next renewal.
          </label>
        </div>

        {/* Payment CTA */}
        <div className="space-y-3">
          {paymentMethod === 'razorpay' ? (
            <RazorpayButton
              planKey="monthly"
              planTitle="INSTASK Pro Monthly"
              amount={pricing.code === 'INR' ? pricing.discountPrice : 1999}
              currency={pricing.code}
              disabled={loading || !termsAccepted}
              className="w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Unlock 50% Off via UPI Autopay ({pricing.symbol}{pricing.discountPrice})</span>
            </RazorpayButton>
          ) : (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading || !termsAccepted}
              className="w-full py-4 px-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-rose-300" />
              <span>{loading ? 'Activating Your Growth Plan...' : `Unlock 50% Off (${pricing.symbol}${pricing.discountPrice}) & Activate`}</span>
              <ArrowRight className="w-4 h-4 text-rose-300" />
            </button>
          )}

          {/* Sandbox Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-500 font-medium">Instant Sandbox Activation Enabled</span>
            </div>
            <span className="font-mono text-[10px]">Stripe &amp; Razorpay UPI</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px]">256-bit SSL encrypted payment • Instant Autopilot Activation</span>
        </div>
      </div>
    </div>
  );
}
