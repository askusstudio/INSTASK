'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { PostRecord } from '@/lib/prisma';
import { InstagramMockup } from '../preview/InstagramMockup';
import {
  X,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  ImagePlus,
  Lock,
  Check,
  Zap,
  QrCode,
  ShieldCheck,
  ArrowRight,
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

  // Gallery unlock state & QR modal
  const [showPaywall, setShowPaywall] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('instask_custom_media_unlocked') === 'true';
    }
    return false;
  });

  // Sync state when post prop changes
  useEffect(() => {
    setHeadline(post.headline);
    setBullets(Array.isArray(post.bodyBullets) ? post.bodyBullets : []);
    setCaption(post.caption);
    setHashtags(Array.isArray(post.hashtags) ? post.hashtags : []);
    setAspectRatio(post.mediaAspectRatio || '1:1');
    setScheduledTime(new Date(post.scheduledTime).toISOString().slice(0, 16));
    setMediaUrl(post.mediaUrl || null);
  }, [post]);

  // Handle ESC key
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

  // Replace from Gallery Trigger: agar paid nahi hai toh turant QR open karega
  const handleGalleryClick = () => {
    if (!isUnlocked) {
      setShowPaywall(true);
    } else {
      galleryInputRef.current?.click();
    }
  };

  // ₹2,000 QR Code Payment Complete & Instant Gallery Open
  const handleUnlockPaywall = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_custom_media_unlocked', 'true');
    }
    setIsUnlocked(true);
    setShowPaywall(false);

    // Payment verify hote hi device ki gallery khol dega
    setTimeout(() => {
      galleryInputRef.current?.click();
    }, 250);
  };

  // Handle File Chosen
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
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleCustomMediaUpload}
        accept="image/*,video/*"
        className="hidden"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        {/* Modal Dialog */}
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92dvh] sm:max-h-[85vh] flex flex-col gpu-layer">
          {/* Header */}
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

          {/* Modal Body: Split view (Preview Left, Editor Right) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Live Instagram Phone Mockup */}
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

              {/* Gallery Replacement Pill Button */}
              <button
                type="button"
                onClick={handleGalleryClick}
                className="w-full max-w-[340px] sm:max-w-[360px] min-h-[44px] py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm touch-manipulation cursor-pointer"
              >
                <ImagePlus className="w-4 h-4 text-rose-400" />
                <span>Replace with Custom Gallery Video / Image</span>
                {!isUnlocked && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-extrabold border border-amber-300/30">
                    <Lock className="w-2.5 h-2.5" />
                    +₹2,000
                  </span>
                )}
              </button>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-7 space-y-4">
              {/* Aspect Ratio Switcher */}
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

              {/* Headline Hook (< 8 words) */}
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

              {/* Value Bullets */}
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

              {/* Regenerate Visual Button */}
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

              {/* Caption */}
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

              {/* Scheduled Time */}
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

          {/* Modal Footer */}
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

      {/* ₹2,000 Instant UPI QR Code Paywall Modal */}
      {showPaywall && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 sm:p-6 text-center relative animate-in fade-in zoom-in-95 duration-200 max-h-[92dvh] overflow-y-auto gpu-layer space-y-3.5">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPaywall(false)}
              className="w-9 h-9 flex items-center justify-center absolute top-3.5 right-3.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition touch-manipulation cursor-pointer"
              aria-label="Close paywall modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge & Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold mb-1">
                <Zap className="w-3 h-3 text-rose-600" />
                CUSTOM MEDIA ADD-ON
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Scan QR to Unlock Gallery
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Scan with Google Pay, PhonePe, or Paytm to unlock custom 4K photos &amp; videos.
              </p>
            </div>

            {/* Live Dynamic UPI QR Code for ₹2000 */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  'upi://pay?pa=tripathishanya310@okaxis&pn=INSTASK%20Studio&am=2000.00&cu=INR&tn=INSTASK%20Custom%20Media%20Upload'
                )}`}
                alt="Scan to Pay ₹2,000"
                className="w-44 h-44 mx-auto rounded-xl shadow-sm border border-slate-100"
              />
              <div className="text-xs font-black text-slate-800 mt-2">
                Amount to Pay: <span className="text-emerald-600 text-sm font-black">₹2,000</span>
              </div>
            </div>

            {/* Primary Action Button (Opens device gallery immediately) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleUnlockPaywall}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Have Paid ₹2,000 (Open Gallery Now)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleUnlockPaywall}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Developer Test Bypass (Instant Unlock)</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Gallery Trigger Upon Confirmation</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}