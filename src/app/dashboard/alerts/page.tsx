"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, TrendingDown, Users, Shield, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  name: string;
  type: "score_drop" | "citation_drop" | "competitor_surpass" | "weekly_report";
  channel: "email" | "slack" | "in-app";
  threshold?: number;
  enabled: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "1", name: "GEO Score Drop", type: "score_drop", channel: "email", threshold: 5, enabled: true },
    { id: "2", name: "Citation Share Decline", type: "citation_drop", channel: "slack", threshold: 10, enabled: true },
    { id: "3", name: "Competitor Surpasses You", type: "competitor_surpass", channel: "email", enabled: true },
    { id: "4", name: "Weekly GEO Report", type: "weekly_report", channel: "email", enabled: false },
  ]);
  const [email, setEmail] = useState("");
  const [slackUrl, setSlackUrl] = useState("");

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const typeIcons: Record<string, React.ElementType> = { score_drop: TrendingDown, citation_drop: TrendingDown, competitor_surpass: Users, weekly_report: Bell };
  const typeLabels: Record<string, string> = { score_drop: "Score Drop", citation_drop: "Citation Drop", competitor_surpass: "Competitor Alert", weekly_report: "Weekly Report" };
  const channelIcons: Record<string, React.ElementType> = { email: Mail, slack: MessageSquare, "in-app": Bell };

  const recentAlerts = [
    { message: "GEO Score dropped by 3 points (78 → 75)", time: "2 hours ago", type: "warning" },
    { message: "Competitor B surpassed your citation share by 5%", time: "1 day ago", type: "danger" },
    { message: "Weekly GEO Report generated successfully", time: "3 days ago", type: "info" },
    { message: "Citation share increased by 8% this week", time: "5 days ago", type: "success" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerting System</h1>
        <p className="text-sm text-muted-foreground">Configure notifications for score changes, competitor alerts, and weekly reports.</p>
      </div>

      {/* Notification Channels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="p-5 pb-3"><CardTitle className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-400" /> Email Notifications</CardTitle></CardHeader>
          <CardContent className="p-5 pt-0">
            <Input placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm mb-2" />
            <Button variant="outline" size="sm" className="text-xs h-8">Save Email</Button>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="p-5 pb-3"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-indigo-400" /> Slack Webhook</CardTitle></CardHeader>
          <CardContent className="p-5 pt-0">
            <Input placeholder="https://hooks.slack.com/..." value={slackUrl} onChange={(e) => setSlackUrl(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm mb-2" />
            <Button variant="outline" size="sm" className="text-xs h-8">Save Webhook</Button>
          </CardContent>
        </Card>
      </div>

      {/* Alert Rules */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Alert Rules</CardTitle>
            <Button variant="outline" size="sm" className="text-xs h-8 border-dashed"><Plus className="mr-1 h-3 w-3" /> Add Rule</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {alerts.map((alert) => {
            const TypeIcon = typeIcons[alert.type] || Bell;
            const ChannelIcon = channelIcons[alert.channel] || Bell;
            return (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${alert.enabled ? "border-border/50 bg-background/50" : "border-border/30 bg-background/30 opacity-60"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                    <TypeIcon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[9px]">{typeLabels[alert.type]}</Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ChannelIcon className="h-3 w-3" /> {alert.channel}
                      </span>
                      {alert.threshold && <span className="text-[10px] text-muted-foreground">Threshold: {alert.threshold}%</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAlert(alert.id)} className="text-muted-foreground hover:text-foreground">
                    {alert.enabled ? <ToggleRight className="h-6 w-6 text-indigo-400" /> : <ToggleLeft className="h-6 w-6" />}
                  </button>
                  <button onClick={() => deleteAlert(alert.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3"><CardTitle className="text-sm font-semibold">Recent Notifications</CardTitle></CardHeader>
        <CardContent className="p-6 pt-0 space-y-2">
          {recentAlerts.map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${alert.type === "success" ? "bg-emerald-500" : alert.type === "warning" ? "bg-amber-500" : alert.type === "danger" ? "bg-red-500" : "bg-blue-500"}`} />
                <span className="text-sm text-foreground">{alert.message}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
