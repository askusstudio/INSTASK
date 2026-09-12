'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuidanceTooltip } from '@/components/ui/GuidanceTooltip';
import { supabase } from '@/lib/supabaseClient';
import {
  Building2,
  Globe,
  Instagram,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  Palette,
  Loader2,
} from 'lucide-react';

const INDUSTRIES = [
  { id: 'Coffee & Cafe', label: 'Coffee & Cafe', desc: 'Roasteries & hospitality' },
  { id: 'Boutique Fitness', label: 'Fitness & Yoga', desc: 'Pilates, gym & coaching' },
  { id: 'Sustainable Fashion', label: 'Fashion & Apparel', desc: 'Apparel & boutique' },
  { id: 'Beauty & Skincare', label: 'Beauty & Skincare', desc: 'Cosmetics & wellness' },
  { id: 'Local Restaurant', label: 'Restaurant & Dining', desc: 'Chef specials & food' },
  { id: 'Real Estate', label: 'Real Estate', desc: 'Listings & property' },
  { id: 'SaaS / Tech', label: 'SaaS & Digital', desc: 'Agencies & consulting' },
  { id: 'Retail & Crafts', label: 'Artisan & Crafts', desc: 'Handmade & goods' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD - US Dollar' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
];

const COLOR_PRESETS = [
  { name: 'Slate', primary: '#0F172A', accent: '#F43F5E' },
  { name: 'Royal', primary: '#1E1B4B', accent: '#6366F1' },
  { name: 'Emerald', primary: '#064E3B', accent: '#10B981' },
  { name: 'Warm', primary: '#451A03', accent: '#D97706' },
  { name: 'Deep', primary: '#881337', accent: '#FB7185' },
];

interface BrandOnboardingProps {
  params: { locale: string };
}

export default function BrandOnboardingPage({ params: { locale } }: BrandOnboardingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedUserId = searchParams.get('userId') || (typeof window !== 'undefined' ? localStorage.getItem('instask_user_id') : null) || 'usr_main';

  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('Coffee & Cafe');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR');
  const [website, setWebsite] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0F172A');
  const [accentColor, setAccentColor] = useState('#F43F5E');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrandProfile() {
      setIsInitialLoading(true);
      try {
        const savedBrand = typeof window !== 'undefined' ? localStorage.getItem('instask_brand_name') : null;
        const savedHandle = typeof window !== 'undefined' ? localStorage.getItem('instask_ig_handle') : null;

        if (savedBrand) setBrandName(savedBrand);
        if (savedHandle) setInstagramHandle(`@${savedHandle.replace(/^@/, '')}`);

        const res = await fetch(`/api/brand?userId=${encodeURIComponent(resolvedUserId)}`);
        const data = await res.json();

        if (data.success && data.brand) {
          const fetchedBrand = data.brand.brandName || '';
          if (!fetchedBrand.toLowerCase().includes('luna') && !fetchedBrand.toLowerCase().includes('glamflow')) {
            setBrandName(fetchedBrand);
          }
          if (data.brand.industry) setIndustry(data.brand.industry);
          if (data.brand.country) setCountry(data.brand.country);
          if (data.brand.currency) setCurrency(data.brand.currency);
          if (data.brand.website) setWebsite(data.brand.website);
          const fetchedHandle = data.brand.instagramHandle || '';
          if (!fetchedHandle.toLowerCase().includes('artisan_luna')) {
            setInstagramHandle(fetchedHandle ? `@${fetchedHandle.replace(/^@/, '')}` : '');
          }
          if (data.brand.primaryColor) setPrimaryColor(data.brand.primaryColor);
          if (data.brand.accentColor) setAccentColor(data.brand.accentColor);
          if (data.brand.logoUrl) {
            setLogoUrl(data.brand.logoUrl);
            setLogoPreview(data.brand.logoUrl);
          }
        }
      } catch (err) {
        console.warn('Could not load existing brand profile:', err);
      } finally {
        setIsInitialLoading(false);
      }
    }

    loadBrandProfile();
  }, [resolvedUserId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingLogo(true);
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`;
      const filePath = `logos/${cleanFileName}`;

      const { data, error: uploadErr } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadErr && data) {
        const { data: publicData } = supabase.storage
          .from('brand-assets')
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          setLogoUrl(publicData.publicUrl);
        }
      } else {
        setLogoUrl((reader.result as string) || URL.createObjectURL(file));
      }
    } catch (err) {
      console.warn('Storage exception, using local preview reference:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brandName.trim()) {
      setError('Please provide your brand or business name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: resolvedUserId,
          brandName,
          industry: industry || 'Coffee & Cafe',
          primaryColor,
          accentColor,
          country: country || 'India',
          currency,
          website,
          instagramHandle: instagramHandle.replace(/^@/, ''),
          logoUrl: logoUrl || logoPreview || '',
        }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('instask_brand_name', brandName);
          if (instagramHandle) {
            localStorage.setItem('instask_ig_handle', instagramHandle.replace(/^@/, ''));
          }
          localStorage.setItem('instask_brand_color', accentColor);
        }
        router.push(`/${locale}/dashboard?view=calendar`);
      } else {
        setError(data.error || 'Failed to save brand profile');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error saving brand onboarding profile');
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
          <p className="text-xs font-semibold">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full">
        
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 space-y-5">
          
          {/* Clean Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Brand Intelligence Profile
                </h1>
                <p className="text-[11px] text-slate-400">Tailored content hooks &amp; brand palette</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Sync
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Brand Name & Handle in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Business Name *
                  </label>
                  <GuidanceTooltip
                    id="tooltip-brand-name"
                    title="Crafting Your Brand Name for Instagram"
                    instructions={[
                      'Enter the trade name customers search for on Instagram.',
                      'Avoid legal suffixes like LLC/Inc.',
                    ]}
                    goodExample="Urban Bloom Studio"
                    badExample="Studio_Shop_City_LLC_123"
                    reachTip="Keep it identical to your storefront for easy tagging."
                  />
                </div>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-semibold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Instagram Handle
                  </label>
                  <GuidanceTooltip
                    id="tooltip-brand-handle"
                    title="Instagram Username"
                    instructions={[
                      'Enter your handle with or without @.',
                      'Appears as author on all rendered mockups and live posts.',
                    ]}
                    goodExample="@yourbrand"
                    badExample="shop#1!! (spaces or invalid characters)"
                    reachTip="Short handles improve profile visits by 22%."
                  />
                </div>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Field 2: Compact Logo Bar */}
            <div className="p-3 bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {uploadingLogo ? 'Uploading...' : logoPreview ? 'Logo ready' : 'Brand Logo & Watermark'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Rendered across 30-day carousels and reels (PNG, SVG)
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>{logoPreview ? 'Change' : 'Browse'}</span>
              </button>
            </div>

            {/* Field 3: Brand Color Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <span>Brand Color Palette</span>
                </label>
                <span className="text-[10px] text-slate-400">Accent: {accentColor}</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = primaryColor === preset.primary && accentColor === preset.accent;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setAccentColor(preset.accent);
                      }}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        isSelected ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Industry 2-Column Grid on Mobile */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Industry &amp; Niche
                </label>
                <GuidanceTooltip
                  id="tooltip-brand-industry"
                  title="Strategic Vertical"
                  instructions={[
                    'Selects pre-tested visual templates for your niche.',
                    'Optimizes bookmark and conversion hooks.',
                  ]}
                  goodExample="Coffee & Cafe or Fashion & Apparel"
                  badExample="Generic 'Business'"
                  reachTip="Niche content gets 3.2x higher bookmarks."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setIndustry(ind.id)}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      industry === ind.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold leading-tight">{ind.label}</span>
                      {industry === ind.id && <CheckCircle2 className="w-3 h-3 text-rose-400 shrink-0" />}
                    </div>
                    <span className={`text-[9px] mt-0.5 leading-tight truncate w-full ${industry === ind.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {ind.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field 5: Optional Website */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Website / Bio Link (Optional)
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Field 6: Target Country & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, United States"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Real-time sync with dashboard</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Saving Profile...' : 'Save & View Calendar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}