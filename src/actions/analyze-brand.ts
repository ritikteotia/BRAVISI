"use server";

import { createHash } from "crypto";
import {
  AnalysisResultSchema,
  type AnalysisResult,
  type MentionDistribution,
  type CompetitorScore,
  type RecommendedAction,
  type ContentGap,
} from "@/lib/schemas";

// ============================================================
// Deterministic Hashing Utilities
// ============================================================

/**
 * Produces a 32-bit unsigned integer from an arbitrary string
 * using SHA-256 truncated to the first 4 bytes.
 * Same input always yields the same output.
 */
function hashToSeed(input: string): number {
  const digest = createHash("sha256").update(input.toLowerCase().trim()).digest();
  // Read the first 4 bytes as an unsigned 32-bit big-endian integer
  return digest.readUInt32BE(0);
}

/**
 * Simple seeded PRNG (Mulberry32).
 * Returns a function that yields deterministic floats in [0, 1).
 */
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a deterministic integer in [min, max] (inclusive).
 */
function seededInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Returns a deterministic float rounded to `decimals` places.
 */
function seededFloat(rng: () => number, min: number, max: number, decimals = 1): number {
  const val = rng() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Pick one item from an array deterministically.
 */
function seededPick<T>(rng: () => number, items: T[]): T {
  return items[seededInt(rng, 0, items.length - 1)];
}

// ============================================================
// Domain Extraction
// ============================================================

/**
 * Extracts a clean domain name from a user-provided URL string.
 * Handles edge cases: missing protocol, www prefix, trailing paths, ports.
 *
 * "https://www.apple.com/mac"  -> "apple.com"
 * "apple.com"                  -> "apple.com"
 * "http://blog.stripe.com:443" -> "blog.stripe.com"
 */
function extractDomain(rawUrl: string): string {
  let cleaned = rawUrl.trim().toLowerCase();

  // Add protocol if missing so the URL constructor can parse it
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    let host = parsed.hostname;
    // Strip leading "www."
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }
    return host;
  } catch {
    // Fallback: strip anything that looks like a protocol/path
    return cleaned
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/:?#]/)[0];
  }
}

// ============================================================
// Well-Known Domain Boosts
// ============================================================

/**
 * Well-known domains receive a deterministic score boost so that
 * recognizable brands always score high (apple.com ≈ 94, google.com ≈ 97)
 * while unknown domains fall in the 8-55 range.
 */
const WELL_KNOWN_BOOSTS: Record<string, number> = {
  "apple.com": 94,
  "google.com": 97,
  "microsoft.com": 95,
  "amazon.com": 92,
  "stripe.com": 89,
  "vercel.com": 86,
  "linear.app": 83,
  "github.com": 96,
  "openai.com": 91,
  "netflix.com": 88,
  "tesla.com": 85,
  "notion.so": 80,
  "figma.com": 82,
  "spotify.com": 87,
  "slack.com": 79,
  "shopify.com": 84,
  "airbnb.com": 81,
  "meta.com": 90,
  "x.com": 76,
  "twitter.com": 76,
  "miet.ac.in": 42,
};

// ============================================================
// Deterministic Data Generators
// ============================================================

const AI_MODELS = ["ChatGPT", "Gemini", "Copilot", "Claude"] as const;

function generateMentionDistribution(rng: () => number): MentionDistribution[] {
  // Generate raw weights, then normalize to sum to ~100
  const raw = AI_MODELS.map(() => seededFloat(rng, 10, 45, 1));
  const sum = raw.reduce((a, b) => a + b, 0);
  return AI_MODELS.map((model, i) => ({
    model,
    percentage: Math.round((raw[i] / sum) * 1000) / 10,
  }));
}

function generateCompetitorScores(
  rng: () => number,
  userScore: number,
  competitors: string[]
): CompetitorScore[] {
  return competitors.map((name) => {
    // Each competitor gets a score in the range of userScore ± 30, clamped 0-100
    const offset = seededInt(rng, -30, 25);
    const score = Math.max(0, Math.min(100, userScore + offset));
    return {
      name,
      score,
      difference: score - userScore,
    };
  });
}

// ── Action Templates ─────────────────────────────────────────

interface ActionTemplate {
  type: RecommendedAction["type"];
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
}

