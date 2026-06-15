"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  ChevronRight,
  Menu,
  Target,
} from "lucide-react";
import { useBrand } from "@/context/BrandContext";
import { useState, useEffect } from "react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/geo-score": "GEO Score",
  "/dashboard/citations": "AI Citations",
  "/dashboard/competitors": "Competitor Analysis",
  "/dashboard/audit": "Website Audit",
  "/dashboard/content-strategy": "Content Strategy",
  "/dashboard/roadmap": "GEO Roadmap",
  "/dashboard/settings": "Settings",
  "/dashboard/scan": "Brand Scan",
};

interface TopbarProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Topbar({ onMobileMenuToggle, sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const { brandName, analysisResult, isAnalyzed, clearBrandData } = useBrand();
  const overallScore = analysisResult?.overallScore || 0;
  const [isDark, setIsDark] = useState(true);

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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 print:hidden">
      {/* Left: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-3.5 w-3.5" />
        </button>

        <nav className="hidden sm:flex items-center text-xs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-3 w-3 text-muted-foreground/30" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-foreground">{crumb.label}</span>
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
        <span className="font-semibold text-foreground text-xs sm:hidden">
          {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
        </span>
      </div>

      {/* Center: Active Brand status */}
      {isAnalyzed && (
        <div className="hidden md:flex items-center gap-3 bg-accent/30 border border-border px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm transition-all hover:bg-accent/50">
          <span className="text-muted-foreground uppercase tracking-wider">Scanned:</span>
          <span className="text-foreground">{brandName}</span>
          <span className="h-3.5 w-[1px] bg-border" />
          <span className="text-opportunity uppercase tracking-wider flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-opportunity" /> {overallScore} Score
          </span>
          <span className="h-3.5 w-[1px] bg-border" />
          <button
            onClick={clearBrandData}
            className="text-risk hover:underline cursor-pointer uppercase tracking-wider text-[9px] font-bold"
          >
            Reset
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* User Info (Minimalist Text Indicator) */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border">
          <span className="text-[10px] font-mono text-muted-foreground">USER@BRAVISI</span>
          <span className="h-1.5 w-1.5 rounded-full bg-opportunity" />
        </div>
      </div>
    </header>
  );
}
