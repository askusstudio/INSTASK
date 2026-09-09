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
  { id: 'Artisan Bakery', label: 'Artisan Bakery', desc: 'Sourdough, pastries & viennoiseries' },
  { id: 'Coffee & Cafe', label: 'Specialty Coffee & Cafe', desc: 'Roasteries, pour-overs & brunch' },
  { id: 'Boutique Fitness', label: 'Boutique Fitness & Yoga', desc: 'Pilates, HIIT & personal training' },
  { id: 'Sustainable Fashion', label: 'Sustainable Fashion', desc: 'Eco-apparel, handmade goods & jewelry' },
  { id: 'Beauty & Skincare', label: 'Beauty & Skincare', desc: 'Organic cosmetics & salon care' },
  { id: 'Local Restaurant', label: 'Local Restaurant & Dining', desc: 'Chef specials, farm-to-table & hospitality' },
  { id: 'Real Estate', label: 'Real Estate & Properties', desc: 'Residential listings & architectural tours' },
  { id: 'SaaS / Tech', label: 'SaaS & Digital Services', desc: 'Productivity apps & agency consulting' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD - United States Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
];

const COLOR_PRESETS = [
  { name: 'Slate Onyx', primary: '#0F172A', accent: '#F43F5E' },
  { name: 'Royal Indigo', primary: '#1E1B4B', accent: '#6366F1' },
  { name: 'Emerald Luxe', primary: '#064E3B', accent: '#10B981' },
  { name: 'Warm Mocha', primary: '#451A03', accent: '#D97706' },
  { name: 'Deep Crimson', primary: '#881337', accent: '#FB7185' },
];

interface BrandOnboardingProps {
  params: { locale: string };
}

export default function BrandOnboardingPage({ params: { locale } }: BrandOnboardingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identify user from URL or session storage or fallback
  const resolvedUserId = searchParams.get('userId') || (typeof window !== 'undefined' ? localStorage.getItem('instask_user_id') : null) || 'usr_demo_001';

  // State defaults to empty (null representation) for first-time users
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('USD');
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

  // Load existing brand: If repeat user, pre-fill; if first time, remains empty
  useEffect(() => {
    async function loadBrandProfile() {
      setIsInitialLoading(true);
      try {
        const res = await fetch(`/api/brand?userId=${encodeURIComponent(resolvedUserId)}`);
        const data = await res.json();

        if (data.success && data.brand) {
          // Returning user: autofill with existing saved records
          setBrandName(data.brand.brandName || '');
          setIndustry(data.brand.industry || '');
          setCountry(data.brand.country || '');
          setCurrency(data.brand.currency || 'USD');
          setWebsite(data.brand.website || '');
          setInstagramHandle(
            data.brand.instagramHandle
              ? `@${data.brand.instagramHandle.replace(/^@/, '')}`
              : ''
          );
          if (data.brand.primaryColor) setPrimaryColor(data.brand.primaryColor);
          if (data.brand.accentColor) setAccentColor(data.brand.accentColor);
          if (data.brand.logoUrl) {
            setLogoUrl(data.brand.logoUrl);
            setLogoPreview(data.brand.logoUrl);
          }
        }
        // If data.brand is null (first-time user), states stay blank as initialized
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
          industry: industry || 'Artisan Bakery',
          primaryColor,
          accentColor,
          country: country || 'United States',
          currency,
          website,
          instagramHandle: instagramHandle.replace(/^@/, ''),
          logoUrl: logoUrl || logoPreview || '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/${locale}/onboarding/payment?userId=${encodeURIComponent(resolvedUserId)}`);
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs">
              2
            </span>
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Step 2 of 3: Brand Profile &amp; Assets
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Next: Plan Activation (50% Off)</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md p-6 sm:p-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Brand Intelligence Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tell us about your brand
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              INSTASK calibrates viral content hooks, color palettes, and hashtag clusters tailored to your exact industry.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Brand Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Business or Brand Name
                </label>
                <GuidanceTooltip
                  id="tooltip-brand-name"
                  title="Crafting Your Brand Name for Instagram"
                  instructions={[
                    'Enter the exact trade name customers search for on Instagram.',
                    'Avoid excessive emojis or legal suffixes like LLC/Inc.',
                  ]}
                  goodExample="Luna Artisan Bakery"
                  badExample="Luna_Bakery_Austin_Texas_LLC_Official_123"
                  reachTip="Keep it identical to your storefront sign so local visitors tag your geotag."
                />
              </div>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Luna Artisan Bakery"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Field 2: Logo Asset Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>Brand Logo &amp; Watermark</span>
                </label>
                <span className="text-[11px] text-slate-400">PNG, SVG, or JPG (max 5MB)</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-slate-800">
                    {uploadingLogo
                      ? 'Uploading to Storage...'
                      : logoPreview
                      ? 'Logo ready for automated watermarks'
                      : 'Upload your official brand logo'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Rendered in high-resolution across all generated carousel slides and Reels.
                  </p>
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
                  className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span>{logoPreview ? 'Change' : 'Browse'}</span>
                </button>
              </div>
            </div>

            {/* Field 3: Brand Colors */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <span>Brand Color Palette</span>
                </label>
                <span className="text-[11px] text-slate-400">Controls banner and text styling</span>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-3">
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
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        isSelected ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center -space-x-1">
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <div className="text-left">
                    <span className="block text-[10px] font-semibold text-slate-400">Primary Color</span>
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase">{primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <div className="text-left">
                    <span className="block text-[10px] font-semibold text-slate-400">Accent Color</span>
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field 4: Industry Niche */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Industry &amp; Niche
                </label>
                <GuidanceTooltip
                  id="tooltip-brand-industry"
                  title="Selecting Your Strategic Vertical"
                  instructions={[
                    'This selects pre-tested visual templates and high-converting caption structures.',
                    'Trained on top performers in your niche for optimal bookmarks.',
                  ]}
                  goodExample="Artisan Bakery or Specialty Coffee"
                  badExample="Generic 'Business' or 'Sales'"
                  reachTip="Niche content gets 3.2x higher bookmark rates than generic corporate messaging."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setIndustry(ind.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      industry === ind.id
                        ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900">{ind.label}</span>
                      {industry === ind.id && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">{ind.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field 5: Instagram Handle & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Instagram Handle
                  </label>
                  <GuidanceTooltip
                    id="tooltip-brand-handle"
                    title="Instagram Username"
                    instructions={[
                      'Enter your handle with or without @.',
                      'This will appear as the author on all rendered mockups and live publishing.',
                    ]}
                    goodExample="@artisan_luna_bakery"
                    badExample="bakery#1!! (spaces or invalid characters)"
                    reachTip="Short, memorable handles improve direct profile visits by 22%."
                  />
                </div>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Website (Optional)
                  </label>
                  <GuidanceTooltip
                    id="tooltip-brand-website"
                    title="Bio Link & Website"
                    instructions={[
                      'Provide your main destination URL.',
                      'E.g. your online store, menu, or booking link.',
                    ]}
                    goodExample="https://lunabakery.com/order"
                    badExample="lunabakery (missing protocol or domain)"
                    reachTip="Clear CTAs driving to this link in your captions increase bio clicks."
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Field 6: Country & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, Spain, India"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Billing Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-900 font-medium"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>50% discount automatically unlocked on next step</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Saving Profile...' : 'Save & Continue to Activation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}