'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { RefreshCw } from 'lucide-react';

interface RazorpayButtonProps {
  planKey: string;
  planId?: string;
  planTitle?: string;
  amount?: number;
  currency?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: (paymentId: string) => void;
}

export default function RazorpayButton({
  planKey,
  planId,
  planTitle = 'INSTASK Growth Plan',
  amount = 1999,
  currency = 'INR',
  userId = 'usr_demo_001',
  userName = 'Brand Owner',
  userEmail = 'owner@example.com',
  userPhone = '',
  disabled = false,
  className = '',
  children,
  onSuccess,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleCheckout = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      // Step 1: Create Order via Backend API
      const res = await fetch('/api/billing/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey,
          planId,
          userId,
          amount,
        }),
      });

      const data = await res.json();
      const liveKey = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Ta09UiD9oNIJhH';

      // Step 2: Open Razorpay Standard Checkout
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options: any = {
          key: liveKey,
          amount: (data.amount || amount) * 100, // paise me convert (e.g. 199900)
          currency: data.currency || currency || 'INR',
          name: 'INSTASK AI',
          description: `${planTitle} Activation`,
          order_id: data.orderId || undefined,
          handler: function (response: any) {
            const payId = response.razorpay_payment_id || 'pay_confirmed';
            if (typeof window !== 'undefined') {
              localStorage.setItem('instask_plan_active', 'true');
              localStorage.setItem('instask_active_plan', planKey);
            }
            if (onSuccess) {
              onSuccess(payId);
            } else {
              window.location.href = `/dashboard?plan_activated=${planKey}&pay_id=${payId}&userId=${encodeURIComponent(userId)}`;
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone,
          },
          theme: {
            color: '#0F172A',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setLoading(false);
          alert(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        });
        rzp.open();
      } else {
        // Fallback if script load is delayed
        if (typeof window !== 'undefined') {
          localStorage.setItem('instask_plan_active', 'true');
          window.location.href = `/dashboard?plan_activated=${planKey}&userId=${encodeURIComponent(userId)}`;
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Payment Gateway Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={
          className ||
          'w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2'
        }
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Opening Payment Gateway...</span>
          </>
        ) : (
          children || <span>Pay & Activate Plan</span>
        )}
      </button>
    </>
  );
}