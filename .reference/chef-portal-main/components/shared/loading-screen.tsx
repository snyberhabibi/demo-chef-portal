"use client";

import { Spinner } from "@/components/ui/spinner";
import { YallaBitesLogoHorizontal } from "@/components/shared";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  spinnerClassName?: string;
  logoClassName?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  className,
  spinnerClassName,
  logoClassName,
  fullScreen = true,
}: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center gap-6">
      <YallaBitesLogoHorizontal className={cn("h-9 w-auto", logoClassName)} />
      <Spinner className={cn("h-8 w-8", spinnerClassName)} />
    </div>
  );

  if (!fullScreen) {
    return <div className={cn("flex items-center justify-center", className)}>{content}</div>;
  }

  return (
    <div className={cn("flex h-screen items-center justify-center", className)}>
      {content}
    </div>
  );
}
