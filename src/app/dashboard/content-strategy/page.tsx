"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Sparkles, ArrowUpRight, BookOpen, HelpCircle, BarChart3, Layout, Database, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ContentIdea {
  title: string;
  type: "Blog" | "FAQ" | "Comparison" | "Landing Page" | "Knowledge Base" | "GEO Content";
  searchIntent: "High" | "Medium" | "Low";
  priority: number;
  expectedImpact: string;
  description: string;
  icon: React.ElementType;
}

export default function ContentStrategyPage() {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[] | null>(null);

  const generate = useCallback(async () => {
    if (!brandName.trim() || !industry.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));

    const b = brandName;
    const generated: ContentIdea[] = [
      { title: `${b} vs Top Alternatives: Complete Comparison Guide`, type: "Comparison", searchIntent: "High", priority: 95, expectedImpact: "+25% citation rate", description: `Comprehensive comparison of ${b} against major competitors in ${industry}. Include pricing, features, and use cases.`, icon: BarChart3 },
      { title: `Complete Guide to ${industry}: Everything You Need to Know`, type: "Blog", searchIntent: "High", priority: 90, expectedImpact: "+20% visibility", description: `Authoritative guide covering all aspects of ${industry}. Position ${b} as the go-to resource.`, icon: BookOpen },
      { title: `${b} FAQ: Top 50 Questions Answered`, type: "FAQ", searchIntent: "High", priority: 88, expectedImpact: "+18% AI mentions", description: `Comprehensive FAQ page optimized for conversational AI queries with JSON-LD FAQ schema.`, icon: HelpCircle },
      { title: `How to Get Started with ${b}: Step-by-Step Tutorial`, type: "Knowledge Base", searchIntent: "Medium", priority: 85, expectedImpact: "+15% recommendation rate", description: `Detailed onboarding tutorial with screenshots, code examples, and best practices.`, icon: Database },
      { title: `${industry} Trends 2025: Expert Analysis & Predictions`, type: "Blog", searchIntent: "High", priority: 82, expectedImpact: "+22% search visibility", description: `Data-driven analysis of trends with original research. Cite-worthy content that AI models reference.`, icon: ArrowUpRight },
      { title: `Why ${b} is the Best Choice for Enterprise ${industry}`, type: "Landing Page", searchIntent: "Medium", priority: 80, expectedImpact: "+12% brand citations", description: `SEO-optimized landing page targeting enterprise buyers with case studies and ROI data.`, icon: Layout },
      { title: `${b} Integration Guide: Connect with 20+ Popular Tools`, type: "Knowledge Base", searchIntent: "Medium", priority: 78, expectedImpact: "+14% documentation score", description: `Technical integration guides for popular tools and platforms in the ${industry} ecosystem.`, icon: Database },
      { title: `${b} Pricing Explained: Plans, Features, and Value`, type: "GEO Content", searchIntent: "High", priority: 92, expectedImpact: "+28% AI recommendation`, description: `Transparent pricing page with comparison tables, FAQ schema, and conversion optimization.`, icon: Tag },
      { title: `${industry} Security & Compliance: ${b}'s Approach`, type: "Blog", searchIntent: "Medium", priority: 75, expectedImpact: "+10% authority score", description: `Deep dive into security practices, compliance certifications, and data protection measures.`, icon: BookOpen },
      { title: `${b} Customer Success Stories: Real Results`, type: "Landing Page", searchIntent: "Low", priority: 70, expectedImpact: "+8% brand trust", description: `Case studies with metrics, testimonials, and before/after comparisons.`, icon: Layout },
    ];

    setIdeas(generated.sort((a, b) => b.priority - a.priority));
    setIsGenerating(false);
  }, [brandName, industry]);

  const typeColors: Record<string, string> = {
    Blog: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    FAQ: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Comparison: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Landing Page": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Knowledge Base": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "GEO Content": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  const intentColors: Record<string, string> = {
    High: "bg-emerald-500/10 text-emerald-400",
    Medium: "bg-amber-500/10 text-amber-400",
    Low: "bg-slate-500/10 text-slate-400",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Strategy Generator</h1>
        <p className="text-sm text-muted-foreground">AI-generated content ideas with search intent, priority, and expected GEO impact.</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Brand Name</label>
              <Input placeholder="Your Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Industry / Niche</label>
              <Input placeholder="e.g. AI Analytics, SaaS" value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={generate} disabled={isGenerating || !brandName.trim() || !industry.trim()} className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                {isGenerating ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Strategy</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {ideas && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{ideas.length} Content Ideas</h2>
            <span className="text-xs text-muted-foreground">Sorted by priority</span>
          </div>
          {ideas.map((idea, idx) => {
            const Icon = idea.icon;
            return (
              <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm glow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-sm font-semibold text-foreground">{idea.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-indigo-400">{idea.priority}</span>
                          <div className="h-4 w-4 rounded-full border-2 border-indigo-500" style={{ background: `conic-gradient(#6366f1 ${idea.priority * 3.6}deg, transparent 0deg)` }} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{idea.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-[9px] ${typeColors[idea.type]}`}>{idea.type}</Badge>
                        <Badge variant="outline" className={`text-[9px] ${intentColors[idea.searchIntent]}`}>{idea.searchIntent} Intent</Badge>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" /> {idea.expectedImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
