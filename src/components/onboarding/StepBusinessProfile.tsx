'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { GuidanceTooltip } from '../ui/GuidanceTooltip';
import { Store, MapPin, Sparkles, ArrowRight, ArrowLeft, Palette, Image as ImageIcon, Briefcase } from 'lucide-react';

export interface BusinessProfileData {
  brandName: string;
  industry: string;
  location: string;
  productSummary: string;
  brandColor: string;
  logoUrl: string;
}

interface StepBusinessProfileProps {
  data: BusinessProfileData;
  onChange: (data: Partial<BusinessProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDUSTRIES = [
  'Artisan Bakery & Cafe',
  'Specialty Coffee & Roastery',
  'Boutique Fashion & Apparel',
  'Fitness Studio, Gym & Wellness',
  'Beauty, Hair & Spa Salon',
  'Restaurant & Local Dining',
  'Real Estate & Home Services',
  'Professional Consulting & Agency',
];

const PRESET_COLORS = ['#e1306c', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0f172a'];

export function StepBusinessProfile({ data, onChange, onNext, onBack }: StepBusinessProfileProps) {
  const t = useTranslations('onboarding.step2');

  const isValid = data.brandName.trim().length > 1 && data.productSummary.trim().length > 5;

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 shadow-soft-sm mb-3">
          <Store className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('heading')}
          </h2>
          <GuidanceTooltip
            id="guide_business_header"
            title="Business Context & Setup"
            instructions={[
              'Our AI uses these details to generate captions that sound authentic to your shop.',
              'Industry selection unlocks proven niche visual styles and hashtag clusters.',
            ]}
            goodExample="Detailed specifics like organic grains or small-batch roasting"
            badExample="Generic descriptions like 'We sell good stuff online'"
            reachTip="Specific, honest value propositions convert local followers into paying customers 3x faster."
          />
        </div>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-5 shadow-soft-sm">
        {/* Brand Name & Industry Niche */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t('brandNameLabel')} *
              </label>
              <GuidanceTooltip
                id="guide_brand_name"
                title="Brand or Shop Name"
                instructions={[
                  'Use your official trading name that appears on your storefront or signage.',
                ]}
                goodExample="Luna Artisan Bakery"
                badExample="The Best Bakery in the World #1 Store"
                reachTip="Keep it clean and identical to your physical brand name."
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Store className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={data.brandName}
                onChange={(e) => onChange({ brandName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                placeholder={t('brandNamePlaceholder')}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Industry / Vertical *
              </label>
              <GuidanceTooltip
                id="guide_industry_dropdown"
                title="Industry Vertical Selection"
                instructions={[
                  'Select the category that best matches your primary offering.',
                  'This customizes the visual templates, content pillars, and hashtag rankings in Step 4.',
                ]}
                goodExample="Artisan Bakery & Cafe (tailors warm photography & morning hooks)"
                badExample="Selecting generic consulting when running a physical boutique"
                reachTip="Aligning with your vertical helps the Instagram discovery algorithm categorize your profile properly."
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <select
                value={data.industry || INDUSTRIES[0]}
                onChange={(e) => onChange({ industry: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition font-medium"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location (City & Country) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t('locationLabel')}
            </label>
            <GuidanceTooltip
              id="guide_location"
              title="City & Country"
              instructions={[
                'Provide your city and region so our engine can generate geo-targeted hashtags.',
              ]}
              goodExample="Austin, TX, USA"
              badExample="Somewhere on Earth"
              reachTip="Local hashtags (#AustinFoodie, #AustinBakery) have 4x higher customer purchase intent than generic tags."
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
              placeholder={t('locationPlaceholder')}
            />
          </div>
        </div>

        {/* 1-Sentence Offering Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t('productSummaryLabel')} *
            </label>
            <GuidanceTooltip
              id="guide_product_summary"
              title="1-Sentence Offering Summary"
              instructions={[
                'Describe what makes your offering unique in 1 or 2 clear sentences.',
                'Highlight your key ingredient, craftsmanship, or customer outcome.',
              ]}
              goodExample="Fresh sourdough pastries and specialty pour-over espresso made from organic local grains."
              badExample="We have products for everyone."
              reachTip="This sentence is transformed by Gemini 2.5 Flash into 30 distinct viral hook variations."
            />
          </div>
          <div className="relative">
            <textarea
              rows={3}
              value={data.productSummary}
              onChange={(e) => onChange({ productSummary: e.target.value })}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition resize-none"
              placeholder={t('productSummaryPlaceholder')}
            />
          </div>
        </div>

        {/* Brand Color & Logo URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-500" />
                  {t('brandColorLabel')}
                </span>
              </label>
              <GuidanceTooltip
                id="guide_brand_color"
                title="Primary Brand Accent Color"
                instructions={[
                  'Pick your signature brand color.',
                  'This color will be dynamically injected into Creatomate badges, checkmarks, and background glows.',
                ]}
                goodExample="Pick a high-contrast hue matching your brand identity"
                badExample="Extremely faint gray or washed-out white"
                reachTip="Consistent visual color branding increases brand recall by 80%."
              />
            </div>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange({ brandColor: color })}
                  className={`w-7 h-7 rounded-full transition transform ${
                    data.brandColor === color ? 'scale-110 ring-2 ring-offset-2 ring-slate-900' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
              <input
                type="color"
                value={data.brandColor}
                onChange={(e) => onChange({ brandColor: e.target.value })}
                className="w-7 h-7 p-0 border-0 rounded-full cursor-pointer bg-transparent"
                title="Custom Hex Color"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  {t('logoUrlLabel')}
                </span>
              </label>
              <GuidanceTooltip
                id="guide_logo_url"
                title="Brand Logo URL"
                instructions={[
                  'Optional. Provide a direct image URL (PNG with transparent background recommended).',
                ]}
                goodExample="https://yourshop.com/logo-transparent.png"
                badExample="https://google.com/search?q=my+logo"
                reachTip="A transparent logo embeds cleanly onto any 1:1 or 4:5 visual template."
              />
            </div>
            <input
              type="url"
              value={data.logoUrl}
              onChange={(e) => onChange({ logoUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              placeholder={t('logoUrlPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-xl mx-auto pt-2 pb-safe">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 active:scale-95 transition touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
        >
          <span>Continue to Step 3</span>
          <ArrowRight className="w-4 h-4 rtl-flip" />
        </button>
      </div>
    </div>
  );
}
