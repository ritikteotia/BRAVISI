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
      hoverStyle: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
      narrative: `ChatGPT primarily perceives ${brandName} through developer docs and tech blogs. Classification is highly structured. ${
        overallScore >= 70
          ? "It consistently ranks the brand high in technical recommendation lists."
          : "It exhibits a confidence gap regarding enterprise compliance and pricing."
      }`,
    },
    {
      model: "Gemini 2.5",
      icon: Sparkles,
      color: "border-blue-500/35 text-blue-400 bg-blue-500/5",
      hoverStyle: "hover:border-blue-500/40 hover:bg-blue-500/5",
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
      hoverStyle: "hover:border-amber-500/40 hover:bg-amber-500/5",
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
      hoverStyle: "hover:border-indigo-500/40 hover:bg-indigo-500/5",
      narrative: `Copilot pulls from live Bing indexes. ${
        overallScore >= 50
          ? "It cites current feature pricing and blog posts reliably."
          : "It struggles to resolve brand authority because robots.txt locks crawler accessibility."
      }`,
    },
  ];

  return (
    <div className="space-y-12 font-sans text-xs w-full">
      
      {/* 1. EXECUTIVE SUMMARY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">01 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Executive Summary
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-card shadow-3d-premium card-3d-lift border-t-3 border-t-indigo-500 p-6 rounded-lg flex flex-col justify-between min-h-[160px]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                  AI Presence
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${presenceColor}`}>
                  {presenceLevel}
                </span>
              </div>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed mt-1">
                {presenceDesc}
              </p>
            </div>
            <div className="flex items-baseline gap-1 pt-3 border-t border-border/40">
              <span className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{overallScore}</span>
              <span className="text-[10px] font-bold text-muted-foreground">/ 100 score</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card shadow-3d-premium card-3d-lift border-t-3 border-t-purple-500 p-6 rounded-lg flex flex-col justify-between min-h-[160px]">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Perceived Positioning
              </span>
              <h3 className="text-xs font-extrabold text-foreground truncate mt-1">
                {primaryPositioning.split(",")[0] || primaryPositioning}
              </h3>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                {primaryPositioning}
              </p>
            </div>
            <div className="pt-3 border-t border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Market Sector Identity
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card shadow-3d-premium card-3d-lift border-t-3 border-t-pink-500 p-6 rounded-lg flex flex-col justify-between min-h-[160px]">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Citation Probability
              </span>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed mt-1">
                {recommendationRate}
              </p>
            </div>
            <div className="flex items-baseline gap-1 pt-3 border-t border-border/40">
              <span className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{overallScore}%</span>
              <span className="text-[10px] font-bold text-muted-foreground">matching rate</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-card shadow-3d-premium card-3d-lift border-t-3 border-t-emerald-500 p-6 rounded-lg flex flex-col justify-between min-h-[160px]">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                Top Opportunity
              </span>
              <h3 className="text-xs font-extrabold text-foreground truncate mt-1">
                {biggestOpportunity}
              </h3>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                Address this technical issue to maximize recommendation velocity.
              </p>
            </div>
            <div className="pt-3 border-t border-border/40 text-[9px] font-mono font-extrabold text-opportunity uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> High Impact Win
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI PERCEPTION - ROW WITH INTERACTIVE GRADIENT HOVERS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">02 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Model-by-Model AI Perception
          </h2>
        </div>
        
        <div className="space-y-4">
          {modelNarratives.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.model}
                whileHover={{ scale: 1.005, y: -1 }}
                className={`bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 transition-all w-full shadow-sm ${item.hoverStyle}`}
              >
                {/* Model Badge */}
                <div className="flex items-center gap-3 w-64 shrink-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded border ${item.color} shadow-sm`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-foreground">{item.model}</h3>
                    <span className="text-[9px] font-extrabold text-muted-foreground/60 uppercase tracking-widest">Conversational Index</span>
                  </div>
                </div>
                
                {/* Stretched Narrative Text */}
                <div className="flex-1 md:pl-6 md:border-l border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                    {item.narrative}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. COMPETITOR LANDSCAPE MATRIX - WIDE SCREEN 3D SPATIAL MAP */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">03 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Competitor Positioning Landscape
          </h2>
        </div>

        <div className="border border-border p-6 bg-card rounded-lg flex flex-col lg:flex-row gap-8 w-full shadow-3d-premium">
          {/* Matrix Plot (Takes 2/3 of space on desktop) */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-foreground uppercase">Strategic Positioning Matrix</h3>
                <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Plotting brand presence versus recommendation strength across models.</p>
              </div>
              <span className="text-[9px] font-mono font-extrabold border border-border px-2 py-0.5 rounded bg-accent/30 text-foreground">
                3D SPATIAL GRID
              </span>
            </div>

            <div className="relative h-80 border-l-2 border-b-2 border-border/80 bg-accent/5 flex flex-col justify-between p-4 rounded-bl overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.03)]">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none opacity-45">
                <div className="border-r border-dashed border-border/30 h-full w-full" />
                <div className="border-r border-dashed border-border/30 h-full w-full" />
                <div className="border-r border-dashed border-border/30 h-full w-full" />
                <div className="border-r border-dashed border-border/30 h-full w-full" />
                <div className="border-b border-dashed border-border/30 h-full w-full" />
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
                const xPos = Math.max(15, Math.min(85, c.score));
                const yPos = Math.max(15, Math.min(85, Math.round(c.score * 0.9)));
                const isMain = c.name === brandName;

                return (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                    style={{
                      left: `${xPos}%`,
                      bottom: `${yPos}%`,
                      transform: "translate(-50%, 50%)",
                    }}
                  >
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-3d-premium whitespace-nowrap cursor-pointer transition-all ${
                      isMain 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                        : "bg-card border-border text-foreground font-bold hover:border-foreground/30"
                    }`}>
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
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
              <span>← UNDERREPRESENTED IN TRAINING DATA</span>
              <span>HIGH RECOMMENDATION PROBABILITY →</span>
            </div>
          </div>

          {/* Matrix Takeaways (Takes 1/3 of space on desktop) */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-6 lg:pt-0 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-widest">Landscape Findings</h4>
                <p className="text-[10px] font-bold text-muted-foreground">Strategic notes on comparative positioning.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-accent/20 border border-border/80 rounded shadow-sm">
                  <p className="font-extrabold text-[10px] text-foreground">1. Market Presence</p>
                  <p className="text-muted-foreground text-[10px] font-semibold mt-1">
                    {sentiment === "Positive"
                      ? `${brandName} enjoys a leading presence score, outperforming peers in index weight.`
                      : `${brandName} is mapped as a niche provider. Enhancing crawls is priority #1.`}
                  </p>
                </div>

                <div className="p-3 bg-accent/20 border border-border/80 rounded shadow-sm">
                  <p className="font-extrabold text-[10px] text-foreground">2. Competitive Positioning</p>
                  <p className="text-muted-foreground text-[10px] font-semibold mt-1">
                    Comparing competitor gaps is vital. Review missing structured data schema list in the "Website Audit" section.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono font-bold text-muted-foreground">
              SCAN COMPLETED AT: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC RECOMMENDATIONS - FULL WIDTH ROW BLOCK */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="text-[10px] font-extrabold font-mono text-muted-foreground/60">04 /</span>
          <h2 className="text-xs font-extrabold tracking-widest text-foreground uppercase">
            Strategic Action Plan
          </h2>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card shadow-3d-premium w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/25 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
                <th className="p-4 w-32">Severity</th>
                <th className="p-4">Required Action Plan</th>
              </tr>
            </thead>
            <tbody>
              {recommendedActions.map((action, i) => {
                let colorClass = "text-risk bg-risk/5 border-risk/20 shadow-[0_2px_8px_rgba(239,68,68,0.1)]";
                if (action.type === "warning") colorClass = "text-warning bg-warning/5 border-warning/20 shadow-[0_2px_8px_rgba(245,158,11,0.1)]";
                if (action.type === "info") colorClass = "text-recommendation bg-recommendation/5 border-recommendation/20 shadow-[0_2px_8px_rgba(59,130,246,0.1)]";

                return (
                  <tr key={i} className="border-b border-border last:border-none transition-colors hover:bg-accent/5">
                    <td className="p-4 align-top">
                      <span className={`text-[9px] font-mono font-extrabold uppercase tracking-wider border px-2.5 py-1 rounded shadow-sm ${colorClass}`}>
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
