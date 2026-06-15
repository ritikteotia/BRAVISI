"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, ArrowLeft, Globe, Link2, Tag, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IntelligenceReport from "@/components/dashboard/intelligence-report";
import { analyzeBrandVisibility } from "@/actions/analyze-brand";
import { useBrand } from "@/context/BrandContext";

export default function DashboardOverview() {
  const {
    brandName: globalBrandName,
    websiteUrl: globalWebsiteUrl,
    productUrl: globalProductUrl,
    competitors: globalCompetitors,
    analysisResult: globalAnalysisResult,
    setBrandData,
    clearBrandData,
    isAnalyzed,
  } = useBrand();

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [competitors, setCompetitors] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Sync state with global context on mount or when context updates
  useEffect(() => {
    if (globalBrandName) setBrandName(globalBrandName);
    if (globalWebsiteUrl) setWebsiteUrl(globalWebsiteUrl);
    if (globalProductUrl) setProductUrl(globalProductUrl);
    if (globalCompetitors) setCompetitors(globalCompetitors);
  }, [globalBrandName, globalWebsiteUrl, globalProductUrl, globalCompetitors]);

  const handleAnalyze = useCallback(async () => {
    if (!websiteUrl.trim() || !productUrl.trim() || !brandName.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setLoadingProgress(0);
    setActiveStep(0);

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

      if (pct < 25) {
        setActiveStep(0);
      } else if (pct < 50) {
        setActiveStep(1);
      } else if (pct < 75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    }, 50);

    try {
      const result = await analyzeBrandVisibility(
        websiteUrl.trim(),
        productUrl.trim(),
        brandName.trim(),
        competitorList
      );
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setActiveStep(4);

      setTimeout(() => {
        setBrandData({
          brandName: brandName.trim(),
          websiteUrl: websiteUrl.trim(),
          productUrl: productUrl.trim(),
          competitors: competitors.trim(),
          isFamous: result.isFamous || false,
          analysisResult: result,
        });
        setIsAnalyzing(false);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred during analysis.");
    }
  }, [websiteUrl, productUrl, brandName, competitors, setBrandData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (websiteUrl.trim() && productUrl.trim() && brandName.trim() && !isAnalyzing) {
        handleAnalyze();
      }
    }
  };

  const showResults = isAnalyzed && globalAnalysisResult;

  const loadingSteps = [
    "Establishing secure crawl connections...",
    "Retrieving search database indexes...",
    "Parsing conversational entity citations...",
    "Constructing strategic recommendation matrices...",
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header Area */}
      {!isAnalyzing && !showResults && (
        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">
            AI Search Intelligence Console
          </h1>
          <p className="text-xs font-semibold text-muted-foreground">
            Audit presence, track conversational citations, and map competitor positioning.
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
          <Card className="border-border bg-card shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                {/* Website URL */}
                <div className="space-y-1.5">
                  <label htmlFor="dashboard-url" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Website Domain *
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      id="dashboard-url"
                      placeholder="e.g. stripe.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-9 h-9 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                </div>

                {/* Product URL */}
                <div className="space-y-1.5">
                  <label htmlFor="dashboard-product-url" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Product/Service Landing URL *
                  </label>
                  <div className="relative flex items-center">
                    <Link2 className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      id="dashboard-product-url"
                      placeholder="e.g. stripe.com/payments"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-9 h-9 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-1.5">
                  <label htmlFor="dashboard-brand" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Product / Brand Name *
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      id="dashboard-brand"
                      placeholder="e.g. Stripe Payments"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-9 h-9 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                </div>

                {/* Competitors */}
                <div className="space-y-1.5">
                  <label htmlFor="dashboard-competitors" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Compare Against (Optional, comma-separated)
                  </label>
                  <div className="relative flex items-center">
                    <Users className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      id="dashboard-competitors"
                      placeholder="e.g. Adyen, PayPal"
                      value={competitors}
                      onChange={(e) => setCompetitors(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-9 h-9 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!websiteUrl.trim() || !productUrl.trim() || !brandName.trim() || isAnalyzing}
                className="w-full h-9 mt-2 rounded bg-primary text-primary-foreground text-xs font-extrabold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-border shadow-sm"
              >
                <Search className="mr-2 h-3.5 w-3.5" />
                Run Intelligence Audit
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Progress State */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center py-16 text-left max-w-md"
          >
            <div className="space-y-6 bg-card border border-border p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">
                  Auditing brand footprint
                </span>
                <span className="text-xs font-extrabold font-mono text-foreground">{loadingProgress}%</span>
              </div>

              {/* Step checklist */}
              <div className="space-y-3">
                {loadingSteps.map((step, idx) => {
                  const isDone = activeStep > idx;
                  const isActive = activeStep === idx;
                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isDone
                            ? "text-opportunity fill-opportunity/10"
                            : isActive
                            ? "text-foreground animate-pulse"
                            : "text-muted-foreground/35"
                        }`}
                      />
                      <span className={`text-[11px] font-bold transition-colors ${
                        isDone
                          ? "text-foreground"
                          : isActive
                          ? "text-foreground font-extrabold"
                          : "text-muted-foreground/60"
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-[2px] w-full bg-secondary overflow-hidden rounded">
                <div
                  className="h-full bg-foreground transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
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
                <p className="text-xs font-bold text-muted-foreground">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  variant="outline"
                  className="h-7 px-3 text-[10px] font-bold border-risk/35 text-risk bg-background/50 hover:bg-risk/10 mt-2"
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
        {showResults && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                    ID: {globalAnalysisResult.domainName.toUpperCase()}-SECTOR-ALPHA
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                  AI Intelligence Audit — {globalAnalysisResult.brandName}
                </h1>
              </div>
              <Button
                onClick={() => {
                  clearBrandData();
                  // Reset local input states
                  setWebsiteUrl("");
                  setProductUrl("");
                  setBrandName("");
                  setCompetitors("");
                }}
                variant="outline"
                className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Analyze New Brand
              </Button>
            </div>

            <IntelligenceReport result={globalAnalysisResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
