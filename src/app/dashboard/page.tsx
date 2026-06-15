"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Search, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IntelligenceReport from "@/components/dashboard/intelligence-report";
import { analyzeBrandVisibility } from "@/actions/analyze-brand";
import type { AnalysisResult } from "@/lib/schemas";

export default function DashboardOverview() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleAnalyze = useCallback(async () => {
    if (!websiteUrl.trim() || !brandName.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setError(null);
    setLoadingProgress(0);
    setLoadingMessage("Initializing analysis engine...");

    const competitorList = competitors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const startTime = Date.now();
    const expectedDuration = 3000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, (elapsed / expectedDuration) * 98);
      setLoadingProgress(Math.round(pct));

      if (pct < 20) {
        setLoadingMessage("Connecting to search nodes...");
      } else if (pct < 45) {
        setLoadingMessage("Parsing model corpora for citations...");
      } else if (pct < 70) {
        setLoadingMessage("Analyzing semantic classification...");
      } else {
        setLoadingMessage("Mapping competitive gap footprints...");
      }
    }, 50);

    try {
      const result = await analyzeBrandVisibility(
        websiteUrl.trim(),
        brandName.trim(),
        competitorList
      );
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingMessage("Report generated.");

      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        setShowResults(true);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred during analysis.");
    }
  }, [websiteUrl, brandName, competitors]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header Area */}
      {!isAnalyzing && !showResults && (
        <div className="space-y-1.5">
          <h1 className="text-lg font-bold tracking-tight text-foreground uppercase">
            AI Search Brand Intelligence
          </h1>
          <p className="text-xs text-muted-foreground">
            Analyze brand presence, competitive positioning, and coverage gaps across conversational AI models.
          </p>
        </div>
      )}

      {/* Unified Input Console (OpenAI / Vercel style) */}
      {!isAnalyzing && !showResults && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="dashboard-url" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Website URL
                  </label>
                  <Input
                    id="dashboard-url"
                    placeholder="e.g. stripe.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="h-9 border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="dashboard-brand" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Brand Name
                  </label>
                  <Input
                    id="dashboard-brand"
                    placeholder="e.g. Stripe"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="h-9 border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="dashboard-competitors" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Competitors (Optional, comma-separated)
                  </label>
                  <Input
                    id="dashboard-competitors"
                    placeholder="e.g. Adyen, PayPal"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    className="h-9 border-border bg-background text-xs"
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!websiteUrl.trim() || !brandName.trim()}
                className="w-full h-9 rounded bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-border"
              >
                <Search className="mr-2 h-3.5 w-3.5" />
                Analyze Brand
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Progress State */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center py-20 text-left max-w-sm"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                  Running brand audit
                </span>
                <span className="text-xs font-bold font-mono text-foreground">{loadingProgress}%</span>
              </div>
              <div className="h-[2px] w-full bg-border overflow-hidden rounded">
                <div
                  className="h-full bg-foreground transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-muted-foreground animate-pulse">
                {loadingMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="max-w-xl">
          <Card className="border-risk bg-risk/5">
            <CardContent className="p-5 flex items-start gap-3 text-risk">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider">Analysis Failed</h3>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  variant="outline"
                  className="h-7 px-3 text-[10px] font-semibold border-risk/35 text-risk bg-background/50 hover:bg-risk/10 mt-2"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results View (Intelligence Report) */}
      <AnimatePresence>
        {showResults && !isAnalyzing && analysisResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Report Toolbar Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase border border-border px-1.5 py-0.5 rounded bg-card text-foreground">
                    REPORT APPROVED
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {analysisResult.domainName.toUpperCase()}-SECTOR-ALPHA
                  </span>
                </div>
                <h1 className="text-lg font-bold text-foreground">
                  AI Intelligence Audit — {analysisResult.brandName}
                </h1>
              </div>
              <Button
                onClick={() => {
                  setShowResults(false);
                  setAnalysisResult(null);
                }}
                variant="outline"
                className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-medium rounded"
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
