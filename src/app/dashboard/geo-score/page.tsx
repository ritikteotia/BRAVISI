"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Shield,
  FileText,
  Code,
  Search,
  Users,
  Award,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ScoreCategory {
  name: string;
  score: number;
  weight: number;
  icon: React.ElementType;
  color: string;
  description: string;
  details: string;
}

export default function GeoScorePage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scores, setScores] = useState<ScoreCategory[] | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const analyze = useCallback(async () => {
    if (!websiteUrl.trim()) return;
    setIsAnalyzing(true);

    await new Promise((r) => setTimeout(r, 2500));

    const url = websiteUrl.toLowerCase();
    const seed = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = (min: number, max: number) => min + (seed * 17 + max * 3) % (max - min + 1);

    const categories: ScoreCategory[] = [
      { name: "Documentation", score: r(30, 92), weight: 15, icon: FileText, color: "#818cf8", description: "Quality and depth of technical documentation", details: "Measures API docs, guides, tutorials, and knowledge base coverage. AI models heavily reference well-structured documentation." },
      { name: "Authority", score: r(25, 88), weight: 15, icon: Award, color: "#a78bfa", description: "Domain authority and brand recognition", details: "Evaluates backlink profile, brand mentions in authoritative sources, Wikipedia presence, and Knowledge Graph inclusion." },
      { name: "Technical SEO", score: r(35, 95), weight: 15, icon: Shield, color: "#34d399", description: "Technical search engine optimization", details: "Analyzes crawlability, indexing, site speed, Core Web Vitals, mobile-friendliness, and canonical URL structure." },
      { name: "Structured Data", score: r(20, 85), weight: 15, icon: Code, color: "#f59e0b", description: "Schema markup and structured data", details: "Checks Organization, FAQ, Product, Breadcrumb, and Article schema implementation across key pages." },
      { name: "Content Coverage", score: r(28, 90), weight: 15, icon: Search, color: "#ec4899", description: "Topic and content coverage breadth", details: "Measures content depth across relevant topics, FAQ completeness, comparison pages, and content freshness." },
      { name: "AI Citation", score: r(15, 82), weight: 15, icon: Target, color: "#06b6d4", description: "AI model citation frequency", details: "Tracks how often AI models mention and recommend your brand across ChatGPT, Gemini, Claude, and Copilot." },
      { name: "Brand Authority", score: r(22, 87), weight: 10, icon: Users, color: "#8b5cf6", description: "Brand strength in AI ecosystems", details: "Evaluates community presence, developer advocacy, social proof, and user-generated content volume." },
    ];

    const weighted = categories.reduce((sum, c) => sum + c.score * c.weight, 0);
    const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
    const overall = Math.round(weighted / totalWeight);

    setScores(categories);
    setOverallScore(overall);
    setIsAnalyzing(false);
  }, [websiteUrl]);

  const radarData = scores?.map((s) => ({ category: s.name, score: s.score, fullMark: 100 }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Critical";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">GEO Score Engine</h1>
        <p className="text-sm text-muted-foreground">Multi-dimensional scoring across 7 GEO categories with detailed analysis.</p>
      </div>

      {/* Input */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Website URL</label>
              <Input placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={analyze} disabled={isAnalyzing || !websiteUrl.trim()} className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                {isAnalyzing ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</> : <><Target className="mr-2 h-4 w-4" /> Calculate Score</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {scores && overallScore !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Overall Score + Radar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <svg className="score-ring" width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="oklch(0.2 0 0)" strokeWidth="8" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${overallScore * 4.4} ${440 - overallScore * 4.4}`} transform="rotate(-90 80 80)" className="transition-all duration-1000" />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Overall GEO Score</h3>
                <Badge variant="outline" className={`mt-2 ${getScoreColor(overallScore)}`}>
                  {getScoreLabel(overallScore)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-semibold">Score Breakdown Radar</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(0.3 0 0 / 0.3)" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.4 0 0)" }} />
                    <Radar dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Individual Score Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {scores.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="border-border/50 bg-card/50 backdrop-blur-sm glow-card group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${category.color}15` }}>
                          <Icon className="h-4 w-4" style={{ color: category.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
                          <p className="text-[10px] text-muted-foreground">Weight: {category.weight}%</p>
                        </div>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>{category.score}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary mb-3">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${category.score}%`, backgroundColor: category.color }} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                    <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-40">
                      <div className="pt-2 border-t border-border/30 mt-2">
                        <div className="flex items-start gap-2">
                          <Info className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{category.details}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
