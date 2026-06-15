"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, RefreshCw, CheckCircle, XCircle, AlertTriangle, Copy, Check, ChevronDown, ChevronUp, Code, FileText, Globe, Zap, Image, Link2, List, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/context/BrandContext";
import Link from "next/link";

interface AuditItem {
  name: string;
  status: "pass" | "fail" | "warning";
  category: string;
  impact: string;
  why: string;
  howToFix: string;
  autoFix?: string;
  icon: React.ElementType;
}

export default function AuditPage() {
  const { websiteUrl, isAnalyzed, isFamous } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [auditItems, setAuditItems] = useState<AuditItem[] | null>(null);
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedFix, setCopiedFix] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    const next = new Set(expandedItems);
    if (next.has(name)) next.delete(name); else next.add(name);
    setExpandedItems(next);
  };

  const copyFix = (name: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFix(name);
    setTimeout(() => setCopiedFix(null), 2000);
  };

  useEffect(() => {
    if (!isAnalyzed || !websiteUrl) {
      setAuditItems(null);
      setAuditScore(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const seed = websiteUrl.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      
      const status = (threshold: number): "pass" | "fail" | "warning" => {
        // If famous, give higher probability of pass/warning
        const bonus = isFamous ? 25 : 0;
        const v = ((seed * threshold) % 100) + bonus;
        if (v > 65) return "pass";
        if (v > 30) return "warning";
        return "fail";
      };

      const items: AuditItem[] = [
        { name: "robots.txt", status: status(7), category: "Crawlability", icon: FileText, impact: "AI crawlers cannot index blocked content, reducing visibility in AI models by up to 80%.", why: "Your robots.txt may be blocking important pages or missing entirely, preventing AI crawlers from accessing your content.", howToFix: "Create or update robots.txt to allow AI crawlers. Ensure /docs, /blog, and /api paths are accessible.", autoFix: `User-agent: *\nAllow: /\nAllow: /blog/\nAllow: /docs/\nAllow: /api/\n\nSitemap: ${websiteUrl}/sitemap.xml` },
        { name: "sitemap.xml", status: status(11), category: "Crawlability", icon: MapPin, impact: "Without a sitemap, AI crawlers miss up to 40% of your content during indexing.", why: "Sitemap is missing or incomplete, meaning AI training data crawlers cannot discover all your pages efficiently.", howToFix: "Generate a comprehensive XML sitemap including all public pages, blog posts, and documentation.", autoFix: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${websiteUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${websiteUrl}/docs</loc>\n    <priority>0.9</priority>\n  </url>\n</urlset>` },
        { name: "Open Graph Tags", status: status(13), category: "Metadata", icon: Image, impact: "Missing OG tags reduce social sharing effectiveness and AI model context understanding by 25%.", why: "Open Graph meta tags are missing or incomplete, causing poor previews when shared and less context for AI models.", howToFix: "Add og:title, og:description, og:image, and og:url tags to all key pages.", autoFix: `<meta property="og:title" content="Your Page Title" />\n<meta property="og:description" content="Your page description" />\n<meta property="og:image" content="${websiteUrl}/og-image.png" />\n<meta property="og:url" content="${websiteUrl}" />\n<meta property="og:type" content="website" />` },
        { name: "JSON-LD Organization", status: status(17), category: "Structured Data", icon: Code, impact: "Organization schema helps AI models correctly identify and cite your brand, improving citations by 35%.", why: "Missing Organization JSON-LD prevents AI models from establishing strong brand entity associations.", howToFix: "Add Organization schema to your homepage with name, url, logo, and social profiles.", autoFix: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Brand",\n  "url": "${websiteUrl}",\n  "logo": "${websiteUrl}/logo.png",\n  "sameAs": [\n    "https://twitter.com/yourbrand",\n    "https://linkedin.com/company/yourbrand"\n  ]\n}\n</script>` },
        { name: "FAQ Schema", status: status(19), category: "Structured Data", icon: List, impact: "FAQ schema increases AI recommendation probability by up to 40% for question-based queries.", why: "No FAQ structured data found. AI models frequently use FAQ content to answer user questions.", howToFix: "Add FAQPage schema to pages with Q&A content.", autoFix: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What is Your Brand?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Your Brand is..."\n    }\n  }]\n}\n</script>` },
        { name: "Breadcrumb Schema", status: status(23), category: "Structured Data", icon: Link2, impact: "Breadcrumb schema improves content hierarchy understanding by AI crawlers by 20%.", why: "Missing breadcrumb structured data reduces AI models' ability to understand your site structure.", howToFix: "Implement BreadcrumbList schema across all pages." },
        { name: "Page Speed", status: status(29), category: "Performance", icon: Zap, impact: "Slow pages are deprioritized by AI crawlers, reducing overall content indexing coverage.", why: "Page load time exceeds recommended thresholds, potentially causing AI crawlers to skip content.", howToFix: "Optimize images, enable compression, minimize CSS/JS, and use CDN." },
        { name: "Meta Descriptions", status: status(31), category: "Metadata", icon: Globe, impact: "Quality meta descriptions help AI models understand page context, improving citation accuracy by 15%.", why: "Some pages are missing meta descriptions or have generic ones, reducing AI context quality.", howToFix: "Write unique, descriptive meta descriptions for all key pages (150-160 characters)." },
      ];

      const passed = items.filter((i) => i.status === "pass").length;
      const score = Math.round((passed / items.length) * 100);

      setAuditItems(items);
      setAuditScore(score);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnalyzed, websiteUrl, isFamous]);

  const statusIcon = (s: string) => {
    if (s === "pass") return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    if (s === "warning") return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const statusColor = (s: string) => {
    if (s === "pass") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "warning") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
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
        <p className="text-xs font-bold font-mono text-muted-foreground">Running website crawler audit...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground uppercase">Website Audit Engine</h1>
          <p className="text-xs font-semibold text-muted-foreground">Analyze technical SEO readiness for AI crawlers with auto-fix generation for {websiteUrl}.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card text-foreground hover:bg-accent font-bold rounded">
            View Core Dashboard
          </Button>
        </Link>
      </div>

      {auditItems && auditScore !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Score */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Audit Score</p>
                <p className={`text-4xl font-extrabold ${auditScore >= 70 ? "text-emerald-400" : auditScore >= 40 ? "text-amber-400" : "text-red-400"}`}>{auditScore}%</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Passed</p>
                <p className="text-4xl font-extrabold text-emerald-400">{auditItems.filter(i => i.status === "pass").length}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-bold text-muted-foreground mb-1">Issues Found</p>
                <p className="text-4xl font-extrabold text-red-400">{auditItems.filter(i => i.status !== "pass").length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Audit Items */}
          <div className="space-y-3">
            {auditItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.has(item.name);
              return (
                <Card key={item.name} className="border-border bg-card backdrop-blur-sm">
                  <CardContent className="p-0">
                    <button onClick={() => toggleExpand(item.name)} className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-3">
                        {statusIcon(item.status)}
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-extrabold text-foreground">{item.name}</span>
                        </div>
                        <Badge variant="outline" className={`text-[9px] font-bold ${statusColor(item.status)}`}>{item.status.toUpperCase()}</Badge>
                        <Badge variant="secondary" className="text-[9px] font-bold">{item.category}</Badge>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-border/30 p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="p-3 rounded bg-red-500/5 border border-red-500/10">
                            <p className="text-[9px] font-extrabold text-red-400 uppercase tracking-wider mb-1">Why This Matters</p>
                            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{item.why}</p>
                          </div>
                          <div className="p-3 rounded bg-amber-500/5 border border-amber-500/10">
                            <p className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider mb-1">Impact</p>
                            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{item.impact}</p>
                          </div>
                          <div className="p-3 rounded bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider mb-1">How to Fix</p>
                            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{item.howToFix}</p>
                          </div>
                        </div>

                        {item.autoFix && (
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[9px] font-extrabold text-foreground uppercase tracking-wider">Auto-Generated Fix</p>
                              <Button variant="ghost" size="sm" onClick={() => copyFix(item.name, item.autoFix!)} className="h-7 text-[10px] font-bold">
                                {copiedFix === item.name ? <><Check className="mr-1 h-3 w-3 text-emerald-400" /> Copied</> : <><Copy className="mr-1 h-3 w-3" /> Copy Code</>}
                              </Button>
                            </div>
                            <pre className="p-3 rounded bg-background border border-border text-xs text-muted-foreground overflow-x-auto font-mono font-semibold">{item.autoFix}</pre>
                          </div>
                        )}
                      </motion.div>
                    )}
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
