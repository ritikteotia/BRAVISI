"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Globe, Link2, Tag, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { analyzeBrandVisibility } from "@/actions/analyze-brand";
import { useBrand } from "@/context/BrandContext";

interface BrandScannerProps {
  title?: string;
  description?: string;
}

export default function BrandScanner({
  title = "Configure Scan Scope",
  description = "Enter your domain parameters to trigger the multi-model intelligence scan.",
}: BrandScannerProps) {
  const {
    brandName: globalBrandName,
    websiteUrl: globalWebsiteUrl,
    productUrl: globalProductUrl,
    competitors: globalCompetitors,
    setBrandData,
  } = useBrand();

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [competitors, setCompetitors] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Sync state with global context on mount
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

  const loadingSteps = [
    "Establishing secure crawl connections...",
    "Retrieving search database index vectors...",
    "Parsing conversational citation contexts...",
    "Synthesizing brand recommendation matrix...",
  ];

  const canSubmit = websiteUrl.trim() && productUrl.trim() && brandName.trim() && !isAnalyzing;

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key="scanner-input"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="border-border bg-card shadow-3d-premium card-3d-lift relative overflow-hidden">
              {/* Vibrant gradient border top line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />

              <CardContent className="p-8 space-y-6">
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-widest mb-1">
                    {title}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    {description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website URL */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scanner-url"
                      className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider"
                    >
                      Website Domain *
                    </label>
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                      <Input
                        id="scanner-url"
                        placeholder="e.g. stripe.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 h-10 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>

                  {/* Product URL */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scanner-product-url"
                      className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider"
                    >
                      Product/Service Landing URL *
                    </label>
                    <div className="relative flex items-center">
                      <Link2 className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                      <Input
                        id="scanner-product-url"
                        placeholder="e.g. stripe.com/payments"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 h-10 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scanner-brand"
                      className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider"
                    >
                      Product / Brand Name *
                    </label>
                    <div className="relative flex items-center">
                      <Tag className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                      <Input
                        id="scanner-brand"
                        placeholder="e.g. Stripe Payments"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 h-10 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>

                  {/* Competitors */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scanner-competitors"
                      className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider"
                    >
                      Compare Against (Optional, comma-separated)
                    </label>
                    <div className="relative flex items-center">
                      <Users className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
                      <Input
                        id="scanner-competitors"
                        placeholder="e.g. Adyen, PayPal"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 h-10 border-border bg-background text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded border border-risk/30 bg-risk/5 text-risk flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <div className="text-xs font-bold">
                      <p className="uppercase tracking-wide">Analysis Failed</p>
                      <p className="text-muted-foreground mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!canSubmit}
                    className="w-full md:w-auto px-8 h-10 rounded bg-primary text-primary-foreground text-xs font-extrabold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-border shadow-md glow-button flex items-center justify-center"
                  >
                    <Search className="mr-2 h-3.5 w-3.5" />
                    Run Intelligence Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="scanner-progress"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center py-6"
          >
            <div className="w-full max-w-xl space-y-6 bg-card border border-border p-8 rounded-lg shadow-3d-premium relative overflow-hidden">
              {/* Loading glowing bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant animate-pulse" />

              <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">
                  Running Deep Search Audit
                </span>
                <span className="text-xs font-extrabold font-mono text-foreground">
                  {loadingProgress}%
                </span>
              </div>

              {/* Step checklist */}
              <div className="space-y-4">
                {loadingSteps.map((step, idx) => {
                  const isDone = activeStep > idx;
                  const isActive = activeStep === idx;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isDone
                            ? "text-opportunity fill-opportunity/10"
                            : isActive
                            ? "text-indigo-500 animate-pulse"
                            : "text-muted-foreground/35"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-bold transition-colors ${
                          isDone
                            ? "text-foreground"
                            : isActive
                            ? "text-foreground font-extrabold"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-[3px] w-full bg-secondary overflow-hidden rounded">
                <div
                  className="h-full bg-gradient-vibrant transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
