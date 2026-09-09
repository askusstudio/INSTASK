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
  Sparkles,
  X,
  Check,
  Zap,
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
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('instask_custom_media_unlocked') === 'true';
    }
    return false;
  });

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

  // Click handler for Replace from Gallery
  const handleReplaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked) {
      setShowPaywallModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  // Simulating Payment & Unlocking Custom Media Add-on (₹2,000)
  const handleUnlockPayment = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('instask_custom_media_unlocked', 'true');
    }
    setIsUnlocked(true);
    setShowPaywallModal(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 200);
  };

  // File Upload and Live Preview Replacement
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
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      <div
        onClick={onClick}
        className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-soft hover:shadow-soft-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-0.5"
      >
        {/* Card Header: Day & Schedule Time */}
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

          {/* Status Badge */}
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

        {/* Visual Thumbnail */}
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
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              No image
            </div>
          )}

          {/* Theme Pill Overlay */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md shadow-sm ${themeStyle.bg} ${themeStyle.text} ${themeStyle.border}`}
            >
              {post.theme}
            </span>
          </div>

          {/* Quick Replace Button on Top Right of Media */}
          <button
            type="button"
            onClick={handleReplaceClick}
            className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 text-[10px] font-bold flex items-center gap-1 shadow-sm transition"
            title="Replace AI media with custom gallery media"
          >
            <ImagePlus className="w-3 h-3 text-rose-400" />
            <span>Replace</span>
            {!isUnlocked && <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />}
          </button>
        </div>

        {/* Content Summary */}
        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition">
              {post.headline}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {post.caption}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={handleReplaceClick}
              className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-slate-100 transition"
            >
              <ImagePlus className="w-3 h-3 text-rose-500" />
              <span>Gallery</span>
              {!isUnlocked && (
                <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1 rounded">
                  ₹2,000
                </span>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-slate-400" />
                <span>{t('viewDetails')}</span>
              </button>

              {isDraft && (
                <button
                  type="button"
                  onClick={onApprove}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition"
                >
                  {t('approve')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ₹2,000 Paywall Add-on Modal */}
      {showPaywallModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-left relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPaywallModal(false)}
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
              Unlock Custom Media Replacement
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Replace any AI-generated post or video with your own original footage directly from your device gallery across the 30-day autonomous schedule.
            </p>

            {/* Price Tag */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">One-Time Lifetime Add-on</p>
                <p className="text-[11px] text-slate-400">Unlimited custom gallery video & photo uploads</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹2,000</span>
                <span className="text-[10px] font-semibold text-emerald-600 block">Single Fee</span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Upload high-res MP4/MOV videos or raw photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI will keep viral captions and hashtags intact</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Meta Graph API container sync</span>
              </div>
            </div>

            {/* Pay / Unlock Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPaywallModal(false)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnlockPayment}
                className="w-2/3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Unlock Now (Pay ₹2,000)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}