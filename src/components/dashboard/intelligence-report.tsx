"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/schemas";

interface IntelligenceReportProps {
  result: AnalysisResult;
}

export default function IntelligenceReport({ result }: IntelligenceReportProps) {
  const { brandName, overallScore, sentiment, competitorScores, recommendedActions } = result;

  // 1. Determine Presence Level
  let presenceLevel = "Low";
  let presenceDesc = "Limited brand footprint in primary model index.";
  if (overallScore >= 75) {
    presenceLevel = "High";
    presenceDesc = "Indexed across all primary training sets and model corpora.";
  } else if (overallScore >= 45) {
    presenceLevel = "Moderate";
    presenceDesc = "Partial presence in training data; missing structured context.";
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
      narrative: `ChatGPT primarily perceives ${brandName} through developer docs and recent tech blogs. Its classification is highly structured. ${
        overallScore >= 70
          ? "It consistently ranks the brand high in technical recommendation lists."
          : "It exhibits a confidence gap regarding enterprise compliance and pricing."
      }`,
    },
    {
      model: "Gemini 2.5",
      narrative: `Gemini draws heavily from Wikidata and structured enterprise entity grids. ${
        overallScore >= 60
          ? "It maps the brand correct to its primary category with strong semantic weight."
          : "Lack of FAQ schema limits Gemini from citing this domain in direct conversational lookups."
      }`,
    },
    {
      model: "Claude 3.5 Sonnet",
      narrative: `Claude focuses on conceptual completeness. ${
        overallScore >= 75
          ? "It provides detailed technical answers praising the brand's modular design."
          : "It mentions competitors more frequently due to a lack of public comparison pages."
      }`,
    },
    {
      model: "Microsoft Copilot",
      narrative: `Copilot pulls from live Bing indexes. ${
        overallScore >= 50
          ? "It cites current feature pricing and blog posts reliably."
          : "It struggles to resolve brand authority because robots.txt locks crawler accessibility."
      }`,
    },
    {
      model: "Perplexity AI",
      narrative: `Perplexity indexes inline citations from recent news. ${
        overallScore >= 70
          ? "Frequently lists the brand as a key resource in niche roundups."
          : "Lacks sufficient reference points, leading it to recommend primary alternatives."
      }`,
    },
  ];

  return (
    <div className="space-y-10 font-sans text-xs">
      {/* 1. EXECUTIVE SUMMARY */}
      <section className="space-y-4">
        <h2 className="text-xs font-extrabold tracking-tight text-foreground uppercase border-b border-border pb-1">
          01. Executive Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border border border-border">
          {/* Card 1 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
              AI Presence Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-sm font-extrabold ${presenceLevel === "High" ? "text-opportunity" : presenceLevel === "Moderate" ? "text-recommendation" : "text-risk"}`}>
                {presenceLevel}
              </span>
              <span className="text-muted-foreground font-bold">/ 100</span>
            </div>
            <p className="text-muted-foreground leading-relaxed font-semibold">
              {presenceDesc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
              Perceived Positioning
            </span>
            <div className="text-sm font-extrabold text-foreground truncate">
              {primaryPositioning.split(",")[0] || primaryPositioning}
            </div>
            <p className="text-muted-foreground leading-relaxed font-semibold">
              {primaryPositioning}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
              Recommendation rate
            </span>
            <div className="text-sm font-extrabold text-foreground">
              {overallScore}%
            </div>
            <p className="text-muted-foreground leading-relaxed font-semibold">
              {recommendationRate}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
              Critical Opportunity
            </span>
            <div className="text-sm font-extrabold text-foreground truncate">
              {biggestOpportunity}
            </div>
            <p className="text-muted-foreground leading-relaxed font-semibold">
              Correcting this issue offers the fastest path to citation share gains.
            </p>
          </div>
        </div>
      </section>

      {/* 2. AI PERCEPTION */}
      <section className="space-y-4">
        <h2 className="text-xs font-extrabold tracking-tight text-foreground uppercase border-b border-border pb-1">
          02. Model-by-Model AI Perception
        </h2>
        <div className="space-y-3">
          {modelNarratives.map((item) => (
            <div
              key={item.model}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-border pb-3"
            >
              <div className="w-40 shrink-0 font-extrabold text-foreground">
                {item.model}
              </div>
              <div className="flex-1 text-muted-foreground leading-relaxed font-semibold">
                {item.narrative}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMPETITOR LANDSCAPE MATRIX */}
      <section className="space-y-4">
        <h2 className="text-xs font-extrabold tracking-tight text-foreground uppercase border-b border-border pb-1">
          03. Competitor Landscape
        </h2>

        {/* 2D Positioning Matrix */}
        <div className="border border-border p-4 bg-card space-y-2">
          <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
            Strategic Positioning Matrix (Presence vs. Recommendations)
          </span>
          <div className="relative h-44 border-l border-b border-border bg-accent/10 flex flex-col justify-between p-3">
            {/* Quadrant Titles */}
            <div className="absolute top-2 right-2 text-muted-foreground/40 font-mono font-bold text-[9px]">
              High Citation / High Score
            </div>
            <div className="absolute bottom-2 left-2 text-muted-foreground/40 font-mono font-bold text-[9px]">
              Low Citation / Low Score
            </div>

            {/* Matrix Items */}
            {competitorScores.map((c) => {
              // Map overall score directly to coordinates
              const xPos = Math.max(10, Math.min(90, c.score));
              const yPos = Math.max(10, Math.min(90, Math.round(c.score * 0.9)));
              const isMain = c.name === brandName;

              return (
                <div
                  key={c.name}
                  className="absolute"
                  style={{
                    left: `${xPos}%`,
                    bottom: `${yPos}%`,
                    transform: "translate(-50%, 50%)",
                  }}
                >
                  <div className="flex items-center gap-1.5 bg-card/85 border border-border/60 px-2 py-0.5 rounded shadow-sm">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isMain ? "bg-opportunity border-foreground animate-pulse" : "bg-recommendation border-border"
                      }`}
                    />
                    <span className={`font-bold text-[10px] ${isMain ? "text-foreground" : "text-muted-foreground"}`}>
                      {c.name} {isMain && "(You)"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[9px] font-bold text-muted-foreground/60 px-1">
            <span>← Underrepresented</span>
            <span>Recommended →</span>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC RECOMMENDATIONS */}
      <section className="space-y-4">
        <h2 className="text-xs font-extrabold tracking-tight text-foreground uppercase border-b border-border pb-1">
          04. Strategic Action Plan
        </h2>
        <div className="border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-accent/20 font-bold text-muted-foreground">
                <th className="p-3 w-28">Severity</th>
                <th className="p-3">Required Action Plan</th>
              </tr>
            </thead>
            <tbody>
              {recommendedActions.map((action, i) => {
                let colorClass = "text-risk bg-risk/10 border-risk/25";
                if (action.type === "warning") colorClass = "text-warning bg-warning/10 border-warning/25";
                if (action.type === "info") colorClass = "text-recommendation bg-recommendation/10 border-recommendation/25";

                return (
                  <tr key={i} className="border-b border-border last:border-none">
                    <td className="p-3 align-top">
                      <span className={`text-[9px] font-mono font-extrabold uppercase tracking-wider border px-1.5 py-0.5 rounded ${colorClass}`}>
                        {action.type}
                      </span>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="font-extrabold text-foreground">{action.title}</div>
                      <p className="text-muted-foreground font-semibold leading-relaxed">{action.description}</p>
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
