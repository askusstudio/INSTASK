'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GuidanceTooltip } from '../ui/GuidanceTooltip';
import { Target, Sparkles, ArrowLeft, Loader2, CheckCircle2, Flame, Bot, Layers } from 'lucide-react';

interface StepCompetitorsProps {
  handles: string[];
  onChange: (handles: string[]) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

const PRESET_SUGGESTIONS = [
  { label: 'Artisan Bakery', handles: ['@tartinebakery', '@lafamille', '@sweetcrust'] },
  { label: 'Specialty Coffee', handles: ['@bluebottle', '@onyxcoffeelab', '@stumptown'] },
  { label: 'Boutique Fashion', handles: ['@reformation', '@everlane', '@sezane'] },
  { label: 'Fitness Studio', handles: ['@barrys', '@f45_training', '@equinox'] },
  { label: 'Consulting / Agency', handles: ['@thefutur', '@hubspot', '@canva'] },
];

export function StepCompetitors({ handles, onChange, onBack, onSubmit }: StepCompetitorsProps) {
  const t = useTranslations('onboarding.step3');
  const [textInput, setTextInput] = useState(handles.join(', '));
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const handleInputChange = (val: string) => {
    setTextInput(val);
    const parsed = val
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
    onChange(parsed);
  };

  const handleApplyPreset = (presetHandles: string[]) => {
    setTextInput(presetHandles.join(', '));
    onChange(presetHandles);
  };

  const handleAnalyzeAndBuild = async () => {
    setLoading(true);
    setLoadingStage(1);

    const t1 = setTimeout(() => setLoadingStage(2), 2000);
    const t2 = setTimeout(() => setLoadingStage(3), 4000);

    try {
      await onSubmit();
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
    }
  };

  const activeHandlesCount = handles.length;

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-soft-sm mb-3">
          <Target className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('heading')}
          </h2>
          <GuidanceTooltip
            id="guide_competitors_header"
            title="Competitor Analysis Strategy"
            instructions={[
              'Add 3 to 5 Instagram accounts you admire or compete with locally.',
              'Apify inspects their top 15 engagement posts to identify which visual formats work best.',
              'Our Gemini agent identifies format gaps to outperform them rather than copying.',
            ]}
            goodExample="@tartinebakery, @bluebottle, @sweetcrust"
            badExample="Celebrities with 50M followers like @cristiano or @kimkardashian"
            reachTip="Accounts with 5k–100k active followers provide the most reliable algorithmic hook data for small businesses."
          />
        </div>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-5 shadow-soft-sm">
        {/* Handles input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t('handlesLabel')}
              </label>
              <GuidanceTooltip
                id="guide_handles_input"
                title="Inputting Competitor Handles"
                instructions={[
                  'Type plain handles separated by commas (with or without @).',
                  'Pick accounts that post consistently and engage local audiences.',
                ]}
                goodExample="@bakery_local, @coffee_roaster, @sweet_pastry"
                badExample="Random full website URLs or non-existent usernames"
                reachTip="Selecting 3–5 competitors increases hook diversity and ensures balanced content buckets."
              />
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {activeHandlesCount} accounts selected
            </span>
          </div>
          <textarea
            rows={3}
            value={textInput}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={loading}
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-none"
            placeholder={t('handlesPlaceholder')}
          />
        </div>

        {/* Quick presets */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-2">
            {t('quickPresetsLabel')}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SUGGESTIONS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.handles)}
                disabled={loading}
                className="text-xs font-medium px-3 py-2 min-h-[40px] bg-slate-100 hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100 text-slate-700 rounded-lg border border-slate-200/80 transition touch-manipulation"
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Progress State */}
        {loading && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-rose-600 animate-spin flex-shrink-0" />
              <div className="text-xs font-bold text-slate-800">
                {loadingStage === 1 && (
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Apify scraping competitor engagement hooks &amp; top formats...
                  </span>
                )}
                {loadingStage === 2 && (
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    Gemini 2.5 Flash analyzing gap opportunities &amp; viral pillars...
                  </span>
                )}
                {loadingStage >= 3 && (
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-600" />
                    Synthesizing Strategy Blueprint &amp; visual template direction...
                  </span>
                )}
              </div>
            </div>

            {/* Stage indicator bars */}
            <div className="grid grid-cols-3 gap-1.5 h-1.5">
              <div className={`rounded-full transition-all duration-500 ${loadingStage >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
              <div className={`rounded-full transition-all duration-500 ${loadingStage >= 2 ? 'bg-purple-600' : 'bg-slate-200'}`} />
              <div className={`rounded-full transition-all duration-500 ${loadingStage >= 3 ? 'bg-sky-500' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        {/* Primary CTA Button: "Analyze & Build My Strategy" */}
        <button
          type="button"
          onClick={handleAnalyzeAndBuild}
          disabled={loading || activeHandlesCount === 0}
          className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 active:scale-[0.98] shadow-soft-md transition touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing &amp; Building Niche Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze &amp; Build My Strategy</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-start max-w-xl mx-auto pt-2 pb-safe">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 active:scale-95 transition touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
