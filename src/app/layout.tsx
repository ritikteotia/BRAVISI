import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRAVISI — Enterprise GEO Intelligence Platform",
  description:
    "The enterprise platform for Generative Engine Optimization. Track AI citations, analyze brand visibility, audit websites, and dominate AI search across ChatGPT, Gemini, Claude, and Copilot.",
  keywords: [
    "GEO platform",
    "generative engine optimization",
    "AI visibility",
    "AI citation tracking",
    "brand monitoring",
    "ChatGPT",
    "Gemini",
    "AI search analytics",
    "brand intelligence",
    "GEO score",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
