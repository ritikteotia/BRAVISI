"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Plus, Copy, Check, Eye, EyeOff, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
}

const API_DOCS = [
  { method: "GET", path: "/api/v1/geo-score", description: "Get GEO score for a website" },
  { method: "GET", path: "/api/v1/citations", description: "Get AI citation data" },
  { method: "GET", path: "/api/v1/competitors", description: "Get competitor analysis" },
  { method: "POST", path: "/api/v1/reports", description: "Generate executive report" },
  { method: "GET", path: "/api/v1/audit", description: "Run website audit" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: "1", name: "Production API Key", key: "bvs_live_sk_2f8a9c4b1e3d7f6a0b5c8e9d", created: "Jun 1, 2025", lastUsed: "Jun 14, 2025", requests: 12847 },
    { id: "2", name: "Development Key", key: "bvs_test_sk_9a1b2c3d4e5f6g7h8i9j0k", created: "May 15, 2025", lastUsed: "Jun 13, 2025", requests: 3421 },
  ]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");

  const toggleVisibility = (id: string) => {
    const next = new Set(visibleKeys);
    if (next.has(id)) next.delete(id); else next.add(id);
    setVisibleKeys(next);
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `bvs_live_sk_${Math.random().toString(36).slice(2, 26)}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
      requests: 0,
    };
    setKeys((prev) => [...prev, newKey]);
    setNewKeyName("");
  };

  const deleteKey = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">API Platform</h1>
        <p className="text-sm text-muted-foreground">Manage API keys and access the BRAVISI REST API.</p>
      </div>

      {/* Create Key */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input placeholder="API Key Name (e.g. Production)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="h-9 border-border/50 bg-background/50 text-sm flex-1" />
            <Button onClick={createKey} disabled={!newKeyName.trim()} className="h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white px-6">
              <Plus className="mr-2 h-4 w-4" /> Create Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3"><CardTitle className="text-sm font-semibold">Your API Keys</CardTitle></CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {keys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium text-foreground">{apiKey.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-muted-foreground">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.slice(0, 12) + "•".repeat(16)}
                  </code>
                  <button onClick={() => toggleVisibility(apiKey.id)} className="text-muted-foreground hover:text-foreground">
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => copyKey(apiKey.id, apiKey.key)} className="text-muted-foreground hover:text-foreground">
                    {copiedKey === apiKey.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Created: {apiKey.created}</span>
                  <span className="text-[10px] text-muted-foreground">Last used: {apiKey.lastUsed}</span>
                  <span className="text-[10px] text-muted-foreground">{apiKey.requests.toLocaleString()} requests</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteKey(apiKey.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm font-semibold">API Endpoints</CardTitle>
          <CardDescription className="text-xs">Base URL: https://api.bravisi.com</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-2">
          {API_DOCS.map((endpoint, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
              <Badge variant="outline" className={`text-[10px] font-mono ${endpoint.method === "GET" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                {endpoint.method}
              </Badge>
              <code className="text-xs font-mono text-foreground">{endpoint.path}</code>
              <span className="text-xs text-muted-foreground">— {endpoint.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
