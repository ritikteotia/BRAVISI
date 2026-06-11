"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { TrendDataPoint } from "@/lib/data";

interface TrendChartProps {
  data: TrendDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TrendDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 p-3 shadow-xl backdrop-blur-md">
      <p className="mb-1.5 text-sm font-semibold text-foreground">{d.month}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Score: <span className="text-foreground font-medium">{d.score}</span></p>
        <p>Mentions: <span className="text-foreground font-medium">{d.mentions.toLocaleString()}</span></p>
      </div>
    </div>
  );
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground">
              Visibility Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Score progression over the last 6 months
            </p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.2 0 0)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                  domain={[30, 90]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "oklch(0.3 0 0)" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  dot={{ fill: "#818cf8", strokeWidth: 0, r: 3 }}
                  activeDot={{ fill: "#818cf8", strokeWidth: 2, stroke: "#fff", r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
