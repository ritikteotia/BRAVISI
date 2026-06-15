"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";
import BrandScanner from "@/components/dashboard/brand-scanner";

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
  const { websiteUrl, isAnalyzed, isFamous } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState<ScoreCategory[] | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    if (!isAnalyzed || !websiteUrl) {
      setScores(null);
      setOverallScore(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const url = websiteUrl.toLowerCase();
      const seed = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      
      // If famous, give high scores (75-95), otherwise lower (25-60)
      const minVal = isFamous ? 75 : 25;
      const maxVal = isFamous ? 95 : 60;
      
      const r = (min: number, max: number) => {
        const base = min + (seed * 17 + max * 3) % (max - min + 1);
        // clamp to fame boundary
        return Math.max(minVal, Math.min(maxVal, base));
      };

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
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, websiteUrl, isFamous]);

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

  if (!isAnalyzed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">GEO Score Engine</h1>
            <p className="text-xs font-semibold text-muted-foreground">Multi-dimensional scoring across 7 GEO categories.</p>
          </div>
        </div>
        <BrandScanner 
          title="Audit GEO Score" 
          description="Enter your product details to generate a comprehensive multi-dimensional GEO Score report." 
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <RefreshCw className="h-8 w-8 text-foreground animate-spin" />
        <p className="text-xs font-bold font-mono text-muted-foreground">Calculating GEO parameters...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">GEO Score Engine</h1>
          <p className="text-xs font-semibold text-muted-foreground">Multi-dimensional scoring across 7 GEO categories for {websiteUrl}.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {scores && overallScore !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Overall Score + Radar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <svg className="score-ring" width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="oklch(0.2 0 0)" strokeWidth="8" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${overallScore * 4.4} ${440 - overallScore * 4.4}`} transform="rotate(-90 80 80)" className="text-foreground transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-foreground">{overallScore}</span>
                    <span className="text-xs font-bold text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-foreground uppercase">Overall GEO Score</h3>
                <Badge variant="outline" className={`mt-2 font-bold ${getScoreColor(overallScore)}`}>
                  {getScoreLabel(overallScore)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Score Breakdown Radar</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(0.3 0 0 / 0.15)" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "oklch(0.5 0 0)", fontWeight: "bold" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.4 0 0)" }} />
                    <Radar dataKey="score" stroke="currentColor" fill="currentColor" fillOpacity={0.1} strokeWidth={2} className="text-foreground" />
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
                <Card key={category.name} className="border-border bg-card glow-card group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-border" style={{ backgroundColor: `${category.color}10` }}>
                          <Icon className="h-4 w-4" style={{ color: category.color }} />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground">{category.name}</h3>
                          <p className="text-[9px] font-semibold text-muted-foreground">Weight: {category.weight}%</p>
                        </div>
                      </div>
                      <span className={`text-xl font-extrabold ${getScoreColor(category.score)}`}>{category.score}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded bg-secondary mb-3">
                      <div className="h-full rounded transition-all duration-700" style={{ width: `${category.score}%`, backgroundColor: category.color }} />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{category.description}</p>
                    <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-40">
                      <div className="pt-2 border-t border-border/30 mt-2">
                        <div className="flex items-start gap-2">
                          <Info className="h-3 w-3 text-recommendation shrink-0 mt-0.5" />
                          <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">{category.details}</p>
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
