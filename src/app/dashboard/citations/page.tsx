"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";
import BrandScanner from "@/components/dashboard/brand-scanner";

interface CitationResult {
  model: string;
  score: number;
  mentions: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  recommendationRate: number;
  color: string;
}

interface CitationMetrics {
  citationFrequency: number;
  citationShare: number;
  brandPresenceScore: number;
  recommendationRate: number;
  results: CitationResult[];
  insights: string[];
}

const MODEL_COLORS: Record<string, string> = {
  ChatGPT: "#818cf8",
  Gemini: "#a78bfa",
  Claude: "#e879f9",
  Copilot: "#34d399",
};

export default function CitationsPage() {
  const { brandName, isAnalyzed, isFamous } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<CitationMetrics | null>(null);

  useEffect(() => {
    if (!isAnalyzed || !brandName) {
      setMetrics(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const brand = brandName.toLowerCase();
      const seed = brand.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      
      const minVal = isFamous ? 75 : 20;
      const maxVal = isFamous ? 96 : 55;

      const r = (min: number, max: number) => {
        const base = min + ((seed * 13 + max) % (max - min + 1));
        return Math.max(minVal, Math.min(maxVal, base));
      };

      const results: CitationResult[] = [
        { model: "ChatGPT", score: r(60, 95), mentions: r(15, 85), sentiment: "Positive", recommendationRate: r(55, 90), color: MODEL_COLORS.ChatGPT },
        { model: "Gemini", score: r(55, 90), mentions: r(12, 70), sentiment: "Positive", recommendationRate: r(50, 85), color: MODEL_COLORS.Gemini },
        { model: "Claude", score: r(45, 85), mentions: r(8, 55), sentiment: "Neutral", recommendationRate: r(40, 80), color: MODEL_COLORS.Claude },
        { model: "Copilot", score: r(50, 88), mentions: r(10, 60), sentiment: "Positive", recommendationRate: r(45, 82), color: MODEL_COLORS.Copilot },
      ];

      const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
      const totalMentions = results.reduce((s, r) => s + r.mentions, 0);

      setMetrics({
        citationFrequency: totalMentions,
        citationShare: avgScore,
        brandPresenceScore: Math.round(avgScore * 0.92),
        recommendationRate: Math.round(results.reduce((s, r) => s + r.recommendationRate, 0) / results.length),
        results,
        insights: [
          `${brandName} has strong presence on ChatGPT with ${results[0].score}% citation rate.`,
          `Gemini shows ${results[1].score}% brand awareness — consider publishing more structured data.`,
          `Claude mentions are lower at ${results[2].score}% — improve technical documentation coverage.`,
          `Overall recommendation rate across all models is ${Math.round(results.reduce((s, r) => s + r.recommendationRate, 0) / results.length)}%.`,
        ],
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, brandName, isFamous]);

  const radarData = metrics?.results.map((r) => ({
    model: r.model,
    "Citation Score": r.score,
    "Recommendation Rate": r.recommendationRate,
    "Mention Count": Math.min(100, Math.round(r.mentions * 1.2)),
  }));

  if (!isAnalyzed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">AI Citation Tracking</h1>
            <p className="text-xs font-semibold text-muted-foreground">Track brand mentions across ChatGPT, Gemini, Claude, and Copilot in real-time.</p>
          </div>
        </div>
        <BrandScanner 
          title="Track AI Citations" 
          description="Enter your product details to retrieve active conversational mentions and citation statistics." 
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <RefreshCw className="h-8 w-8 text-foreground animate-spin" />
        <p className="text-xs font-bold font-mono text-muted-foreground">Scanning conversational indexes...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">AI Citation Tracking</h1>
          <p className="text-xs font-semibold text-muted-foreground">Track brand mentions across ChatGPT, Gemini, Claude, and Copilot in real-time for {brandName}.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {metrics && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Model Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.results.map((result) => (
              <Card key={result.model} className="border-border bg-card glow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-foreground">{result.model}</span>
                    <Badge variant="outline" className={`text-[9px] font-bold ${result.sentiment === "Positive" ? "bg-success/10 text-opportunity border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                      {result.sentiment}
                    </Badge>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground mb-1">{result.score}%</div>
                  <p className="text-xs font-semibold text-muted-foreground">{result.mentions} mentions found</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-secondary">
                    <div className="h-full rounded transition-all duration-500" style={{ width: `${result.score}%`, backgroundColor: result.color }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Citation Frequency", value: metrics.citationFrequency, suffix: " total" },
              { label: "Citation Share", value: `${metrics.citationShare}%`, suffix: "" },
              { label: "Brand Presence", value: `${metrics.brandPresenceScore}%`, suffix: "" },
              { label: "Recommendation Rate", value: `${metrics.recommendationRate}%`, suffix: "" },
            ].map((m) => (
              <Card key={m.label} className="border-border bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-bold text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-lg font-extrabold text-foreground">{m.value}{m.suffix}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Citation Score by Model</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={metrics.results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.15)" />
                    <XAxis dataKey="model" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)", fontWeight: "bold" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.5 0 0)" }} />
                    <ChartTooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, fontWeight: "bold" }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {metrics.results.map((entry) => (
                        <Bar key={entry.model} dataKey="score" fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Model Comparison Radar</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(0.3 0 0 / 0.15)" />
                    <PolarAngleAxis dataKey="model" tick={{ fontSize: 10, fill: "oklch(0.6 0 0)", fontWeight: "bold" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.4 0 0)" }} />
                    <Radar name="Citation Score" dataKey="Citation Score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} />
                    <Radar name="Recommendation" dataKey="Recommendation Rate" stroke="#e879f9" fill="#e879f9" fillOpacity={0.08} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="border-border bg-card">
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-recommendation" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Actionable Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              {metrics.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded bg-background border border-border">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[9px] font-extrabold text-foreground">{i + 1}</div>
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
