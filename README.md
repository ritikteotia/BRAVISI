# BRAVISI — AI Brand Visibility Intelligence

Bravisi is a premium, presentation-ready SaaS platform that helps B2B and enterprise brands measure, analyze, and optimize their visibility footprint across major Large Language Models (LLMs) and conversational search engines, including ChatGPT, Gemini, Microsoft Copilot, and Anthropic Claude.

---

## 🚀 Key Features

### 1. Brand AI Metrics Scan
*   **AI Visibility Score**: Benchmark your brand's authority footprint from 0 to 100.
*   **Per-Model Mention Rate**: Detailed percentage-based breakdowns of citation references across ChatGPT, Gemini, Claude, and Copilot.
*   **Sentiment & Accuracy Analysis**: Track the tone (Positive, Neutral, Negative) and factual alignment of AI-generated brand mentions.
*   **Visual Trend Analytics**: View month-over-month visibility progression charts built using high-performance Recharts.
*   **Competitor Benchmarks**: Dynamic comparison dashboards to monitor competitor mention rates, sentiment, and visibility differences.

### 2. Executive Report (Powered by Gemini 2.5)
*   **Structured AI Generation**: Interfaces directly with the official Google Gen AI SDK utilizing a strict JSON schema model (`gemini-2.5-flash`).
*   **Content Gap Analysis**: Clear diagnostic checks on where LLMs lack training corpora to cite your brand.
*   **Actionable Editorial Backlog**: Detailed list of target articles, keywords, and priority levels needed to overwrite citation gaps.
*   **LLM Crawler Registry**: Curated list of high-importance developer hubs, directories (G2, ProductHunt, GitHub), and registries heavily crawled by AI engines.
*   **Technical Optimization Strategy**: Roadmap detailing pillars (like Schema Markup, Entity Association, and Docs Structure) alongside concrete engineering tasks.
*   **Print & Export Utility**: Executive-ready print stylesheets and copy-to-clipboard actions to share reports instantly.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16+ (App Router, React Server Actions)
*   **Language**: TypeScript (Strict typing for structured payloads)
*   **Styling**: Tailwind CSS v4 & custom oklch CSS variables
*   **SDK**: Official `@google/genai` (Google Gen AI SDK)
*   **Libraries**:
    *   `recharts` — Visual data representation
    *   `framer-motion` — Staggered micro-animations and transitions
    *   `lucide-react` — SVG icons
    *   `zod` — Runtime schema validation

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have Node.js 18+ installed on your system.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of your project:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> ⚠️ **Important**: Never commit your `.env.local` file to source control. It is already added to `.gitignore` to prevent secret leakage.

### 4. Running Locally
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Production Build
Verify typings and build the Next.js production bundle:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── actions/
│   ├── analyze-brand.ts      # Deterministic scanner backend action
│   └── generate-report.ts    # Gemini Gen AI structured report server action
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard container & tab system
│   ├── globals.css           # Global typography & design system tokens
│   ├── layout.tsx            # Global metadata & theme wrapper
│   └── page.tsx              # Brand landing page
├── components/
│   ├── dashboard/
│   │   ├── professional-report.tsx  # Executive report UI layout
│   │   ├── score-ring.tsx           # Animated SVG score visualizer
│   │   ├── overview-cards.tsx       # KPI widgets
│   │   ├── mention-chart.tsx        # Mention bars (Recharts)
│   │   ├── trend-chart.tsx          # Trend curves (Recharts)
│   │   ├── competitor-table.tsx     # Benchmarks grid table
│   │   └── insights.tsx             # Actionable tabs
│   └── ui/                          # Shadcn UI primitives
└── lib/
    ├── data.ts               # Standard mockup schemas & interfaces
    ├── mappers.ts            # Data adapters for dashboard props
    └── schemas.ts            # Zod validation models
```

---

## 🔒 Security & Best Practices
*   **Strict JSON Outlining**: The Gemini SDK uses the structured `responseSchema` parameters to validate response models before delivery, preventing parsing errors.
*   **Isolation of Secrets**: All API logic resides on the server using Server Actions; your API key is never exposed to the client-side browser.
*   **Design Standards**: Fully mobile-responsive layouts, custom dark themes, custom scrollbars, and optimized print layouts.
