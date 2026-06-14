"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Search,
  Shield,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  MessageSquare,
  FlaskConical,
  FileText,
  Users,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/dashboard/score-ring";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

// Quick action cards for the overview
const quickActions = [
  {
    title: "Brand Scan",
    description: "Analyze your brand's AI visibility across all major models",
    icon: Search,
    href: "/dashboard/scan",
    gradient: "from-indigo-500/10 to-purple-500/10",
    iconColor: "text-indigo-400",
    borderColor: "hover:border-indigo-500/30",
  },
  {
    title: "Website Audit",
    description: "Check technical SEO readiness for AI crawlers",
    icon: Shield,
    href: "/dashboard/audit",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/30",
  },
  {
    title: "AI Prompt Lab",
    description: "Test how AI models respond to queries about your brand",
    icon: FlaskConical,
    href: "/dashboard/prompt-lab",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-400",
    borderColor: "hover:border-amber-500/30",
  },
  {
    title: "AI Copilot",
    description: "Get AI-powered strategic recommendations",
    icon: MessageSquare,
    href: "/dashboard/copilot",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-400",
    borderColor: "hover:border-pink-500/30",
  },
];

const metricCards = [
  {
    title: "GEO Score",
    value: "—",
    change: null,
    description: "Run a scan to calculate",
    icon: Target,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "AI Citations",
    value: "—",
    change: null,
    description: "Track brand mentions",
    icon: BarChart3,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Competitors Tracked",
    value: "0",
    change: null,
    description: "Add competitors to track",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Content Opportunities",
    value: "—",
    change: null,
    description: "Audit to discover gaps",
    icon: FileText,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

const recentModules = [
  {
    title: "GEO Score Engine",
    description: "7-dimension scoring with detailed analysis",
    icon: Target,
    href: "/dashboard/geo-score",
    status: "ready",
  },
  {
    title: "Citation Tracking",
    description: "Real-time AI model mention tracking",
    icon: Search,
    href: "/dashboard/citations",
    status: "ready",
  },
  {
    title: "Competitor Analysis",
    description: "Compare up to 10 competitors side-by-side",
    icon: Users,
    href: "/dashboard/competitors",
    status: "ready",
  },
  {
    title: "Content Strategy",
    description: "AI-generated content roadmap",
    icon: FileText,
    href: "/dashboard/content-strategy",
    status: "ready",
  },
  {
    title: "GEO Roadmap",
    description: "30/60/90 day optimization plan",
    icon: TrendingUp,
    href: "/dashboard/roadmap",
    status: "ready",
  },
  {
    title: "Advanced Analytics",
    description: "Heatmaps, radar charts, network graphs",
    icon: BarChart3,
    href: "/dashboard/analytics",
    status: "ready",
  },
];

export default function DashboardOverview() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to BRAVISI
        </h1>
        <p className="text-sm text-muted-foreground">
          Your AI Search Visibility Intelligence Platform. Start by scanning your brand.
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ${action.borderColor} hover:bg-card/80 cursor-pointer h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <CardContent className="relative z-10 p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} border border-current/10`}>
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                    <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    {metric.change && (
                      <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        {metric.change}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* All Modules Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Platform Modules</h2>
          <span className="text-xs text-muted-foreground">{recentModules.length} modules available</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="group border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/60 cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {module.title}
                        </h3>
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {module.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30 shrink-0 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Banner */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />
          <CardContent className="relative z-10 flex flex-col items-center text-center py-12 px-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Start Optimizing for AI Search
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mb-6">
              Run your first brand scan to get a comprehensive GEO score, discover content gaps,
              and receive actionable recommendations to dominate AI search.
            </p>
            <Link href="/dashboard/scan">
              <Button className="glow-button h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500">
                <Search className="mr-2 h-4 w-4" />
                Run Brand Scan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
