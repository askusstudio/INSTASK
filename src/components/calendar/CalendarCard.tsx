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
  'Problem-Solution': { bg: 'bg-rose-600/90', text: 'text-white', border: 'border-rose-400/50' },
  'Behind the Scenes': { bg: 'bg-amber-600/90', text: 'text-white', border: 'border-amber-400/50' },
  'Social Proof': { bg: 'bg-emerald-600/90', text: 'text-white', border: 'border-emerald-400/50' },
  'Educational Tips': { bg: 'bg-sky-600/90', text: 'text-white', border: 'border-sky-400/50' },
  'Community & Memes': { bg: 'bg-purple-600/90', text: 'text-white', border: 'border-purple-400/50' },
};

const DEFAULT_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1080&auto=format&fit=crop&q=80';

export function CalendarCard({ post, onClick, onApprove }: CalendarCardProps) {
  const t = useTranslations('common');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentMedia, setCurrentMedia] = useState<string>(post.mediaUrl || DEFAULT_FALLBACK_IMG);
  const [isVideo, setIsVideo] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const themeStyle = THEME_STYLES[post.theme] || {
    bg: 'bg-slate-900/90',
    text: 'text-white',
    border: 'border-white/20',
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
        className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-0.5 gpu-layer touch-manipulation active:scale-[0.99]"
      >
        {/* Top Header Time Bar */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
              {post.dayNumber}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/80 text-slate-700">
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

        {/* Visual Graphic Area */}
        <div className="relative aspect-square w-full bg-slate-900 overflow-hidden select-none">
          {isVideo ? (
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
              onError={() => setCurrentMedia(DEFAULT_FALLBACK_IMG)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-[0.95]"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-slate-950/60 pointer-events-none" />

          {/* Top Graphic Controls */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10">
            <span
              className={`max-w-[55%] truncate px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider uppercase border backdrop-blur-md shadow-xs ${themeStyle.bg} ${themeStyle.text} ${themeStyle.border}`}
            >
              {post.theme}
            </span>

            <button
              type="button"
              onClick={handleReplaceClick}
              className="min-h-[26px] px-2 py-0.5 rounded-lg bg-slate-900/85 hover:bg-slate-900 active:scale-95 text-white backdrop-blur-md border border-white/20 text-[10px] font-bold flex items-center gap-1 shadow-sm transition touch-manipulation cursor-pointer shrink-0"
              title="Replace with custom upload (+₹2,000)"
            >
              <ImagePlus className="w-3 h-3 text-rose-400" />
              <span>Replace</span>
              <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />
            </button>
          </div>

          {/* Hook Headline Overlay */}
          <div className="absolute bottom-2 inset-x-2.5 z-10 pointer-events-none">
            <span className="text-[9px] font-extrabold text-rose-400 tracking-wider uppercase block mb-0.5">
              Day {post.dayNumber} Hook
            </span>
            <p className="text-white font-black text-[11px] leading-snug drop-shadow-md line-clamp-2">
              {post.headline}
            </p>
          </div>
        </div>

        {/* Post Actions and Caption Area */}
        <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed min-h-[30px]">
            {post.caption}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 w-full">
            {/* Top row: Gallery Addon Trigger */}
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={handleReplaceClick}
                className="w-full h-7 text-[10.5px] font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/80 rounded-lg flex items-center justify-between px-2 transition touch-manipulation cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <ImagePlus className="w-3 h-3 text-rose-500" />
                  <span>Gallery</span>
                </div>
                <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                  +₹2,000
                </span>
              </button>
            </div>

            {/* Bottom row: View & Approve Buttons */}
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <button
                type="button"
                onClick={onClick}
                className="h-7 text-[10.5px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1 transition touch-manipulation cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-500" />
                <span>View</span>
              </button>

              {isDraft ? (
                <button
                  type="button"
                  onClick={onApprove}
                  className="h-7 text-[10.5px] font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition touch-manipulation flex items-center justify-center cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Approve
                </button>
              ) : (
                <div className="h-7 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Add-on Modal */}
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