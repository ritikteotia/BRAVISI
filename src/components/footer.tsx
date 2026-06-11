"use client";

import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
            <Activity className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">BRAVISI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BRAVISI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
