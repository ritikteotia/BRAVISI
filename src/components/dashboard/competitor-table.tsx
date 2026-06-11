"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { CompetitorData } from "@/lib/data";

interface CompetitorTableProps {
  data: CompetitorData[];
}

function TrendIcon({ trend }: { trend: CompetitorData["trend"] }) {
  if (trend === "up")
    return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "down")
    return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const colorMap: Record<string, string> = {
    Positive:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Neutral:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Negative:
      "bg-red-500/10 text-red-400 border-red-500/20",
    Mixed:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${colorMap[sentiment] ?? colorMap.Neutral}`}
    >
      {sentiment}
    </Badge>
  );
}

export default function CompetitorTable({ data }: CompetitorTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground">
              Competitor Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Head-to-head visibility metrics
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Brand
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Visibility
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Mention Rate
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sentiment
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Content Gaps
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Trend
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow
                    key={row.name}
                    className={`border-border/30 transition-colors hover:bg-white/[0.02] ${
                      idx === 0
                        ? "bg-indigo-500/[0.03]"
                        : ""
                    }`}
                  >
                    <TableCell className="text-sm font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        )}
                        {row.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Progress
                          value={row.visibilityScore}
                          className="h-1.5 w-16 bg-muted"
                        />
                        <span className="text-xs font-medium text-foreground tabular-nums">
                          {row.visibilityScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                      {row.mentionRate}%
                    </TableCell>
                    <TableCell>
                      <SentimentBadge sentiment={row.sentiment} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums hidden md:table-cell">
                      {row.contentGaps}
                    </TableCell>
                    <TableCell className="text-right">
                      <TrendIcon trend={row.trend} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
