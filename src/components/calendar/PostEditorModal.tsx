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
  Clock,
  Layers,
  ImagePlus,
  Lock,
  Check,
  Zap,
  UploadCloud,
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
    Array.isArray(post.bodyBullets) ? post.bodyBullets : ['Handmade daily', 'Locally sourced', 'Fresh ingredients']
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

  // Gallery Replace & ₹2,000 Monetization states
  const [showPaywall, setShowPaywall] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsUnlocked(localStorage.getItem('instask_custom_media_unlocked') === 'true');
    }
  }, []);

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
      if (e.key === 'Escape' && !showPaywall) onClose();
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

  // Replace from Gallery Trigger
  const handleGalleryClick = () => {
    if (!isUnlocked) {
      setShowPaywall(true);
    } else {
      galleryInputRef.current?.click();
    }
  };

  // Simulating ₹2,000 Unlock Payment
  const handleUnlockPaywall = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_custom_media_unlocked', 'true');
    }
    setIsUnlocked(true);
    setShowPaywall(false);
    setTimeout(() => {
      galleryInputRef.current?.click();
    }, 200);
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

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        {/* Modal Dialog */}
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                {post.dayNumber}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('modalTitle')} {post.dayNumber} ({post.theme})
                </h3>
                <p className="text-xs text-slate-500">
                  Live interactive Instagram preview and instant template editor
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
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
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ImagePlus className="w-4 h-4 text-rose-400" />
                <span>Replace Media from Gallery (Video/Photo)</span>
                {!isUnlocked && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    ₹2,000
                  </span>
                )}
              </button>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-7 space-y-4">
              {/* Aspect Ratio Switcher */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-500" />
                  {t('aspectRatioLabel')}:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
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
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                      aspectRatio === '4:5'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    4:5 Portrait (1080x1350)
                  </button>
                </div>
              </div>

              {/* Headline Hook */}
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
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={`Bullet ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Gallery Replace + AI Regenerate */}
              <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGalleryClick}
                  className="py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <UploadCloud className="w-4 h-4 text-rose-600" />
                  <span>Upload from Gallery</span>
                  {!isUnlocked && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">
                      ₹2,000
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateGraphic}
                  disabled={regenerating}
                  className="py-2.5 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-2 transition"
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
                  rows={4}
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              {tCommon('cancel')}
            </button>

            <button
              type="button"
              onClick={handleSaveAndApprove}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:opacity-95 rounded-xl shadow-soft transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving...' : t('saveAndApprove')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ₹2,000 Paywall Modal */}
      {showPaywall && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-left relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold mb-2">
              <Zap className="w-3 h-3 text-rose-600" />
              EXCLUSIVE CREATOR ADD-ON
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Unlock Custom Gallery Replacement
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload your own high-resolution brand videos and photos to replace any AI-rendered post across your 30-day autonomous calendar.
            </p>

            {/* Price Banner */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Add-on Activation Fee</p>
                <p className="text-[11px] text-slate-400">Unlimited uploads for this 30-day cycle</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹2,000</span>
                <span className="text-[10px] font-semibold text-emerald-600 block">Single payment</span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Upload custom MP4/MOV videos or raw photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Retains AI captions and 3-tier viral hashtags</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Meta Graph API v21.0 container sync</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPaywall(false)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnlockPaywall}
                className="w-2/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Unlock (Pay ₹2,000)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}