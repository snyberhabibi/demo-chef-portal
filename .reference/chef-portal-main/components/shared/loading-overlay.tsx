"use client";

import { useLoading } from "@/contexts/loading-context";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/shared";

interface LoadingOverlayProps {
  className?: string;
}

export function LoadingOverlay({ className }: LoadingOverlayProps) {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-white/90 dark:bg-black/50 backdrop-blur-sm",
        className
      )}
      aria-label="Loading"
      role="status"
    >
      <LoadingScreen spinnerClassName="text-[#e54141]" />
    </div>
  );
}

