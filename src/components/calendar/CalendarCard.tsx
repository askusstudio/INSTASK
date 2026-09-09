'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, CheckCircle2, Send, AlertCircle, Edit3, Sparkles } from 'lucide-react';
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

  return (
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
        {post.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.mediaUrl}
            alt={post.headline}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
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
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
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
  );
}
