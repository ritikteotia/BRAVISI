"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, ArrowUpRight, BookOpen, HelpCircle, BarChart3, Layout, Database, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";

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
  const { brandName, websiteUrl, isAnalyzed } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[] | null>(null);

  useEffect(() => {
    if (!isAnalyzed || !brandName) {
      setIdeas(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      let industry = "SaaS Technology";
      const domain = websiteUrl ? websiteUrl.toLowerCase() : "";
      if (domain.includes("stripe")) {
        industry = "Online Payments & Financial APIs";
      } else if (domain.includes("vercel")) {
        industry = "Cloud Hosting & Frontend Architectures";
      } else if (domain.includes("apple")) {
        industry = "Consumer Technology & Device Ecosystems";
      } else if (domain.includes("google")) {
        industry = "Web Search & Cloud Automation";
      } else if (domain.includes("linear")) {
        industry = "Product Management & Project Planning";
      } else if (domain.includes("notion")) {
        industry = "Knowledge Bases & Workspace Documentations";
      }

      const generated: ContentIdea[] = [
        { title: `${brandName} vs Top Alternatives: Complete Comparison Guide`, type: "Comparison", searchIntent: "High", priority: 95, expectedImpact: "+25% citation rate", description: `Comprehensive comparison of ${brandName} against major competitors in ${industry}. Include pricing, features, and use cases.`, icon: BarChart3 },
        { title: `Complete Guide to ${industry}: Everything You Need to Know`, type: "Blog", searchIntent: "High", priority: 90, expectedImpact: "+20% visibility", description: `Authoritative guide covering all aspects of ${industry}. Position ${brandName} as the go-to resource.`, icon: BookOpen },
        { title: `${brandName} FAQ: Top 50 Questions Answered`, type: "FAQ", searchIntent: "High", priority: 88, expectedImpact: "+18% AI mentions", description: `Comprehensive FAQ page optimized for conversational AI queries with JSON-LD FAQ schema.`, icon: HelpCircle },
        { title: `How to Get Started with ${brandName}: Step-by-Step Tutorial`, type: "Knowledge Base", searchIntent: "Medium", priority: 85, expectedImpact: "+15% recommendation rate", description: `Detailed onboarding tutorial with screenshots, code examples, and best practices.`, icon: Database },
        { title: `${industry} Trends 2025: Expert Analysis & Predictions`, type: "Blog", searchIntent: "High", priority: 82, expectedImpact: "+22% search visibility", description: `Data-driven analysis of trends with original research. Cite-worthy content that AI models reference.`, icon: ArrowUpRight },
        { title: `Why ${brandName} is the Best Choice for Enterprise ${industry}`, type: "Landing Page", searchIntent: "Medium", priority: 80, expectedImpact: "+12% brand citations", description: `SEO-optimized landing page targeting enterprise buyers with case studies and ROI data.`, icon: Layout },
        { title: `${brandName} Integration Guide: Connect with 20+ Popular Tools`, type: "Knowledge Base", searchIntent: "Medium", priority: 78, expectedImpact: "+14% documentation score", description: `Technical integration guides for popular tools and platforms in the ${industry} ecosystem.`, icon: Database },
        { title: `${brandName} Pricing Explained: Plans, Features, and Value`, type: "GEO Content", searchIntent: "High", priority: 92, expectedImpact: "+28% AI recommendation", description: `Transparent pricing page with comparison tables, FAQ schema, and conversion optimization.`, icon: Tag },
        { title: `${industry} Security & Compliance: ${brandName}'s Approach`, type: "Blog", searchIntent: "Medium", priority: 75, expectedImpact: "+10% authority score", description: `Deep dive into security practices, compliance certifications, and data protection measures.`, icon: BookOpen },
        { title: `${brandName} Customer Success Stories: Real Results`, type: "Landing Page", searchIntent: "Low", priority: 70, expectedImpact: "+8% brand trust", description: `Case studies with metrics, testimonials, and before/after comparisons.`, icon: Layout },
      ];

      setIdeas(generated.sort((a, b) => b.priority - a.priority));
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, brandName, websiteUrl]);

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
        <p className="text-xs font-bold font-mono text-muted-foreground">Formulating content recommendations...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">Content Strategy Generator</h1>
          <p className="text-xs font-semibold text-muted-foreground">AI-generated content ideas with search intent, priority, and expected GEO impact for {brandName}.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {ideas && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase">{ideas.length} Content Ideas</h2>
            <span className="text-xs font-bold text-muted-foreground">Sorted by priority</span>
          </div>
          {ideas.map((idea, idx) => {
            const Icon = idea.icon;
            return (
              <Card key={idx} className="border-border bg-card glow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-accent/20">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xs font-extrabold text-foreground">{idea.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-foreground">{idea.priority}</span>
                          <div className="h-4 w-4 rounded-full border-2 border-border" style={{ background: `conic-gradient(currentColor ${idea.priority * 3.6}deg, transparent 0deg)` }} />
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3 leading-relaxed">{idea.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-[9px] font-bold ${typeColors[idea.type]}`}>{idea.type}</Badge>
                        <Badge variant="outline" className={`text-[9px] font-bold ${intentColors[idea.searchIntent]}`}>{idea.searchIntent} Intent</Badge>
                        <span className="text-[10px] text-opportunity font-bold flex items-center gap-1">
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
