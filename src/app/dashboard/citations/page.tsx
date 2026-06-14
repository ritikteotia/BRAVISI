"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Activity,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [brandName, setBrandName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<CitationMetrics | null>(null);
  const [progress, setProgress] = useState(0);

  const runCheck = useCallback(async () => {
    if (!brandName.trim()) return;
    setIsRunning(true);
    setProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(95, (elapsed / 3000) * 95));
    }, 50);

    // Simulated AI citation check
    await new Promise((r) => setTimeout(r, 3000));
    clearInterval(interval);
    setProgress(100);

    const brand = brandName.toLowerCase();
    const seed = brand.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = (min: number, max: number) => min + ((seed * 13 + max) % (max - min + 1));

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

    setTimeout(() => setIsRunning(false), 300);
  }, [brandName]);

  const radarData = metrics?.results.map((r) => ({
    model: r.model,
    "Citation Score": r.score,
    "Recommendation Rate": r.recommendationRate,
    "Mention Count": Math.min(100, Math.round(r.mentions * 1.2)),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Citation Tracking</h1>
        <p className="text-sm text-muted-foreground">Track brand mentions across ChatGPT, Gemini, Claude, and Copilot in real-time.</p>
      </div>

      {/* Input */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Brand Name</label>
              <Input placeholder="Your Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Custom Prompt (optional)</label>
              <Input placeholder="Best payment gateway for SaaS" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={runCheck} disabled={isRunning || !brandName.trim()} className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                {isRunning ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Checking…</> : <><Search className="mr-2 h-4 w-4" /> Run Check</>}
              </Button>
            </div>
          </div>
          {isRunning && (
            <div className="mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {metrics && !isRunning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Model Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.results.map((result) => (
              <Card key={result.model} className="border-border/50 bg-card/50 backdrop-blur-sm glow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">{result.model}</span>
                    <Badge variant="outline" className={`text-[10px] ${result.sentiment === "Positive" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-amber-500/10 text-amber-400 border-amber-500/25"}`}>
                      {result.sentiment}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{result.score}%</div>
                  <p className="text-xs text-muted-foreground">{result.mentions} mentions found</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result.score}%`, backgroundColor: result.color }} />
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
              <Card key={m.label} className="border-border/50 bg-card/50">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">{m.value}{m.suffix}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-semibold">Citation Score by Model</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={metrics.results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
                    <XAxis dataKey="model" tick={{ fontSize: 12, fill: "oklch(0.5 0 0)" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "oklch(0.5 0 0)" }} />
                    <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {metrics.results.map((entry) => (
                        <Bar key={entry.model} dataKey="score" fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-semibold">Model Comparison Radar</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(0.3 0 0 / 0.3)" />
                    <PolarAngleAxis dataKey="model" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.4 0 0)" }} />
                    <Radar name="Citation Score" dataKey="Citation Score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} />
                    <Radar name="Recommendation" dataKey="Recommendation Rate" stroke="#e879f9" fill="#e879f9" fillOpacity={0.1} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <CardTitle className="text-sm font-semibold">Actionable Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              {metrics.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400">{i + 1}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
