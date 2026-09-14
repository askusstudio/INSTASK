'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { StepBusinessProfile, BusinessProfileData } from './StepBusinessProfile';
import { StepCompetitors } from './StepCompetitors';
import { StepConnectMeta } from './StepConnectMeta';
import { StrategyBlueprint } from '@/lib/recommendations';
import { Store, TrendingUp, Instagram, CheckCircle2 } from 'lucide-react';

interface StepWizardProps {
  onStrategyReady: (
    blueprint: StrategyBlueprint,
    profile: BusinessProfileData,
    metaAccount: { igUserId: string; username: string }
  ) => void;
  currentLocale: string;
}

export function StepWizard({ onStrategyReady, currentLocale }: StepWizardProps) {
  const t = useTranslations('onboarding');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [businessProfile, setBusinessProfile] = useState<BusinessProfileData>({
    brandName: '',
    industry: '',
    location: '',
    productSummary: '',
    brandColor: '#e1306c',
    logoUrl: '',
  });

  const [competitors, setCompetitors] = useState<string[]>([]);

  const [metaAccount, setMetaAccount] = useState<{ igUserId: string; username: string }>({
    igUserId: '',
    username: '',
  });

  // Pre-fill existing brand details
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

  const handleFinalSubmit = async (customMeta?: { igUserId: string; username: string }) => {
    const activeMeta = customMeta || metaAccount;
    const finalHandle =
      activeMeta.username ||
      businessProfile.brandName.toLowerCase().replace(/\s+/g, '_') ||
      'mybrand';
    const finalIgUserId = activeMeta.igUserId || `usr_${Date.now()}`;

    if (typeof window !== 'undefined') {
      if (businessProfile.brandName) {
        localStorage.setItem('instask_brand_name', businessProfile.brandName);
      }
      if (finalHandle) {
        localStorage.setItem('instask_ig_handle', finalHandle);
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
        handle: finalHandle,
        igUserId: finalIgUserId,
      }),
    });

    const data = await res.json();
    if (data.success && data.blueprint) {
      onStrategyReady(data.blueprint, businessProfile, {
        igUserId: finalIgUserId,
        username: finalHandle,
      });
    }
  };

  const steps = [
    { num: 1, label: '1. Brand Info', icon: Store },
    { num: 2, label: '2. Trends & Competitors', icon: TrendingUp },
    { num: 3, label: '3. Meta Connect', icon: Instagram },
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* Wizard Step Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
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
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition shadow-xs touch-manipulation cursor-pointer ${
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
                  className={`mt-1.5 text-[11px] sm:text-xs font-bold ${
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

      {/* Step Views */}
      <div className="transition-all duration-200">
        {/* Step 1: Brand Information */}
        {currentStep === 1 && (
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
            onNext={() => setCurrentStep(2)}
            onBack={() => {}}
          />
        )}

        {/* Step 2: Trends & Competitors Research */}
        {currentStep === 2 && (
          <StepCompetitors
            handles={competitors}
            onChange={(h) => setCompetitors(h)}
            onBack={() => setCurrentStep(1)}
            onSubmit={async () => {
              setCurrentStep(3);
            }}
          />
        )}

        {/* Step 3: Meta Account Connect & Plan Activation */}
        {currentStep === 3 && (
          <StepConnectMeta
            onConnected={(acc) => {
              setMetaAccount(acc);
              if (acc.username && typeof window !== 'undefined') {
                localStorage.setItem('instask_ig_handle', acc.username);
              }
              handleFinalSubmit(acc);
            }}
            onNext={() => handleFinalSubmit()}
          />
        )}
      </div>
    </div>
  );
}