"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/shared/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check, MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/dishes.types";
import type { DataTableAction } from "@/components/shared/data-table";
import { YallaBitesLogoHorizontal } from "@/components/shared";

export type DishCardVariant = "default" | "selection";

interface DishCardProps {
  dish: Dish;
  actions?: DataTableAction<Dish>[];
  onCardClick?: (dish: Dish) => void;
  priority?: boolean;
  showActions?: boolean;
  variant?: DishCardVariant;
  // Selection mode props
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (dish: Dish) => void;
  // Loading state
  isProcessing?: boolean;
  className?: string; // Additional className for the card
}

export function DishCard({
  dish,
  actions = [],
  onCardClick,
  priority = false,
  showActions = true,
  variant = "default",
  selectable = false,
  isSelected = false,
  onSelect,
  isProcessing = false,
  className,
}: DishCardProps) {
  const isSelectionMode = variant === "selection" || selectable;

  // Internal state for actions visibility (mobile/tablet)
  const [actionsVisible, setActionsVisible] = useState(false);

  const handleClick = () => {
    // Don't handle clicks when processing
    if (isProcessing) return;

    if (isSelectionMode && onSelect) {
      onSelect(dish);
    } else {
      onCardClick?.(dish);
    }
  };

  const handleFABClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isProcessing) {
      setActionsVisible(!actionsVisible);
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-0 w-full h-70 md:h-80 lg:h-90 xl:h-100",
        !isProcessing && "cursor-pointer",
        !isSelectionMode && !isProcessing && "lg:hover:shadow-lg",
        (dish.status === "draft" || dish.status === "archived") && "opacity-75",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isProcessing && "cursor-wait",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Layer - z-index: 0 (base layer) */}
      <div className="relative w-full h-full overflow-hidden">
        <OptimizedImage
          src={dish.image}
          alt={dish.name}
          fill
          className={cn(
            "object-cover object-center transition-all duration-300 z-0",
            isSelected && "blur-sm",
            !isSelectionMode && "lg:group-hover:scale-110"
          )}
          sizes={
            isSelectionMode
              ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          }
          priority={priority}
          showSkeleton={true}
          fallbackComponent={
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          }
        />
      </div>

      {/* Gradient Shades Layer - z-index: 5 (above image, below text) */}
      {isSelectionMode ? (
        <>
          {/* Top gradient - compact shade for text readability on smaller cards */}
          <div className="absolute top-0 inset-x-0 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-[5]" />
          {/* Bottom gradient - lighter for footer */}
          <div className="absolute bottom-0 inset-x-0 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-black/70 to-transparent z-[5]" />
        </>
      ) : (
        <>
          {/* Top gradient - strong shade for name and category */}
          <div className="absolute top-0 inset-x-0 h-2/5 bg-gradient-to-b from-black/95 via-black/70 to-transparent z-[5] transition-opacity duration-300 lg:group-hover:opacity-50" />
          {/* Bottom gradient - smooth fade for price */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/95 via-black/85 via-black/60 via-black/30 to-transparent z-[5] pointer-events-none transition-opacity duration-300 lg:group-hover:opacity-0" />
        </>
      )}

      {/* Hover Overlay - z-index: 15 (above gradients, below actions) */}
      {!isSelectionMode && showActions && actions && actions.length > 0 && (
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-[2px] z-[15] transition-opacity duration-300 ease-out pointer-events-none",
            actionsVisible
              ? "opacity-100"
              : "opacity-0 lg:group-hover:opacity-100"
          )}
        />
      )}

      {/* Content Layer - z-index: 10 (above shades) */}
      <div className="absolute inset-0 z-10 flex flex-col p-2 sm:p-3 md:p-4">
        {/* Top Section: Name, Category, Status */}
        <div
          className={cn(
            "flex items-start justify-between gap-2 transition-opacity duration-300",
            actionsVisible ? "opacity-60" : "lg:group-hover:opacity-60"
          )}
        >
          {isSelectionMode ? (
            <div className="flex-1">
              <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base lg:text-lg leading-tight drop-shadow-lg line-clamp-2">
                {dish.name}
              </h4>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-bold text-white text-lg leading-tight [text-shadow:0_2px_8px_rgb(0_0_0/80%)] line-clamp-2">
                  {dish.name}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-background/90 border-2 border-background/50 text-foreground text-xs font-medium shadow-md w-fit"
                >
                  {dish.category}
                </Badge>
              </div>
              <Badge
                variant={
                  dish.status === "published"
                    ? "default"
                    : dish.status === "archived"
                    ? "destructive"
                    : "secondary"
                }
                className={cn(
                  "shrink-0 shadow-xl border-2",
                  dish.status === "published"
                    ? "bg-primary border-primary-foreground/20 text-primary-foreground"
                    : dish.status === "archived"
                    ? "bg-destructive border-destructive-foreground/20 text-destructive-foreground"
                    : "bg-secondary border-secondary-foreground/20 text-secondary-foreground"
                )}
              >
                {dish.status === "published"
                  ? "Published"
                  : dish.status === "archived"
                  ? "Archived"
                  : "Draft"}
              </Badge>
            </>
          )}
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Bottom Section: Price - Hidden on hover or when actions are visible */}
        {!isSelectionMode && (
          <div
            className={cn(
              "flex items-baseline gap-2 mb-2 transition-all duration-300",
              actionsVisible
                ? "opacity-0 translate-y-2"
                : "lg:group-hover:opacity-0 lg:group-hover:translate-y-2"
            )}
          >
            <span className="text-sm text-white [text-shadow:0_2px_8px_rgb(0_0_0/100%)]">
              Starting at
            </span>
            <span className="text-2xl font-bold text-white [text-shadow:0_2px_8px_rgb(0_0_0/100%)]">
              ${dish.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Centered Actions Overlay - z-index: 20 (above overlay) */}
      {!isSelectionMode && showActions && actions && actions.length > 0 && (
        <div
          className={cn(
            "absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 ease-out pointer-events-none",
            actionsVisible
              ? "opacity-100"
              : "opacity-0 lg:group-hover:opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              "flex items-center gap-3 flex-wrap justify-center px-4",
              // Only enable pointer events when actions are visible (via group-hover on desktop or actionsVisible on mobile)
              actionsVisible
                ? "pointer-events-auto"
                : "pointer-events-none lg:group-hover:pointer-events-auto"
            )}
          >
            {actions.map((action, idx) => {
              const Icon = action.icon;
              const isDestructive = action.variant === "destructive";
              return (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative h-8 px-3 overflow-hidden transition-all duration-300 ease-out",
                    "bg-white/95 backdrop-blur-sm border-0 text-foreground",
                    "hover:bg-white hover:border-white hover:shadow-md hover:scale-105",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    // Animation: slide up and fade in
                    actionsVisible
                      ? "translate-y-0 opacity-100"
                      : "transform translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                    // Red background with light text for delete action
                    isDestructive &&
                      "bg-destructive text-white border-destructive hover:bg-destructive/90 hover:border-destructive hover:text-white/90"
                  )}
                  style={{
                    transitionDelay: actionsVisible ? "0ms" : `${idx * 50}ms`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isProcessing) {
                      action.onClick(dish);
                    }
                  }}
                  disabled={isProcessing || action.disabled?.(dish)}
                >
                  <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                    <span className="text-xs font-medium whitespace-nowrap">
                      {action.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Button - z-index: 30 (above everything) */}
      {!isSelectionMode && showActions && actions && actions.length > 0 && (
        <Button
          onClick={handleFABClick}
          size="icon"
          disabled={isProcessing}
          className={cn(
            "absolute bottom-3 right-3 z-30 h-10 w-10 rounded-full shadow-lg",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 hover:scale-110",
            "transition-all duration-300 ease-out",
            // Always visible on screens < 1024px, hide on large screens when container is wide enough (≥656px) for hover
            "lg:@[656px]:hidden",
            actionsVisible && "bg-destructive hover:bg-destructive/90",
            isProcessing && "opacity-50 cursor-wait"
          )}
          aria-label={actionsVisible ? "Hide actions" : "Show actions"}
        >
          {actionsVisible ? (
            <X className="h-5 w-5 transition-transform duration-300" />
          ) : (
            <MoreVertical className="h-5 w-5 transition-transform duration-300" />
          )}
        </Button>
      )}

      {/* Selection Checkmark Overlay - z-index: 25 (above everything) */}
      {isSelectionMode && isSelected && (
        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-[25] pointer-events-none">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Check className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}

      {/* Loading Overlay - z-index: 35 (above everything when processing) */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[35] pointer-events-none">
          <div className="flex flex-col items-center gap-6">
            <YallaBitesLogoHorizontal className="h-16 w-auto" />
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">
                Processing...
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
