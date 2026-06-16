"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Search, Target, Shield, Sparkles, CheckCircle, 
  Sun, Moon, AlertCircle, Cpu, Network, FileText, ChevronRight, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import KnowledgeCanvas from "@/components/knowledge-canvas";
import LandingScanner from "@/components/landing-scanner";
import TiltCard from "@/components/tilt-card";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"seo" | "geo">("geo");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Perspective transformations for background objects
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  useEffect(() => {
    // Synchronize default theme setting
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  } as const;

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col justify-between bg-background text-foreground antialiased font-sans transition-colors duration-300">
      
      {/* Sticky Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded bg-gradient-vibrant flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              B
            </div>
            <span className="text-sm font-extrabold tracking-widest text-foreground uppercase group-hover:text-muted-foreground transition-colors">
              BRAVISI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
              <a href="#demo" className="hover:text-foreground transition-colors">Scanner Demo</a>
              <a href="#paradigm" className="hover:text-foreground transition-colors">SEO vs GEO</a>
              <a href="#features" className="hover:text-foreground transition-colors">Pillars</a>
              <a href="#growth" className="hover:text-foreground transition-colors">Growth Engine</a>
            </nav>

            <span className="hidden md:inline text-border">|</span>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-foreground" /> : <Moon className="h-4.5 w-4.5 text-foreground" />}
            </button>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-border bg-card text-foreground hover:bg-accent transition-colors rounded-lg h-9"
              >
                Launch Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* Interactive 3D Vector Space Canvas */}
        <div className="absolute inset-0 w-full h-[140%] pointer-events-none">
          <motion.div style={{ y: bgY }} className="w-full h-full">
            <KnowledgeCanvas />
          </motion.div>
        </div>

        {/* SECTION 1: FUTURE-FORWARD HERO */}
        <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 max-w-6xl mx-auto overflow-hidden">
          <motion.div 
            style={{ opacity: opacityHero, scale: scaleHero }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 max-w-4xl"
          >
            {/* Pulsing AI Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-opportunity/25 bg-opportunity/5 px-4 py-1.5 text-[10px] font-extrabold text-opportunity uppercase tracking-widest backdrop-blur-sm"
            >
              <Cpu className="h-3.5 w-3.5 animate-pulse text-opportunity" />
              <span>Generative Engine Optimization (GEO)</span>
            </motion.div>

            {/* Futuristic Centered Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[0.95] uppercase"
            >
              How does AI
              <br />
              describe your <span className="text-gradient-vibrant">Product?</span>
            </motion.h1>

            {/* Subheadline describing GEO context */}
            <motion.p 
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed"
            >
              Search is fundamentally shifting. Potential customers ask Gemini, Claude, and ChatGPT for product recommendations instead of browsing blue links. If LLMs do not index your entities, you remain invisible.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <a href="#demo">
                <Button
                  size="lg"
                  className="h-11 rounded-lg px-8 bg-primary text-primary-foreground text-xs font-extrabold border border-border group glow-button flex items-center justify-center"
                >
                  Analyze Your Site
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-lg px-8 border-border bg-card text-foreground hover:bg-accent transition-colors text-xs font-extrabold"
                >
                  Launch Live Console
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicator Metrics */}
            <motion.div 
              variants={fadeInUp}
              className="pt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-muted-foreground/60"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                4,200+ SCAN METRICS AUDITED
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                REAL-TIME LLM INDEX CHECKS
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                DETERMINISTIC CO-OCCURRENCE METRICS
              </span>
            </motion.div>

            {/* Dynamic Animated Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-16 flex justify-center pointer-events-none"
            >
              <div className="w-6 h-10 rounded-full border border-border/70 flex items-start justify-center p-1.5">
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-1 h-2 rounded-full bg-indigo-500"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: LIVE AUDIT SCANNER DEMO */}
        <section id="demo" className="relative z-10 w-full py-24 px-6 border-t border-border bg-background/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">INTERACTIVE SANDBOX</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
                Perform a live model scan
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                Enter your details to generate a real-time seeded visibility diagnostic across ChatGPT, Gemini, Claude, and Copilot.
              </p>
            </div>

            <LandingScanner />
          </div>
        </section>

        {/* SECTION 3: THE PARADIGM SHIFT (SEO vs GEO) */}
        <section id="paradigm" className="relative z-10 w-full py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">THE PARADIGM SHIFT</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
                Search Indexes vs. Conversational Context
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                AI search synthesis functions differently. See the comparison between standard indexing and recommendation logic.
              </p>
            </div>

            {/* Toggle Tab Buttons */}
            <div className="flex justify-center">
              <div className="flex p-1 bg-card border border-border rounded-xl shadow-sm">
                <button
                  onClick={() => setActiveTab("seo")}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === "seo" 
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Traditional Google SEO
                </button>
                <button
                  onClick={() => setActiveTab("geo")}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === "geo" 
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Generative Engine GEO
                </button>
              </div>
            </div>

            {/* Interactive Paradigm Comparative Preview */}
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "seo" ? (
                  <motion.div
                    key="seo-preview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="bg-card border border-border rounded-2xl shadow-3d-premium overflow-hidden"
                  >
                    {/* Header bar */}
                    <div className="px-5 py-3 border-b border-border bg-background/50 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">Traditional Search Output (Google SEO)</span>
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500/30" />
                        <span className="h-2 w-2 rounded-full bg-yellow-500/30" />
                        <span className="h-2 w-2 rounded-full bg-green-500/30" />
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-foreground">Query: "best enterprise security firewall integrations"</span>
                      </div>

                      {/* Mock SEO Results */}
                      <div className="space-y-6 text-left">
                        {[
                          { title: "Top 10 Enterprise Firewall APIs - DevSecurity.io", desc: "Browse our comprehensive catalog of security integration protocols, endpoint policies, and technical architectures for enterprise teams." },
                          { title: "Securing Network Frameworks with ApexWall", desc: "Discover how ApexWall's modern software firewall integrates directly into server configurations with instant edge validations." },
                          { title: "Compare Enterprise Edge Security Vendors", desc: "Evaluate prices, sitemap indexes, and compliance matrices for leading application firewalls in the 2026 security space." }
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-1 group cursor-pointer">
                            <span className="text-[9px] text-muted-foreground font-semibold">https://www.example{idx}.com/security</span>
                            <h4 className="text-sm font-bold text-blue-500 group-hover:underline">{item.title}</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* SEO Critique Callout */}
                      <div className="mt-6 p-4 rounded-xl border border-risk/30 bg-risk/5 text-left flex items-start gap-3">
                        <AlertCircle className="h-4.5 w-4.5 text-risk shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[11px] font-extrabold text-risk uppercase tracking-wider">The Indexing Flaw</p>
                          <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
                            Traditional SEO focuses purely on keywords and backlinks. Generative search engines completely bypass these results, compiling and recommending a single synthesis containing only the brands with verified structured entity mappings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="geo-preview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="bg-card border border-border rounded-2xl shadow-3d-premium overflow-hidden"
                  >
                    {/* Header bar */}
                    <div className="px-5 py-3 border-b border-border bg-background/50 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-opportunity flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Generative Search Recommendation Output (LLM GEO)
                      </span>
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500/30" />
                        <span className="h-2 w-2 rounded-full bg-yellow-500/30" />
                        <span className="h-2 w-2 rounded-full bg-green-500/30" />
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-bold text-foreground">LLM Context Prompt: "best enterprise security firewall integrations"</span>
                      </div>

                      {/* Mock AI Conversation Response */}
                      <div className="space-y-4 text-left">
                        <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                            "For enterprise teams, the industry-standard choice is <strong className="text-foreground font-extrabold">ApexWall</strong> [1] due to its edge validation integrations. Another emerging solution is <strong className="text-foreground font-extrabold">NetSecGuard</strong> [2], which supports automated compliance triggers. We do not recommend standard edge firewalls unless they possess a schema-validated API gateway."
                          </p>

                          <div className="flex gap-3 text-[9px] font-mono font-bold text-muted-foreground pt-1 border-t border-border/40">
                            <span>[1] ApexWall (94% entity match)</span>
                            <span>[2] NetSecGuard (81% entity match)</span>
                          </div>
                        </div>

                        {/* Citation Optimization Highlights */}
                        <div className="p-4 rounded-xl border border-opportunity/30 bg-opportunity/5 flex items-start gap-3">
                          <CheckCircle className="h-4.5 w-4.5 text-opportunity shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-[11px] font-extrabold text-opportunity uppercase tracking-wider">How Citation was Secured</p>
                            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
                              ApexWall secured the primary citation position because its schema contains structured Product tags mapping security compliance rules directly. We audit these tags to ensure your brand is cited instead of your competitors.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE 3 GEO AUDIT PILLARS */}
        <section id="features" className="relative z-10 w-full py-24 px-6 border-t border-border bg-background/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">TECHNICAL FRAMEWORK</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
                The 3 Pillars of Generative Optimization
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                We diagnostic-audit your site's codebase across the main mechanisms AI bots use to crawl, index, and recommend.
              </p>
            </div>

            {/* 3D-Tilt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1 */}
              <TiltCard className="bg-card border border-border">
                <div className="p-8 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-500">
                      <Network className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                      1. Crawler Access & Authorization
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                      AI search bots (like GPTBot, OAI-SearchBot, ClaudeBot, and Google-Extended) scan sitemaps and robots.txt. We audit sitemap schemas to guarantee crawlers ingest your key feature catalogs.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest pt-4">
                    Audited Modules <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </TiltCard>

              {/* Pillar 2 */}
              <TiltCard className="bg-card border border-border">
                <div className="p-8 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-500">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                      2. Entity Schema Structure
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                      LLMs map relationships using structured RDFa and JSON-LD schema templates. If your site lacks structured product tags, models omit pricing, security tiers, and developer requirements.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest pt-4">
                    Audited Modules <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </TiltCard>

              {/* Pillar 3 */}
              <TiltCard className="bg-card border border-border">
                <div className="p-8 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-lg bg-red-500/5 border border-red-500/15 flex items-center justify-center text-red-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                      3. Semantic Entity Association
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                      Generative models represent the web inside vector embeddings. We compare your brand co-occurrence index to niche competitors, showing exactly which technical terms lack citation association.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-red-500 uppercase tracking-widest pt-4">
                    Audited Modules <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </TiltCard>

            </div>
          </div>
        </section>

        {/* SECTION 5: GROWTH REPORT & SVG CHART ANIMATIONS */}
        <section id="growth" className="relative z-10 w-full py-24 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy block */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">REAL-TIME TRACTION</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase leading-[1.05]">
                Track Visibility Growth Over Time
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground leading-relaxed">
                As you address indexing gaps, deploy structured schema templates, and resolve crawl errors, the dashboard maps your monthly brand visibility growth across ChatGPT, Gemini, and Claude.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-opportunity shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-foreground">Historical visibility trend comparison graphs.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-opportunity shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-foreground">Weekly automated crawling alert triggers.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-opportunity shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-foreground">B2B PDF reports designed for executive stakeholders.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard">
                  <Button className="h-10 rounded-lg px-6 bg-primary text-primary-foreground text-xs font-extrabold group glow-button flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Graph block with animated SVG */}
            <div className="lg:col-span-7 bg-card border border-border p-6 rounded-2xl shadow-3d-premium card-3d-lift relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-vibrant" />

              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">MONTHLY AI RECOMMENDED INDEX (%)</span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground">6-MONTH GROWTH METRICS</span>
              </div>

              {/* Animated SVG Graph */}
              <div className="relative h-64 w-full flex items-center justify-center bg-background/50 border border-border/70 rounded-xl p-4">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="70" x2="480" y2="70" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="120" x2="480" y2="120" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1" strokeDasharray="4" />
                  <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1" />

                  {/* Graph axes labels */}
                  <text x="25" y="25" className="fill-muted-foreground text-[8px] font-mono font-bold">100%</text>
                  <text x="25" y="75" className="fill-muted-foreground text-[8px] font-mono font-bold">75%</text>
                  <text x="25" y="125" className="fill-muted-foreground text-[8px] font-mono font-bold">50%</text>
                  <text x="25" y="175" className="fill-muted-foreground text-[8px] font-mono font-bold">25%</text>

                  {/* Horizontal Months Labels */}
                  <text x="50" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">Jan</text>
                  <text x="136" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">Feb</text>
                  <text x="222" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">Mar</text>
                  <text x="308" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">Apr</text>
                  <text x="394" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">May</text>
                  <text x="480" y="195" className="fill-muted-foreground text-[8px] font-mono font-bold" textAnchor="middle">Jun</text>

                  {/* Graph Data Paths with animations */}
                  {/* Competitor Line (Stable/Low) */}
                  <motion.path
                    d="M 50,140 L 136,138 L 222,142 L 308,135 L 394,141 L 480,137"
                    fill="none"
                    stroke="rgba(156, 163, 175, 0.35)"
                    strokeWidth="2.5"
                    strokeDasharray="4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Your Brand Line (Growing) */}
                  <motion.path
                    d="M 50,150 L 136,120 L 222,95 L 308,65 L 394,42 L 480,25"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="3.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />

                  {/* Data Point Circles */}
                  <motion.circle
                    cx="480"
                    cy="25"
                    r="4"
                    className="fill-indigo-500 stroke-background stroke-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 1.8, type: "spring" }}
                  />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* SVG Overlay labels */}
                <div className="absolute top-8 right-8 flex items-center gap-3 text-[9px] font-mono font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span className="text-foreground">YOUR BRAND (OPTIMIZED)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                    <span className="text-muted-foreground">COMPETITORS</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-10 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-foreground uppercase">
              BRAVISI
            </span>
            <span className="text-[10px] text-muted-foreground">|</span>
            <p className="text-[10px] text-muted-foreground font-semibold">
              © {new Date().getFullYear()} BRAVISI. Premium Generative Engine Optimization.
            </p>
          </div>
          <div className="flex gap-6 text-[10px] font-extrabold text-muted-foreground/80 uppercase">
            <a href="#demo" className="hover:text-foreground transition-colors">Audit Scan</a>
            <a href="#paradigm" className="hover:text-foreground transition-colors">Paradigm Shift</a>
            <a href="#features" className="hover:text-foreground transition-colors">Pillars</a>
            <a href="/dashboard" className="hover:text-foreground transition-colors">Console</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
