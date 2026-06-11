"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  Calendar,
  Layers,
  Globe,
  CheckCircle,
  FileText,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScoreRing from "./score-ring";
import type { BrandVisibilityReport } from "@/actions/generate-report";

interface ProfessionalReportProps {
  report: BrandVisibilityReport;
  brandName: string;
  category: string;
}

export default function ProfessionalReport({
  report,
  brandName,
  category,
}: ProfessionalReportProps) {
  const [copied, setCopied] = useState(false);
  const { visibilitySummary, contentGapAnalysis, recommendedArticles, recommendedDirectories, aiSearchOptimizationStrategy } = report;

  // Formatting date of report generation
  const reportDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for priority badge styles
  const getPriorityStyles = (priority: string) => {
    const val = priority.toLowerCase();
    if (val === "critical") return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    if (val === "high") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
  };

  // Helper for search intent badge styles
  const getIntentStyles = (intent: string) => {
    const val = intent.toLowerCase();
    if (val === "high") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (val === "medium") return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
    return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  };

  // Helper for sentiment badge styles
  const getSentimentStyles = (sentiment: string) => {
    const val = sentiment.toLowerCase();
    if (val === "positive") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (val === "neutral") return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black print:p-0">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6 print:border-black/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/5 text-indigo-400 print:border-black print:text-black">
              Executive Intel Report
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {reportDate}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl print:text-black">
            {brandName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 print:text-black/70">
            AI Search Footprint & Optimization Diagnosis • {category}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 print:hidden">
          <Button
            onClick={handleCopyJSON}
            variant="outline"
            size="sm"
            className="h-8 border-border/50 bg-card/50 text-xs font-semibold hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                Copied JSON
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy JSON
              </>
            )}
          </Button>

          <Button
            onClick={handlePrint}
            className="glow-button h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-semibold text-white hover:from-indigo-500 hover:to-purple-500"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Print / Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Hero Score Metric Card */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-sm overflow-hidden print:border-black print:bg-transparent print:shadow-none">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl print:hidden" />
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 print:border print:border-black print:p-4 print:rounded-lg">
            <ScoreRing score={visibilitySummary.score} label="AI Visibility Index" size={170} />
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                LLM Sentiment Association:
              </span>
              <Badge variant="outline" className={`font-semibold ${getSentimentStyles(visibilitySummary.currentSentiment)}`}>
                {visibilitySummary.currentSentiment}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground print:text-black">
              Executive Evaluation
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground print:text-black print:text-justify">
              {visibilitySummary.executiveSummary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Content Gaps & Articles Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Content Gaps */}
        <Card className="border-border/50 bg-card/45 backdrop-blur-sm print:border-black print:bg-transparent">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-base font-semibold print:text-black">Content Gap Analysis</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Topics and search queries where LLM training models find a lack of brand presence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {contentGapAnalysis.map((gap, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background/50 border border-border/30 print:border-black/20 print:bg-transparent"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-semibold text-foreground print:text-black">
                    {gap.topic}
                  </h4>
                  <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getIntentStyles(gap.searchIntent)}`}>
                    {gap.searchIntent} Intent
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed print:text-black/80">
                  {gap.reasoning}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column: Recommended Articles */}
        <Card className="border-border/50 bg-card/45 backdrop-blur-sm print:border-black print:bg-transparent">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <CardTitle className="text-base font-semibold print:text-black">Recommended Editorial Action Items</CardTitle>
            </div>
            <CardDescription className="text-xs">
              High-signal articles to publish to overwrite these crawler gaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {recommendedArticles.map((article, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-background/50 border border-border/30 print:border-black/20 print:bg-transparent"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-semibold text-foreground leading-snug print:text-black">
                    {article.title}
                  </h4>
                  <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${getPriorityStyles(article.priority)}`}>
                    {article.priority}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[10px] text-muted-foreground mr-1 self-center">Keywords:</span>
                  {article.targetKeywords.map((kw, kwIdx) => (
                    <Badge
                      key={kwIdx}
                      variant="secondary"
                      className="text-[9px] py-0 px-1.5 bg-secondary/80 text-muted-foreground print:border-black/10 print:text-black"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. LLM Crawler Indexes Table */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-sm print:border-black print:bg-transparent">
        <CardHeader className="p-6">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            <CardTitle className="text-base font-semibold print:text-black">LLM Crawler & Entity Directories</CardTitle>
          </div>
          <CardDescription className="text-xs">
            External registries and databases training crawlers rely on to formulate knowledge graphs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent print:border-black">
                  <TableHead className="text-xs print:text-black font-semibold">Directory Registry</TableHead>
                  <TableHead className="text-xs print:text-black font-semibold">Crawler Importance</TableHead>
                  <TableHead className="text-xs print:text-black font-semibold">LLM Citation Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendedDirectories.map((dir, index) => (
                  <TableRow
                    key={index}
                    className="border-border/40 hover:bg-muted/10 print:border-black/10 print:hover:bg-transparent"
                  >
                    <TableCell className="font-semibold text-sm text-foreground print:text-black">
                      {dir.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 print:text-black print:border-black"
                      >
                        {dir.importance}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground leading-relaxed print:text-black/80 max-w-sm">
                      {dir.rationale}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Strategic Roadmap (Modern steps component) */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-sm print:border-black print:bg-transparent">
        <CardHeader className="p-6">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <CardTitle className="text-base font-semibold print:text-black">AI Search Optimization Strategy</CardTitle>
          </div>
          <CardDescription className="text-xs">
            A step-by-step roadmap to align website code, markup, and schema for index ingestion.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="relative pl-6 border-l border-indigo-500/20 space-y-8 ml-3 print:border-black/20">
            {aiSearchOptimizationStrategy.map((strat, index) => (
              <div key={index} className="relative">
                {/* Step number marker */}
                <div className="absolute -left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow shadow-indigo-500/20 print:from-black print:to-black">
                  {index + 1}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider print:text-black">
                    {strat.pillar}
                  </h4>
                  <ul className="space-y-2.5">
                    {strat.actionableSteps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-2 text-xs text-muted-foreground print:text-black">
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5 print:text-black" />
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
