'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS, PlanTier } from '@/lib/pricing-plans';

interface PricingSelectorProps {
  locale?: string;
  initialCurrency?: 'usd' | 'inr';
  initialPlan?: 'quarterly' | 'semi_annual' | 'annual';
}

export default function PricingSelector({
  locale = 'en',
  initialCurrency = 'usd',
  initialPlan = 'semi_annual',
}: PricingSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<'quarterly' | 'semi_annual' | 'annual'>(initialPlan);
  const [currency, setCurrency] = useState<'usd' | 'inr'>(initialCurrency);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!termsAccepted) {
      alert('Please agree to the Terms of Service and Refund Policy to continue.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: selectedPlan, currency }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Checkout error: ${data.error}`);
      }
    } catch (e) {
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const planOptions: Array<'quarterly' | 'semi_annual' | 'annual'> = ['quarterly', 'semi_annual', 'annual'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center space-y-2 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Save Up to 15% with Multi-Month Autopay</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your INSTASK Growth Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Continuous AI competitor analysis, automated graphics, and guaranteed daily Instagram posting.
        </p>

        {/* Currency Toggle */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Currency:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrency('usd')}
              className={`px-2.5 py-1 rounded-md transition ${
                currency === 'usd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('inr')}
              className={`px-2.5 py-1 rounded-md transition ${
                currency === 'inr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {planOptions.map((key) => {
          const plan = SUBSCRIPTION_PLANS[key];
          const isSelected = selectedPlan === key;
          const symbol = currency === 'usd' ? '$' : '₹';
          const pricingData = currency === 'usd' ? plan.usd : plan.inr;

          return (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
              }`}
            >
              {/* Discount Tag */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">{plan.label}</h3>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {symbol}{pricingData.monthlyEquivalent}
                  </span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                  <p className="text-xs text-slate-400 mt-1">
                    Billed {symbol}{pricingData.total} every {plan.months} months
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{`${plan.creditsGranted} Total Generation Credits`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save {plan.discountPercentage}% upfront</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-published daily via Meta API</span>
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {isSelected ? 'Selected' : 'Select Plan'}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Autopay Notice & Checkout Action */}
      <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        {/* Mandatory Pre-Payment Waiver Checkbox */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-slate-200 text-left shadow-xs">
          <input
            type="checkbox"
            id="terms-check"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer flex-shrink-0"
          />
          <label htmlFor="terms-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
            I authorize <strong>INSTASK</strong> to charge my payment method for the selected recurring plan ({SUBSCRIPTION_PLANS[selectedPlan].label}) with automatic renewal. I agree to the{' '}
            <Link href={`/${locale}/terms`} target="_blank" className="underline font-semibold text-slate-900 hover:text-rose-600">
              Terms of Service
            </Link>{' '}
            and acknowledge the{' '}
            <Link href={`/${locale}/refund-policy`} target="_blank" className="underline font-semibold text-slate-900 hover:text-rose-600">
              Refund Policy
            </Link>:{' '}
            because API, AI tokens, and design generation initialize immediately, <strong>all sales are final and non-refundable</strong>. I can cancel recurring autopay anytime in my dashboard before the next cycle.
          </label>
        </div>

        {/* Autopay Notice */}
        <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl">
          <RefreshCw className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>Automatic Autopay Protection:</strong> Subscriptions renew automatically at the end of each billing cycle to prevent account disconnection and missed posts. Cancel anytime in your dashboard with 1 click.
          </span>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || !termsAccepted}
          className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            'Redirecting to Secure Checkout...'
          ) : (
            `Activate ${SUBSCRIPTION_PLANS[selectedPlan].label} & Enable Autopay`
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>256-bit encrypted card billing handled by Stripe. No refunds once assets render.</span>
        </div>
      </div>
    </div>
  );
}
