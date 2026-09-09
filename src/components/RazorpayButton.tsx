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
  onSuccess?: (subscriptionId: string) => void;
}

export default function RazorpayButton({
  planKey,
  planId,
  planTitle = 'INSTASK Growth Plan',
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
      const res = await fetch('/api/billing/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey,
          planId,
          userId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate Razorpay subscription');
      }

      const { subscriptionId, keyId, mode } = data;

      // If Razorpay SDK is loaded on client window
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: keyId,
          subscription_id: subscriptionId,
          name: 'INSTASK AI',
          description: `${planTitle} Autopay`,
          handler: function (response: any) {
            const subId = response.razorpay_subscription_id || subscriptionId;
            if (onSuccess) {
              onSuccess(subId);
            } else {
              window.location.href = `/dashboard?plan_activated=${planKey}&sub_id=${subId}`;
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
        // Fallback for offline/headless/sandbox mode when Razorpay script isn't active
        if (mode === 'sandbox') {
          // Simulate mandate authentication webhook
          await fetch('/api/webhooks/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'subscription.authenticated',
              payload: {
                subscription: {
                  entity: {
                    id: subscriptionId,
                    notes: {
                      userId,
                      planKey,
                      creditsGranted: data.creditsGranted?.toString() || '60',
                    },
                  },
                },
              },
            }),
          });
        }

        if (onSuccess) {
          onSuccess(subscriptionId);
        } else {
          window.location.href = `/dashboard?plan_activated=${planKey}&sub_id=${subscriptionId}&sandbox=true`;
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      alert(`Razorpay Checkout Error: ${e.message}`);
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
            <span>Connecting UPI Autopay...</span>
          </>
        ) : (
          children || <span>Pay with UPI Autopay / Card</span>
        )}
      </button>
    </>
  );
}
