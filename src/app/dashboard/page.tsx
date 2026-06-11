"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  ArrowLeft,
  AlertCircle,
  FileText,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import OverviewCards from "@/components/dashboard/overview-cards";
import MentionChart from "@/components/dashboard/mention-chart";
import TrendChart from "@/components/dashboard/trend-chart";
import CompetitorTable from "@/components/dashboard/competitor-table";
import Insights from "@/components/dashboard/insights";
import ProfessionalReport from "@/components/dashboard/professional-report";

import { analyzeBrandVisibility } from "@/actions/analyze-brand";
import { generateReport } from "@/actions/generate-report";
import type { AnalysisResult } from "@/lib/schemas";
import type { BrandVisibilityReport } from "@/actions/generate-report";

import {
  toOverviewMetrics,
  toAIMentionData,
  toCompetitorData,
  toActionItems,
  toContentOpportunities,
  toTrendData,
} from "@/lib/mappers";

import {
  mockOverview,
  mockAIMentions,
  mockCompetitors,
  mockActions,
  mockOpportunities,
  mockTrendData,
} from "@/lib/data";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"scan" | "report">("scan");

  // ── Metrics Scan Form States ──
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // ── Executive Report Form States ──
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportResults, setShowReportResults] = useState(false);
  const [reportResult, setReportResult] = useState<BrandVisibilityReport | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportMessage, setReportMessage] = useState("");

  // ── Scan Action ──
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

    let progress = 0;
    const startTime = Date.now();
    const expectedDuration = 3000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, (elapsed / expectedDuration) * 98);
      progress = pct;
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

  // ── Executive Report Action ──
  const handleGenerateReport = useCallback(async () => {
    if (!websiteDescription.trim() || !brandCategory.trim() || !brandName.trim()) return;
    setIsGeneratingReport(true);
    setShowReportResults(false);
    setReportError(null);
    setReportProgress(0);
    setReportMessage("Initializing Gemini agent...");

    const competitorList = competitors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    let progress = 0;
    const startTime = Date.now();
    const expectedDuration = 4500; // Gemini generation duration

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, (elapsed / expectedDuration) * 98);
      progress = pct;
      setReportProgress(Math.round(pct));

      if (pct < 25) {
        setReportMessage("Initializing Gemini 2.5 Flash agent...");
      } else if (pct < 50) {
        setReportMessage("Synthesizing content crawls & LLM corpus overlap...");
      } else if (pct < 75) {
        setReportMessage("Analyzing semantic gaps & target keywords...");
      } else if (pct < 95) {
        setReportMessage("Formulating step-by-step entity roadmaps...");
      } else {
        setReportMessage("Formatting structured JSON output...");
      }
    }, 50);

    try {
      const result = await generateReport(
        websiteDescription.trim(),
        brandCategory.trim(),
        competitorList
      );
      clearInterval(progressInterval);
      setReportProgress(100);
      setReportMessage("Report generated successfully!");

      setTimeout(() => {
        setReportResult(result);
        setIsGeneratingReport(false);
        setShowReportResults(true);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setIsGeneratingReport(false);
      console.error(err);
      setReportError(
        err instanceof Error ? err.message : "An unexpected error occurred while generating report."
      );
    }
  }, [websiteDescription, brandCategory, brandName, competitors]);

  // ── Mappers binding for Metrics Scan ──
  const overviewData = analysisResult ? toOverviewMetrics(analysisResult) : mockOverview;
  const mentionData = analysisResult ? toAIMentionData(analysisResult) : mockAIMentions;
  const trendData = analysisResult ? toTrendData(analysisResult) : mockTrendData;
  const competitorData = analysisResult ? toCompetitorData(analysisResult) : mockCompetitors;
  const actionItems = analysisResult ? toActionItems(analysisResult) : mockActions;
  const opportunityItems = analysisResult ? toContentOpportunities(analysisResult) : mockOpportunities;

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50 print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Activity className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                BRAVISI
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">/</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Dashboard
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border/50 mb-8 gap-6 print:hidden">
          <button
            onClick={() => setActiveTab("scan")}
            className={`pb-3 text-sm font-semibold relative transition-colors ${
              activeTab === "scan" ? "text-indigo-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Metrics Scan
            </span>
            {activeTab === "scan" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`pb-3 text-sm font-semibold relative transition-colors ${
              activeTab === "report" ? "text-indigo-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Executive Report
            </span>
            {activeTab === "report" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
              />
            )}
          </button>
        </div>

        {/* ── METRICS SCAN TAB ── */}
        {activeTab === "scan" && (
          <div className="space-y-6">
            {/* Input Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="print:hidden"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-8">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h1 className="text-lg font-semibold text-foreground">
                      Brand AI Scan
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Benchmark visibility scores, metrics, and gaps across models.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="website-url"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Website URL
                      </label>
                      <Input
                        id="website-url"
                        placeholder="https://example.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="brand-name"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Brand Name
                      </label>
                      <Input
                        id="brand-name"
                        placeholder="Acme Corp"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="competitors"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Competitor Names
                      </label>
                      <Input
                        id="competitors"
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
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 print:hidden"
              >
                <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">Analysis Failed</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-md">
                      {error}
                    </p>
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
                  className="flex flex-col items-center justify-center py-20 text-center print:hidden"
                >
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-purple-500/15 bg-purple-500/5"
                      animate={{
                        scale: [1.2, 1.6, 1.2],
                        opacity: [0.1, 0.5, 0.1],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: 1,
                      }}
                    />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                      <Activity className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="w-full max-w-md px-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        System Scan
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {loadingProgress}%
                      </span>
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
              {showResults && !isAnalyzing && (
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

                  <Insights
                    actions={actionItems}
                    opportunities={opportunityItems}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!showResults && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center print:hidden"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <Search className="h-7 w-7 text-indigo-400" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">
                  Ready to analyze
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Enter your website URL and brand name above to get a comprehensive
                  AI visibility report across all major AI assistants.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ── EXECUTIVE REPORT TAB ── */}
        {activeTab === "report" && (
          <div className="space-y-6 animate-fade-in">
            {/* Input Form (Only show when not loading or showing results) */}
            {!showReportResults && !isGeneratingReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="print:hidden"
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        AI Search & Engine Optimization Diagnosis
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Leverage Gemini 2.5 models to generate a formatted B2B report of LLM gaps, crawls, and roadmaps.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Brand Name Input */}
                      <div className="space-y-1.5">
                        <label htmlFor="report-brand-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Brand Name
                        </label>
                        <Input
                          id="report-brand-name"
                          placeholder="e.g. Acme Corp"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50"
                        />
                      </div>

                      {/* Brand Category Input */}
                      <div className="space-y-1.5">
                        <label htmlFor="report-brand-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Brand Category
                        </label>
                        <Input
                          id="report-brand-category"
                          placeholder="e.g. AI Analytics / B2B SaaS"
                          value={brandCategory}
                          onChange={(e) => setBrandCategory(e.target.value)}
                          className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50"
                        />
                      </div>

                      {/* Competitors Input */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="report-competitors" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Competitor Names (comma separated)
                        </label>
                        <Input
                          id="report-competitors"
                          placeholder="e.g. Competitor A, Competitor B"
                          value={competitors}
                          onChange={(e) => setCompetitors(e.target.value)}
                          className="h-9 border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50"
                        />
                      </div>

                      {/* Website Description Textarea */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label htmlFor="report-web-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Website Description & Product Summary
                        </label>
                        <textarea
                          id="report-web-desc"
                          rows={4}
                          placeholder="Acme Corp is a real-time analytics provider offering low latency time-series databases for developers. We specialize in..."
                          value={websiteDescription}
                          onChange={(e) => setWebsiteDescription(e.target.value)}
                          className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport || !websiteDescription.trim() || !brandCategory.trim() || !brandName.trim()}
                        className="glow-button rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Generate Executive Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Report Error State */}
            {reportError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 print:hidden"
              >
                <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">Report Generation Failed</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-md">
                      {reportError}
                    </p>
                    <Button
                      onClick={() => setReportError(null)}
                      variant="outline"
                      className="mt-4 border-border/50 bg-background/50 text-xs hover:bg-muted"
                    >
                      Dismiss
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Report Loading State */}
            <AnimatePresence mode="wait">
              {isGeneratingReport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center py-20 text-center print:hidden"
                >
                  {/* Pulsing AI Scanner Effect */}
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-purple-500/15 bg-purple-500/5"
                      animate={{
                        scale: [1.2, 1.6, 1.2],
                        opacity: [0.1, 0.5, 0.1],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: 1,
                      }}
                    />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                      <FileText className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="w-full max-w-md px-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        AI Synthesis Progress
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {reportProgress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary border border-border/30">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
                        style={{ width: `${reportProgress}%` }}
                      />
                    </div>

                    {/* Animated status message */}
                    <div className="h-10 mt-6">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={reportMessage}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-medium text-foreground"
                        >
                          {reportMessage}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Running dynamic entity extraction and semantic overlap analysis.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Report Results */}
            {showReportResults && reportResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Back Link to Form */}
                <div className="mb-2 flex justify-between items-center print:hidden">
                  <Button
                    onClick={() => {
                      setReportResult(null);
                      setShowReportResults(false);
                    }}
                    variant="link"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 p-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Configure New Report
                  </Button>
                </div>

                {/* Professional Report Display */}
                <ProfessionalReport
                  report={reportResult}
                  brandName={brandName}
                  category={brandCategory}
                />
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
