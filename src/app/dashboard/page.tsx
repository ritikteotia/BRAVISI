"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import IntelligenceReport from "@/components/dashboard/intelligence-report";
import { useBrand } from "@/context/BrandContext";
import BrandScanner from "@/components/dashboard/brand-scanner";

export default function DashboardOverview() {
  const {
    analysisResult,
    clearBrandData,
    isAnalyzed,
  } = useBrand();

  const showResults = isAnalyzed && analysisResult;

  return (
    <div className="space-y-8 font-sans w-full">
      {/* Header Area */}
      {!showResults && (
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">
            AI Search Intelligence Console
          </h1>
          <p className="text-xs font-semibold text-muted-foreground">
            Audit presence, track conversational citations, and map competitor positioning across global LLM indexes.
          </p>
        </div>
      )}

      {/* Unified Input Console */}
      {!showResults && (
        <BrandScanner />
      )}

      {/* Results View (Intelligence Report) */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Report Toolbar Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-extrabold uppercase border border-border px-1.5 py-0.5 rounded bg-card text-foreground">
                    REPORT APPROVED
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    ID: {analysisResult.domainName.toUpperCase()}-SECTOR-ALPHA
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                  AI Intelligence Audit — {analysisResult.brandName}
                </h1>
              </div>
              <Button
                onClick={clearBrandData}
                variant="outline"
                className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded shadow-sm hover:translate-y-[-1px] transition-transform active:translate-y-[1px]"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Analyze New Brand
              </Button>
            </div>

            <IntelligenceReport result={analysisResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