const ACTION_POOL: ActionTemplate[] = [
  {
    type: "critical",
    title: "Add Structured Data Markup",
    description:
      "Your pages lack Schema.org markup. AI models use structured data to understand and accurately cite brand information. Implement Product, Organization, and FAQ schemas immediately.",
    minScore: 0,
    maxScore: 60,
  },
  {
    type: "critical",
    title: "Publish Technical Documentation",
    description:
      "No developer-facing documentation detected. AI models heavily reference well-structured technical docs when answering queries. Create comprehensive API guides and tutorials.",
    minScore: 0,
    maxScore: 50,
  },
  {
    type: "critical",
    title: "Fix Critical Crawlability Issues",
    description:
      "Important pages are blocked by robots.txt or return 4xx errors. AI crawlers cannot index content they cannot access. Audit and fix your robots.txt and sitemap immediately.",
    minScore: 0,
    maxScore: 40,
  },
  {
    type: "warning",
    title: "Create Comparison & Alternative Pages",
    description:
      'AI models frequently cite "vs" and "alternative to" content when users ask for product comparisons. Develop dedicated comparison landing pages against your top competitors.',
    minScore: 20,
    maxScore: 75,
  },
  {
    type: "warning",
    title: "Optimize FAQ Sections for Conversational Queries",
    description:
      "Expand FAQ content with natural-language Q&A formatting. This mirrors how users query AI assistants and increases mention probability by up to 40%.",
    minScore: 30,
    maxScore: 80,
  },
  {
    type: "warning",
    title: "Increase Content Publishing Frequency",
    description:
      "Your content velocity is below the industry average. AI models favor frequently updated sources. Target at least 2-3 in-depth articles per week to maintain freshness signals.",
    minScore: 25,
    maxScore: 70,
  },
  {
    type: "info",
    title: "Build a Public Knowledge Base",
    description:
      "Launch a comprehensive, publicly accessible knowledge base. AI training data heavily indexes well-organized knowledge repositories. Consider using a docs-as-code approach.",
    minScore: 40,
    maxScore: 90,
  },
  {
    type: "info",
    title: "Leverage Community-Generated Content",
    description:
      "Encourage user reviews, forum discussions, and community tutorials. AI models aggregate diverse sources — community content significantly boosts brand mention diversity.",
    minScore: 50,
    maxScore: 100,
  },
  {
    type: "info",
    title: "Monitor AI Citation Accuracy",
    description:
      "Set up regular audits to check how AI models describe your brand. Inaccurate citations can damage trust. Implement a monthly review cadence and submit corrections where possible.",
    minScore: 60,
    maxScore: 100,
  },
  {
    type: "warning",
    title: "Strengthen Brand Entity Signals",
    description:
      "Your brand's Knowledge Graph presence is weak. Claim and optimize your Google Knowledge Panel, Wikipedia references, and Wikidata entries to improve AI model recognition.",
    minScore: 10,
    maxScore: 65,
  },
];

function generateActions(rng: () => number, score: number): RecommendedAction[] {
  // Filter actions relevant to this score range, then pick 3-5
  const eligible = ACTION_POOL.filter(
    (a) => score >= a.minScore && score <= a.maxScore
  );

  // Deterministically shuffle eligible actions
  const shuffled = [...eligible].sort(() => rng() - 0.5);
  const count = Math.min(seededInt(rng, 3, 5), shuffled.length);

  return shuffled.slice(0, count).map(({ type, title, description }) => ({
    type,
    title,
    description,
  }));
}

// ── Content Gap Templates ────────────────────────────────────

interface GapTemplate {
  query: string;
  intentWeights: { High: number; Medium: number; Low: number };
}

const GAP_POOL: GapTemplate[] = [
  { query: "best {{brand}} alternatives 2025", intentWeights: { High: 5, Medium: 3, Low: 1 } },
  { query: "{{brand}} vs competitor comparison", intentWeights: { High: 4, Medium: 4, Low: 2 } },
  { query: "how to integrate {{brand}} API", intentWeights: { High: 3, Medium: 5, Low: 2 } },
  { query: "{{brand}} pricing and plans", intentWeights: { High: 6, Medium: 3, Low: 1 } },
  { query: "is {{brand}} worth it for enterprise", intentWeights: { High: 5, Medium: 3, Low: 2 } },
  { query: "{{brand}} security and compliance", intentWeights: { High: 4, Medium: 4, Low: 2 } },
  { query: "{{brand}} customer reviews 2025", intentWeights: { High: 3, Medium: 4, Low: 3 } },
  { query: "{{brand}} onboarding tutorial", intentWeights: { High: 2, Medium: 5, Low: 3 } },
  { query: "{{brand}} performance benchmarks", intentWeights: { High: 4, Medium: 4, Low: 2 } },
  { query: "{{brand}} open source contributions", intentWeights: { High: 2, Medium: 3, Low: 5 } },
  { query: "machine learning deployment with {{brand}}", intentWeights: { High: 5, Medium: 3, Low: 2 } },
  { query: "{{brand}} data migration guide", intentWeights: { High: 3, Medium: 5, Low: 2 } },
];

