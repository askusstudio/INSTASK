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
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');

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
        setError(response.error?.description || 'Payment failed. Please try another method.');
        setLoading(false);
      });
      
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-4">
          
          {/* Clean Discount Header Bar */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Checkout</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              50% Welcome Discount Applied
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Activate Autonomous Plan
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
              Unlock AI competitor scraping, 30 days of graphics, and auto-publishing via Meta API.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Pricing Box */}
          <div className="rounded-2xl bg-slate-50/80 border border-rose-200/70 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">Pro Growth Plan</h2>
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    POPULAR
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Billed Monthly ({pricing.code})</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through mr-1">
                  {pricing.symbol}{pricing.regularPrice}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {pricing.symbol}{pricing.discountPrice}
                </span>
                <span className="text-[9px] text-emerald-600 font-bold block">First month offer</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              {[
                '5 Competitor analysis',
                '30 High-res graphic templates',
                'Gemini 2.5 captions & hashtags',
                'Meta Graph API auto-publishing',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-[10px] sm:text-[11px] text-amber-900 flex items-center justify-between gap-2">
              <span className="leading-snug">
                Billed <strong>{pricing.symbol}{pricing.discountPrice} today</strong>. Renews at {pricing.symbol}{pricing.regularPrice}/mo. Cancel anytime in 1 click.
              </span>
            </div>
          </div>

          {/* Compact Developer Test Mode */}
          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px]">Developer Mode</span>
            </div>
            <button
              type="button"
              onClick={() => handlePaymentSuccess('admin_testing_bypass')}
              disabled={loading}
              className="py-1 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg transition active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Lock className="w-3 h-3" />
              <span>Bypass & Unlock</span>
            </button>
          </div>

          {/* Payment Method Switcher */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 block">Payment Method</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className={`w-4 h-4 shrink-0 ${paymentMethod === 'razorpay' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-xs font-bold leading-tight">UPI / Cards</span>
                  <span className="block text-[9px] text-slate-400">Razorpay Gateway</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className={`w-4 h-4 shrink-0 ${paymentMethod === 'stripe' ? 'text-slate-900' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-xs font-bold leading-tight">Cards / Net</span>
                  <span className="block text-[9px] text-slate-400">Stripe Global</span>
                </div>
              </button>
            </div>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-2 text-[10px] sm:text-[11px] text-slate-500 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              id="terms-check-onboarding"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0"
            />
            <span className="leading-tight">
              I authorize <strong>INSTASK</strong> to charge {pricing.symbol}{pricing.discountPrice} for month 1, and {pricing.symbol}{pricing.regularPrice}/mo thereafter. Agree to{' '}
              <a href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-800">Terms</a> &amp;{' '}
              <a href={`/${locale}/refund-policy`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-slate-800">Refund Policy</a>.
            </span>
          </label>

          {/* Pay Button */}
          <div>
            {paymentMethod === 'razorpay' ? (
              <button
                type="button"
                onClick={handleRazorpayCheckout}
                disabled={loading || !termsAccepted}
                className="w-full py-3 sm:py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
                className="w-full py-3 sm:py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4 text-rose-300" />
                <span>Pay with Card ({pricing.symbol}{pricing.discountPrice})</span>
                <ArrowRight className="w-4 h-4 text-rose-300" />
              </button>
            )}
          </div>

          {/* SSL Trust Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-bit SSL encrypted • askus studio (instask.in)</span>
          </div>

        </div>
      </div>
    </>
  );
}