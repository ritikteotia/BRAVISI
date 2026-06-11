"use client";

import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, ThumbsUp, Hash, Target, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { OverviewMetrics } from "@/lib/data";
import ScoreRing from "./score-ring";

interface OverviewCardsProps {
  data: OverviewMetrics;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, subtext, color }: MetricCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
            {subtext && (
              <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Main Score Card — spans 2 columns on large */}
      <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex h-full flex-col items-center justify-center p-6">
            <ScoreRing score={data.visibilityScore} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual metric cards */}
      <motion.div variants={itemVariants}>
        <MetricCard
          icon={TrendingUp}
          label="Mention Rate"
          value={`${data.mentionRate}%`}
          subtext="Across all AI models"
          color="#818cf8"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCard
          icon={ThumbsUp}
          label="Sentiment"
          value={data.sentiment}
          subtext={`${data.sentimentScore}% positive`}
          color="#22c55e"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCard
          icon={Hash}
          label="Total Mentions"
          value={data.totalMentions.toLocaleString()}
          subtext="Last 30 days"
          color="#a78bfa"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCard
          icon={Target}
          label="Avg. Position"
          value={`#${data.avgPosition}`}
          subtext="In AI recommendations"
          color="#e879f9"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCard
          icon={MessageSquare}
          label="AI Models"
          value="4"
          subtext="Actively monitored"
          color="#f59e0b"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCard
          icon={BarChart3}
          label="Growth"
          value="+18.2%"
          subtext="vs. last month"
          color="#22c55e"
        />
      </motion.div>
    </motion.div>
  );
}
