"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Users, Building2, Shield, Palette, Sun, Moon, Monitor, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("BRAVISI Corp");
  const [userName, setUserName] = useState("Admin User");
  const [userEmail, setUserEmail] = useState("admin@bravisi.com");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [saved, setSaved] = useState(false);

  const teamMembers = [
    { name: "Admin User", email: "admin@bravisi.com", role: "Owner", status: "Active" },
    { name: "Jane Smith", email: "jane@bravisi.com", role: "Admin", status: "Active" },
    { name: "Bob Johnson", email: "bob@bravisi.com", role: "Member", status: "Active" },
    { name: "Alice Davis", email: "alice@bravisi.com", role: "Viewer", status: "Pending" },
  ];

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const roleColors: Record<string, string> = {
    Owner: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Member: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Viewer: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your organization, team, and preferences.</p>
      </div>

      {/* Organization */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4 text-indigo-400" /> Organization</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Organization Name</label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Plan</label>
              <div className="flex items-center gap-2 h-9">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Pro Plan</Badge>
                <span className="text-xs text-muted-foreground">Unlimited scans & API access</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-indigo-400" /> Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Full Name</label>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm" />
            </div>
          </div>
          <Button onClick={handleSave} className="h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white px-6">
            {saved ? <><Check className="mr-2 h-4 w-4" /> Saved</> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-indigo-400" /> Appearance</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex gap-3">
            {[
              { value: "light" as const, icon: Sun, label: "Light" },
              { value: "dark" as const, icon: Moon, label: "Dark" },
              { value: "system" as const, icon: Monitor, label: "System" },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button key={opt.value} onClick={() => {
                  setTheme(opt.value);
                  if (opt.value === "dark") document.documentElement.classList.add("dark");
                  else if (opt.value === "light") document.documentElement.classList.remove("dark");
                }} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${theme === opt.value ? "border-indigo-500/30 bg-indigo-500/5" : "border-border/50 bg-background/50 hover:bg-accent/5"}`}>
                  <Icon className={`h-5 w-5 ${theme === opt.value ? "text-indigo-400" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${theme === opt.value ? "text-indigo-400" : "text-muted-foreground"}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-indigo-400" /> Team Members</CardTitle>
            <Button variant="outline" size="sm" className="text-xs h-8">Invite Member</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-2">
          {teamMembers.map((member) => (
            <div key={member.email} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[9px] ${roleColors[member.role]}`}>{member.role}</Badge>
                <Badge variant="secondary" className={`text-[9px] ${member.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>{member.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
