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
      { label: "AI Citations", href: "/dashboard/citations", icon: Search },
      { label: "Competitor Analysis", href: "/dashboard/competitors", icon: Users },
      { label: "Website Audit", href: "/dashboard/audit", icon: Shield },
    ],
  },
  {
    label: "Strategy",
    items: [
      { label: "Content Strategy", href: "/dashboard/content-strategy", icon: FileText },
      { label: "GEO Roadmap", href: "/dashboard/roadmap", icon: Map },
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
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar overflow-hidden print:hidden"
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-background text-foreground">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-bold tracking-wider text-foreground uppercase whitespace-nowrap"
                >
                  BRAVISI
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            onClick={onToggle}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-3 w-3" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          {navigation.map((group) => (
            <div key={group.label} className="space-y-1">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              {collapsed && (
                <div className="mb-1 mx-auto w-4 h-px bg-border" />
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
                        "relative flex items-center gap-2.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.1 }}
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          {content}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-[11px] font-medium border border-border bg-popover text-popover-foreground">
                          {item.label}
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

        {/* Pinned Settings Footer */}
        <div className="border-t border-border p-2 bg-sidebar/80">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    "flex items-center justify-center rounded p-2 text-xs font-medium transition-colors",
                    pathname === "/dashboard/settings"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  )}
                >
                  <Settings className="h-4 w-4 shrink-0 text-foreground" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] font-medium border border-border bg-popover text-popover-foreground">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-2.5 rounded px-3 py-2 text-xs font-medium transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4 shrink-0 text-foreground" />
              <span className="font-bold text-foreground">Settings</span>
            </Link>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
