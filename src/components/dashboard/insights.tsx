"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  Search,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActionItem, ContentOpportunity } from "@/lib/data";

interface InsightsProps {
  actions: ActionItem[];
  opportunities: ContentOpportunity[];
}

function ImpactBadge({ impact }: { impact: ActionItem["impact"] }) {
  const colors: Record<string, string> = {
    High: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-muted text-muted-foreground border-border/50",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${colors[impact]}`}>
      {impact}
    </Badge>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: ContentOpportunity["difficulty"];
}) {
  const colors: Record<string, string> = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </Badge>
  );
}

function PresenceBadge({
  presence,
}: {
  presence: ContentOpportunity["brandPresence"];
}) {
  const colors: Record<string, string> = {
    None: "bg-red-500/10 text-red-400 border-red-500/20",
    Low: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Medium: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${colors[presence]}`}>
      {presence}
    </Badge>
  );
}

export default function Insights({ actions, opportunities }: InsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="actions">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Actionable Insights
                </h3>
                <p className="text-xs text-muted-foreground">
                  AI-powered recommendations to boost visibility
                </p>
              </div>
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger
                  value="actions"
                  className="gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Zap className="h-3 w-3" />
                  Actions
                </TabsTrigger>
                <TabsTrigger
                  value="opportunities"
                  className="gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Lightbulb className="h-3 w-3" />
                  Opportunities
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Recommended Actions Tab */}
            <TabsContent value="actions" className="mt-0 space-y-3">
              {actions.map((action, idx) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group flex items-start gap-4 rounded-xl border border-border/30 bg-background/50 p-4 transition-all hover:border-border/60 hover:bg-white/[0.02]"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
                    {action.category === "Content" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-foreground">
                        {action.title}
                      </h4>
                      <ImpactBadge impact={action.impact} />
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </TabsContent>

            {/* Content Opportunities Tab */}
            <TabsContent value="opportunities" className="mt-0 space-y-3">
              {opportunities.map((opp, idx) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group flex items-center gap-4 rounded-xl border border-border/30 bg-background/50 p-4 transition-all hover:border-border/60 hover:bg-white/[0.02]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-foreground">
                        {opp.keyword}
                      </h4>
                      <DifficultyBadge difficulty={opp.difficulty} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span>
                        Volume:{" "}
                        <span className="text-foreground font-medium">
                          {opp.searchVolume}
                        </span>
                      </span>
                      <span className="hidden sm:inline text-border">·</span>
                      <span className="hidden sm:inline">
                        Presence: <PresenceBadge presence={opp.brandPresence} />
                      </span>
                      <span className="hidden sm:inline text-border">·</span>
                      <span className="hidden sm:inline text-emerald-400 font-medium">
                        {opp.potentialImpact}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
