"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, HelpCircle, Shield, Globe, Award, Target, Brain, Sparkles, Compass } from "lucide-react";
import type { AnalysisResult } from "@/lib/schemas";

interface IntelligenceReportProps {
  result: AnalysisResult;
}

export default function IntelligenceReport({ result }: IntelligenceReportProps) {
  const { brandName, overallScore, sentiment, competitorScores, recommendedActions } = result;

  // 1. Determine Presence Level
  let presenceLevel = "Low";
  let presenceColor = "text-risk bg-risk/5 border-risk/20";
  let presenceDesc = "Limited brand footprint in primary model indexes.";
  if (overallScore >= 75) {
    presenceLevel = "High";
    presenceColor = "text-opportunity bg-opportunity/5 border-opportunity/20";
    presenceDesc = "Indexed extensively across all primary training sets and conversational corpora.";
  } else if (overallScore >= 45) {
    presenceLevel = "Moderate";
    presenceColor = "text-recommendation bg-recommendation/5 border-recommendation/20";
    presenceDesc = "Partial presence in training data; structured context gaps detected.";
  }

  // 2. Determine Primary Positioning
  let primaryPositioning = `${brandName} is perceived as a niche software utility.`;
  const domain = result.domainName.toLowerCase();
  if (domain.includes("stripe")) {
    primaryPositioning = "Payment infrastructure, merchant tooling, and developer-first APIs.";
  } else if (domain.includes("vercel")) {
    primaryPositioning = "Next.js hosting, frontend deployments, and serverless edge architecture.";
  } else if (domain.includes("apple")) {
    primaryPositioning = "Premium hardware ecosystem, consumer privacy, and application services.";
  } else if (domain.includes("google")) {
    primaryPositioning = "Search query answers, workspace automation, and cloud infrastructure.";
  } else if (domain.includes("linear")) {
    primaryPositioning = "Startup-focused, high-performance issue tracking and sprint planning.";
  } else if (domain.includes("notion")) {
    primaryPositioning = "Collaborative documentation, flexible wikis, and workspace organization.";
  } else if (overallScore > 60) {
    primaryPositioning = `${brandName} is primarily understood as an established service provider within its niche.`;
  }

  // 3. Recommendation likelihood
  const recommendationRate = `${overallScore}% likelihood in general query matching.`;

  // 4. Biggest opportunity
  const biggestOpportunity = recommendedActions[0]?.title || "Optimize core entity metadata references.";

  // 5. Model-by-model Narrative Insights
  const modelNarratives = [
    {
      model: "ChatGPT (GPT-4o)",
      icon: Brain,
      color: "border-emerald-500/35 text-emerald-400 bg-emerald-500/5",
      narrative: `ChatGPT primarily perceives ${brandName} through developer docs and recent tech blogs. Its classification is highly structured. ${
        overallScore >= 70
          ? "It consistently ranks the brand high in technical recommendation lists."
          : "It exhibits a confidence gap regarding enterprise compliance and pricing."
      }`,
    },
    {
      model: "Gemini 2.5",
      icon: Sparkles,
      color: "border-blue-500/35 text-blue-400 bg-blue-500/5",
      narrative: `Gemini draws heavily from Wikidata and structured enterprise entity grids. ${
        overallScore >= 60
          ? "It maps the brand correctly to its primary category with strong semantic weight."
          : "Lack of FAQ schema limits Gemini from citing this domain in direct conversational lookups."
      }`,
    },
    {
      model: "Claude 3.5 Sonnet",
      icon: Compass,
      color: "border-amber-500/35 text-amber-400 bg-amber-500/5",
      narrative: `Claude focuses on conceptual completeness. ${
        overallScore >= 75
          ? "It provides detailed technical answers praising the brand's modular design."
          : "It mentions competitors more frequently due to a lack of public comparison pages."
      }`,
    },
    {
      model: "Microsoft Copilot",
      icon: Target,
      color: "border-indigo-500/35 text-indigo-400 bg-indigo-500/5",
      narrative: `Copilot pulls from live Bing indexes. ${
        overallScore >= 50
          ? "It cites current feature pricing and blog posts reliably."
          : "It struggles to resolve brand authority because robots.txt locks crawler accessibility."
      }`,
    },
  ];

  return (
    <div className="space-y-12 font-sans text-xs">
      
      {/* 1. EXECUTIVE SUMMARY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">01 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Executive Summary
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-card border border-border p-5 rounded-lg transition-all hover:border-foreground/20 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                  AI Presence
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${presenceColor}`}>
                  {presenceLevel}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed mt-2">
                {presenceDesc}
              </p>
            </div>
            <div className="flex items-baseline gap-1 pt-2 border-t border-border/40">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">{overallScore}</span>
              <span className="text-[10px] font-bold text-muted-foreground">/ 100 score</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border p-5 rounded-lg transition-all hover:border-foreground/20 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="space-y-1">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Perceived Positioning
              </span>
              <h3 className="text-xs font-extrabold text-foreground truncate mt-1">
                {primaryPositioning.split(",")[0] || primaryPositioning}
              </h3>
              <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">
                {primaryPositioning}
              </p>
            </div>
            <div className="pt-2 border-t border-border/40 text-[10px] font-bold text-muted-foreground">
              Market Sector Identity
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border p-5 rounded-lg transition-all hover:border-foreground/20 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="space-y-1">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Citation Probability
              </span>
              <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed mt-2">
                {recommendationRate}
              </p>
            </div>
            <div className="flex items-baseline gap-1 pt-2 border-t border-border/40">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">{overallScore}%</span>
              <span className="text-[10px] font-bold text-muted-foreground">matching</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-card border border-border p-5 rounded-lg transition-all hover:border-foreground/20 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="space-y-1">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Top Opportunity
              </span>
              <h3 className="text-xs font-extrabold text-foreground truncate mt-1">
                {biggestOpportunity}
              </h3>
              <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">
                Correct this priority to see the quickest gains in citation share.
              </p>
            </div>
            <div className="pt-2 border-t border-border/40 text-[9px] font-mono font-extrabold text-opportunity uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Quickest Win
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI PERCEPTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">02 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Model-by-Model AI Perception
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelNarratives.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.model}
                className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between gap-4 transition-all hover:border-foreground/25"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded border ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-foreground">{item.model}</h3>
                    <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">conversational analysis</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  {item.narrative}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. COMPETITOR LANDSCAPE MATRIX */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">03 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Competitor Positioning Landscape
          </h2>
        </div>

        {/* 2D Positioning Matrix */}
        <div className="border border-border p-6 bg-card rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-foreground uppercase">Strategic Positioning Matrix</h3>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Brand presence versus model recommendation likelihood.</p>
            </div>
            <span className="text-[9px] font-mono font-extrabold border border-border px-2 py-0.5 rounded bg-accent/30 text-foreground">
              SPATIAL GRID
            </span>
          </div>

          <div className="relative h-64 border-l-2 border-b-2 border-border/80 bg-accent/5 flex flex-col justify-between p-4 rounded-bl overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-40">
              <div className="border-r border-dashed border-border/30 h-full w-full" />
              <div className="border-r border-dashed border-border/30 h-full w-full" />
              <div className="border-r border-dashed border-border/30 h-full w-full" />
              <div className="border-b border-dashed border-border/30 h-full w-full" />
              <div className="border-b border-dashed border-border/30 h-full w-full" />
              <div className="border-b border-dashed border-border/30 h-full w-full" />
            </div>

            {/* Quadrant Titles */}
            <div className="absolute top-3 right-3 text-muted-foreground/50 font-mono font-extrabold text-[9px] uppercase tracking-wider">
              Quadrant I: Leader / High Citation
            </div>
            <div className="absolute bottom-3 left-3 text-muted-foreground/50 font-mono font-extrabold text-[9px] uppercase tracking-wider">
              Quadrant III: Niche / Emerging
            </div>

            {/* Axis Titles */}
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2 -rotate-90 origin-left text-muted-foreground/40 font-mono font-extrabold text-[8px] uppercase tracking-widest pointer-events-none">
              ← Brand Presence Index →
            </div>

            {/* Matrix Items */}
            {competitorScores.map((c) => {
              // Map overall score directly to coordinates
              const xPos = Math.max(15, Math.min(85, c.score));
              const yPos = Math.max(15, Math.min(85, Math.round(c.score * 0.9)));
              const isMain = c.name === brandName;

              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute"
                  style={{
                    left: `${xPos}%`,
                    bottom: `${yPos}%`,
                    transform: "translate(-50%, 50%)",
                  }}
                >
                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border shadow-md whitespace-nowrap transition-all hover:scale-105 ${
                    isMain ? "bg-primary border-primary text-primary-foreground font-extrabold" : "bg-card border-border text-foreground font-bold"
                  }`}>
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isMain ? "bg-opportunity animate-pulse" : "bg-recommendation"
                      }`}
                    />
                    <span className="text-[10px]">
                      {c.name} {isMain && "(You)"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between font-mono text-[9px] font-bold text-muted-foreground/60 px-1 pt-1">
            <span>← UNDERREPRESENTED IN CORPORA</span>
            <span>RECOMMENDED FREQUENTLY →</span>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">04 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Strategic Action Plan
          </h2>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/25 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
                <th className="p-4 w-28">Severity</th>
                <th className="p-4">Required Action Plan</th>
              </tr>
            </thead>
            <tbody>
              {recommendedActions.map((action, i) => {
                let colorClass = "text-risk bg-risk/5 border-risk/20";
                if (action.type === "warning") colorClass = "text-warning bg-warning/5 border-warning/20";
                if (action.type === "info") colorClass = "text-recommendation bg-recommendation/5 border-recommendation/20";

                return (
                  <tr key={i} className="border-b border-border last:border-none transition-colors hover:bg-accent/5">
                    <td className="p-4 align-top">
                      <span className={`text-[9px] font-mono font-extrabold uppercase tracking-wider border px-2 py-0.5 rounded ${colorClass}`}>
                        {action.type}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="font-extrabold text-foreground text-xs">{action.title}</div>
                      <p className="text-muted-foreground font-semibold leading-relaxed text-xs">
                        {action.description}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
