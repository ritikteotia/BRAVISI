"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Search,
  Shield,
  Target,
  FlaskConical,
  MessageSquare,
  FileText,
  Map,
  BarChart3,
  Users,
  Bell,
  Key,
  Clock,
  PieChart,
  Sparkles,
  Zap,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "AI Citation Tracking", description: "Track brand mentions across ChatGPT, Gemini, Claude, and Copilot in real-time.", icon: Search, gradient: "from-indigo-500/20 to-blue-500/20" },
  { title: "GEO Score Engine", description: "7-dimension scoring with documentation, authority, SEO, and citation analysis.", icon: Target, gradient: "from-purple-500/20 to-violet-500/20" },
  { title: "Website Audit", description: "Check robots.txt, schemas, metadata, and page speed with auto-fix generation.", icon: Shield, gradient: "from-emerald-500/20 to-teal-500/20" },
  { title: "AI Prompt Lab", description: "Test how AI models respond to queries and extract brand mentions.", icon: FlaskConical, gradient: "from-amber-500/20 to-orange-500/20" },
  { title: "Competitor Analysis", description: "Compare up to 10 competitors across documentation, content, and schemas.", icon: Users, gradient: "from-pink-500/20 to-rose-500/20" },
  { title: "AI GEO Copilot", description: "Chat assistant that uses your data to answer strategic questions.", icon: MessageSquare, gradient: "from-cyan-500/20 to-sky-500/20" },
  { title: "Content Strategy", description: "AI-generated blog ideas, FAQ pages, and GEO-optimized content plans.", icon: FileText, gradient: "from-violet-500/20 to-purple-500/20" },
  { title: "GEO Roadmap", description: "30/60/90 day optimization plans prioritized by expected impact.", icon: Map, gradient: "from-blue-500/20 to-indigo-500/20" },
  { title: "Historical Tracking", description: "Monthly trends, weekly charts, and competitor movement over time.", icon: Clock, gradient: "from-teal-500/20 to-emerald-500/20" },
  { title: "Advanced Visualizations", description: "Heatmaps, radar charts, positioning maps, and opportunity matrices.", icon: PieChart, gradient: "from-rose-500/20 to-pink-500/20" },
  { title: "Smart Alerts", description: "Email and Slack notifications for score drops and competitor changes.", icon: Bell, gradient: "from-orange-500/20 to-amber-500/20" },
  { title: "Public API", description: "REST API with key management for GEO Score, Citations, and Reports.", icon: Key, gradient: "from-sky-500/20 to-cyan-500/20" },
];

const pricingPlans = [
  { name: "Starter", price: "Free", description: "For individuals exploring GEO", features: ["3 scans/month", "Basic GEO Score", "1 competitor", "Community support"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$49", description: "For growing teams and brands", features: ["Unlimited scans", "Full GEO Score Engine", "10 competitors", "AI Copilot", "Prompt Lab", "Priority support"], cta: "Start Pro Trial", popular: true },
  { name: "Enterprise", price: "Custom", description: "For large organizations", features: ["Everything in Pro", "Team workspaces", "API access", "Custom integrations", "Dedicated support", "SSO & RBAC"], cta: "Contact Sales", popular: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-shadow group-hover:shadow-indigo-500/40">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">BRAVISI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-border/50 bg-white/5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-r from-indigo-600/8 via-purple-600/8 to-pink-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Enterprise GEO Intelligence Platform</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Dominate <span className="gradient-text">AI Search.</span>
            <br />
            Get Recommended.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The enterprise platform for tracking, analyzing, and optimizing your brand's visibility across ChatGPT, Gemini, Claude, and Copilot. 16 intelligence modules. One platform.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="glow-button group relative h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-base font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500">
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard/copilot">
              <Button variant="outline" size="lg" className="h-12 rounded-xl border-border/50 bg-white/5 px-8 text-base font-medium backdrop-blur-sm">
                <MessageSquare className="mr-2 h-4 w-4 text-indigo-400" /> Try AI Copilot
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />16 Intelligence Modules</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />4 AI Models Tracked</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" />Auto-Fix Generation</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />REST API Access</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              16 Modules. One Platform. <span className="gradient-text">Total Dominance.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Everything you need to understand, improve, monitor, and dominate AI-generated search and recommendation systems.</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-card/80">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Not Just Metrics. <span className="gradient-text">Automatic Fixes.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground mb-12">For every problem BRAVISI finds, it explains WHY it exists, what IMPACT it has, HOW to fix it, and generates the fix automatically.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm text-left">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">Problem Found</p>
                <p className="text-sm font-semibold text-foreground mb-1">Missing FAQ Schema</p>
                <p className="text-xs text-muted-foreground">No FAQPage structured data detected on key pages.</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Impact</p>
                <p className="text-sm font-semibold text-foreground mb-1">-40% AI Visibility</p>
                <p className="text-xs text-muted-foreground">AI models use FAQ content to answer user questions directly.</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">Auto-Generated Fix</p>
                <pre className="text-[10px] font-mono text-emerald-300 overflow-x-auto">{`<script type="ld+json">\n{"@type":"FAQPage"}\n</script>`}</pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Start free. Scale as you grow.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={`relative rounded-2xl border p-6 ${plan.popular ? "border-indigo-500/30 bg-gradient-to-b from-indigo-500/5 to-transparent" : "border-border/50 bg-card/50"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && plan.price !== "Free" && <span className="text-sm text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button className={`w-full h-10 rounded-lg text-sm font-semibold ${plan.popular ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white glow-button" : "bg-secondary text-foreground hover:bg-accent"}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Activity className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-bold text-foreground">BRAVISI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Enterprise GEO intelligence platform for AI search optimization.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Product</h4>
              <div className="space-y-2">
                {["Dashboard", "GEO Score", "Citations", "Audit"].map((l) => (
                  <Link key={l} href="/dashboard" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Intelligence</h4>
              <div className="space-y-2">
                {["Prompt Lab", "Copilot", "Content Strategy", "Roadmap"].map((l) => (
                  <Link key={l} href="/dashboard" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Platform</h4>
              <div className="space-y-2">
                {["API", "Pricing", "Documentation", "Support"].map((l) => (
                  <Link key={l} href="/dashboard" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BRAVISI. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
