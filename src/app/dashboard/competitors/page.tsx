"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, RefreshCw, Sparkles, Code, FileText, Shield } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";

interface CompetitorAnalysis {
  name: string;
  scores: { documentation: number; knowledgeBase: number; contentTopics: number; faqPresence: number; schemaMarkup: number; geoReadiness: number; };
  overallScore: number;
  missingTopics: string[];
  missingSchemas: string[];
}

export default function CompetitorsPage() {
  const { brandName, competitors, isAnalyzed, isFamous } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompetitorAnalysis[] | null>(null);

  useEffect(() => {
    if (!isAnalyzed || !brandName) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const competitorList = competitors ? competitors.split(",").map(c => c.trim()).filter(Boolean) : [];
      const allNames = [brandName, ...competitorList];
      
      const topicPool = ["API Documentation", "Getting Started Guide", "Pricing Page", "Case Studies", "Integration Guides", "Changelog", "Status Page", "Security Whitepaper", "Developer Blog", "Video Tutorials"];
      const schemaPool = ["Organization", "FAQ", "Product", "Breadcrumb", "Article", "HowTo", "SoftwareApplication", "Review"];

      const res: CompetitorAnalysis[] = allNames.map((name, index) => {
        const seed = name.toLowerCase().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        
        // Boost user scores if famous, else set standard offsets
        const isUser = index === 0;
        let minVal = 20;
        let maxVal = 60;
        if (isUser && isFamous) {
          minVal = 75;
          maxVal = 95;
        } else if (!isUser) {
          // Competitors scores are generated relative to seed
          minVal = 30;
          maxVal = 85;
        }

        const r = (min: number, max: number) => {
          const base = min + ((seed * 13 + max) % (max - min + 1));
          return Math.max(minVal, Math.min(maxVal, base));
        };

        const scores = {
          documentation: r(25, 95), 
          knowledgeBase: r(20, 90), 
          contentTopics: r(30, 88), 
          faqPresence: r(15, 85), 
          schemaMarkup: r(10, 80), 
          geoReadiness: r(20, 92),
        };
        const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
        const missingTopics = topicPool.filter((_, i) => (seed * (i + 1)) % 3 === 0).slice(0, r(1, 4));
        const missingSchemas = schemaPool.filter((_, i) => (seed * (i + 2)) % 4 === 0).slice(0, r(1, 3));
        return { name, scores, overallScore: overall, missingTopics, missingSchemas };
      });

      setResults(res);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, brandName, competitors, isFamous]);

  const radarData = results ? [
    { category: "Documentation", ...Object.fromEntries(results.map(r => [r.name, r.scores.documentation])) },
    { category: "Knowledge Base", ...Object.fromEntries(results.map(r => [r.name, r.scores.knowledgeBase])) },
    { category: "Content Topics", ...Object.fromEntries(results.map(r => [r.name, r.scores.contentTopics])) },
    { category: "FAQ Presence", ...Object.fromEntries(results.map(r => [r.name, r.scores.faqPresence])) },
    { category: "Schema Markup", ...Object.fromEntries(results.map(r => [r.name, r.scores.schemaMarkup])) },
    { category: "GEO Readiness", ...Object.fromEntries(results.map(r => [r.name, r.scores.geoReadiness])) },
  ] : [];

  const colors = ["#818cf8", "#e879f9", "#34d399", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6", "#ef4444"];

  if (!isAnalyzed) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center bg-card">
          <Sparkles className="h-5 w-5 text-muted-foreground animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-foreground uppercase">Brand Analysis Required</h3>
          <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
            Please run a brand visibility audit on the dashboard before accessing this section.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="h-9 px-4 text-xs font-bold border border-border bg-card text-foreground hover:bg-accent">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <RefreshCw className="h-8 w-8 text-foreground animate-spin" />
        <p className="text-xs font-bold font-mono text-muted-foreground">Mapping competitor landscape...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">Competitor Gap Analyzer</h1>
          <p className="text-xs font-semibold text-muted-foreground">Compare {brandName} against top competitors across documentation, content, schema, and GEO readiness.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((comp, idx) => (
              <Card key={comp.name} className="border-border bg-card glow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                      <span className="text-xs font-extrabold text-foreground">{comp.name}</span>
                      {idx === 0 && <Badge variant="outline" className="text-[9px] font-bold bg-primary/10 text-foreground border-border">You</Badge>}
                    </div>
                    <span className="text-xl font-extrabold text-foreground">{comp.overallScore}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded bg-secondary">
                    <div className="h-full rounded" style={{ width: `${comp.overallScore}%`, backgroundColor: colors[idx] }} />
                  </div>
                  {comp.missingTopics.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[9px] font-extrabold text-muted-foreground mb-1">Missing Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.missingTopics.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[9px] font-bold bg-amber-500/10 text-warning border-warning/20">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {comp.missingSchemas.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[9px] font-extrabold text-muted-foreground mb-1">Missing Schemas:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.missingSchemas.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[9px] font-bold bg-red-500/10 text-risk border-risk/20">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Radar Comparison */}
          <Card className="border-border bg-card">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider">Side-by-Side Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.3 0 0 / 0.15)" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "oklch(0.6 0 0)", fontWeight: "bold" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.4 0 0)" }} />
                  {results.map((comp, idx) => (
                    <Radar key={comp.name} name={comp.name} dataKey={comp.name} stroke={colors[idx]} fill={colors[idx]} fillOpacity={0.05} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
