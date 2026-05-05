"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreVertical, X } from "lucide-react";

interface FloatingActionButtonProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

export function FloatingActionButton({
  isActive,
  onToggle,
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onToggle}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 hover:scale-110",
        "transition-all duration-300 ease-out",
        "lg:hidden", // Only visible on mobile/tablet
        className
      )}
      aria-label={isActive ? "Hide actions" : "Show actions"}
    >
      {isActive ? (
        <X className="h-6 w-6 transition-transform duration-300" />
      ) : (
        <MoreVertical className="h-6 w-6 transition-transform duration-300" />
      )}
    </Button>
  );
}

