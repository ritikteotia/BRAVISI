"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Globe, Tag, CheckCircle2, ArrowRight, Sparkles, RefreshCw, BarChart2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LandingScanner() {
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Deterministic results generator based on domain string hash
  const getScannedMetrics = (url: string) => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = url.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Visibility Score between 42 and 89
    const score = 42 + (hash % 48);
    // Sentiment
    const sentiments = ["Positive", "Neutral", "Negative"];
    const sentiment = score > 75 ? "Positive" : score > 55 ? "Neutral" : "Negative";
    
    // Model mention rates (ensure they sum to reasonable amounts)
    const chatgpt = 20 + (hash % 25);
    const gemini = 15 + ((hash >> 2) % 20);
    const claude = 10 + ((hash >> 4) % 20);
    const copilot = 15 + ((hash >> 6) % 20);

    return {
      score,
      sentiment,
      models: [
        { name: "ChatGPT", value: chatgpt, color: "rgba(59, 130, 246, 0.85)" },
        { name: "Gemini", value: gemini, color: "rgba(16, 185, 129, 0.85)" },
        { name: "Claude", value: claude, color: "rgba(239, 68, 68, 0.85)" },
        { name: "Copilot", value: copilot, color: "rgba(245, 158, 11, 0.85)" },
      ],
      gaps: [
        {
          title: "Structured Schema Gap",
          desc: "Domain lacks JSON-LD Product schema, resulting in indexing omission.",
          severity: "Critical",
        },
        {
          title: "Robots.txt AI Crawl Blocker",
          desc: "Active user-agent rules restrict GPTBot or ClaudeBot from parsing FAQ sub-directories.",
          severity: "Warning",
        },
        {
          title: "Entity Co-occurrence Deficit",
          desc: `LLM vector maps fail to associate '${brandName || "your brand"}' with target industry keywords.`,
          severity: "Warning",
        }
      ]
    };
  };

  const startScan = () => {
    if (!domain.trim() || !brandName.trim()) return;
    setIsScanning(true);
    setShowResults(false);
    setScanStep(0);
    setProgress(0);

    const steps = 4;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setScanStep(steps);
          setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
          }, 600);
          return 100;
        }

        // Increment scan step sequentially
        const stepThreshold = 100 / steps;
        setScanStep(Math.min(Math.floor(next / stepThreshold), steps - 1));
        return next;
      });
    }, 50);
  };

  const handleReset = () => {
    setShowResults(false);
    setDomain("");
    setBrandName("");
  };

  const stepsList = [
    "Crawling robots.txt and sitemap headers...",
    "Parsing metadata, JSON-LD, and microdata tags...",
    "Querying local model mock indexing graphs...",
    "Evaluating sentiment vector mapping clusters...",
  ];

  const metrics = showResults ? getScannedMetrics(domain) : null;

  return (
    <div className="w-full max-w-4xl mx-auto py-2 z-10 relative">
      <AnimatePresence mode="wait">
        {!isScanning && !showResults && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-card/70 backdrop-blur-md border border-border p-6 sm:p-8 rounded-2xl shadow-3d-premium card-3d-lift relative overflow-hidden"
          >
            {/* Top border line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-opportunity uppercase tracking-widest border border-opportunity/20 px-2 py-0.5 rounded bg-opportunity/5">
                  LIVE BENCHMARK TOOL
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">Zero setup needed</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Run an instant AI search audit on your domain
              </h2>
              <p className="text-xs font-semibold text-muted-foreground max-w-xl">
                See exactly how search vectors classify your features and verify if conversational crawlers recommend your company.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Domain Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Website Domain
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    placeholder="e.g. acme.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="pl-10 h-11 border-border bg-background/50 text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground rounded-lg"
                  />
                </div>
              </div>

              {/* Brand Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Product / Brand Name
                </label>
                <div className="relative flex items-center">
                  <Tag className="absolute left-3 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    placeholder="e.g. Acme SaaS"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="pl-10 h-11 border-border bg-background/50 text-xs font-bold text-foreground focus-visible:ring-1 focus-visible:ring-foreground rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={startScan}
                disabled={!domain.trim() || !brandName.trim()}
                className="w-full sm:w-auto h-11 px-8 rounded-lg bg-primary text-primary-foreground text-xs font-extrabold border border-border group glow-button flex items-center justify-center cursor-pointer"
              >
                <Search className="mr-2 h-4 w-4" />
                Analyze Model Visibility
              </Button>
            </div>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="scan-loader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-card/80 backdrop-blur-md border border-border p-6 sm:p-8 rounded-2xl shadow-3d-premium max-w-xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant animate-pulse" />

            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin" />
                  Running Generative Indexing Crawl
                </span>
                <span className="text-sm font-extrabold font-mono text-foreground">{progress}%</span>
              </div>

              <div className="space-y-3.5">
                {stepsList.map((step, idx) => {
                  const isDone = scanStep > idx;
                  const isActive = scanStep === idx;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isDone
                            ? "text-opportunity fill-opportunity/10"
                            : isActive
                            ? "text-indigo-500 animate-pulse"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-bold transition-colors ${
                          isDone
                            ? "text-foreground/80"
                            : isActive
                            ? "text-foreground font-extrabold"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full bg-secondary overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-vibrant transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {showResults && metrics && (
          <motion.div
            key="scan-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full"
          >
            {/* Left Box: Visibility score & Mentions bar chart */}
            <div className="lg:col-span-7 bg-card border border-border p-6 rounded-2xl shadow-3d-premium card-3d-lift flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
                      AUDIT TARGET: {domain.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-foreground">AI Mentions Distribution</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-opportunity/5 border border-opportunity/25 rounded">
                    <span className="h-1.5 w-1.5 rounded-full bg-opportunity" />
                    <span className="text-[10px] font-mono font-bold text-opportunity">Seeded Math</span>
                  </div>
                </div>

                {/* Score and Sentiment Row */}
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                  <div className="text-center py-1 border-r border-border/50">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Visibility Score</p>
                    <p className="text-3xl font-extrabold text-foreground mt-0.5">{metrics.score}<span className="text-xs text-muted-foreground font-normal">/100</span></p>
                  </div>
                  <div className="text-center py-1">
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Corpus Sentiment</p>
                    <p className={`text-sm font-extrabold mt-1.5 ${
                      metrics.sentiment === "Positive" ? "text-opportunity" : metrics.sentiment === "Neutral" ? "text-warning" : "text-risk"
                    }`}>
                      {metrics.sentiment.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Simulated Recharts Bar Chart using native HTML */}
                <div className="space-y-3.5 pt-2">
                  {metrics.models.map((model, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-foreground">{model.name}</span>
                        <span className="text-muted-foreground">{model.value}% Share</span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${model.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.15 }}
                          style={{ backgroundColor: model.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-border/50 mt-6 justify-between">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto h-9 px-4 rounded border border-border bg-background hover:bg-accent text-[11px] font-bold text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3 w-3" /> Run New Audit
                </button>
                
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full h-9 px-5 rounded bg-primary text-primary-foreground text-[11px] font-bold transition-opacity border border-border group glow-button flex items-center justify-center cursor-pointer">
                    Open Full Enterprise Dashboard
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Box: Critical Gaps & Roadmap Action items */}
            <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl shadow-3d-premium card-3d-lift flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
                    DIAGNOSTICS OUTLINE
                  </span>
                  <h3 className="text-base font-bold text-foreground">Identified Content Gaps</h3>
                </div>

                <div className="space-y-3.5">
                  {metrics.gaps.map((gap, idx) => (
                    <div key={idx} className="p-3 bg-background/50 border border-border/70 rounded-xl space-y-1 text-left relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-foreground">{gap.title}</span>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                          gap.severity === "Critical" ? "text-risk border-risk/20 bg-risk/5" : "text-warning border-warning/20 bg-warning/5"
                        }`}>
                          {gap.severity}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                        {gap.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B2B Action Hint */}
              <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-2 text-left">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-foreground uppercase tracking-wide">Enterprise Solution</p>
                  <p className="text-[9px] font-semibold text-muted-foreground leading-relaxed">
                    Deploying the structured JSON-LD schemas generated by our AI Copilot increases average citation recommendations by up to 34%.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
