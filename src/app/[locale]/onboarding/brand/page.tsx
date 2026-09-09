'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GuidanceTooltip } from '@/components/ui/GuidanceTooltip';
import {
  Building2,
  Globe,
  Instagram,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Briefcase,
  HelpCircle,
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

interface BrandOnboardingProps {
  params: { locale: string };
}

export default function BrandOnboardingPage({ params: { locale } }: BrandOnboardingProps) {
  const router = useRouter();

  const [brandName, setBrandName] = useState('Luna Artisan Bakery');
  const [industry, setIndustry] = useState('Artisan Bakery');
  const [country, setCountry] = useState('United States');
  const [currency, setCurrency] = useState('USD');
  const [website, setWebsite] = useState('https://lunabakery.com');
  const [instagramHandle, setInstagramHandle] = useState('@artisan_luna_bakery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing brand if present
  useEffect(() => {
    fetch('/api/brand?userId=usr_demo_001')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.brand) {
          if (data.brand.brandName) setBrandName(data.brand.brandName);
          if (data.brand.industry) setIndustry(data.brand.industry);
          if (data.brand.country) setCountry(data.brand.country);
          if (data.brand.currency) setCurrency(data.brand.currency);
          if (data.brand.website) setWebsite(data.brand.website);
          if (data.brand.instagramHandle) setInstagramHandle(`@${data.brand.instagramHandle.replace(/^@/, '')}`);
        }
      })
      .catch(() => {
        // Fallback default is fine
      });
  }, []);

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
          userId: 'usr_demo_001',
          brandName,
          industry,
          country,
          currency,
          website,
          instagramHandle,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/${locale}/onboarding/payment`);
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
              Step 2 of 3: Brand Profile
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

            {/* Field 2: Industry Niche */}
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

            {/* Field 3: Instagram Handle & Website */}
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

            {/* Field 4: Country & Currency */}
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
