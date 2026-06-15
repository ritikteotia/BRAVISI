"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p className="text-xs text-muted-foreground animate-pulse">Redirecting to audit workspace...</p>
    </div>
  );
}
