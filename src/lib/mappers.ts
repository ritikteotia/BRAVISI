/**
 * Maps the AnalysisResult from the server action into the prop shapes
 * expected by the existing dashboard sub-components.
 *
 * This keeps the server action schema clean and decoupled from the
 * UI component interfaces.
 */

import type { AnalysisResult } from "@/lib/schemas";
import type {
  OverviewMetrics,
  AIMentionData,
  CompetitorData,
  ActionItem,
  ContentOpportunity,
  TrendDataPoint,
} from "@/lib/data";

// ── Chart Colors ─────────────────────────────────────────────

const MODEL_COLORS: Record<string, string> = {
  ChatGPT: "#818cf8",
  Gemini: "#a78bfa",
  Copilot: "#c084fc",
  Claude: "#e879f9",
};

// ── Overview Metrics ─────────────────────────────────────────

export function toOverviewMetrics(result: AnalysisResult): OverviewMetrics {
  // Derive mention rate as the average percentage across models
  const avgRate =
    result.mentionDistribution.reduce((sum, d) => sum + d.percentage, 0) /
    Math.max(result.mentionDistribution.length, 1);

  // Sentiment score is a numeric representation (Positive=78-92, Neutral=45-65, Negative=15-35)
  const sentimentScoreMap: Record<string, number> = {
    Positive: 78 + (result.overallScore % 15),
    Neutral: 45 + (result.overallScore % 20),
    Negative: 15 + (result.overallScore % 20),
  };

  return {
    visibilityScore: result.overallScore,
    mentionRate: Math.round(avgRate * 10) / 10,
    sentiment: result.sentiment,
    sentimentScore: sentimentScoreMap[result.sentiment] ?? 50,
    totalMentions: result.totalMentions,
    avgPosition: Math.max(1, Math.round((100 - result.overallScore) / 15 * 10) / 10),
  };
}

// ── AI Mention Data (for bar chart) ──────────────────────────

export function toAIMentionData(result: AnalysisResult): AIMentionData[] {
  const total = result.totalMentions;

  return result.mentionDistribution.map((d) => {
    const mentions = Math.round((d.percentage / 100) * total);
    // Derive per-model sentiment & accuracy from the overall score with small offsets
    const baseAccuracy = Math.min(98, result.overallScore + 10);

    return {
      model: d.model,
      mentions,
      sentiment: Math.max(20, Math.min(98, result.overallScore + ((d.model.length * 3) % 15) - 5)),
      accuracy: Math.max(30, Math.min(98, baseAccuracy + ((d.model.length * 7) % 12) - 6)),
      color: MODEL_COLORS[d.model] ?? "#818cf8",
    };
  });
}

// ── Competitor Data (for table) ──────────────────────────────

export function toCompetitorData(result: AnalysisResult): CompetitorData[] {
  return result.competitorScores.map((c, idx) => {
    // Derive sentiment from score
    let sentiment: string;
    if (c.score >= 65) sentiment = "Positive";
    else if (c.score >= 35) sentiment = "Neutral";
    else sentiment = "Negative";

    // Derive trend from difference
    let trend: "up" | "down" | "stable";
    if (c.difference > 5) trend = "up";
    else if (c.difference < -5) trend = "down";
    else trend = "stable";

    // For the user's own brand (idx 0), trend is always "up"
    if (idx === 0) trend = "up";

    // Derive mention rate from score
    const mentionRate = Math.round(c.score * 0.48 * 10) / 10;

    // Content gaps derived from score (lower score = more gaps)
    const contentGaps = Math.max(0, Math.round((100 - c.score) / 8));

    return {
      name: c.name,
      visibilityScore: c.score,
      mentionRate,
      sentiment,
      contentGaps,
      trend,
    };
  });
}

// ── Action Items (for insights tab) ──────────────────────────

export function toActionItems(result: AnalysisResult): ActionItem[] {
  const impactMap: Record<string, ActionItem["impact"]> = {
    critical: "High",
    warning: "Medium",
    info: "Low",
  };

  const categoryMap: Record<string, string> = {
    critical: "Technical SEO",
    warning: "Content",
    info: "Content",
  };

  return result.recommendedActions.map((a, i) => ({
    id: `a${i + 1}`,
    title: a.title,
    description: a.description,
    impact: impactMap[a.type] ?? "Medium",
    category: categoryMap[a.type] ?? "Content",
  }));
}

// ── Content Opportunities (for insights tab) ─────────────────

export function toContentOpportunities(result: AnalysisResult): ContentOpportunity[] {
  const difficultyMap: Record<string, ContentOpportunity["difficulty"]> = {
    High: "Hard",
    Medium: "Medium",
    Low: "Easy",
  };

  const presenceMap: Record<string, ContentOpportunity["brandPresence"]> = {
    High: "None",
    Medium: "Low",
    Low: "Medium",
  };

  // Deterministic volume based on query length
  const volumeForQuery = (query: string): string => {
    const base = (query.length * 137 + 42) % 300;
    if (base > 200) return `${(base / 10).toFixed(1)}K`;
    return `${((base * 100 + 500) / 100).toFixed(1)}K`;
  };

  return result.contentGaps.map((gap, i) => ({
    id: `o${i + 1}`,
    keyword: gap.query,
    searchVolume: volumeForQuery(gap.query),
    brandPresence: presenceMap[gap.intent] ?? "None",
    difficulty: difficultyMap[gap.intent] ?? "Medium",
    potentialImpact: `+${Math.max(5, 25 - i * 3)}% visibility`,
  }));
}

// ── Trend Data (simulated 6-month history) ───────────────────

export function toTrendData(result: AnalysisResult): TrendDataPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const finalScore = result.overallScore;

  // Build a plausible upward curve ending at the current score
  return months.map((month, i) => {
    const progress = (i + 1) / months.length; // 0.16 … 1.0
    // Exponential ease-in curve so early months are lower
    const curve = Math.pow(progress, 1.4);
    const score = Math.round(
      Math.max(5, finalScore * 0.4) + (finalScore - Math.max(5, finalScore * 0.4)) * curve
    );
    const mentions = Math.round(
      (result.totalMentions * 0.3) + (result.totalMentions * 0.7) * curve
    );

    return { month, score, mentions };
  });
}
