"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/image";
import { MenuVerticalIcon, ImageIcon } from "@shopify/polaris-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ActionList, type ActionListItem } from "./action-list";
import { StatusDot } from "./status-dot";
import { Badge } from "./badge";
import { Spinner } from "./spinner";
import type { Bundle } from "@/types/bundles.types";
import type { DataTableAction } from "@/components/shared/data-table";

interface PolarisBundleCardProps {
  bundle: Bundle;
  actions?: DataTableAction<Bundle>[];
  onCardClick?: (bundle: Bundle) => void;
  priority?: boolean;
  showActions?: boolean;
  isProcessing?: boolean;
  className?: string;
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

export const PolarisBundleCard = memo(function PolarisBundleCard({
  bundle,
  actions = [],
  onCardClick,
  priority = false,
  showActions = true,
  isProcessing = false,
  className,
}: PolarisBundleCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest('[role="button"]') || target.closest('[data-slot="popover-content"]')) return;
    onCardClick?.(bundle);
  };

  const actionListItems: ActionListItem[] = actions.map((action, idx) => ({
    id: String(idx),
    label: action.label,
    icon: action.icon,
    description: action.description,
    destructive: action.variant === "destructive",
    disabled: action.disabled?.(bundle),
    onClick: () => action.onClick(bundle),
  }));

  return (
    <div
      data-testid="bundle-card"
      className={cn(
        "group relative cursor-pointer",
        isProcessing && "opacity-60 cursor-wait",
        (bundle.status === "draft" || bundle.status === "archived") && "opacity-90",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Area */}
      <div className="relative w-full">
        {/* Image (clipped) */}
        <div className="relative w-full rounded-[var(--p-border-radius-300)] overflow-hidden">
          <OptimizedImage
            src={bundle.image}
            alt={bundle.name}
            width={300}
            height={225}
            className="w-full object-cover aspect-[4/3]"
            quality={priority ? 80 : 70}
            showSkeleton
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fallbackComponent={
              <div className="w-full aspect-[4/3] bg-[var(--p-color-bg-surface-secondary)] flex flex-col items-center justify-center gap-[var(--p-space-200)]">
                <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
                <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">No Image</span>
              </div>
            }
          />

          {/* Status Badge — top left (frosted glass pill with StatusDot) */}
          <div className="absolute top-[var(--p-space-200)] left-[var(--p-space-200)] z-10">
            <span className="inline-flex items-center gap-[var(--p-space-100)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
              <StatusDot tone={statusToneMap[bundle.status] || "warning"} size="sm" />
              <span className="text-[0.625rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                {statusLabelMap[bundle.status]}
              </span>
            </span>
          </div>

          {/* Item count badge — bottom left */}
          <div className="absolute bottom-[var(--p-space-200)] left-[var(--p-space-200)] z-10">
            <Badge tone="attention" size="sm" className="!bg-[var(--p-color-bg-fill-caution)] !text-[var(--p-color-text-caution-on-bg-fill)]">
              {bundle.itemCount} {bundle.itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>

        {/* Action Menu — top right, outside overflow-hidden */}
        {!isProcessing && showActions && actions.length > 0 && (
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
        <h3 className="text-[0.875rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] line-clamp-1">
          {bundle.name}
        </h3>
        <p className="text-[0.875rem] leading-[1.25rem] text-[var(--p-color-text)] mt-[var(--p-space-050)]">
          <span className="text-[var(--p-color-text-secondary)]">From </span>
          <span className="font-[var(--p-font-weight-regular)]">${bundle.price.toFixed(2)}</span>
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
