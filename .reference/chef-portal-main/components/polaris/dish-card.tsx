"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/image";
import { MenuVerticalIcon, CheckIcon, ImageIcon } from "@shopify/polaris-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ActionList, type ActionListItem } from "./action-list";
import { StatusDot } from "./status-dot";
import { Spinner } from "./spinner";
import type { Dish } from "@/types/dishes.types";
import type { DataTableAction } from "@/components/shared/data-table";

export type DishCardVariant = "default" | "selection";

interface PolarisDishCardProps {
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

const statusToneMap: Record<string, "success" | "critical" | "warning"> = {
  published: "success",
  archived: "critical",
  draft: "warning",
};

const statusLabelMap = {
  published: "Published",
  archived: "Archived",
  draft: "Draft",
};

export const PolarisDishCard = memo(function PolarisDishCard({
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
}: PolarisDishCardProps) {
  if (!dish) return null;

  const { name, category, price, image, status } = dish;
  const isSelectionMode = variant === "selection" || selectable;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest('[role="button"]') || target.closest('[data-slot="popover-content"]')) return;

    if (isSelectionMode && onSelect) {
      onSelect(dish);
    } else if (onCardClick) {
      onCardClick(dish);
    }
  };

  const actionListItems: ActionListItem[] = actions.map((action, idx) => ({
    id: String(idx),
    label: action.label,
    icon: action.icon,
    description: action.description,
    destructive: action.variant === "destructive",
    disabled: action.disabled?.(dish),
    onClick: () => action.onClick(dish),
  }));

  return (
    <div
      data-testid="dish-card"
      className={cn(
        "group relative cursor-pointer",
        isProcessing && "opacity-60 cursor-wait",
        (status === "draft" || status === "archived") && "opacity-90",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image Area */}
      <div className="relative w-full">
        {/* Image (clipped) */}
        <div className={cn(
          "relative w-full rounded-[var(--p-border-radius-300)] overflow-hidden",
          isSelected && "ring-2 ring-[var(--p-color-border-emphasis)] ring-offset-2"
        )}>
          <OptimizedImage
            src={image}
            alt={name}
            width={300}
            height={225}
            className={cn(
              "w-full object-cover aspect-[4/3]",
              isSelected && "blur-sm"
            )}
            quality={imagePriority || priority ? 80 : 70}
            showSkeleton
            priority={imagePriority || priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fallbackComponent={
              <div className="w-full aspect-[4/3] bg-[var(--p-color-bg-surface-secondary)] flex flex-col items-center justify-center gap-[var(--p-space-200)]">
                <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
                <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">No Image</span>
              </div>
            }
          />

          {/* Status Badge — top left */}
          {showStatusBadge && (
            <div className="absolute top-[var(--p-space-200)] left-[var(--p-space-200)] z-10">
              <span className="inline-flex items-center gap-[var(--p-space-100)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
                <StatusDot tone={statusToneMap[status] || "warning"} size="sm" />
                <span className="text-[0.625rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                  {statusLabelMap[status]}
                </span>
              </span>
            </div>
          )}

          {/* Selection Checkmark */}
          {isSelectionMode && isSelected && (
            <div className="absolute inset-0 bg-[var(--p-color-bg-fill-emphasis)]/20 flex items-center justify-center z-[25] pointer-events-none">
              <div className="size-[3rem] rounded-full bg-[var(--p-color-bg-surface)] flex items-center justify-center shadow-[var(--p-shadow-400)]">
                <CheckIcon className="size-6 fill-[var(--p-color-icon-emphasis)]" />
              </div>
            </div>
          )}
        </div>

        {/* Action Menu — top right, outside overflow-hidden */}
        {!isSelectionMode && !isProcessing && showActions && actions.length > 0 && (
          <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
              <button
                className={cn(
                  "absolute top-[var(--p-space-200)] right-[var(--p-space-200)] z-[40]",
                  "size-[2rem] rounded-full flex items-center justify-center",
                  "bg-[var(--p-color-bg-surface)] text-[var(--p-color-icon)]",
                  "border border-[var(--p-color-border)]",
                  "shadow-[var(--p-shadow-200)]",
                  "cursor-pointer",
                  "transition-opacity duration-150",
                  "hover:bg-[var(--p-color-bg-surface-hover)]",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuVerticalIcon className="size-4 fill-current" />
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                align="end"
                sideOffset={4}
                className={cn(
                  "z-50 w-[12rem]",
                  "bg-[var(--p-color-bg-surface)]",
                  "border border-[var(--p-color-border)]",
                  "rounded-[var(--p-border-radius-300)]",
                  "shadow-[var(--p-shadow-300)]",
                  "overflow-hidden",
                  "animate-in fade-in-0 zoom-in-95 duration-150",
                  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                  "data-[side=bottom]:slide-in-from-top-2",
                  "data-[side=top]:slide-in-from-bottom-2",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <ActionList items={actionListItems} />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-[var(--p-space-200)]">
        <p className="text-[0.75rem] leading-[1rem] font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)]">
          {category}
        </p>
        <h3 className="text-[0.875rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] line-clamp-1 mt-[var(--p-space-050)]">
          {name}
        </h3>
        <p className="text-[0.875rem] leading-[1.25rem] font-[var(--p-font-weight-regular)] text-[var(--p-color-text)] mt-[var(--p-space-050)]">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-[var(--p-color-bg-surface)]/80 backdrop-blur-[2px] flex items-center justify-center z-[35] rounded-[var(--p-border-radius-300)] pointer-events-none">
          <Spinner size="small" />
        </div>
      )}
    </div>
  );
});
