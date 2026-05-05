"use client";

import { memo, useState } from "react";
import { OptimizedImage } from "@/components/shared/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bundle } from "@/types/bundles.types";
import type { DataTableAction } from "@/components/shared/data-table";
import { YallaBitesLogoHorizontal, YallaBitesLogo } from "@/components/shared";

interface BundleCardProps {
  bundle: Bundle;
  actions?: DataTableAction<Bundle>[];
  onCardClick?: (bundle: Bundle) => void;
  priority?: boolean;
  showActions?: boolean;
  isProcessing?: boolean;
  className?: string;
}

export const BundleCard = memo(function BundleCard({
  bundle,
  actions = [],
  onCardClick,
  priority = false,
  showActions = true,
  isProcessing = false,
  className,
}: BundleCardProps) {
  const [actionsVisible, setActionsVisible] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    onCardClick?.(bundle);
  };

  const handleFABClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isProcessing) {
      setActionsVisible(!actionsVisible);
    }
  };

  const getStatusColorClass = () => {
    if (bundle.status === "published") return "bg-emerald-500 text-white";
    if (bundle.status === "archived") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <Card
      className={cn(
        "group rounded-xl shadow-none border-none gap-0 py-0 shrink-0 cursor-pointer relative overflow-hidden",
        isProcessing && "opacity-60 cursor-wait",
        (bundle.status === "draft" || bundle.status === "archived") &&
          "opacity-90",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full rounded-xl">
        <div className="relative w-full rounded-xl overflow-hidden">
          <OptimizedImage
            src={bundle.image}
            alt={bundle.name}
            width={400}
            height={300}
            className="w-full h-full object-cover rounded-xl aspect-[4/3]"
            quality={priority ? 80 : 70}
            showSkeleton={true}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fallbackComponent={
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center rounded-xl">
                <YallaBitesLogo className="h-12 w-auto opacity-30 grayscale" />
              </div>
            }
          />

          {/* Status Badge - Top Left */}
          <div
            className={cn(
              "absolute top-2 left-2 z-10 transition-opacity duration-300",
              actionsVisible ? "opacity-60" : "group-hover:opacity-60"
            )}
          >
            <div className="bg-white/90 px-2 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
              <Badge
                className={cn(
                  "font-regular text-xs px-2 py-0 h-5",
                  getStatusColorClass()
                )}
              >
                {bundle.status === "published"
                  ? "Published"
                  : bundle.status === "archived"
                  ? "Archived"
                  : "Draft"}
              </Badge>
            </div>
          </div>

          {/* Hover Overlay */}
          {!isProcessing && showActions && actions.length > 0 && (
            <div
              className={cn(
                "absolute inset-0 bg-black/40 z-[15] transition-opacity duration-200 ease-out pointer-events-none",
                actionsVisible
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            />
          )}

          {/* Centered Actions Overlay */}
          {!isProcessing && showActions && actions.length > 0 && (
            <div
              className={cn(
                "absolute inset-0 z-20 flex items-center justify-center transition-all duration-200 ease-out pointer-events-none",
                actionsVisible
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "flex items-center gap-2 flex-wrap justify-center px-3",
                  actionsVisible
                    ? "pointer-events-auto"
                    : "pointer-events-none group-hover:pointer-events-auto"
                )}
              >
                {actions.map((action, idx) => {
                  const Icon = action.icon;
                  const isDestructive = action.variant === "destructive";
                  return (
                    <Button
                      key={idx}
                      variant="secondary"
                      size="sm"
                      className={cn(
                        "h-7 px-2.5 transition-all duration-200 ease-out",
                        "bg-white text-foreground border-0 shadow-sm",
                        "hover:bg-white/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        actionsVisible
                          ? "translate-y-0 opacity-100"
                          : "transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                        isDestructive &&
                          "bg-destructive text-white hover:bg-destructive/90"
                      )}
                      style={{
                        transitionDelay: actionsVisible
                          ? "0ms"
                          : `${idx * 40}ms`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isProcessing) {
                          action.onClick(bundle);
                        }
                      }}
                      disabled={isProcessing || action.disabled?.(bundle)}
                    >
                      <div className="flex items-center gap-1">
                        {Icon && <Icon className="h-3 w-3 shrink-0" />}
                        <span className="text-[11px] font-medium whitespace-nowrap">
                          {action.label}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAB Button */}
          {!isProcessing && showActions && actions.length > 0 && (
            <Button
              onClick={handleFABClick}
              size="icon"
              disabled={isProcessing}
              className={cn(
                "absolute bottom-2 right-2 z-30 h-8 w-8 rounded-full shadow-md",
                "bg-white/95 text-foreground border border-black/10",
                "hover:bg-white",
                "transition-all duration-200 ease-out",
                "lg:hidden",
                actionsVisible &&
                  "bg-destructive text-white border-destructive hover:bg-destructive/90",
                isProcessing && "opacity-50 cursor-wait"
              )}
              aria-label={actionsVisible ? "Hide actions" : "Show actions"}
            >
              {actionsVisible ? (
                <X className="h-4 w-4" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-2 px-0.5">
        {/* Item count */}
        <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs">
          <span className="font-medium">
            {bundle.itemCount} {bundle.itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Bundle Name */}
        <h3 className="text-foreground text-base font-bold line-clamp-1 min-w-0 mb-1">
          {bundle.name}
        </h3>

        {/* Price */}
        <div className="text-sm text-foreground line-clamp-1">
          <span className="text-muted-foreground">From </span>
          <span className="font-medium">${bundle.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[35] rounded-xl pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <YallaBitesLogoHorizontal className="h-12 w-auto" />
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}
    </Card>
  );
});
