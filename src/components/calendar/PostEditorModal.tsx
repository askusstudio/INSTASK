'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { PostRecord } from '@/lib/prisma';
import { InstagramMockup } from '../preview/InstagramMockup';
import {
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  ImagePlus,
  Lock,
  Zap,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface PostEditorModalProps {
  post: PostRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: Partial<PostRecord>) => Promise<void>;
  handle: string;
  brandName: string;
}

export function PostEditorModal({
  post,
  isOpen,
  onClose,
  onSave,
  handle,
  brandName,
}: PostEditorModalProps) {
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [headline, setHeadline] = useState(post.headline);
  const [bullets, setBullets] = useState<string[]>(
    Array.isArray(post.bodyBullets)
      ? post.bodyBullets
      : ['Handmade daily', 'Locally sourced', 'Fresh ingredients']
  );
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState<string[]>(
    Array.isArray(post.hashtags) ? post.hashtags : []
  );
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5'>(
    post.mediaAspectRatio || '1:1'
  );
  const [scheduledTime, setScheduledTime] = useState<string>(
    new Date(post.scheduledTime).toISOString().slice(0, 16)
  );
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.mediaUrl || null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const [showPaywall, setShowPaywall] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    setHeadline(post.headline);
    setBullets(Array.isArray(post.bodyBullets) ? post.bodyBullets : []);
    setCaption(post.caption);
    setHashtags(Array.isArray(post.hashtags) ? post.hashtags : []);
    setAspectRatio(post.mediaAspectRatio || '1:1');
    setScheduledTime(new Date(post.scheduledTime).toISOString().slice(0, 16));
    setMediaUrl(post.mediaUrl || null);
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPaywall) setShowPaywall(false);
        else onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showPaywall]);

  if (!isOpen) return null;

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    setBullets(updated);
  };

  const loadRazorpaySDK = (): Promise<boolean> => {
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

  const triggerLiveRazorpayPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const sdkReady = await loadRazorpaySDK();
      if (!sdkReady) throw new Error('Razorpay SDK failed to load.');

      const orderRes = await fetch('/api/billing/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: 'addon_custom_media',
          amount: 2000,
          userId: 'usr_main',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initiate ₹2,000 order.');
      }

      const activeKey = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Taeho8Zjy6LgGW';

      const options = {
        key: activeKey,
        amount: 2000 * 100,
        currency: 'INR',
        name: 'INSTASK Studio',
        description: 'Custom Media & Gallery Unlock Add-on',
        order_id: orderData.orderId,
        handler: function () {
          // Live payment confirm hote hi modal close hoga aur gallery open hogi
          setShowPaywall(false);
          setIsProcessingPayment(false);
          setTimeout(() => {
            galleryInputRef.current?.click();
          }, 300);
        },
        prefill: {
          name: brandName || 'Instask Creator',
          email: 'tripathishanya310@gmail.com',
          contact: '918429451312',
        },
        theme: { color: '#0f172a' },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleGalleryClick = () => {
    setShowPaywall(true);
  };

  const handleCustomMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
    }
  };

  const handleRegenerateGraphic = async () => {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          bodyBullets: bullets,
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (data?.success && data.post?.mediaUrl) {
        setMediaUrl(data.post.mediaUrl);
      }
    } catch (err) {
      console.error('Failed to regenerate visual:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveAndApprove = async () => {
    setSaving(true);
    try {
      await onSave({
        headline,
        bodyBullets: bullets,
        caption,
        hashtags,
        mediaAspectRatio: aspectRatio,
        scheduledTime: new Date(scheduledTime),
        mediaUrl: mediaUrl || post.mediaUrl,
        status: 'APPROVED',
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleCustomMediaUpload}
        accept="image/*,video/*"
        className="hidden"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92dvh] sm:max-h-[85vh] flex flex-col gpu-layer">
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                {post.dayNumber}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {t('modalTitle')} {post.dayNumber} ({post.theme})
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Live interactive Instagram preview and instant template editor
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition touch-manipulation active:scale-95 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 flex flex-col items-center sticky top-0 gap-3">
              <InstagramMockup
                handle={handle}
                brandName={brandName}
                mediaUrl={mediaUrl}
                caption={caption}
                hashtags={hashtags}
                aspectRatio={aspectRatio}
                status={post.status}
                dayNumber={post.dayNumber}
              />

              <button
                type="button"
                onClick={handleGalleryClick}
                className="w-full max-w-[340px] sm:max-w-[360px] min-h-[44px] py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm touch-manipulation cursor-pointer"
              >
                <ImagePlus className="w-4 h-4 text-rose-400" />
                <span>Replace with Custom Gallery Video / Image</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-extrabold border border-amber-300/30">
                  <Lock className="w-2.5 h-2.5" />
                  +₹2,000
                </span>
              </button>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-500" />
                  {t('aspectRatioLabel')}:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-lg border transition touch-manipulation cursor-pointer ${
                      aspectRatio === '1:1'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    1:1 Square (1080x1080)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('4:5')}
                    className={`flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-lg border transition touch-manipulation cursor-pointer ${
                      aspectRatio === '4:5'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    4:5 Portrait (1080x1350)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {t('headlineLabel')}
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {headline.split(' ').filter(Boolean).length} words
                  </span>
                </div>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('bulletsLabel')}
                </label>
                <div className="space-y-2">
                  {bullets.slice(0, 3).map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-500 w-4">
                        •
                      </span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={`Bullet ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleRegenerateGraphic}
                  disabled={regenerating}
                  className="w-full min-h-[48px] py-2.5 px-3 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-xl flex items-center justify-center gap-2 transition touch-manipulation cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                  <span>{regenerating ? 'Re-rendering Graphic...' : t('regenerateGraphic')}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('captionLabel')}
                </label>
                <textarea
                  rows={5}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {t('scheduledTimeLabel')}
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition touch-manipulation flex items-center justify-center cursor-pointer"
            >
              {tCommon('cancel')}
            </button>

            <button
              type="button"
              onClick={handleSaveAndApprove}
              disabled={saving}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:opacity-95 active:scale-[0.98] rounded-xl shadow-soft transition touch-manipulation cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving...' : t('saveAndApprove')}</span>
            </button>
          </div>
        </div>
      </div>

      {showPaywall && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center relative space-y-4">
            <button
              type="button"
              onClick={() => setShowPaywall(false)}
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
                MANDATORY CREATOR ADD-ON
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Pay ₹2,000 to Unlock Gallery
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan via UPI QR (GPay/PhonePe/Paytm) or Card. Gallery opens automatically upon successful transaction.
              </p>
            </div>

            {paymentError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium">
                {paymentError}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Amount</span>
              <span className="text-2xl font-black text-slate-900">₹2,000</span>
            </div>

            <button
              type="button"
              onClick={triggerLiveRazorpayPayment}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Waiting for live payment...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Pay ₹2,000 with UPI QR / Cards</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-unlocks device gallery once payment verifies</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}