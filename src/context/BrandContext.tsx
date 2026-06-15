"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AnalysisResult } from "@/lib/schemas";

interface BrandData {
  brandName: string;
  websiteUrl: string;
  productUrl: string;
  competitors: string;
  isFamous: boolean;
  analysisResult: AnalysisResult | null;
}

interface BrandContextType extends BrandData {
  setBrandData: (data: Partial<BrandData>) => void;
  clearBrandData: () => void;
  isAnalyzed: boolean;
}

const defaultState: BrandData = {
  brandName: "",
  websiteUrl: "",
  productUrl: "",
  competitors: "",
  isFamous: false,
  analysisResult: null,
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrandData>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bravisi_brand_context");
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load brand context from localStorage:", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("bravisi_brand_context", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save brand context to localStorage:", e);
    }
  }, [state, isInitialized]);

  const setBrandData = (data: Partial<BrandData>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const clearBrandData = () => {
    setState(defaultState);
    try {
      localStorage.removeItem("bravisi_brand_context");
    } catch (e) {
      console.error("Failed to clear brand context from localStorage:", e);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        ...state,
        setBrandData,
        clearBrandData,
        isAnalyzed: !!state.analysisResult,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
