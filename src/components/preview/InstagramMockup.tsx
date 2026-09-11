'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InstagramMockupProps {
  handle: string;
  brandName: string;
  mediaUrl?: string | null;
  caption: string;
  hashtags: string[];
  aspectRatio?: '1:1' | '4:5';
  status?: string;
  dayNumber?: number;
}

export function InstagramMockup({
  handle,
  brandName,
  mediaUrl,
  caption,
  hashtags,
  aspectRatio = '1:1',
  status = 'APPROVED',
  dayNumber = 1,
}: InstagramMockupProps) {
  const t = useTranslations('mockup');
  const cleanHandle = handle.replace(/^@/, '') || 'shop';

  const isPortrait = aspectRatio === '4:5';

  return (
    <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto bg-black rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 text-slate-900 font-sans gpu-layer">
      {/* Phone Notch & Speaker Bar */}
      <div className="flex justify-between items-center px-5 pt-1.5 pb-2 text-[11px] font-semibold text-white">
        <span>9:41</span>
        <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="w-4 h-2 rounded-sm border border-white p-[1px]">
            <div className="w-full h-full bg-white rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Instagram App Window */}
      <div className="bg-white rounded-[32px] overflow-hidden flex flex-col">
        {/* IG Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
              <div className="w-full h-full bg-white rounded-full p-[1px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold">
                  {cleanHandle.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {cleanHandle}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
              </div>
              <span className="text-[10px] text-slate-400 font-normal">
                {t('sponsored')}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition touch-manipulation"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Media Graphic Preview (1:1 or 4:5) */}
        <div
          className={`relative w-full bg-slate-950 flex items-center justify-center overflow-hidden gpu-layer ${
            isPortrait ? 'aspect-[4/5]' : 'aspect-square'
          }`}
        >
          {mediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl}
              alt="Generated Post Visual"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-400 text-xs">
              Rendering dynamic visual asset...
            </div>
          )}

          {/* Meta v21.0 Container Badge Overlay */}
          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-bold text-white tracking-wide border border-white/10 pointer-events-none">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>DAY {dayNumber} • {aspectRatio}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-2 pt-1 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-900">
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center hover:text-rose-600 active:scale-90 transition touch-manipulation"
                aria-label="Like post"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </button>
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center hover:text-slate-600 active:scale-90 transition touch-manipulation"
                aria-label="Comment on post"
              >
                <MessageCircle className="w-5 h-5 -scale-x-100" />
              </button>
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center hover:text-slate-600 active:scale-90 transition touch-manipulation"
                aria-label="Share post"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center text-slate-900 hover:text-slate-600 active:scale-90 transition touch-manipulation"
              aria-label="Bookmark post"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Likes */}
          <div className="px-2 mt-0.5 text-xs font-bold text-slate-900">
            {t('likedBy')} <span className="font-semibold">local_foodie</span> {t('and')}{' '}
            <span>482 {t('others')}</span>
          </div>

          {/* Caption */}
          <div className="px-2 mt-1 text-xs text-slate-800 leading-snug max-h-28 overflow-y-auto pr-1">
            <span className="font-bold text-slate-900 mr-1.5">{cleanHandle}</span>
            <span className="whitespace-pre-line text-slate-700">{caption}</span>
            {hashtags && hashtags.length > 0 && (
              <div className="mt-1.5 text-[11px] text-blue-700 leading-relaxed font-medium">
                {hashtags.slice(0, 10).join(' ')}
              </div>
            )}
          </div>

          {/* Comments Link */}
          <div className="px-2 mt-1 text-[11px] text-slate-400">
            {t('viewComments')}
          </div>

          {/* Bottom Bar indicator */}
          <div className="py-2 flex justify-center">
            <div className="w-28 h-1 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
