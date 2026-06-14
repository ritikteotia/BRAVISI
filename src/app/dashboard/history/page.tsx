"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const monthlyData = [
  { month: "Jul '24", geoScore: 32, citations: 45, competitors: 58 },
  { month: "Aug '24", geoScore: 38, citations: 62, competitors: 60 },
  { month: "Sep '24", geoScore: 42, citations: 78, competitors: 59 },
  { month: "Oct '24", geoScore: 48, citations: 95, competitors: 62 },
  { month: "Nov '24", geoScore: 54, citations: 120, competitors: 61 },
  { month: "Dec '24", geoScore: 58, citations: 145, competitors: 64 },
  { month: "Jan '25", geoScore: 62, citations: 168, competitors: 63 },
  { month: "Feb '25", geoScore: 65, citations: 192, competitors: 67 },
  { month: "Mar '25", geoScore: 68, citations: 215, competitors: 66 },
  { month: "Apr '25", geoScore: 71, citations: 248, competitors: 68 },
  { month: "May '25", geoScore: 74, citations: 280, competitors: 70 },
  { month: "Jun '25", geoScore: 78, citations: 312, competitors: 72 },
];

const weeklyData = [
  { week: "W22", score: 73, mentions: 68 },
  { week: "W23", score: 74, mentions: 72 },
  { week: "W24", score: 73, mentions: 69 },
  { week: "W25", score: 76, mentions: 78 },
  { week: "W26", score: 75, mentions: 75 },
  { week: "W27", score: 78, mentions: 82 },
  { week: "W28", score: 77, mentions: 79 },
  { week: "W29", score: 78, mentions: 85 },
];

const scanHistory = [
  { date: "Jun 14, 2025", score: 78, change: +3, status: "improved" },
  { date: "Jun 7, 2025", score: 75, change: +1, status: "improved" },
  { date: "May 31, 2025", score: 74, change: -1, status: "declined" },
  { date: "May 24, 2025", score: 75, change: +2, status: "improved" },
  { date: "May 17, 2025", score: 73, change: +1, status: "improved" },
  { date: "May 10, 2025", score: 72, change: 0, status: "stable" },
];

export default function HistoryPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Historical GEO Tracking</h1>
        <p className="text-sm text-muted-foreground">Track GEO score trends, citation changes, and competitor movements over time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Current Score", value: "78", change: "+46", period: "vs 12 mo ago" },
          { label: "Total Citations", value: "312", change: "+267", period: "vs 12 mo ago" },
          { label: "Growth Rate", value: "+143%", change: null, period: "12 month" },
          { label: "Avg Weekly Change", value: "+1.2", change: null, period: "points/week" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-[10px] text-emerald-400 mt-1">{m.change ? `${m.change} ` : ""}{m.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-sm font-semibold">12-Month GEO Score Trend</CardTitle>
          <CardDescription className="text-xs">GEO Score vs Competitor Average</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorGeo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e879f9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
              <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="geoScore" stroke="#818cf8" fill="url(#colorGeo)" strokeWidth={2} name="Your GEO Score" />
              <Area type="monotone" dataKey="competitors" stroke="#e879f9" fill="url(#colorComp)" strokeWidth={2} strokeDasharray="5 5" name="Competitor Avg" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly + Citation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-semibold">Weekly Score Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
                <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: "#818cf8" }} name="GEO Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-semibold">Citation Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0 0)" }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.015 265)", border: "1px solid oklch(0.2 0 0)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="citations" stroke="#34d399" fill="url(#colorCitations)" strokeWidth={2} name="Total Citations" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scan History Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <CardTitle className="text-sm font-semibold">Scan History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-2">
            {scanHistory.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{scan.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{scan.score}</span>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${scan.change > 0 ? "text-emerald-400" : scan.change < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                    {scan.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : scan.change < 0 ? <ArrowDownRight className="h-3 w-3" /> : null}
                    {scan.change > 0 ? `+${scan.change}` : scan.change === 0 ? "—" : scan.change}
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${scan.status === "improved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : scan.status === "declined" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