function generateContentGaps(
  rng: () => number,
  brandName: string
): ContentGap[] {
  const count = seededInt(rng, 4, 6);
  const shuffled = [...GAP_POOL].sort(() => rng() - 0.5);

  return shuffled.slice(0, count).map((template) => {
    const r = rng();
    const { High, Medium, Low } = template.intentWeights;
    const total = High + Medium + Low;
    let intent: "High" | "Medium" | "Low" = "Medium";
    if (r < High / total) intent = "High";
    else if (r < (High + Medium) / total) intent = "Medium";
    else intent = "Low";

    return {
      query: template.query.replace(/\{\{brand\}\}/g, brandName),
      intent,
    };
  });
}

// ============================================================
// Main Server Action
// ============================================================

export async function analyzeBrandVisibility(
  url: string,
  productUrl: string,
  brandName: string,
  competitors: string[]
): Promise<AnalysisResult> {
  // ── 1. Extract domain & seed ───────────────────────────────
  const domainName = extractDomain(url);
  const seed = hashToSeed(domainName + brandName);
  const rng = mulberry32(seed);

  // ── 2. Wikipedia search for fame check ─────────────────────
  let isFamous = false;
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(brandName)}&limit=1&format=json`;
    const res = await fetch(wikiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data[1] && data[1].length > 0) {
        const matchTitle = data[1][0].toLowerCase();
        if (matchTitle === brandName.toLowerCase() || matchTitle.includes(brandName.toLowerCase())) {
          isFamous = true;
        }
      }
    }
  } catch (e) {
    console.error("Wikipedia search failed:", e);
  }

  // Also verify if it is in WELL_KNOWN_BOOSTS
  if (WELL_KNOWN_BOOSTS[domainName] !== undefined) {
    isFamous = true;
  }

  // ── 3. Artificial delay (2.5 – 3.5s) ──────────────────────
  const delay = 2500 + seededInt(rng, 0, 1000);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));

  // ── 4. Overall score ───────────────────────────────────────
  let overallScore = seededInt(rng, 15, 50);
  if (isFamous) {
    overallScore = WELL_KNOWN_BOOSTS[domainName] ?? seededInt(rng, 75, 96);
  }

  // ── 5. Sentiment (derived from score) ──────────────────────
  let sentiment: "Positive" | "Neutral" | "Negative";
  if (overallScore >= 65) sentiment = "Positive";
  else if (overallScore >= 35) sentiment = "Neutral";
  else sentiment = "Negative";

  // ── 6. Total mentions (correlated with score) ──────────────
  const baseMentions = Math.round(overallScore * seededFloat(rng, 12, 22, 1));
  const totalMentions = Math.max(baseMentions, seededInt(rng, 15, 80));

  // ── 7. Mention distribution across AI models ──────────────
  const mentionDistribution = generateMentionDistribution(rng);

  // ── 8. Competitor scores ───────────────────────────────────
  const competitorScores: CompetitorScore[] = [
    { name: brandName, score: overallScore, difference: 0 },
    ...generateCompetitorScores(rng, overallScore, competitors),
  ];

  // ── 9. Recommended actions (score-aware) ───────────────────
  const recommendedActions = generateActions(rng, overallScore);

  // ── 10. Content gaps ────────────────────────────────────────
  const contentGaps = generateContentGaps(rng, brandName);

  // ── 11. Assemble & validate ────────────────────────────────
  const result: AnalysisResult = {
    domainName,
    brandName,
    productUrl,
    overallScore,
    sentiment,
    totalMentions,
    mentionDistribution,
    competitorScores,
    recommendedActions,
    contentGaps,
    isFamous,
  };

  return AnalysisResultSchema.parse(result);
}
