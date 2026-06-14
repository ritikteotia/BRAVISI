"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Activity,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalReport from "@/components/dashboard/professional-report";
import { generateReport } from "@/actions/generate-report";
import type { BrandVisibilityReport } from "@/actions/generate-report";

export default function ReportsPage() {
  const [brandName, setBrandName] = useState("");
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [reportResult, setReportResult] = useState<BrandVisibilityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!websiteDescription.trim() || !brandCategory.trim() || !brandName.trim()) return;
    setIsGenerating(true);
    setShowResults(false);
    setError(null);
    setProgress(0);
    setMessage("Initializing Gemini agent...");

    const competitorList = competitors.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
    const startTime = Date.now();
    const expectedDuration = 4500;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, (elapsed / expectedDuration) * 98);
      setProgress(Math.round(pct));
      if (pct < 25) setMessage("Initializing Gemini 2.5 Flash agent...");
      else if (pct < 50) setMessage("Synthesizing content crawls & LLM corpus overlap...");
      else if (pct < 75) setMessage("Analyzing semantic gaps & target keywords...");
      else if (pct < 95) setMessage("Formulating step-by-step entity roadmaps...");
      else setMessage("Formatting structured JSON output...");
    }, 50);

    try {
      const result = await generateReport(websiteDescription.trim(), brandCategory.trim(), competitorList);
      clearInterval(progressInterval);
      setProgress(100);
      setMessage("Report generated successfully!");
      setTimeout(() => {
        setReportResult(result);
        setIsGenerating(false);
        setShowResults(true);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while generating report.");
    }
  }, [websiteDescription, brandCategory, brandName, competitors]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Report</h1>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered brand visibility reports using Gemini 2.5 Flash.
        </p>
      </div>

      {/* Input Form */}
      {!showResults && !isGenerating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="rpt-brand-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Name</label>
                  <Input id="rpt-brand-name" placeholder="e.g. Acme Corp" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="rpt-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Category</label>
                  <Input id="rpt-category" placeholder="e.g. AI Analytics / B2B SaaS" value={brandCategory} onChange={(e) => setBrandCategory(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="rpt-competitors" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Competitor Names</label>
                  <Input id="rpt-competitors" placeholder="e.g. Competitor A, Competitor B" value={competitors} onChange={(e) => setCompetitors(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="rpt-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website Description</label>
                  <textarea id="rpt-desc" rows={4} placeholder="Describe your brand, products, and target market..." value={websiteDescription} onChange={(e) => setWebsiteDescription(e.target.value)} className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-indigo-500/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/20" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleGenerate} disabled={isGenerating || !websiteDescription.trim() || !brandCategory.trim() || !brandName.trim()} className="glow-button rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50">
                  Generate Executive Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <AlertCircle className="h-6 w-6 text-red-400 mb-3" />
            <h3 className="text-base font-semibold text-foreground">Report Generation Failed</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">{error}</p>
            <Button onClick={() => setError(null)} variant="outline" className="mt-4 text-xs">Dismiss</Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <motion.div className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5" animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }} />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <FileText className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="w-full max-w-md px-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">AI Synthesis</span>
                <span className="text-xs font-bold text-foreground">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary border border-border/30">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm font-medium text-foreground mt-6">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {showResults && reportResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Button onClick={() => { setReportResult(null); setShowResults(false); }} variant="link" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 p-0">
            <ArrowLeft className="h-3.5 w-3.5" /> Configure New Report
          </Button>
          <ProfessionalReport report={reportResult} brandName={brandName} category={brandCategory} />
        </motion.div>
      )}
    </div>
  );
}
