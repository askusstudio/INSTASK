'use client';

import React, { useState } from 'react';
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

  const [metaAccount, setMetaAccount] = useState<{ igUserId: string; username: string }>({
    igUserId: '17841458920194827',
    username: 'artisan_luna_bakery',
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfileData>({
    brandName: 'Luna Artisan Bakery',
    industry: 'Artisan Bakery & Cafe',
    location: 'Austin, TX',
    productSummary: 'Fresh sourdough pastries and specialty espresso made from organic local grains.',
    brandColor: '#e1306c',
    logoUrl: '',
  });

  const [competitors, setCompetitors] = useState<string[]>([
    '@tartinebakery',
    '@lafamille',
    '@sweetcrust',
  ]);

  const handleAnalyzeStrategy = async () => {
    // Call /api/recommendations/generate
    const res = await fetch('/api/recommendations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: businessProfile.brandName,
        industry: businessProfile.industry,
        location: businessProfile.location,
        productSummary: businessProfile.productSummary,
        competitors,
        language: currentLocale,
      }),
    });

    const data = await res.json();
    if (data.success && data.blueprint) {
      onStrategyReady(data.blueprint, businessProfile, metaAccount);
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
                  onClick={() => isCompleted && setCurrentStep(step.num as any)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm ${
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
            onConnected={(acc) => setMetaAccount(acc)}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepBusinessProfile
            data={businessProfile}
            onChange={(patch) => setBusinessProfile((prev) => ({ ...prev, ...patch }))}
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
