'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import {
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  CreditCard,
  Smartphone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CurrencyConfig } from '@/lib/currency';

interface PaymentOnboardingClientProps {
  locale: string;
  pricing: CurrencyConfig;
}

export function PaymentOnboardingClient({ locale, pricing }: PaymentOnboardingClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('razorpay');

  // Success handler after successful transaction
  const handlePaymentSuccess = async (paymentId: string) => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('instask_plan_active', 'true');
        localStorage.setItem('instask_plan_activated', 'true');
        localStorage.setItem('instask_active_plan', 'pro_monthly');
        localStorage.setItem('instask_user_activated', 'true');
        localStorage.setItem('instask_wizard_completed', 'true');
        localStorage.setItem('instask_payment_id', paymentId);

        // Session cookies required by middleware
        document.cookie = 'instask_auth=true; path=/; max-age=31536000';
        document.cookie = 'instask_plan=pro; path=/; max-age=31536000';
        document.cookie = 'next-auth.session-token=demo-session-token; path=/; max-age=31536000';
        document.cookie = '__Secure-next-auth.session-token=demo-session-token; path=/; max-age=31536000';
      }

      await fetch('/api/billing/simulate-activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_demo_001', paymentId }),
      }).catch(() => {});

      window.location.href = `/${locale}/dashboard?activated=true&view=calendar&session=paid_${paymentId}`;
    } catch {
      window.location.href = `/${locale}/dashboard?activated=true&view=calendar`;
    } finally {
      setLoading(false);
    }
  };

  // Helper to ensure Razorpay script is loaded dynamically if not present
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay Checkout
  const handleRazorpayCheckout = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const res = await fetch('/api/billing/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: 'monthly',
          amount: pricing.code === 'INR' ? pricing.discountPrice : 1999,
          userId: 'usr_demo_001',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.orderId) {
        throw new Error(data.error || 'Failed to create payment order with Razorpay.');
      }

      const activeKey = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Taeho8Zjy6LgGW';

      const options: any = {
        key: activeKey,
        amount: data.amount || Math.round((pricing.code === 'INR' ? pricing.discountPrice : 1999) * 100),
        currency: data.currency || pricing.code || 'INR',
        name: 'Askus Studio (INSTASK)',
        description: 'Pro Monthly Plan Activation',
        order_id: data.orderId,
        handler: function (response: any) {
          handlePaymentSuccess(response?.razorpay_payment_id || 'pay_success');
        },
        prefill: {
          name: 'Askus Studio Client',
          email: 'tripathishanya310@gmail.com',
          contact: '918429451312',
        },
        theme: { color: '#059669' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error?.description || 'Payment transaction failed. Please try another method.');
        setLoading(false);
      });
      
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay Checkout Error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  // Stripe Checkout
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
        throw new Error(data.error || 'Stripe configuration pending.');
      }
    } catch (err: any) {
      setError(err.message || 'Stripe error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-12">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-soft-md p-4 sm:p-8 space-y-5">
          
          {/* Header Bar with Clean Discount Badge Only */}
          <div className="flex items-center justify-end border-b border-slate-100 pb-3">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              50% Welcome Discount Applied
            </span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Activate Your Autonomous Growth Plan
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Complete your subscription to unlock competitor analysis, AI post generation, Creatomate visual rendering, and automated Meta Graph API posting.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Dynamic Regional Pricing Card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border-2 border-rose-500/30 shadow-soft space-y-4 sm:space-y-5">
            <div className="flex items-baseline justify-between border-b border-slate-200/60 pb-3">
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
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {pricing.symbol}{pricing.discountPrice}
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold block">50% off first month</span>
              </div>
            </div>

            <div className="pt-1 space-y-2">
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
                  <span className="font-medium text-[11px] sm:text-xs text-slate-600 leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Billed {pricing.symbol}{pricing.discountPrice} today • Renews at {pricing.symbol}{pricing.regularPrice}/mo thereafter</span>
              </p>
              <p className="text-amber-800/90 text-[10px] leading-tight">
                You can pause or cancel your subscription at any time from your account settings with zero cancellation penalties.
              </p>
            </div>
          </div>

          {/* Testing Bypass Quick Action */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" /> Developer Testing Mode
              </span>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Domain PG Verification
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              While payment gateway domain verification is in progress, you can directly preview and test the platform:
            </p>
            <button
              type="button"
              onClick={() => handlePaymentSuccess('admin_testing_bypass')}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-amber-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Bypass Payment &amp; Unlock Dashboard (Test Mode)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Payment Gateway Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Payment Method:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className={`w-4 h-4 shrink-0 ${paymentMethod === 'razorpay' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-xs font-bold">UPI / Cards</span>
                  <span className="block text-[10px] text-slate-400">Razorpay Gateway</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className={`w-4 h-4 shrink-0 ${paymentMethod === 'stripe' ? 'text-slate-900' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-xs font-bold">Credit / Debit</span>
                  <span className="block text-[10px] text-slate-400">Stripe Global</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mandatory Pre-Payment Waiver Checkbox */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
            <input
              type="checkbox"
              id="terms-check-onboarding"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="terms-check-onboarding" className="text-[11px] sm:text-xs text-slate-600 leading-snug cursor-pointer select-none">
              I authorize <strong>INSTASK</strong> to charge my payment method for the introductory rate of 50% off ({pricing.symbol}{pricing.discountPrice}) for month 1, and recurring monthly thereafter ({pricing.symbol}{pricing.regularPrice}/mo). I agree to the{' '}
              <a href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-900 hover:text-rose-600">Terms of Service</a>{' '}
              and acknowledge the{' '}
              <a href={`/${locale}/refund-policy`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-900 hover:text-rose-600">Refund Policy</a>.
            </label>
          </div>

          {/* Payment CTA */}
          <div className="space-y-3 pt-1">
            {paymentMethod === 'razorpay' ? (
              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={loading || !termsAccepted}
                className="w-full py-3.5 sm:py-4 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Pay with UPI / Cards ({pricing.symbol}{pricing.discountPrice})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading || !termsAccepted}
                className="w-full py-3.5 sm:py-4 px-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4 text-rose-300" />
                <span>{loading ? 'Activating Your Growth Plan...' : `Unlock 50% Off (${pricing.symbol}{pricing.discountPrice}) & Activate`}</span>
                <ArrowRight className="w-4 h-4 text-rose-300" />
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-bit SSL encrypted payment • askus studio (instask.in)</span>
          </div>

        </div>
      </div>
    </>
  );
}