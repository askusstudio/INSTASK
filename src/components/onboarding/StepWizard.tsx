'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { StepConnectMeta } from './StepConnectMeta';
import { StepBusinessProfile, BusinessProfileData } from './StepBusinessProfile';
import { StepCompetitors } from './StepCompetitors';
import { StrategyBlueprint } from '@/lib/recommendations';
import { Instagram, Store, Target, CheckCircle2 } from 'lucide-react';

interface StepWizardProps {
  onStrategyReady: (blueprint: StrategyBlueprint, profile: BusinessProfileData, metaAccount: { igUserId: string; username: string }) => void;
  currentLocale: string;
}

export function StepWizard({ onStrategyReady, currentLocale }: StepWizardProps) {
  const t = useTranslations('onboarding');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Dynamic state: No hardcoded Luna Bakery dummy credentials
  const [metaAccount, setMetaAccount] = useState<{ igUserId: string; username: string }>({
    igUserId: '',
    username: '',
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfileData>({
    brandName: '',
    industry: '',
    location: '',
    productSummary: '',
    brandColor: '#e1306c',
    logoUrl: '',
  });

  const [competitors, setCompetitors] = useState<string[]>([]);

  // Pre-fill agar user ne handle ya brand pahle save kiya ho
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBrand = localStorage.getItem('instask_brand_name');
      const savedHandle = localStorage.getItem('instask_ig_handle');

      if (savedBrand) {
        setBusinessProfile((prev) => ({ ...prev, brandName: savedBrand }));
      }
      if (savedHandle) {
        setMetaAccount((prev) => ({ ...prev, username: savedHandle }));
      }
    }
  }, []);

  const handleAnalyzeStrategy = async () => {
    // Save user's dynamic business identity to display in header
    if (typeof window !== 'undefined') {
      if (businessProfile.brandName) {
        localStorage.setItem('instask_brand_name', businessProfile.brandName);
      }
      if (metaAccount.username) {
        localStorage.setItem('instask_ig_handle', metaAccount.username);
      }
    }

    const res = await fetch('/api/recommendations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: businessProfile.brandName || 'My Brand',
        industry: businessProfile.industry || 'General Business',
        location: businessProfile.location || '',
        productSummary: businessProfile.productSummary || '',
        competitors: competitors.filter(Boolean),
        language: currentLocale,
        handle: metaAccount.username,
        igUserId: metaAccount.igUserId || `usr_${Date.now()}`,
      }),
    });

    const data = await res.json();
    if (data.success && data.blueprint) {
      onStrategyReady(data.blueprint, businessProfile, {
        igUserId: metaAccount.igUserId || `usr_${Date.now()}`,
        username: metaAccount.username || businessProfile.brandName.toLowerCase().replace(/\s+/g, '_'),
      });
    }
  };

  const steps = [
    { num: 1, label: t('step1.tab'), icon: Instagram },
    { num: 2, label: t('step2.tab'), icon: Store },
    { num: 3, label: t('step3.tab'), icon: Target },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      {/* Wizard Progress Tabs */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

          {steps.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            const Icon = step.icon;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.num as 1 | 2 | 3)}
                  aria-label={`Step ${step.num}: ${step.label}`}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-sm touch-manipulation active:scale-95 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="transition-all duration-300">
        {currentStep === 1 && (
          <StepConnectMeta
            onConnected={(acc) => {
              setMetaAccount(acc);
              if (acc.username && typeof window !== 'undefined') {
                localStorage.setItem('instask_ig_handle', acc.username);
              }
            }}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepBusinessProfile
            data={businessProfile}
            onChange={(patch) => {
              setBusinessProfile((prev) => {
                const updated = { ...prev, ...patch };
                if (patch.brandName && typeof window !== 'undefined') {
                  localStorage.setItem('instask_brand_name', patch.brandName);
                }
                return updated;
              });
            }}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <StepCompetitors
            handles={competitors}
            onChange={(h) => setCompetitors(h)}
            onBack={() => setCurrentStep(2)}
            onSubmit={handleAnalyzeStrategy}
          />
        )}
      </div>
    </div>
  );
}