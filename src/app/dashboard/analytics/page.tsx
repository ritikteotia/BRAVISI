"use client";

import { motion } from "framer-motion";
import { PieChart as PieChartIcon, BarChart3, Target, Users, Sparkles } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Heatmap data
const heatmapData = [
  { category: "Documentation", ChatGPT: 82, Gemini: 76, Claude: 69, Copilot: 74 },
  { category: "Authority", ChatGPT: 78, Gemini: 72, Claude: 80, Copilot: 65 },
  { category: "Technical SEO", ChatGPT: 85, Gemini: 88, Claude: 72, Copilot: 79 },
  { category: "Structured Data", ChatGPT: 45, Gemini: 52, Claude: 38, Copilot: 48 },
  { category: "Content Coverage", ChatGPT: 70, Gemini: 68, Claude: 75, Copilot: 62 },
  { category: "AI Citation", ChatGPT: 88, Gemini: 72, Claude: 65, Copilot: 70 },
];

// Radar data
const radarData = [
  { metric: "Brand Recognition", score: 78, fullMark: 100 },
  { metric: "Content Depth", score: 65, fullMark: 100 },
  { metric: "Technical SEO", score: 82, fullMark: 100 },
  { metric: "Community Size", score: 55, fullMark: 100 },
  { metric: "Documentation", score: 72, fullMark: 100 },
  { metric: "Schema Coverage", score: 48, fullMark: 100 },
];

// Competitor positioning data
const positioningData = [
  { brand: "You", geoScore: 78, citationShare: 68, size: 200 },
  { brand: "Comp A", geoScore: 72, citationShare: 55, size: 150 },
  { brand: "Comp B", geoScore: 85, citationShare: 82, size: 250 },
  { brand: "Comp C", geoScore: 45, citationShare: 30, size: 100 },
  { brand: "Comp D", geoScore: 62, citationShare: 48, size: 120 },
];

// Opportunity matrix
const opportunityData = [
  { topic: "API Docs", impact: 90, effort: 30, size: 180 },
  { topic: "FAQ Schema", impact: 85, effort: 20, size: 160 },
  { topic: "Comparisons", impact: 75, effort: 40, size: 140 },
  { topic: "Tutorials", impact: 70, effort: 60, size: 130 },
  { topic: "Case Studies", impact: 55, effort: 50, size: 110 },
  { topic: "Blog Posts", impact: 45, effort: 35, size: 100 },
  { topic: "Videos", impact: 60, effort: 80, size: 120 },
];

const getHeatColor = (value: number) => {
  if (value >= 80) return "bg-emerald-500/30 text-emerald-300";
  if (value >= 60) return "bg-amber-500/25 text-amber-300";
  if (value >= 40) return "bg-orange-500/25 text-orange-300";
  return "bg-red-500/25 text-red-300";
};

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Advanced Visualizations</h1>
        <p className="text-sm text-muted-foreground">Enterprise-grade heatmaps, radar charts, positioning maps, and opportunity matrices.</p>
      </div>

      {/* GEO Heatmap */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm font-semibold">GEO Score Heatmap</CardTitle>
          <CardDescription className="text-xs">Score distribution across AI models and categories</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-muted-foreground p-2">Category</th>
                {["ChatGPT", "Gemini", "Claude", "Copilot"].map((m) => (
                  <th key={m} className="text-center text-xs font-semibold text-muted-foreground p-2">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.category}>
                  <td className="text-sm font-medium text-foreground p-2">{row.category}</td>
                  {[row.ChatGPT, row.Gemini, row.Claude, row.Copilot].map((val, idx) => (
                    <td key={idx} className="p-1.5">
                      <div className={`rounded-lg text-center py-3 text-sm font-bold ${getHeatColor(val)}`}>
                        {val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brand Visibility Radar */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-semibold">Brand Visibility Radar</CardTitle>
            <CardDescription className="text-xs">Multi-dimensional brand strength analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(0.3 0 0 / 0.3)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.4 0 0)" }} />
                <Radar dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Competitor Positioning Map */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-semibold">Competitor Positioning Map</CardTitle>
            <CardDescription className="text-xs">GEO Score vs Citation Share</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
                <XAxis type="number" dataKey="geoScore" name="GEO Score" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} label={{ value: "GEO Score", position: "bottom", fontSize: 10, fill: "oklch(0.5 0 0)" }} />
                <YAxis type="number" dataKey="citationShare" name="Citation Share" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} label={{ value: "Citation %", angle: -90, position: "left", fontSize: 10, fill: "oklch(0.5 0 0)" }} />
                <ZAxis type="number" dataKey="size" range={[60, 260]} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
                <Scatter name="Brands" data={positioningData} fill="#818cf8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* GEO Opportunity Matrix */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-sm font-semibold">GEO Opportunity Matrix</CardTitle>
          <CardDescription className="text-xs">Impact vs Effort — focus on high-impact, low-effort opportunities (top-left quadrant)</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
              <XAxis type="number" dataKey="effort" name="Effort" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} label={{ value: "Effort →", position: "bottom", fontSize: 10, fill: "oklch(0.5 0 0)" }} />
              <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} label={{ value: "Impact →", angle: -90, position: "left", fontSize: 10, fill: "oklch(0.5 0 0)" }} />
              <ZAxis type="number" dataKey="size" range={[60, 200]} />
              <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
              <Scatter name="Opportunities" data={opportunityData} fill="#a855f7" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
