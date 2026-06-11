// ============================================================
// BRAVISI — TypeScript Interfaces & Mock Data
// ============================================================

// ── Overview Metrics ─────────────────────────────────────────

export interface OverviewMetrics {
  visibilityScore: number;
  mentionRate: number;
  sentiment: "Positive" | "Neutral" | "Negative" | "Mixed";
  sentimentScore: number;
  totalMentions: number;
  avgPosition: number;
}

// ── AI Model Mention ─────────────────────────────────────────

export interface AIMentionData {
  model: string;
  mentions: number;
  sentiment: number;
  accuracy: number;
  color: string;
}

// ── Competitor ───────────────────────────────────────────────

export interface CompetitorData {
  name: string;
  visibilityScore: number;
  mentionRate: number;
  sentiment: string;
  contentGaps: number;
  trend: "up" | "down" | "stable";
}

// ── Actionable Insight ───────────────────────────────────────

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  category: string;
}

export interface ContentOpportunity {
  id: string;
  keyword: string;
  searchVolume: string;
  brandPresence: "None" | "Low" | "Medium";
  difficulty: "Easy" | "Medium" | "Hard";
  potentialImpact: string;
}

// ── Feature (landing page) ───────────────────────────────────

export interface Feature {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

// ── Trend Data (for charts) ─────────────────────────────────

export interface TrendDataPoint {
  month: string;
  score: number;
  mentions: number;
}

// ============================================================
// MOCK DATA
// ============================================================

export const mockOverview: OverviewMetrics = {
  visibilityScore: 72,
  mentionRate: 34.8,
  sentiment: "Positive",
  sentimentScore: 78,
  totalMentions: 1247,
  avgPosition: 3.2,
};

export const mockAIMentions: AIMentionData[] = [
  { model: "ChatGPT", mentions: 456, sentiment: 82, accuracy: 89, color: "#818cf8" },
  { model: "Gemini", mentions: 328, sentiment: 76, accuracy: 85, color: "#a78bfa" },
  { model: "Copilot", mentions: 267, sentiment: 71, accuracy: 78, color: "#c084fc" },
  { model: "Claude", mentions: 196, sentiment: 88, accuracy: 92, color: "#e879f9" },
];

export const mockCompetitors: CompetitorData[] = [
  {
    name: "Your Brand",
    visibilityScore: 72,
    mentionRate: 34.8,
    sentiment: "Positive",
    contentGaps: 5,
    trend: "up",
  },
  {
    name: "Competitor A",
    visibilityScore: 68,
    mentionRate: 31.2,
    sentiment: "Neutral",
    contentGaps: 8,
    trend: "stable",
  },
  {
    name: "Competitor B",
    visibilityScore: 81,
    mentionRate: 42.1,
    sentiment: "Positive",
    contentGaps: 3,
    trend: "up",
  },
  {
    name: "Competitor C",
    visibilityScore: 45,
    mentionRate: 18.7,
    sentiment: "Negative",
    contentGaps: 12,
    trend: "down",
  },
];

export const mockActions: ActionItem[] = [
  {
    id: "a1",
    title: "Publish Technical Documentation",
    description:
      "Create in-depth technical guides and API documentation. AI models heavily reference well-structured docs when answering developer queries.",
    impact: "High",
    category: "Content",
  },
  {
    id: "a2",
    title: "Add Structured Data Markup",
    description:
      "Implement Schema.org markup across key pages to help AI systems understand and accurately represent your brand information.",
    impact: "High",
    category: "Technical SEO",
  },
  {
    id: "a3",
    title: "Create Comparison Pages",
    description:
      'Develop "vs" comparison content against competitors. AI models frequently cite these when users ask for product comparisons.',
    impact: "Medium",
    category: "Content",
  },
  {
    id: "a4",
    title: "Optimize FAQ Sections",
    description:
      "Expand FAQ content with conversational Q&A formatting. This mirrors how users query AI assistants and increases mention probability.",
    impact: "Medium",
    category: "Content",
  },
  {
    id: "a5",
    title: "Build Public Knowledge Base",
    description:
      "Launch a comprehensive, publicly accessible knowledge base. AI training data heavily indexes well-organized knowledge repositories.",
    impact: "High",
    category: "Content",
  },
];

export const mockOpportunities: ContentOpportunity[] = [
  {
    id: "o1",
    keyword: "AI integrations for enterprise",
    searchVolume: "12.4K",
    brandPresence: "None",
    difficulty: "Medium",
    potentialImpact: "+15% visibility",
  },
  {
    id: "o2",
    keyword: "best API documentation tools",
    searchVolume: "8.1K",
    brandPresence: "Low",
    difficulty: "Easy",
    potentialImpact: "+12% visibility",
  },
  {
    id: "o3",
    keyword: "machine learning deployment guide",
    searchVolume: "22.7K",
    brandPresence: "None",
    difficulty: "Hard",
    potentialImpact: "+22% visibility",
  },
  {
    id: "o4",
    keyword: "developer productivity platforms",
    searchVolume: "15.3K",
    brandPresence: "Low",
    difficulty: "Medium",
    potentialImpact: "+18% visibility",
  },
  {
    id: "o5",
    keyword: "SaaS analytics comparison",
    searchVolume: "6.8K",
    brandPresence: "None",
    difficulty: "Easy",
    potentialImpact: "+9% visibility",
  },
];

export const mockTrendData: TrendDataPoint[] = [
  { month: "Jan", score: 42, mentions: 580 },
  { month: "Feb", score: 48, mentions: 720 },
  { month: "Mar", score: 51, mentions: 810 },
  { month: "Apr", score: 55, mentions: 890 },
  { month: "May", score: 63, mentions: 1050 },
  { month: "Jun", score: 72, mentions: 1247 },
];

export const features: Feature[] = [
  {
    title: "AI Visibility Score",
    description:
      "Get a comprehensive score measuring how prominently your brand appears across all major AI assistants and search systems.",
    icon: "Activity",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    title: "Competitor Analysis",
    description:
      "Compare your AI visibility head-to-head against competitors. Identify where they outrank you and discover strategic advantages.",
    icon: "Users",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Content Gap Detection",
    description:
      "Uncover high-impact content opportunities where AI models actively search for answers but can't find your brand.",
    icon: "Search",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    title: "AI Search Readiness",
    description:
      "Audit your site's technical readiness for AI crawlers. Ensure structured data, schema markup, and content format compliance.",
    icon: "Shield",
    gradient: "from-violet-500/20 to-indigo-500/20",
  },
];
