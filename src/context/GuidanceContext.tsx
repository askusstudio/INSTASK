'use client';

import React, { createContext, useContext, useState } from 'react';

interface GuidanceContextType {
  guidanceEnabled: boolean;
  toggleGuidance: () => void;
  setGuidanceEnabled: (enabled: boolean) => void;
  dismissAllGuidance: () => void;
  activeTooltipId: string | null;
  setActiveTooltipId: (id: string | null) => void;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

export function GuidanceProvider({ children }: { children: React.ReactNode }) {
  const [guidanceEnabled, setGuidanceEnabled] = useState(true);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const toggleGuidance = () => {
    setGuidanceEnabled((prev) => !prev);
    if (guidanceEnabled) {
      setActiveTooltipId(null);
    }
  };

  const dismissAllGuidance = () => {
    setActiveTooltipId(null);
    setGuidanceEnabled(false);
  };

  return (
    <GuidanceContext.Provider
      value={{
        guidanceEnabled,
        toggleGuidance,
        setGuidanceEnabled,
        dismissAllGuidance,
        activeTooltipId,
        setActiveTooltipId,
      }}
    >
      {children}
    </GuidanceContext.Provider>
  );
}

export function useGuidance() {
  const context = useContext(GuidanceContext);
  if (!context) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
}
