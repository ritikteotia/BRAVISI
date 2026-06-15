"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map, RefreshCw, Code, FileText, Award, Shield, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";

interface RoadmapTask {
  title: string;
  category: "Technical" | "Content" | "Authority" | "Schema";
  impact: "Critical" | "High" | "Medium";
  description: string;
}

interface RoadmapPhase {
  period: string;
  label: string;
  tasks: RoadmapTask[];
}

export default function RoadmapPage() {
  const { brandName, websiteUrl, isAnalyzed } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[] | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    if (!isAnalyzed || !brandName) {
      setRoadmap(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const url = websiteUrl || "";
      const phases: RoadmapPhase[] = [
        {
          period: "30 Days", label: "Foundation & Quick Wins",
          tasks: [
            { title: "Fix robots.txt and sitemap.xml", category: "Technical", impact: "Critical", description: "Ensure AI crawlers can access all important pages." },
            { title: "Add Organization JSON-LD schema", category: "Schema", impact: "Critical", description: "Help AI models identify and associate your brand entity." },
            { title: "Implement FAQ schema on key pages", category: "Schema", impact: "High", description: "Increase probability of being cited in Q&A queries by 40%." },
            { title: "Publish 5 comparison articles", category: "Content", impact: "High", description: `Create 'Brand vs X' pages for top competitors.` },
            { title: "Optimize meta descriptions", category: "Technical", impact: "Medium", description: "Write unique, descriptive meta tags for all key pages." },
            { title: "Claim Knowledge Graph Panel", category: "Authority", impact: "High", description: "Strengthen brand entity recognition across AI models." },
          ],
        },
        {
          period: "60 Days", label: "Content & Authority Building",
          tasks: [
            { title: "Launch comprehensive documentation", category: "Content", impact: "Critical", description: "Create API docs, guides, and tutorials that AI models reference." },
            { title: "Build public knowledge base", category: "Content", impact: "High", description: "Organized, searchable knowledge repository for AI crawler indexing." },
            { title: "Add Product and Article schemas", category: "Schema", impact: "High", description: "Rich structured data for all product and blog pages." },
            { title: "Implement breadcrumb navigation + schema", category: "Technical", impact: "Medium", description: "Improve site structure understanding for AI crawlers." },
            { title: "Create 10 industry FAQ pages", category: "Content", impact: "High", description: "Cover top questions users ask AI models about your industry." },
            { title: "Submit to 15 industry directories", category: "Authority", impact: "Medium", description: "Get listed in directories that AI training crawlers index heavily." },
            { title: "Optimize Core Web Vitals", category: "Technical", impact: "Medium", description: "Ensure fast load times so AI crawlers can index more content." },
          ],
        },
        {
          period: "90 Days", label: "Dominance & Scale",
          tasks: [
            { title: "Launch developer blog with weekly posts", category: "Content", impact: "High", description: "Maintain content freshness signals with 2-3 articles per week." },
            { title: "Build integration ecosystem pages", category: "Content", impact: "High", description: "Document all integrations with popular tools and platforms." },
            { title: "Implement HowTo schema across tutorials", category: "Schema", impact: "Medium", description: "Structured step-by-step content that AI models can parse directly." },
            { title: "Set up citation monitoring", category: "Technical", impact: "High", description: `Track brand mentions across all AI models weekly.` },
            { title: "Launch community forum", category: "Authority", impact: "Medium", description: "User-generated content creates diverse citation sources for AI models." },
            { title: "Publish annual industry report", category: "Authority", impact: "High", description: "Original research that becomes a cite-worthy source for AI models." },
          ],
        },
      ];

      setRoadmap(phases);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, brandName, websiteUrl]);

  const categoryIcon: Record<string, React.ElementType> = { Technical: Code, Content: FileText, Authority: Award, Schema: Shield };
  const categoryColor: Record<string, string> = { Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20", Content: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", Authority: "bg-purple-500/10 text-purple-400 border-purple-500/20", Schema: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  const impactColor: Record<string, string> = { Critical: "bg-red-500/10 text-red-400 border-red-500/20", High: "bg-amber-500/10 text-amber-400 border-amber-500/20", Medium: "bg-slate-500/10 text-slate-400 border-slate-500/20" };

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
        <p className="text-xs font-bold font-mono text-muted-foreground">Drafting GEO optimization plan...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">GEO Roadmap Generator</h1>
          <p className="text-xs font-semibold text-muted-foreground">Generate a 30/60/90 day optimization roadmap prioritized by expected impact for {brandName}.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {roadmap && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Phase Tabs */}
          <div className="flex gap-3">
            {roadmap.map((phase, idx) => (
              <button key={idx} onClick={() => setActivePhase(idx)} className={`flex-1 rounded border p-4 transition-all ${activePhase === idx ? "border-foreground bg-accent/20" : "border-border bg-card hover:bg-accent/40"}`}>
                <p className={`text-lg font-extrabold ${activePhase === idx ? "text-foreground" : "text-muted-foreground"}`}>{phase.period}</p>
                <p className="text-xs font-bold text-muted-foreground">{phase.label}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">{phase.tasks.length} tasks</p>
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="relative pl-6 border-l-2 border-border space-y-4 ml-3">
            {roadmap[activePhase].tasks.map((task, idx) => {
              const CatIcon = categoryIcon[task.category] || Zap;
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="relative">
                  <div className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[9px] font-extrabold text-background">{idx + 1}</div>
                  <Card className="border-border bg-card glow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xs font-extrabold text-foreground">{task.title}</h3>
                          </div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2 leading-relaxed">{task.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={`text-[9px] font-bold ${categoryColor[task.category]}`}>
                              <CatIcon className="mr-1 h-3 w-3" /> {task.category}
                            </Badge>
                            <Badge variant="outline" className={`text-[9px] font-bold ${impactColor[task.impact]}`}>{task.impact} Impact</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
