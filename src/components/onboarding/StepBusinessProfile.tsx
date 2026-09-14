'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { GuidanceTooltip } from '../ui/GuidanceTooltip';
import {
  Store,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Palette,
  Upload,
  X,
  Check,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

export interface BusinessProfileData {
  brandName: string;
  industry: string;
  location: string;
  productSummary: string;
  brandColor: string;
  logoUrl: string;
  referenceImages?: string[];
}

interface StepBusinessProfileProps {
  data: BusinessProfileData;
  onChange: (data: Partial<BusinessProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORY_OPTIONS = [
  {
    id: 'beauty',
    name: 'Beauty, Salon & Spa',
    icon: '✨',
    defaultPrompt: 'Curated skincare treatments, salon transformations, and aesthetic services.',
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: '👗',
    defaultPrompt: 'Contemporary apparel, seasonal streetwear, and artisan wardrobe essentials.',
  },
  {
    id: 'fitness',
    name: 'Fitness & Gym',
    icon: '💪',
    defaultPrompt: 'Personal training programs, workout routines, and wellness nutrition plans.',
  },
  {
    id: 'food',
    name: 'Restaurant & Dining',
    icon: '🍽️',
    defaultPrompt: 'Signature crafted meals, dining specials, and handcrafted refreshments.',
  },
  {
    id: 'cafe',
    name: 'Specialty Coffee & Bakery',
    icon: '☕',
    defaultPrompt: 'Artisan roast coffee brews, fresh pastries, and warm daily hospitality.',
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce & D2C',
    icon: '📦',
    defaultPrompt: 'Direct-to-consumer lifestyle products engineered for daily convenience.',
  },
  {
    id: 'realestate',
    name: 'Real Estate & Interior',
    icon: '🏡',
    defaultPrompt: 'Premium residential properties, modern home staging, and architectural design.',
  },
  {
    id: 'agency',
    name: 'Agency & Tech',
    icon: '🚀',
    defaultPrompt: 'Full-service digital branding, performance marketing, and software design.',
  },
];

const PRESET_COLORS = ['#e1306c', '#6366f1', '#059669', '#d97706', '#8b5cf6', '#0f172a'];

export function StepBusinessProfile({ data, onChange, onNext, onBack }: StepBusinessProfileProps) {
  const t = useTranslations('onboarding.step2');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refImagesInputRef = useRef<HTMLInputElement>(null);

  const [referenceImages, setReferenceImages] = useState<string[]>(data.referenceImages || []);

  const isValid =
    data.brandName?.trim().length > 1 &&
    Boolean(data.industry?.trim()) &&
    data.productSummary?.trim().length > 5;

  const handleBrandNameChange = (val: string) => {
    onChange({ brandName: val });
    if (typeof window !== 'undefined') {
      if (!val.toLowerCase().includes('glamflow') && !val.toLowerCase().includes('luna')) {
        localStorage.setItem('instask_brand_name', val);
      }
    }
  };

  const handleCategorySelect = (category: (typeof CATEGORY_OPTIONS)[0]) => {
    onChange({
      industry: category.name,
      productSummary:
        !data.productSummary ||
        CATEGORY_OPTIONS.some((c) => c.defaultPrompt === data.productSummary)
          ? category.defaultPrompt
          : data.productSummary,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const maxFiles = 5 - referenceImages.length;

    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      if (file.size > 3 * 1024 * 1024) continue; // skip if > 3MB
      
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const resultStr = uploadEvent.target.result as string;
          setReferenceImages((prev) => {
            const updated = [...prev, resultStr].slice(0, 5);
            onChange({ referenceImages: updated });
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = (index: number) => {
    const updated = referenceImages.filter((_, i) => i !== index);
    setReferenceImages(updated);
    onChange({ referenceImages: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs mb-2">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t('heading')}
        </h2>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 max-w-xl mx-auto space-y-5 shadow-sm">
        
        {/* Step 1: Business Identity & Logo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              1. Brand Name & Logo *
            </label>
            <GuidanceTooltip
              id="guide_brand_name"
              title="Brand or Shop Name"
              instructions={['Use your official brand name without keyword spam.']}
              goodExample="Glow & Bloom Studio"
              badExample="The Best Shop in the World #1"
              reachTip="Clean brand names rank better in Instagram hashtag mentions."
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Logo Preview & Upload Box */}
            <div className="relative group shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50 flex flex-col items-center justify-center transition overflow-hidden cursor-pointer relative"
                title="Upload Brand Logo"
              >
                {data.logoUrl ? (
                  <img
                    src={data.logoUrl}
                    alt="Brand Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-rose-600">
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">Upload</span>
                  </div>
                )}
              </button>

              {data.logoUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ logoUrl: '' })}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition"
                  title="Remove Logo"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Brand Name Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Store className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={data.brandName || ''}
                onChange={(e) => handleBrandNameChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition font-medium"
                placeholder="Enter your brand or shop name"
                required
              />
            </div>
          </div>

          {/* Optional Direct Logo URL */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <LinkIcon className="w-3.5 h-3.5" />
            </span>
            <input
              type="url"
              value={data.logoUrl?.startsWith('data:') ? '' : data.logoUrl || ''}
              onChange={(e) => onChange({ logoUrl: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
              placeholder="Or paste direct logo URL (optional)"
            />
          </div>
        </div>

        {/* Step 2: Category Selector (Chips) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              2. Select Business Category *
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Click to select
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = data.industry === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-left text-xs font-semibold transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/80 text-rose-700 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-sm shrink-0">{cat.icon}</span>
                  <span className="truncate leading-tight">{cat.name.split(',')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 text-rose-600 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            3. City & Target Location (Optional)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              placeholder="e.g. Mumbai, India / London, UK / Austin, TX"
            />
          </div>
        </div>

        {/* Step 4: Offering Summary */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              4. Short Offering / Product Summary *
            </label>
            <span className="text-[10px] text-slate-400">
              AI anchors 30 days of hooks on this
            </span>
          </div>
          <textarea
            rows={2}
            value={data.productSummary || ''}
            onChange={(e) => onChange({ productSummary: e.target.value })}
            className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition resize-none font-normal leading-relaxed"
            placeholder="What products, services, or experience makes your business special?"
            required
          />
        </div>

        {/* Step 5: Reference Images (Upto 5) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <label className="block text-xs font-bold text-slate-800">
                5. Brand Reference Images (Upto 5)
              </label>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {referenceImages.length}/5 uploaded
            </span>
          </div>
          
          <input
            ref={refImagesInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleReferenceImagesUpload}
            className="hidden"
          />

          <div className="grid grid-cols-5 gap-2">
            {referenceImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeReferenceImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-slate-900/80 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-rose-600 transition"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {referenceImages.length < 5 && (
              <button
                type="button"
                onClick={() => refImagesInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-rose-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition text-slate-400 hover:text-rose-600 group"
                title="Upload Reference Image"
              >
                <span className="text-lg font-bold">+</span>
                <span className="text-[9px] font-semibold mt-0.5">Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* Step 6: Brand Color Accent */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">Brand Color</span>
          </div>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ brandColor: color })}
                className={`w-6 h-6 rounded-full transition transform cursor-pointer ${
                  data.brandColor === color
                    ? 'scale-110 ring-2 ring-offset-2 ring-slate-900'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
            <input
              type="color"
              value={data.brandColor || '#e1306c'}
              onChange={(e) => onChange({ brandColor: e.target.value })}
              className="w-6 h-6 p-0 border-0 rounded-full cursor-pointer bg-transparent"
              title="Custom Hex Color"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-xl mx-auto pt-1 pb-safe">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Continue to Competitors</span>
          <ArrowRight className="w-4 h-4 rtl-flip" />
        </button>
      </div>
    </div>
  );
}