"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { AIMentionData } from "@/lib/data";

interface MentionChartProps {
  data: AIMentionData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: AIMentionData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 p-3 shadow-xl backdrop-blur-md">
      <p className="mb-1.5 text-sm font-semibold text-foreground">{d.model}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Mentions: <span className="text-foreground font-medium">{d.mentions}</span></p>
        <p>Sentiment: <span className="text-foreground font-medium">{d.sentiment}%</span></p>
        <p>Accuracy: <span className="text-foreground font-medium">{d.accuracy}%</span></p>
      </div>
    </div>
  );
}

export default function MentionChart({ data }: MentionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Mention Distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Brand mentions across AI models
              </p>
            </div>
            <div className="flex items-center gap-3">
              {data.map((d) => (
                <div key={d.model} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs text-muted-foreground hidden sm:inline">{d.model}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                barCategoryGap="25%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.2 0 0)"
                  vertical={false}
                />
                <XAxis
                  dataKey="model"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "oklch(0.15 0 0)" }}
                />
                <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.model} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
