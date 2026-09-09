'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Zap, CheckCircle2, TrendingUp, Calendar as CalendarIcon, Play } from 'lucide-react';

interface FilterToolbarProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onApproveAll: () => Promise<void>;
  onTriggerPublishNow: () => Promise<void>;
  stats: {
    total: number;
    approved: number;
    published: number;
    drafts: number;
  };
  approving: boolean;
  publishing: boolean;
}

const THEMES = [
  'All',
  'Problem-Solution',
  'Behind the Scenes',
  'Social Proof',
  'Educational Tips',
  'Community & Memes',
];

export function FilterToolbar({
  selectedTheme,
  onSelectTheme,
  selectedStatus,
  onSelectStatus,
  onApproveAll,
  onTriggerPublishNow,
  stats,
  approving,
  publishing,
}: FilterToolbarProps) {
  const t = useTranslations('calendar');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-soft space-y-4">
      {/* Top Row: Title, Overview Stats & Master Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-600" />
            {t('title')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('subtitle')}
          </p>
        </div>

        {/* Action Buttons: Batch Autopilot Approve & Test Publish Now */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onTriggerPublishNow}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition"
            title="Triggers the Meta Graph API publisher worker for due posts immediately"
          >
            <Play className="w-3.5 h-3.5 text-slate-900" />
            <span>{publishing ? 'Publishing...' : 'Test Publish Due Post'}</span>
          </button>

          <button
            type="button"
            onClick={onApproveAll}
            disabled={approving || stats.drafts === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:opacity-95 shadow-soft transition disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{approving ? 'Activating Autopilot...' : t('autopilotCta')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Content Plan
          </div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">
            {stats.total} Posts
          </div>
        </div>

        <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100">
          <div className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider">
            Approved / Scheduled
          </div>
          <div className="text-lg font-extrabold text-sky-900 mt-0.5">
            {stats.approved}
          </div>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Published Live
          </div>
          <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
            {stats.published}
          </div>
        </div>

        <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
            Est. 30-Day Reach
          </div>
          <div className="text-lg font-extrabold text-rose-900 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            24,500+
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => onSelectTheme(theme)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {theme}
              </button>
            );
          })}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="DRAFT">Drafts ({stats.drafts})</option>
            <option value="APPROVED">Approved ({stats.approved})</option>
            <option value="PUBLISHED">Published ({stats.published})</option>
          </select>
        </div>
      </div>
    </div>
  );
}
