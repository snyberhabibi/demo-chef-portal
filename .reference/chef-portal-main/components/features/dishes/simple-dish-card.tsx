"use client";

import React, { memo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/dishes.types";
import { OptimizedImage } from "@/components/shared/image";
import { MenuVerticalIcon, XSmallIcon, CheckIcon, ImageIcon } from "@shopify/polaris-icons";
import { Button, Badge, StatusDot } from "@/components/polaris";
import type { DataTableAction } from "@/components/shared/data-table";

export type DishCardVariant = "default" | "selection";

interface SimpleDishCardProps {
  dish: Dish;
  className?: string;
  imagePriority?: boolean;
  actions?: DataTableAction<Dish>[];
  onCardClick?: (dish: Dish) => void;
  isProcessing?: boolean;
  variant?: DishCardVariant;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (dish: Dish) => void;
  showActions?: boolean;
  showStatusBadge?: boolean;
  priority?: boolean;
}

const statusConfig: Record<string, { label: string; tone: "success" | "warning" | "critical" }> = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "warning" },
  archived: { label: "Archived", tone: "critical" },
};

export const SimpleDishCard = memo(function SimpleDishCard({
  dish,
  className,
  imagePriority = false,
  actions = [],
  onCardClick,
  isProcessing = false,
  variant = "default",
  selectable = false,
  isSelected = false,
  onSelect,
  showActions = true,
  showStatusBadge = true,
  priority = false,
}: SimpleDishCardProps) {
  const [actionsVisible, setActionsVisible] = useState(false);

  if (!dish) return null;

  const { name, category, price, image, status } = dish;
  const isSelectionMode = variant === "selection" || selectable;
  const statusInfo = statusConfig[status] || statusConfig.draft;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest('[role="button"]')) return;

    if (isSelectionMode && onSelect) {
      onSelect(dish);
    } else if (onCardClick) {
      onCardClick(dish);
    }
  };

  const handleFABClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isProcessing) setActionsVisible(!actionsVisible);
  };

  return (
    <div
      data-testid="dish-card"
      className={cn(
        "group cursor-pointer relative",
        isProcessing && "opacity-60 cursor-wait",
        (status === "draft" || status === "archived") && "opacity-90",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image container */}
      <div className={cn(
        "relative w-full rounded-[var(--p-border-radius-300)] overflow-hidden",
        isSelected && "ring-2 ring-[var(--p-color-border-focus)] ring-offset-2"
      )}>
        {image ? (
          <OptimizedImage
            src={image}
            alt={name}
            width={400}
            height={160}
            className={cn(
              "w-full h-full object-cover aspect-[4/3]",
              isSelected && "blur-sm"
            )}
            quality={imagePriority || priority ? 80 : 70}
            showSkeleton={true}
            priority={imagePriority || priority}
            sizes="(max-width: 640px) 140px, (max-width: 1024px) 165px, 200px"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-[var(--p-color-bg-surface-secondary)] border border-[var(--p-color-border-secondary)] rounded-[var(--p-border-radius-300)] flex items-center justify-center">
            <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
          </div>
        )}

        {/* Status badge */}
        {showStatusBadge && (
          <div className={cn(
            "absolute top-[var(--p-space-200)] left-[var(--p-space-200)] z-10 transition-opacity",
            actionsVisible ? "opacity-60" : "group-hover:opacity-60"
          )}>
            <span className="inline-flex items-center gap-[var(--p-space-100)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
              <StatusDot tone={statusInfo.tone} size="sm" />
              <span className="text-[0.625rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                {statusInfo.label}
              </span>
            </span>
          </div>
        )}

        {/* Hover overlay */}
        {!isSelectionMode && !isProcessing && showActions && actions.length > 0 && (
          <div className={cn(
            "absolute inset-0 bg-black/40 z-[15] transition-opacity duration-200 pointer-events-none",
            actionsVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )} />
        )}

        {/* Action buttons overlay */}
        {!isSelectionMode && !isProcessing && showActions && actions.length > 0 && (
          <div
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center transition-all duration-200 pointer-events-none",
              actionsVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              "flex items-center gap-[var(--p-space-150)] flex-wrap justify-center px-[var(--p-space-300)]",
              actionsVisible ? "pointer-events-auto" : "pointer-events-none group-hover:pointer-events-auto"
            )}>
              {actions.map((action, idx) => {
                const Icon = action.icon;
                const isDestructive = action.variant === "destructive";
                return (
                  <button
                    key={idx}
                    className={cn(
                      "inline-flex items-center gap-[var(--p-space-100)] h-7 px-[var(--p-space-200)] rounded-[var(--p-border-radius-200)]",
                      "text-[0.6875rem] font-[var(--p-font-weight-medium)] whitespace-nowrap",
                      "transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      actionsVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                      isDestructive
                        ? "bg-[rgba(199,10,36,1)] text-white hover:bg-[rgba(163,10,36,1)]"
                        : "bg-white text-[var(--p-color-text)] hover:bg-white/90 shadow-sm"
                    )}
                    style={{ transitionDelay: actionsVisible ? "0ms" : `${idx * 40}ms` }}
                    onClick={(e) => { e.stopPropagation(); if (!isProcessing) action.onClick(dish); }}
                    disabled={isProcessing || action.disabled?.(dish)}
                  >
                    {Icon && <Icon className="size-3 shrink-0 fill-current" />}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FAB toggle */}
        {!isSelectionMode && !isProcessing && showActions && actions.length > 0 && (
          <button
            onClick={handleFABClick}
            disabled={isProcessing}
            className={cn(
              "absolute bottom-[var(--p-space-200)] right-[var(--p-space-200)] z-30 size-7 rounded-full shadow-[var(--p-shadow-200)]",
              "flex items-center justify-center transition-all duration-200 cursor-pointer",
              actionsVisible
                ? "bg-[rgba(199,10,36,1)] text-white"
                : "bg-white/95 text-[var(--p-color-text)] border border-[var(--p-color-border-secondary)]",
            )}
            aria-label={actionsVisible ? "Hide actions" : "Show actions"}
          >
            {actionsVisible ? (
              <XSmallIcon className="size-4 fill-current" />
            ) : (
              <MenuVerticalIcon className="size-4 fill-current" />
            )}
          </button>
        )}

        {/* Selection checkmark */}
        {isSelectionMode && isSelected && (
          <div className="absolute inset-0 bg-[var(--p-color-bg-fill-brand)]/20 flex items-center justify-center z-[25] pointer-events-none">
            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-[var(--p-shadow-300)]">
              <CheckIcon className="size-6 fill-[var(--p-color-icon-brand)]" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-[var(--p-space-200)] px-[var(--p-space-050)]">
        <p className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
          {category}
        </p>
        <h3 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] line-clamp-1">
          {name}
        </h3>
        <p className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] mt-[var(--p-space-050)]">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
});
