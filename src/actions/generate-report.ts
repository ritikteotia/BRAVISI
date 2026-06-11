"use server";

import { GoogleGenAI, Type } from "@google/genai";

// ============================================================
// Types for strict typing between backend and frontend
// ============================================================

export interface VisibilitySummary {
  score: number;
  executiveSummary: string;
  currentSentiment: "Positive" | "Neutral" | "Negative";
}

export interface ContentGapAnalysisItem {
  topic: string;
  searchIntent: "High" | "Medium" | "Low";
  reasoning: string;
}

export interface RecommendedArticle {
  title: string;
  targetKeywords: string[];
  priority: "Critical" | "High" | "Medium";
}

export interface RecommendedDirectory {
  name: string;
  importance: string;
  rationale: string;
}

export interface AISearchOptimizationStrategyItem {
  pillar: string;
  actionableSteps: string[];
}

export interface BrandVisibilityReport {
  visibilitySummary: VisibilitySummary;
  contentGapAnalysis: ContentGapAnalysisItem[];
  recommendedArticles: RecommendedArticle[];
  recommendedDirectories: RecommendedDirectory[];
  aiSearchOptimizationStrategy: AISearchOptimizationStrategyItem[];
}

// ============================================================
// Structured Schema for the Gemini API
// ============================================================

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    visibilitySummary: {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.INTEGER,
          description: "Visibility score (0-100) benchmarking the brand's clear footprint across LLMs.",
        },
        executiveSummary: {
          type: Type.STRING,
          description: "High-level diagnostic paragraph written in an elite B2B tone analyzing why the brand stands where it does.",
        },
        currentSentiment: {
          type: Type.STRING,
          enum: ["Positive", "Neutral", "Negative"],
          description: "The brand's overall sentiment in AI response references.",
        },
      },
      required: ["score", "executiveSummary", "currentSentiment"],
    },
    contentGapAnalysis: {
      type: Type.ARRAY,
      description: "Major content gaps where LLMs lack training context to recommend the brand.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "Name of the topic or search theme." },
          searchIntent: {
            type: Type.STRING,
            enum: ["High", "Medium", "Low"],
            description: "Target search intent level.",
          },
          reasoning: {
            type: Type.STRING,
            description: "Detailed description of why LLMs miss the brand for this topic.",
          },
        },
        required: ["topic", "searchIntent", "reasoning"],
      },
    },
    recommendedArticles: {
      type: Type.ARRAY,
      description: "Specific, high-signal technical content to write and publish to bridge the gaps.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Actionable, developer-focused or enterprise-focused article title.",
          },
          targetKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High-intent keywords.",
          },
          priority: {
            type: Type.STRING,
            enum: ["Critical", "High", "Medium"],
            description: "Publishing priority level.",
          },
        },
        required: ["title", "targetKeywords", "priority"],
      },
    },
    recommendedDirectories: {
      type: Type.ARRAY,
      description: "Developer registries, product directories, and hubs indexed heavily by LLM crawlers.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "e.g., G2, ProductHunt, GitHub, npm registry, specialized registries.",
          },
          importance: {
            type: Type.STRING,
            description: "Critical, Major, or Standard directory significance.",
          },
          rationale: {
            type: Type.STRING,
            description: "Why LLM crawlers index this database heavily for citations.",
          },
        },
        required: ["name", "importance", "rationale"],
      },
    },
    aiSearchOptimizationStrategy: {
      type: Type.ARRAY,
      description: "Concrete engineering-focused roadmap for AI search readiness.",
      items: {
        type: Type.OBJECT,
        properties: {
          pillar: {
            type: Type.STRING,
            description: "Strategic domain, e.g., Schema Markup, Documentation Structure, Entity Association.",
          },
          actionableSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concrete engineering items.",
          },
        },
        required: ["pillar", "actionableSteps"],
      },
    },
  },
  required: [
    "visibilitySummary",
    "contentGapAnalysis",
    "recommendedArticles",
    "recommendedDirectories",
    "aiSearchOptimizationStrategy",
  ],
};

// ============================================================
// Server Action implementation
// ============================================================

export async function generateReport(
  websiteDescription: string,
  brandCategory: string,
  competitors: string[]
): Promise<BrandVisibilityReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }

  // Initialize official client
  const ai = new GoogleGenAI({ apiKey });

  const competitorList = competitors.length > 0 ? competitors.join(", ") : "None specified";

  const prompt = `
You are an elite LLM optimization architect and technical SEO consultant specializing in AI Search Engine Optimization (GEO/AIO).
Generate a comprehensive, executive-ready AI Brand Visibility & Optimization Report for the following brand:

- Brand Website/Description: "${websiteDescription}"
- Brand Category/Niche: "${brandCategory}"
- Competitors: "${competitorList}"

Your analysis must:
1. Benchmark the brand's clear visibility score (0-100) and footprint across leading LLM architectures (e.g., OpenAI GPTs, Google Gemini, Anthropic Claude, Microsoft Copilot).
2. Provide an executive summary of findings in a premium B2B tone.
3. Identify major content gaps where LLMs lack training corpora or context to recommend the brand.
4. Recommend high-priority technical articles (with target keywords) to publish to bridge those gaps.
5. Identify specific developer directories, registries, or product directories (e.g. G2, ProductHunt, GitHub) that LLM crawlers index heavily, explaining why they are critical for this brand.
6. Outline a concrete optimization roadmap with pillars (like Schema Markup, Entity Association, and Docs Structure) and actionable steps.

Ensure the output conforms strictly to the specified JSON schema. Do not output any markdown formatting, preambles, or additional notes outside of the JSON structure.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini API.");
    }

    // Parse structured JSON
    const reportData: BrandVisibilityReport = JSON.parse(text);
    return reportData;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate AI brand visibility report."
    );
  }
}
