'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, Locale } from '@/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    // Replace the current locale in pathname or prepend
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  const activeMeta = localeNames[currentLocale as Locale] || localeNames.en;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span>{activeMeta.flag}</span>
        <span className="hidden sm:inline font-medium">{activeMeta.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 origin-top-right rounded-xl bg-white shadow-soft-lg ring-1 ring-black ring-opacity-5 border border-slate-100 z-50 py-1.5 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Language (10 Available)
          </div>
          {locales.map((loc) => {
            const meta = localeNames[loc];
            const isSelected = loc === currentLocale;
            return (
              <button
                key={loc}
                onClick={() => handleSelectLanguage(loc)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition hover:bg-slate-50 ${
                  isSelected ? 'font-semibold text-slate-900 bg-slate-50/80' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta.flag}</span>
                  <div>
                    <div>{meta.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{meta.name}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
