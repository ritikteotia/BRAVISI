"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import OverviewCards from "@/components/dashboard/overview-cards";
import MentionChart from "@/components/dashboard/mention-chart";
import TrendChart from "@/components/dashboard/trend-chart";
import CompetitorTable from "@/components/dashboard/competitor-table";
import Insights from "@/components/dashboard/insights";

import { analyzeBrandVisibility } from "@/actions/analyze-brand";
import type { AnalysisResult } from "@/lib/schemas";

import {
  toOverviewMetrics,
  toAIMentionData,
  toCompetitorData,
  toActionItems,
  toContentOpportunities,
  toTrendData,
} from "@/lib/mappers";

export default function ScanPage() {
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
    setLoadingMessage("Initializing brand analysis...");

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
        setLoadingMessage("Connecting to AI crawler nodes...");
      } else if (pct < 45) {
        setLoadingMessage("Scraping ChatGPT search indexes for brand citations...");
      } else if (pct < 65) {
        setLoadingMessage("Querying Gemini brand database & knowledge graph...");
      } else if (pct < 85) {
        setLoadingMessage("Extracting sentiment and context from Copilot & Claude...");
      } else {
        setLoadingMessage("Calculating relative visibility scores & content gaps...");
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
      setLoadingMessage("Analysis complete!");

      setTimeout(() => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        setShowResults(true);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during brand analysis.");
    }
  }, [websiteUrl, brandName, competitors]);

  const overviewData = analysisResult ? toOverviewMetrics(analysisResult) : null;
  const mentionData = analysisResult ? toAIMentionData(analysisResult) : null;
  const trendData = analysisResult ? toTrendData(analysisResult) : null;
  const competitorData = analysisResult ? toCompetitorData(analysisResult) : null;
  const actionItems = analysisResult ? toActionItems(analysisResult) : null;
  const opportunityItems = analysisResult ? toContentOpportunities(analysisResult) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Brand AI Scan</h1>
        <p className="text-sm text-muted-foreground">
          Benchmark visibility scores, metrics, and gaps across AI models.
        </p>
      </div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label htmlFor="scan-website-url" className="text-xs font-medium text-muted-foreground">
                  Website URL
                </label>
                <Input
                  id="scan-website-url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="scan-brand-name" className="text-xs font-medium text-muted-foreground">
                  Brand Name
                </label>
                <Input
                  id="scan-brand-name"
                  placeholder="Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="scan-competitors" className="text-xs font-medium text-muted-foreground">
                  Competitor Names
                </label>
                <Input
                  id="scan-competitors"
                  placeholder="Company A, Company B"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !websiteUrl.trim() || !brandName.trim()}
                  className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-pulse" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Analysis Failed</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">{error}</p>
              <Button
                onClick={() => setError(null)}
                variant="outline"
                className="mt-4 border-border/50 bg-background/50 text-xs hover:bg-muted"
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5"
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-purple-500/15 bg-purple-500/5"
                animate={{ scale: [1.2, 1.6, 1.2], opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 1 }}
              />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Activity className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="w-full max-w-md px-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">System Scan</span>
                <span className="text-xs font-bold text-foreground">{loadingProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary border border-border/30">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="h-10 mt-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium text-foreground"
                  >
                    {loadingMessage}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="text-xs text-muted-foreground">
                Scanning search engines, developer documentation, and public forums.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && !isAnalyzing && overviewData && mentionData && trendData && competitorData && actionItems && opportunityItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <OverviewCards data={overviewData} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <MentionChart data={mentionData} />
              <TrendChart data={trendData} />
            </div>
            <CompetitorTable data={competitorData} />
            <Insights actions={actionItems} opportunities={opportunityItems} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!showResults && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <Search className="h-7 w-7 text-indigo-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Ready to analyze</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Enter your website URL and brand name above to get a comprehensive AI visibility report across all major AI assistants.
          </p>
        </motion.div>
      )}
    </div>
  );
}
