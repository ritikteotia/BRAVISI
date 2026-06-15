"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Target, Shield, FileText, Sparkles, MessageSquare, AlertCircle, CheckCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground antialiased font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-widest text-foreground uppercase">
              BRAVISI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
            </button>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-border bg-card text-foreground hover:bg-accent transition-colors"
              >
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-6xl mx-auto w-full">
        
        {/* Section 1: Hero & Graphics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full py-6"
        >
          {/* Left Block: Bold Copy & Call-to-action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-[10px] font-extrabold text-opportunity uppercase tracking-widest border border-opportunity/25 px-2.5 py-0.5 rounded bg-opportunity/5">
                GENERATIVE ENGINE OPTIMIZATION (GEO)
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
                How does AI describe your product?
              </h1>
              <p className="text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed max-w-xl">
                Every day, millions of potential customers ask ChatGPT, Gemini, and Claude for product recommendations. If your website isn't optimized for AI model indexing, you don't exist.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-opportunity shrink-0" />
                Audit what LLM engines say about your features and pricing.
              </p>
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-opportunity shrink-0" />
                Discover if AI models are recommending your competitors instead.
              </p>
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-opportunity shrink-0" />
                Get copy-paste Schema and robots.txt files to boost AI citation share.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-10 rounded px-6 bg-primary text-primary-foreground text-xs font-extrabold transition-opacity border border-border group glow-button"
                >
                  Scan Your Product Now
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Block: Elegant Mock AI Graphic */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-5 bg-card border border-border p-6 rounded-xl shadow-3d-premium card-3d-lift space-y-4 relative overflow-hidden"
          >
            {/* Vibrant gradient border top line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/30" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/80 font-bold uppercase tracking-wider">AI RECOMMENDATION AUDIT</span>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-extrabold text-muted-foreground uppercase">USER PROMPT</span>
              <div className="p-3 bg-accent/20 rounded border border-border">
                <p className="text-xs font-bold text-foreground">
                  "What is the best customer communication API for our SaaS?"
                </p>
              </div>
            </div>

            {/* AI Response Mock */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-extrabold text-opportunity uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> CHATGPT RECOMMENDATION ENGINE
              </span>
              <div className="p-4 bg-background border border-border/80 rounded space-y-3">
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  "I recommend choosing <strong className="text-foreground font-extrabold">Twilio</strong> for scale, or <strong className="text-foreground font-extrabold">Courier</strong> for multi-channel templates. Another emerging option is..."
                </p>

                {/* Highlighted Callout showing what's missing */}
                <div className="border-l-2 border-risk pl-3 py-1 space-y-1">
                  <p className="text-[10px] font-extrabold text-risk uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> MISSING BRAND CITATION
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    Your product was omitted because it lacks JSON-LD structured schemas.
                  </p>
                </div>

                {/* Metric overlay */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[9px] font-mono font-bold">
                  <span className="text-muted-foreground">CITATION SHARE: <span className="text-risk font-extrabold">0%</span></span>
                  <span className="text-opportunity">AUDITED BY BRAVISI</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section 2: Why Optimize? (Value Props in larger horizontal blocks) */}
        <div className="w-full mt-24 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
              Why Optimize for AI Engines?
            </h2>
            <p className="text-lg font-extrabold text-foreground tracking-tight">
              AI-driven search functions differently than traditional Google SEO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Block 1 */}
            <div className="bg-card border border-border p-6 rounded-lg space-y-3 glow-card card-3d-lift">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-accent/20">
                <Search className="h-4.5 w-4.5 text-foreground" />
              </div>
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                1. AI Citation Indexing
              </h3>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                When users ask LLMs for tools, models cite their sources. If you optimize your codebase and crawl files, AI search engines cite you as a recommended option.
              </p>
            </div>

            {/* Block 2 */}
            <div className="bg-card border border-border p-6 rounded-lg space-y-3 glow-card card-3d-lift">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-accent/20">
                <Target className="h-4.5 w-4.5 text-foreground" />
              </div>
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                2. Perceived Identity
              </h3>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                AI engines group products into categories based on developer documentation. We help you correct how models describe your key product specs and features.
              </p>
            </div>

            {/* Block 3 */}
            <div className="bg-card border border-border p-6 rounded-lg space-y-3 glow-card card-3d-lift">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-accent/20">
                <Shield className="h-4.5 w-4.5 text-foreground" />
              </div>
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                3. Actionable Schema Fixes
              </h3>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                Traditional SEO checklists don't work. BRAVISI audits sitemaps and creates Schema structured files so models easily parse your product benefits.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-semibold">
            © {new Date().getFullYear()} BRAVISI. Premium Generative Engine Optimization.
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold">
            Research-focused SaaS intelligence for modern web products.
          </p>
        </div>
      </footer>
    </div>
  );
}
