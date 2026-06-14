"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Map routes to breadcrumb labels
const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/geo-score": "GEO Score",
  "/dashboard/citations": "AI Citations",
  "/dashboard/prompt-lab": "Prompt Lab",
  "/dashboard/competitors": "Competitor Analysis",
  "/dashboard/audit": "Website Audit",
  "/dashboard/copilot": "AI Copilot",
  "/dashboard/content-strategy": "Content Strategy",
  "/dashboard/roadmap": "GEO Roadmap",
  "/dashboard/history": "History",
  "/dashboard/analytics": "Visualizations",
  "/dashboard/alerts": "Alerts",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/settings": "Settings",
  "/dashboard/scan": "Brand Scan",
  "/dashboard/reports": "Reports",
};

interface TopbarProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Topbar({ onMobileMenuToggle, sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [hasNotifications] = useState(true);

  // Get breadcrumb path segments
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((_, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: routeLabels[href] || segments[index].charAt(0).toUpperCase() + segments[index].slice(1),
      href,
      isLast: index === segments.length - 1,
    };
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <motion.header
      initial={false}
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6 print:hidden"
    >
      {/* Left: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav className="hidden sm:flex items-center text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-muted-foreground/40" />
              )}
              {crumb.isLast ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile: page title only */}
        <span className="font-medium text-foreground sm:hidden">
          {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex h-8 gap-2 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            // TODO: open command palette
          }}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
              {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-background" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-[10px] font-normal text-muted-foreground cursor-pointer hover:text-foreground">
                Mark all read
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium">GEO Score Updated</span>
              </div>
              <span className="text-[11px] text-muted-foreground pl-4">
                Your GEO score increased from 68 to 74. View details →
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium">New Citation Detected</span>
              </div>
              <span className="text-[11px] text-muted-foreground pl-4">
                ChatGPT mentioned your brand in 3 new queries.
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium">Competitor Alert</span>
              </div>
              <span className="text-[11px] text-muted-foreground pl-4">
                Competitor X surpassed your citation share by 5%.
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white transition-shadow hover:shadow-lg hover:shadow-indigo-500/20">
              B
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">BRAVISI User</p>
                <p className="text-xs text-muted-foreground">user@bravisi.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
