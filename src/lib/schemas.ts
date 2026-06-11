import { z } from "zod";

// ============================================================
// BRAVISI — Analysis Response Schema (Zod + TypeScript)
// ============================================================

// ── Mention Distribution ─────────────────────────────────────

export const MentionDistributionSchema = z.object({
  model: z.string(),
  percentage: z.number().min(0).max(100),
});

export type MentionDistribution = z.infer<typeof MentionDistributionSchema>;

// ── Competitor Score ─────────────────────────────────────────

export const CompetitorScoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  difference: z.number(), // relative to user's brand, can be negative
});

export type CompetitorScore = z.infer<typeof CompetitorScoreSchema>;

// ── Recommended Action ───────────────────────────────────────

export const RecommendedActionSchema = z.object({
  type: z.enum(["critical", "warning", "info"]),
  title: z.string(),
  description: z.string(),
});

export type RecommendedAction = z.infer<typeof RecommendedActionSchema>;

// ── Content Gap ──────────────────────────────────────────────

export const ContentGapSchema = z.object({
  query: z.string(),
  intent: z.enum(["High", "Medium", "Low"]),
});

export type ContentGap = z.infer<typeof ContentGapSchema>;

// ── Full Analysis Result ─────────────────────────────────────

export const AnalysisResultSchema = z.object({
  domainName: z.string(),
  brandName: z.string(),
  overallScore: z.number().min(0).max(100),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  totalMentions: z.number().int().nonnegative(),
  mentionDistribution: z.array(MentionDistributionSchema),
  competitorScores: z.array(CompetitorScoreSchema),
  recommendedActions: z.array(RecommendedActionSchema),
  contentGaps: z.array(ContentGapSchema),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
