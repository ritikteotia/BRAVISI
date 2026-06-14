"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Send, RefreshCw, Copy, Check, ThumbsUp, ThumbsDown, Minus, Clock, Sparkles, AlertCircle, Search, Tag, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ModelResponse {
  model: string;
  response: string;
  brandMentions: string[];
  competitorMentions: string[];
  sentiment: "Positive" | "Neutral" | "Negative";
  ranking: number;
  color: string;
}

interface PromptResult {
  prompt: string;
  timestamp: string;
  responses: ModelResponse[];
}

const EXAMPLE_PROMPTS = [
  "Best payment gateway for SaaS",
  "Top project management tools 2025",
  "Best AI analytics platform",
  "Cheapest cloud hosting for startups",
  "Best CRM for small businesses",
];

export default function PromptLabPage() {
  const [prompt, setPrompt] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PromptResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const runPrompt = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 3000));

    const seed = prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const brand = brandName || "Your Brand";
    const compPool = ["Stripe", "Square", "PayPal", "Adyen", "Braintree", "Razorpay", "Shopify", "Asana", "Monday.com", "ClickUp"];
    const pickComps = compPool.filter((_, i) => (seed + i) % 3 === 0).slice(0, 3);

    const genResponse = (model: string, idx: number): ModelResponse => {
      const mentioned = (seed + idx) % 3 !== 0;
      const sentiments: Array<"Positive" | "Neutral" | "Negative"> = ["Positive", "Neutral", "Negative"];
      return {
        model,
        response: `Based on current market analysis, ${mentioned ? `${brand} is ` : ""}${mentioned ? "a strong contender" : "not prominently featured"} for "${prompt}". Key recommendations include ${pickComps.slice(0, 2).join(", ")}, and ${pickComps[2] || "others"}. ${mentioned ? `${brand} stands out for its developer experience and comprehensive API documentation.` : "Consider improving visibility through technical content and structured data."}`,
        brandMentions: mentioned ? [brand] : [],
        competitorMentions: pickComps,
        sentiment: sentiments[(seed + idx) % 3],
        ranking: mentioned ? ((seed + idx) % 5) + 1 : 0,
        color: ["#818cf8", "#a78bfa", "#e879f9", "#34d399"][idx],
      };
    };

    const newResult: PromptResult = {
      prompt,
      timestamp: new Date().toLocaleTimeString(),
      responses: [
        genResponse("ChatGPT", 0),
        genResponse("Gemini", 1),
        genResponse("Claude", 2),
        genResponse("Copilot", 3),
      ],
    };

    setResults((prev) => [newResult, ...prev]);
    setIsRunning(false);
  }, [prompt, brandName]);

  const copyResponse = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const sentimentIcon = (s: string) => {
    if (s === "Positive") return <ThumbsUp className="h-3 w-3 text-emerald-400" />;
    if (s === "Negative") return <ThumbsDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-amber-400" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Prompt Lab</h1>
        <p className="text-sm text-muted-foreground">Test prompts across ChatGPT, Gemini, Claude, and Copilot. Extract brand mentions, sentiment, and rankings.</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Test Prompt</label>
              <Input placeholder="Best payment gateway for SaaS" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" onKeyDown={(e) => e.key === "Enter" && runPrompt()} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Track Brand (optional)</label>
              <Input placeholder="Your Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={runPrompt} disabled={isRunning || !prompt.trim()} className="glow-button w-full h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                {isRunning ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing…</> : <><Send className="mr-2 h-4 w-4" /> Run Test</>}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-muted-foreground self-center">Try:</span>
            {EXAMPLE_PROMPTS.map((p) => (
              <button key={p} onClick={() => setPrompt(p)} className="text-[11px] px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                {p}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isRunning && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-16 w-16">
              <motion.div className="absolute inset-0 rounded-full border border-indigo-500/20 bg-indigo-500/5" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <FlaskConical className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Testing across 4 AI models...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.map((result, resultIdx) => (
        <motion.div key={resultIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{result.timestamp}</span>
            <Badge variant="outline" className="text-[10px]">{result.prompt}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {result.responses.map((resp, respIdx) => (
              <Card key={resp.model} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: resp.color }} />
                      <CardTitle className="text-sm font-semibold">{resp.model}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {sentimentIcon(resp.sentiment)}
                      <Badge variant="outline" className="text-[9px]">{resp.sentiment}</Badge>
                      {resp.ranking > 0 && <Badge className="text-[9px] bg-indigo-500/15 text-indigo-400">#{resp.ranking}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{resp.response}</p>
                  <div className="flex flex-wrap gap-3">
                    {resp.brandMentions.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">Brand: {resp.brandMentions.join(", ")}</span>
                      </div>
                    )}
                    {resp.competitorMentions.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-amber-400" />
                        <span className="text-[10px] text-amber-400 font-medium">Comps: {resp.competitorMentions.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => copyResponse(resp.response, resultIdx * 10 + respIdx)} className="h-7 text-[10px] text-muted-foreground">
                      {copiedIdx === resultIdx * 10 + respIdx ? <><Check className="mr-1 h-3 w-3 text-emerald-400" /> Copied</> : <><Copy className="mr-1 h-3 w-3" /> Copy</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {resultIdx < results.length - 1 && <div className="border-t border-border/30" />}
        </motion.div>
      ))}

      {!isRunning && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <FlaskConical className="h-7 w-7 text-indigo-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Ready to test</h2>
          <p className="max-w-md text-sm text-muted-foreground">Enter a prompt above to see how AI models respond and where your brand appears.</p>
        </div>
      )}
    </motion.div>
  );
}
