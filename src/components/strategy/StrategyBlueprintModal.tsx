'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyBlueprint, VisualTemplateOption } from '@/lib/recommendations';
import { Sparkles, Check, ArrowRight, Layers, PieChart, Hash, Flame, Clock, ShieldCheck, X } from 'lucide-react';

interface StrategyBlueprintModalProps {
  blueprint: StrategyBlueprint;
  isOpen: boolean;
  onClose: () => void;
  onApplyStrategy: (selectedTemplateId: string) => Promise<void>;
}

export function StrategyBlueprintModal({
  blueprint,
  isOpen,
  onClose,
  onApplyStrategy,
}: StrategyBlueprintModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    blueprint.selectedTemplateId || blueprint.visualTemplateStyles[0]?.id || ''
  );
  const [applying, setApplying] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    setApplying(true);
    try {
      await onApplyStrategy(selectedTemplateId);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Strategy Blueprint: {blueprint.industry}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Niche Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Review competitor gap analysis, algorithm-balanced content mix, and pick your visual aesthetic.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Section 1: Recommended Visual Template Styles (4 to 6 options) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-rose-600" />
                  1. Recommended Visual Template Direction (Pick Your Aesthetic)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-designed Creatomate styles calibrated for high bookmark and save rates in your vertical.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                1-Click Select
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {blueprint.visualTemplateStyles.map((style) => {
                const isSelected = selectedTemplateId === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedTemplateId(style.id)}
                    className={`relative rounded-2xl border p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20 shadow-soft-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 shadow-xs'
                    }`}
                  >
                    {/* Visual Preview Thumbnail */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={style.previewUrl}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        {style.aspectRatio}
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-rose-600/15 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">
                          {style.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {style.palette.map((color, i) => (
                            <span
                              key={i}
                              className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {style.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Winning Content Pillars & Copywriting Hooks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 border-t border-slate-100">
            {/* Left: Content Pillars (40% / 25% / 20% / 15%) */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-sky-600" />
                2. Algorithmic Content Pillar Mix
              </h3>

              <div className="space-y-2">
                {blueprint.contentPillars.map((pillar, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-800">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pillar.color }} />
                        {pillar.name}
                      </span>
                      <span className="text-slate-900">{pillar.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pillar.percentage}%`, backgroundColor: pillar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Winning Competitor Gap Hooks */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Top 3 Winning Viral Hooks (Gap Analysis)
              </h3>

              <div className="space-y-2">
                {blueprint.winningHooks.map((hook, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>Formula Hook #{idx + 1}</span>
                    </div>
                    <div className="text-slate-800 font-semibold italic">
                      “{hook}”
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Segmented 3-Tier Hashtag Strategy */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <Hash className="w-4 h-4 text-purple-600" />
              3. Segmented Hashtag Strategy (15-Tag Tri-Tier Matrix)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Low Competition */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                  Rank Fast (&lt; 50k posts)
                </div>
                <div className="flex flex-wrap gap-1">
                  {blueprint.hashtagStrategy.lowCompetition.map((tag, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Industry Niche */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">
                  Industry Niche (50k - 500k)
                </div>
                <div className="flex flex-wrap gap-1">
                  {blueprint.hashtagStrategy.industryNiche.map((tag, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* High Volume Reach */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1.5">
                  Reach Multipliers (500k+)
                </div>
                <div className="flex flex-wrap gap-1">
                  {blueprint.hashtagStrategy.highVolume.map((tag, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Adjust Business Info
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:opacity-95 rounded-xl shadow-soft transition disabled:opacity-50"
          >
            <span>{applying ? 'Scheduling 30-Day Queue...' : 'Apply Strategy & Schedule 30 Days'}</span>
            <ArrowRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
