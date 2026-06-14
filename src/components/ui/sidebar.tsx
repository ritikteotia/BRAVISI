"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Search,
  Target,
  FlaskConical,
  Shield,
  Clock,
  MessageSquare,
  FileText,
  Map,
  PieChart,
  Bell,
  Settings,
  Key,
  ChevronLeft,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { label: "GEO Score", href: "/dashboard/geo-score", icon: Target },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI Citations", href: "/dashboard/citations", icon: Search, badge: "Live" },
      { label: "Prompt Lab", href: "/dashboard/prompt-lab", icon: FlaskConical },
      { label: "Competitor Analysis", href: "/dashboard/competitors", icon: Users },
      { label: "Website Audit", href: "/dashboard/audit", icon: Shield },
    ],
  },
  {
    label: "Strategy",
    items: [
      { label: "AI Copilot", href: "/dashboard/copilot", icon: MessageSquare, badge: "AI" },
      { label: "Content Strategy", href: "/dashboard/content-strategy", icon: FileText },
      { label: "GEO Roadmap", href: "/dashboard/roadmap", icon: Map },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "History", href: "/dashboard/history", icon: Clock },
      { label: "Visualizations", href: "/dashboard/analytics", icon: PieChart },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar overflow-hidden print:hidden"
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5 group overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-shadow group-hover:shadow-indigo-500/40">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-bold tracking-tight text-sidebar-foreground whitespace-nowrap"
                >
                  BRAVISI
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            onClick={onToggle}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
          {navigation.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              {collapsed && (
                <div className="mb-1.5 mx-auto w-6 h-px bg-sidebar-border" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  const content = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "sidebar-item group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-muted-foreground hover:text-sidebar-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute inset-0 rounded-lg bg-sidebar-accent"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <Icon className={cn(
                        "relative z-10 h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && item.badge && (
                        <span className={cn(
                          "relative z-10 ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          item.badge === "Live"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                            : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          {content}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <React.Fragment key={item.href}>{content}</React.Fragment>;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: Upgrade CTA */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-3 mb-3 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold text-foreground">Upgrade to Pro</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                Unlock unlimited scans, API access, and team features.
              </p>
              <button className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/20">
                Upgrade Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </TooltipProvider>
  );
}
