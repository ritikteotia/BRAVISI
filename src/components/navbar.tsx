"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-shadow group-hover:shadow-indigo-500/40">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            BRAVISI
          </span>
        </Link>

        {/* CTA */}
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 bg-white/5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}
