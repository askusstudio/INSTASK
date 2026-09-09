'use client';

import React, { useState } from 'react';
import { Zap, Plus, Sparkles, X, Check, ShieldCheck } from 'lucide-react';

interface CreditBadgeProps {
  balance?: number;
  initialBalance?: number;
}

const BUNDLES = [
  {
    key: 'tier_small',
    credits: 25,
    priceUSD: '$5',
    priceINR: '₹399',
    popular: false,
    description: 'Perfect for tweaking and testing a few post creatives.',
  },
  {
    key: 'tier_medium',
    credits: 75,
    priceUSD: '$12',
    priceINR: '₹899',
    popular: true,
    description: 'Best Value • Complete batch regenerations & audits.',
  },
  {
    key: 'tier_large',
    credits: 200,
    priceUSD: '$25',
    priceINR: '₹1,899',
    popular: false,
    description: 'Power User • Heavy multi-campaign asset rendering.',
  },
];

export default function CreditBadge({ balance: propBalance, initialBalance = 60 }: CreditBadgeProps) {
  const [balance, setBalance] = useState(propBalance ?? initialBalance);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  React.useEffect(() => {
    if (propBalance !== undefined) {
      setBalance(propBalance);
    }
  }, [propBalance]);

  const buyCredits = async (bundleKey: string) => {
    setLoadingKey(bundleKey);
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundleKey }),
      });
      const data = await res.json();
      if (data.balanceRemaining !== undefined) {
        setBalance(data.balanceRemaining);
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate credit top-up. Please try again.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      {/* Header Credit Badge */}
      <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-full shadow-xs">
        <Zap
          className={`w-3.5 h-3.5 transition-colors ${
            balance < 10 ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-amber-500 fill-amber-500'
          }`}
        />
        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
          {balance} <span className="hidden sm:inline">Credits</span>
        </span>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="ml-1 text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full hover:bg-slate-800 transition flex items-center gap-0.5 shadow-xs"
          title="Top up compute and rendering credits"
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Top Up</span>
        </button>
      </div>

      {/* Top-Up Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Compute Refill</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Top Up INSTASK Credits
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your current balance is <strong className="text-slate-900">{balance} credits</strong>. Credits never expire and power AI copywriting, Apify audits, and Creatomate rendering.
              </p>
            </div>

            {/* Bundle Options */}
            <div className="space-y-3">
              {BUNDLES.map((b) => {
                const isLoading = loadingKey === b.key;
                return (
                  <div
                    key={b.key}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                      b.popular
                        ? 'border-rose-500 bg-rose-50/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {b.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {b.credits} Extra Credits
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {b.priceUSD} <span className="text-slate-400 font-normal">({b.priceINR})</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{b.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => buyCredits(b.key)}
                      disabled={Boolean(loadingKey)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Trust Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instant Credit Activation</span>
              </span>
              <span>Encrypted Stripe Checkout</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
