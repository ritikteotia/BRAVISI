"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground antialiased font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-sm font-bold tracking-wider text-foreground uppercase">
              BRAVISI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-12">
        <div className="max-w-2xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Understand How AI Sees Your Brand
            </h1>
            <p className="mx-auto max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
              Analyze how ChatGPT, Gemini, Claude, Copilot, and Perplexity perceive, position, and recommend your product.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-10 rounded px-6 bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity border border-border group"
              >
                Analyze Brand
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} BRAVISI. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Research-focused AI search intelligence for premium brands.
          </p>
        </div>
      </footer>
    </div>
  );
}
