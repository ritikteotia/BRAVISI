"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Map, RefreshCw, CheckCircle, Clock, ArrowRight, Sparkles, Code, FileText, Award, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [brandName, setBrandName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[] | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  const generate = useCallback(async () => {
    if (!brandName.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));

    const phases: RoadmapPhase[] = [
      {
        period: "30 Days", label: "Foundation & Quick Wins",
        tasks: [
          { title: "Fix robots.txt and sitemap.xml", category: "Technical", impact: "Critical", description: "Ensure AI crawlers can access all important pages." },
          { title: "Add Organization JSON-LD schema", category: "Schema", impact: "Critical", description: "Help AI models identify and associate your brand entity." },
          { title: "Implement FAQ schema on key pages", category: "Schema", impact: "High", description: "Increase probability of being cited in Q&A queries by 40%." },
          { title: "Publish 5 comparison articles", category: "Content", impact: "High", description: "Create 'Brand vs X' pages for top 5 competitors." },
          { title: "Optimize meta descriptions", category: "Technical", impact: "Medium", description: "Write unique, descriptive meta tags for all key pages." },
          { title: "Claim Google Knowledge Panel", category: "Authority", impact: "High", description: "Strengthen brand entity recognition across AI models." },
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
          { title: "Set up citation monitoring", category: "Technical", impact: "High", description: "Track brand mentions across all 4 AI models weekly." },
          { title: "Launch community forum", category: "Authority", impact: "Medium", description: "User-generated content creates diverse citation sources for AI models." },
          { title: "Publish annual industry report", category: "Authority", impact: "High", description: "Original research that becomes a cite-worthy source for AI models." },
        ],
      },
    ];

    setRoadmap(phases);
    setIsGenerating(false);
  }, [brandName]);

  const categoryIcon: Record<string, React.ElementType> = { Technical: Code, Content: FileText, Authority: Award, Schema: Shield };
  const categoryColor: Record<string, string> = { Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20", Content: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", Authority: "bg-purple-500/10 text-purple-400 border-purple-500/20", Schema: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  const impactColor: Record<string, string> = { Critical: "bg-red-500/10 text-red-400 border-red-500/20", High: "bg-amber-500/10 text-amber-400 border-amber-500/20", Medium: "bg-slate-500/10 text-slate-400 border-slate-500/20" };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">GEO Roadmap Generator</h1>
        <p className="text-sm text-muted-foreground">Generate a 30/60/90 day optimization roadmap prioritized by expected impact.</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Brand Name</label>
              <Input placeholder="Your Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={generate} disabled={isGenerating || !brandName.trim()} className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                {isGenerating ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><Map className="mr-2 h-4 w-4" /> Generate Roadmap</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {roadmap && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Phase Tabs */}
          <div className="flex gap-3">
            {roadmap.map((phase, idx) => (
              <button key={idx} onClick={() => setActivePhase(idx)} className={`flex-1 rounded-xl border p-4 transition-all ${activePhase === idx ? "border-indigo-500/30 bg-indigo-500/5" : "border-border/50 bg-card/30 hover:bg-card/50"}`}>
                <p className={`text-lg font-bold ${activePhase === idx ? "text-indigo-400" : "text-foreground"}`}>{phase.period}</p>
                <p className="text-xs text-muted-foreground">{phase.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{phase.tasks.length} tasks</p>
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="relative pl-6 border-l-2 border-indigo-500/20 space-y-4 ml-3">
            {roadmap[activePhase].tasks.map((task, idx) => {
              const CatIcon = categoryIcon[task.category] || Zap;
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="relative">
                  <div className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white">{idx + 1}</div>
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm glow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={`text-[9px] ${categoryColor[task.category]}`}>
                              <CatIcon className="mr-1 h-3 w-3" /> {task.category}
                            </Badge>
                            <Badge variant="outline" className={`text-[9px] ${impactColor[task.impact]}`}>{task.impact} Impact</Badge>
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
