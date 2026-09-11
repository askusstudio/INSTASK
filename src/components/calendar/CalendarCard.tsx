'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
  Edit3,
  ImagePlus,
  Lock,
  X,
  Zap,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { PostRecord } from '@/lib/prisma';

interface CalendarCardProps {
  post: PostRecord;
  onClick: () => void;
  onApprove: (e: React.MouseEvent) => void;
}

const THEME_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Problem-Solution': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Behind the Scenes': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Social Proof': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Educational Tips': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'Community & Memes': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export function CalendarCard({ post, onClick, onApprove }: CalendarCardProps) {
  const t = useTranslations('common');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentMedia, setCurrentMedia] = useState<string | null>(post.mediaUrl || null);
  const [isVideo, setIsVideo] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const themeStyle = THEME_STYLES[post.theme] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const formattedTime = new Date(post.scheduledTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isPublished = post.status === 'PUBLISHED';
  const isApproved = post.status === 'APPROVED' || post.status === 'SCHEDULED';
  const isDraft = post.status === 'DRAFT';
  const isFailed = post.status === 'FAILED';

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

  const handleOpenLivePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Payment gateway failed to load. Please check internet connection.');
      }

      // Order creation
      const res = await fetch('/api/billing/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: 'addon_custom_media',
          amount: 2000,
          userId: 'usr_main',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || 'Failed to create ₹2,000 order.');
      }

      const activeKey = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Taeho8Zjy6LgGW';

      const options: any = {
        key: activeKey,
        amount: 2000 * 100,
        currency: 'INR',
        name: 'INSTASK Studio',
        description: 'Unlock Custom Gallery Upload (+₹2,000)',
        order_id: data.orderId,
        handler: function () {
          // PAYMENT COMPLETE: Sirf yahan aane par hi gallery open hogi
          setShowPaywallModal(false);
          setIsProcessingPayment(false);
          setTimeout(() => {
            fileInputRef.current?.click();
          }, 300);
        },
        prefill: {
          name: 'INSTASK Client',
          email: 'tripathishanya310@gmail.com',
          contact: '918429451312',
        },
        theme: { color: '#059669' },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setIsProcessingPayment(false);
      });

      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation failed.');
      setIsProcessingPayment(false);
    }
  };

  const handleReplaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPaywallModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentMedia(fileUrl);
      setIsVideo(file.type.startsWith('video/'));
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      <div
        onClick={onClick}
        className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-soft hover:shadow-soft-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-0.5 gpu-layer touch-manipulation active:scale-[0.99]"
      >
        <div className="p-3 pb-2 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center">
              {post.dayNumber}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formattedTime}
            </span>
          </div>

          <div>
            {isPublished && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <Send className="w-2.5 h-2.5" />
                {t('published')}
              </span>
            )}
            {isApproved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {t('approved')}
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                {t('draft')}
              </span>
            )}
            {isFailed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                <AlertCircle className="w-2.5 h-2.5" />
                Failed
              </span>
            )}
          </div>
        </div>

        <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
          {currentMedia ? (
            isVideo ? (
              <video
                src={currentMedia}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay
                muted
                loop
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentMedia}
                alt={post.headline}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              No image
            </div>
          )}

          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md shadow-sm ${themeStyle.bg} ${themeStyle.text} ${themeStyle.border}`}
            >
              {post.theme}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplaceClick}
            className="absolute top-2 right-2 min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 active:scale-95 text-white backdrop-blur-md border border-white/20 text-[10px] font-bold flex items-center gap-1 shadow-sm transition touch-manipulation cursor-pointer"
            title="Replace AI media with custom gallery media (+₹2,000)"
          >
            <ImagePlus className="w-3.5 h-3.5 text-rose-400" />
            <span>Replace</span>
            <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />
          </button>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition">
              {post.headline}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {post.caption}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={handleReplaceClick}
              className="min-h-[44px] text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition touch-manipulation cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5 text-rose-500" />
              <span>Gallery</span>
              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                +₹2,000
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClick}
                className="min-h-[44px] text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 touch-manipulation px-2 rounded-lg cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('viewDetails')}</span>
              </button>

              {isDraft && (
                <button
                  type="button"
                  onClick={onApprove}
                  className="min-h-[44px] text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 px-3 py-1.5 rounded-xl transition touch-manipulation flex items-center justify-center cursor-pointer"
                >
                  {t('approve')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaywallModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowPaywallModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowPaywallModal(false)}
              className="w-8 h-8 flex items-center justify-center absolute top-3.5 right-3.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close paywall modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold mb-1">
                <Zap className="w-3 h-3 text-rose-600" />
                MANDATORY ADD-ON
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Unlock Custom Gallery Upload
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan UPI QR (GPay / PhonePe / Paytm) or pay via Card. Gallery triggers automatically once payment is verified.
              </p>
            </div>

            {paymentError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium">
                {paymentError}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Required Payment</span>
              <span className="text-2xl font-black text-slate-900">₹2,000</span>
            </div>

            <button
              type="button"
              onClick={handleOpenLivePayment}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Opening Secure Razorpay UPI...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Pay ₹2,000 via UPI QR / Card</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gallery triggers automatically upon verified payment</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}