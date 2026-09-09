'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface CheckoutButtonProps {
  priceId?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export default function CheckoutButton({
  priceId = 'price_pro_growth_monthly',
  className = '',
  label = 'Claim 50% Off & Activate',
  disabled = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planPriceId: priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Payment initialization failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading || disabled}
      className={`w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <Lock className="w-4 h-4 text-rose-300" />
      <span>{loading ? 'Redirecting to Secure Checkout...' : label}</span>
      <ArrowRight className="w-4 h-4 text-rose-300" />
    </button>
  );
}
