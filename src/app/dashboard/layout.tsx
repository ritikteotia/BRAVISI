"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/ui/sidebar";
import Topbar from "@/components/ui/topbar";
import { Toaster } from "sonner";
import { BrandProvider } from "@/context/BrandContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrandProvider>
      <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 lg:hidden">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 68 : 260,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen max-lg:!ml-0"
      >
        <Topbar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </motion.div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "!bg-card !text-foreground !border-border",
        }}
      />
      </div>
    </BrandProvider>
  );
}
