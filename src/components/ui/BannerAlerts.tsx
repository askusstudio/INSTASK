'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Sparkles, Clock, X } from 'lucide-react';

export function BannerAlerts() {
  const t = useTranslations('alerts');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700/50 py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t('tokenHealthy')}</span>
          </div>
          <span className="hidden md:inline text-slate-500">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span>{t('rateLimitSafe')}</span>
          </div>
          <span className="hidden lg:inline text-slate-500">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>{t('creatomateReady')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white transition p-0.5 rounded"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
