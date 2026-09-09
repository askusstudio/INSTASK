'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { ShieldCheck } from 'lucide-react';
import { CurrencyConfig } from '@/lib/currency';

interface PricingCheckoutSectionProps {
  pricing: CurrencyConfig;
  locale: string;
}

export function PricingCheckoutSection({ pricing, locale }: PricingCheckoutSectionProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="space-y-4">
      {/* Mandatory Pre-Payment Waiver Checkbox */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
        <input
          type="checkbox"
          id="terms-check"
          required
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer flex-shrink-0"
        />
        <label htmlFor="terms-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
          I authorize <strong>INSTASK</strong> to charge my payment method for the introductory rate of 50% off ({pricing.symbol}{pricing.discountPrice}) for month 1, and recurring monthly thereafter ({pricing.symbol}{pricing.regularPrice}/mo). I agree to the{' '}
          <Link href={`/${locale}/terms`} target="_blank" className="underline font-semibold text-slate-900 hover:text-rose-600">
            Terms of Service
          </Link>{' '}
          and acknowledge the{' '}
          <Link href={`/${locale}/refund-policy`} target="_blank" className="underline font-semibold text-slate-900 hover:text-rose-600">
            Refund Policy
          </Link>:{' '}
          because API, AI tokens, and design generation initialize immediately, <strong>all sales are final and non-refundable</strong>. I can cancel anytime before the next renewal.
        </label>
      </div>

      {/* Pass the specific Stripe Price ID to checkout */}
      <CheckoutButton
        priceId={pricing.stripePriceId}
        disabled={!termsAccepted}
        label={`Claim 50% Off (${pricing.symbol}${pricing.discountPrice}) & Activate`}
      />

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Meta v21.0 Certified</span>
        </span>
        <span>Stripe Encrypted (SSL)</span>
      </div>
    </div>
  );
}
