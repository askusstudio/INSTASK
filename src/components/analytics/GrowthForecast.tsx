'use client';

import React from 'react';
import { TrendingUp, Users, Eye, Sparkles, PieChart, Clock } from 'lucide-react';

export function GrowthForecast() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            30-Day Growth & Performance Forecast
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Projected metrics based on competitor engagement benchmarks and consistent 1-post/day frequency.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Strategy Active
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Eye className="w-4 h-4 text-sky-600" />
            Estimated Organic Reach
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">24,500 – 38,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↑ +185% vs inconsistent posting
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Users className="w-4 h-4 text-purple-600" />
            Target Audience Growth
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">+420 – 680 New</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Local, high-intent followers
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Clock className="w-4 h-4 text-amber-600" />
            Time Saved Per Month
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">32 Hours</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Design, copywriting & scheduling
          </div>
        </div>
      </div>

      {/* Content Bucket Distribution */}
      <div className="pt-2">
        <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-slate-600" />
          Algorithm-Optimized Content Mix (Balanced 20% Formula)
        </div>
        <div className="grid grid-cols-5 h-3 rounded-full overflow-hidden gap-1 bg-slate-100 p-0.5">
          <div className="bg-rose-500 rounded-l-full" title="Problem-Solution: 20%" />
          <div className="bg-amber-500" title="Behind the Scenes: 20%" />
          <div className="bg-emerald-500" title="Social Proof: 20%" />
          <div className="bg-sky-500" title="Educational Tips: 20%" />
          <div className="bg-purple-600 rounded-r-full" title="Community & Memes: 20%" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>Problem-Solution (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span>Behind Scenes (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>Social Proof (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
            <span>Educational Tips (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0" />
            <span>Community (6)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
