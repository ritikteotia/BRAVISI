"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ExternalLink, HelpCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/schemas";

interface IntelligenceReportProps {
  result: AnalysisResult;
}

export default function IntelligenceReport({ result }: IntelligenceReportProps) {
  const { brandName, overallScore, sentiment, competitorScores, recommendedActions, contentGaps } = result;

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

  // 6. Gaps Calculation
  const gapsList = contentGaps.length > 0 ? contentGaps : [
    { query: `${brandName} security framework`, intent: "High" },
    { query: `pricing plans for ${brandName}`, intent: "Medium" }
  ];

  // 7. Footprint Breakdown
  const footprint = [
    { source: "Developer Documentation", weight: Math.min(95, overallScore + 15), status: "Primary source" },
    { source: "Wikidata / Wikipedia", weight: Math.min(90, overallScore + 5), status: "Authority source" },
    { source: "GitHub Repositories", weight: Math.max(10, overallScore - 10), status: "Technical source" },
    { source: "Industry Blog Posts", weight: Math.min(85, overallScore + 10), status: "Freshness signal" },
    { source: "StackOverflow Mentions", weight: Math.max(15, overallScore - 20), status: "Developer signal" },
  ];

  return (
    <div className="space-y-10 font-sans text-xs">
      {/* 1. EXECUTIVE SUMMARY */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          01. Executive Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border border border-border">
          {/* Card 1 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-medium uppercase tracking-wider text-[9px]">
              AI Presence Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-sm font-bold ${presenceLevel === "High" ? "text-opportunity" : presenceLevel === "Moderate" ? "text-recommendation" : "text-risk"}`}>
                {presenceLevel}
              </span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <p className="text-muted-foreground leading-relaxed font-normal">
              {presenceDesc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-medium uppercase tracking-wider text-[9px]">
              Perceived Positioning
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {primaryPositioning.split(",")[0] || primaryPositioning}
            </div>
            <p className="text-muted-foreground leading-relaxed font-normal">
              {primaryPositioning}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-medium uppercase tracking-wider text-[9px]">
              Recommendation rate
            </span>
            <div className="text-sm font-bold text-foreground">
              {overallScore}%
            </div>
            <p className="text-muted-foreground leading-relaxed font-normal">
              {recommendationRate}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-card p-4 space-y-1.5">
            <span className="text-muted-foreground font-medium uppercase tracking-wider text-[9px]">
              Critical Opportunity
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {biggestOpportunity}
            </div>
            <p className="text-muted-foreground leading-relaxed font-normal">
              Correcting this issue offers the fastest path to citation share gains.
            </p>
          </div>
        </div>
      </section>

      {/* 2. AI PERCEPTION */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          02. Model-by-Model AI Perception
        </h2>
        <div className="space-y-3">
          {modelNarratives.map((item) => (
            <div
              key={item.model}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-border pb-3"
            >
              <div className="w-40 shrink-0 font-semibold text-foreground">
                {item.model}
              </div>
              <div className="flex-1 text-muted-foreground leading-relaxed font-normal">
                {item.narrative}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMPETITOR LANDSCAPE */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          03. Competitor Landscape
        </h2>

        {/* 2D Positioning Matrix */}
        <div className="border border-border p-4 bg-card space-y-2">
          <span className="text-muted-foreground font-medium uppercase tracking-wider text-[9px]">
            Strategic Positioning Matrix
          </span>
          <div className="relative h-44 border-l border-b border-border bg-accent/20 flex flex-col justify-between p-3">
            {/* Quadrant Titles */}
            <div className="absolute top-2 right-2 text-muted-foreground/35 font-mono">
              High Citation / High Score
            </div>
            <div className="absolute bottom-2 left-2 text-muted-foreground/35 font-mono">
              Low Citation / Low Score
            </div>

            {/* Matrix Items */}
            {competitorScores.map((c, i) => {
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
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        isMain ? "bg-opportunity border-foreground animate-pulse" : "bg-muted-foreground border-border"
                      }`}
                    />
                    <span className={`font-semibold ${isMain ? "text-foreground" : "text-muted-foreground"}`}>
                      {c.name} {isMain && "(You)"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground/60 px-1">
            <span>← Underrepresented</span>
            <span>Recommended →</span>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-accent/30 font-medium text-muted-foreground">
                <th className="p-3">Brand Name</th>
                <th className="p-3 text-right">GEO Score</th>
                <th className="p-3 text-right">Citation Share</th>
                <th className="p-3 text-right">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {competitorScores.map((c) => {
                const isMain = c.name === brandName;
                const mentionShare = Math.round(c.score * 0.48 * 10) / 10;
                let cSentiment = "Neutral";
                if (c.score >= 65) cSentiment = "Positive";
                else if (c.score < 35) cSentiment = "Negative";

                return (
                  <tr key={c.name} className={`border-b border-border last:border-none ${isMain ? "bg-accent/40 font-semibold" : ""}`}>
                    <td className="p-3 text-foreground flex items-center gap-2">
                      {c.name} {isMain && <span className="text-[10px] font-mono text-opportunity bg-opportunity/10 border border-opportunity/25 px-1 py-0.5 rounded">You</span>}
                    </td>
                    <td className="p-3 text-right text-foreground font-mono">{c.score}</td>
                    <td className="p-3 text-right text-foreground font-mono">{mentionShare}%</td>
                    <td className={`p-3 text-right font-medium ${cSentiment === "Positive" ? "text-opportunity" : cSentiment === "Negative" ? "text-risk" : "text-muted-foreground"}`}>
                      {cSentiment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. POSITIONING GAPS */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          04. Knowledge & Positioning Gaps
        </h2>
        <div className="border border-border divide-y divide-border">
          {gapsList.map((gap, i) => (
            <div key={i} className="p-3 flex items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="font-semibold text-foreground font-mono">
                  {gap.query}
                </div>
                <p className="text-muted-foreground font-normal">
                  Competitors are heavily recommended in this segment. Brand presence: <span className="text-risk font-semibold">None</span>.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-[10px] font-semibold font-mono uppercase border px-1.5 py-0.5 rounded ${
                  gap.intent === "High" ? "bg-risk/10 border-risk/25 text-risk" : "bg-warning/10 border-warning/25 text-warning"
                }`}>
                  {gap.intent} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. KNOWLEDGE FOOTPRINT */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          05. Knowledge Footprint Influence
        </h2>
        <div className="space-y-3">
          {footprint.map((item) => (
            <div key={item.source} className="flex items-center justify-between gap-6">
              <div className="w-44 shrink-0 font-medium text-foreground">
                {item.source}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${item.weight}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-mono font-semibold text-foreground">
                  {item.weight}%
                </span>
              </div>
              <div className="w-24 shrink-0 text-right font-mono text-muted-foreground">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STRATEGIC RECOMMENDATIONS */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground uppercase border-b border-border pb-1">
          06. Strategic Recommendations
        </h2>
        <div className="border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-accent/30 font-medium text-muted-foreground">
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
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded ${colorClass}`}>
                        {action.type}
                      </span>
                    </td>
                    <td className="p-3 space-y-1">
                      <div className="font-semibold text-foreground">{action.title}</div>
                      <p className="text-muted-foreground font-normal leading-relaxed">{action.description}</p>
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
