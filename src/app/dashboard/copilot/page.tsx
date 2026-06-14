"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, User, Bot, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "Why is my visibility low?",
  "What content should I publish next?",
  "How do I beat competitor X?",
  "Why is my citation score dropping?",
  "What schema markup should I add?",
  "How can I improve my GEO score?",
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI GEO Copilot. I can help you understand your visibility metrics, suggest improvements, and create optimization strategies. What would you like to know?", timestamp: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    const userMsg: Message = { role: "user", content: msgText, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));

    const responses: Record<string, string> = {
      "Why is my visibility low?": "Based on typical GEO analysis patterns, low visibility usually stems from three key factors:\n\n1. **Missing Structured Data**: Without Organization, FAQ, and Product schema, AI models can't properly identify your brand.\n\n2. **Limited Technical Documentation**: AI models heavily reference well-structured docs. Publishing comprehensive API guides and tutorials can increase citations by 35%.\n\n3. **Low Content Velocity**: Publishing 2-3 in-depth articles per week maintains freshness signals that AI crawlers prioritize.\n\nI recommend starting with a Website Audit to identify specific technical issues, then building a content strategy around high-intent topics.",
      "What content should I publish next?": "Based on GEO best practices, here's a prioritized content plan:\n\n🔴 **Critical Priority**:\n- Comparison pages (\"Your Brand vs Competitor X\")\n- FAQ pages with conversational Q&A format\n- Technical documentation and API guides\n\n🟡 **High Priority**:\n- \"How to\" tutorials for your core use cases\n- Industry benchmark reports\n- Integration guides with popular tools\n\n🟢 **Medium Priority**:\n- Customer success stories\n- Community-contributed tutorials\n- Product changelog and updates\n\nEach piece should include relevant schema markup and target specific search intents.",
      "How do I beat competitor X?": "To outperform competitors in AI search, focus on these strategies:\n\n1. **Content Gap Analysis**: Run the Competitor Gap Analyzer to find topics they cover that you don't.\n\n2. **Schema Advantage**: Implement richer structured data — Organization, FAQ, Product, and HowTo schemas.\n\n3. **Documentation Depth**: Create more comprehensive technical docs than competitors. AI models prefer detailed, well-structured content.\n\n4. **Community Building**: Encourage user reviews, forum discussions, and community tutorials. Diverse sources boost mention diversity.\n\n5. **Citation Monitoring**: Use the Citation Tracker to monitor real-time mentions and quickly respond to gaps.\n\nWould you like me to generate a specific competitive strategy?",
      default: "That's a great question! Based on GEO optimization best practices, here are my recommendations:\n\n1. **Run a comprehensive audit** using the Website Audit tool to identify technical gaps\n2. **Track citations** across all 4 major AI models using the Citation Tracker\n3. **Analyze competitors** to find content and schema opportunities\n4. **Generate a roadmap** with prioritized 30/60/90 day action items\n\nEach of these tools is available in the sidebar. Would you like me to elaborate on any specific area?",
    };

    const response = responses[msgText] || responses.default;
    const assistantMsg: Message = { role: "assistant", content: response, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }, [input]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI GEO Copilot</h1>
        <p className="text-sm text-muted-foreground">Ask questions about your visibility, content strategy, and optimization.</p>
      </div>

      <Card className="flex-1 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-indigo-500/15 border border-indigo-500/20" : "bg-secondary/50 border border-border/30"}`}>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                <p className="text-[10px] text-muted-foreground mt-2">{msg.timestamp}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border/30">
                <motion.div className="h-2 w-2 rounded-full bg-indigo-400" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                <motion.div className="h-2 w-2 rounded-full bg-indigo-400" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="h-2 w-2 rounded-full bg-indigo-400" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[10px] text-muted-foreground font-medium">Suggested questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} className="text-[11px] px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/30 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your GEO strategy..."
              className="flex-1 rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
            />
            <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-0 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
