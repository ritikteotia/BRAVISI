"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, RefreshCw, Plus, X, ArrowUpRight, ArrowDownRight, Minus, BarChart3, Sparkles, AlertTriangle, CheckCircle, FileText, Code, HelpCircle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CompetitorAnalysis {
  name: string;
  scores: { documentation: number; knowledgeBase: number; contentTopics: number; faqPresence: number; schemaMarkup: number; geoReadiness: number; };
  overallScore: number;
  missingTopics: string[];
  missingSchemas: string[];
}

export default function CompetitorsPage() {
  const [brandName, setBrandName] = useState("");
  const [competitorInputs, setCompetitorInputs] = useState<string[]>([""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CompetitorAnalysis[] | null>(null);

  const addCompetitor = () => { if (competitorInputs.length < 10) setCompetitorInputs([...competitorInputs, ""]); };
  const removeCompetitor = (idx: number) => setCompetitorInputs(competitorInputs.filter((_, i) => i !== idx));
  const updateCompetitor = (idx: number, val: string) => { const n = [...competitorInputs]; n[idx] = val; setCompetitorInputs(n); };

  const analyze = useCallback(async () => {
    if (!brandName.trim()) return;
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));

    const allNames = [brandName, ...competitorInputs.filter(c => c.trim())];
    const topicPool = ["API Documentation", "Getting Started Guide", "Pricing Page", "Case Studies", "Integration Guides", "Changelog", "Status Page", "Security Whitepaper", "Developer Blog", "Video Tutorials"];
    const schemaPool = ["Organization", "FAQ", "Product", "Breadcrumb", "Article", "HowTo", "SoftwareApplication", "Review"];

    const res: CompetitorAnalysis[] = allNames.map((name) => {
      const seed = name.toLowerCase().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const r = (min: number, max: number) => min + ((seed * 13 + max) % (max - min + 1));
      const scores = {
        documentation: r(25, 95), knowledgeBase: r(20, 90), contentTopics: r(30, 88), faqPresence: r(15, 85), schemaMarkup: r(10, 80), geoReadiness: r(20, 92),
      };
      const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
      const missingTopics = topicPool.filter((_, i) => (seed * (i + 1)) % 3 === 0).slice(0, r(1, 4));
      const missingSchemas = schemaPool.filter((_, i) => (seed * (i + 2)) % 4 === 0).slice(0, r(1, 3));
      return { name, scores, overallScore: overall, missingTopics, missingSchemas };
    });

    setResults(res);
    setIsAnalyzing(false);
  }, [brandName, competitorInputs]);

  const radarData = results ? [
    { category: "Documentation", ...Object.fromEntries(results.map(r => [r.name, r.scores.documentation])) },
    { category: "Knowledge Base", ...Object.fromEntries(results.map(r => [r.name, r.scores.knowledgeBase])) },
    { category: "Content Topics", ...Object.fromEntries(results.map(r => [r.name, r.scores.contentTopics])) },
    { category: "FAQ Presence", ...Object.fromEntries(results.map(r => [r.name, r.scores.faqPresence])) },
    { category: "Schema Markup", ...Object.fromEntries(results.map(r => [r.name, r.scores.schemaMarkup])) },
    { category: "GEO Readiness", ...Object.fromEntries(results.map(r => [r.name, r.scores.geoReadiness])) },
  ] : [];

  const colors = ["#818cf8", "#e879f9", "#34d399", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6", "#ef4444"];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Competitor Gap Analyzer</h1>
        <p className="text-sm text-muted-foreground">Compare up to 10 competitors across documentation, content, schema, and GEO readiness.</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Your Brand</label>
            <Input placeholder="Your Brand Name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Competitors ({competitorInputs.length}/10)</label>
            {competitorInputs.map((comp, idx) => (
              <div key={idx} className="flex gap-2">
                <Input placeholder={`Competitor ${idx + 1}`} value={comp} onChange={(e) => updateCompetitor(idx, e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
                {competitorInputs.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeCompetitor(idx)} className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {competitorInputs.length < 10 && (
              <Button variant="outline" size="sm" onClick={addCompetitor} className="text-xs h-8 border-dashed">
                <Plus className="mr-1 h-3 w-3" /> Add Competitor
              </Button>
            )}
          </div>
          <Button onClick={analyze} disabled={isAnalyzing || !brandName.trim()} className="glow-button h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
            {isAnalyzing ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</> : <><Users className="mr-2 h-4 w-4" /> Analyze Competitors</>}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((comp, idx) => (
              <Card key={comp.name} className="border-border/50 bg-card/50 backdrop-blur-sm glow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                      <span className="text-sm font-semibold text-foreground">{comp.name}</span>
                      {idx === 0 && <Badge variant="outline" className="text-[9px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">You</Badge>}
                    </div>
                    <span className="text-2xl font-bold text-foreground">{comp.overallScore}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${comp.overallScore}%`, backgroundColor: colors[idx] }} />
                  </div>
                  {comp.missingTopics.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">Missing Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.missingTopics.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/20">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {comp.missingSchemas.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">Missing Schemas:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.missingSchemas.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Radar Comparison */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-sm font-semibold">Side-by-Side Comparison</CardTitle>
              <CardDescription className="text-xs">Radar view across 6 scoring dimensions</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.3 0 0 / 0.3)" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.4 0 0)" }} />
                  {results.map((comp, idx) => (
                    <Radar key={comp.name} name={comp.name} dataKey={comp.name} stroke={colors[idx]} fill={colors[idx]} fillOpacity={0.08} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
