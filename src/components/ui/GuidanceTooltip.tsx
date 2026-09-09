'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuidance } from '@/context/GuidanceContext';
import { HelpCircle, CheckCircle, XCircle, Sparkles, ArrowRight, Lightbulb, X } from 'lucide-react';

export interface GuidanceTooltipProps {
  id: string;
  title: string;
  instructions: string[];
  goodExample: string;
  badExample: string;
  reachTip: string;
  placement?: 'top' | 'bottom' | 'right' | 'left';
  className?: string;
}

export function GuidanceTooltip({
  id,
  title,
  instructions,
  goodExample,
  badExample,
  reachTip,
  placement = 'bottom',
  className = '',
}: GuidanceTooltipProps) {
  const { guidanceEnabled, activeTooltipId, setActiveTooltipId } = useGuidance();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = guidanceEnabled && activeTooltipId === id;

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) {
      setActiveTooltipId(null);
    } else {
      setActiveTooltipId(id);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setActiveTooltipId(null);
        }
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setActiveTooltipId]);

  if (!guidanceEnabled) {
    return null;
  }

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
      {/* Interactive Circular Help Button (?) */}
      <button
        type="button"
        onClick={toggleOpen}
        onMouseEnter={() => !activeTooltipId && setActiveTooltipId(id)}
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-xs border ${
          isOpen
            ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
        }`}
        title="Click for step-by-step guidance & examples"
        aria-label={`Help: ${title}`}
        aria-expanded={isOpen}
      >
        ?
      </button>

      {/* Animated Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-soft-lg border border-slate-200 p-4 text-left font-sans text-xs text-slate-800 ${
              placement === 'top'
                ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                : 'top-full mt-2 right-0 sm:left-0 sm:right-auto'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <span>{title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltipId(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-1 text-slate-600 leading-relaxed mb-3">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Good vs Bad Example Cards */}
            <div className="space-y-1.5 mb-3">
              <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-800">Good Example: </span>
                  <span className="text-emerald-900 italic">“{goodExample}”</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200 text-[11px] flex items-start gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-800">Avoid: </span>
                  <span className="text-rose-900 italic">“{badExample}”</span>
                </div>
              </div>
            </div>

            {/* Pro Reach Tip */}
            <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700">Reach Tip: </strong>
                {reachTip}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
