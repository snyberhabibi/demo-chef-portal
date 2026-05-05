"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/image";
import {
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import { StatusDot } from "@/components/polaris";
import type { Dish } from "@/types/dishes.types";

interface BundleDishPickerCardProps {
  dish: Dish;
  isSelected: boolean;
  quantity?: number;
  onToggle: (dish: Dish) => void;
  onQuantityChange?: (dishId: string, quantity: number) => void;
  showQuantity?: boolean;
  className?: string;
}

const statusConfig: Record<string, { label: string; tone: "success" | "warning" | "critical" }> = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "warning" },
  archived: { label: "Archived", tone: "critical" },
};

export const BundleDishPickerCard = memo(function BundleDishPickerCard({
  dish,
  isSelected,
  quantity = 0,
  onToggle,
  onQuantityChange,
  showQuantity = true,
  className,
}: BundleDishPickerCardProps) {
  const { name, category, price, image, status } = dish;
  const statusInfo = statusConfig[status] || statusConfig.draft;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking stepper controls
    const target = e.target as HTMLElement;
    if (target.closest("[data-stepper]")) return;
    onToggle(dish);
  };

  return (
    <div
      className={cn("group cursor-pointer relative", className)}
      onClick={handleCardClick}
    >
      {/* Image area */}
      <div
        className={cn(
          "relative w-full rounded-[var(--p-border-radius-300)] overflow-hidden transition-shadow duration-150",
          isSelected
            ? "ring-2 ring-[var(--p-color-bg-fill-success)] ring-offset-1"
            : "ring-0 ring-transparent hover:ring-1 hover:ring-[var(--p-color-border-hover)]"
        )}
      >
        {image ? (
          <OptimizedImage
            src={image}
            alt={name}
            width={400}
            height={160}
            className="w-full h-full object-cover aspect-[4/3]"
            quality={70}
            showSkeleton
            sizes="(max-width: 640px) 140px, (max-width: 1024px) 165px, 200px"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-[var(--p-color-bg-surface-secondary)] flex items-center justify-center">
            <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
          </div>
        )}

        {/* Selected backdrop */}
        {isSelected && (
          <div className="absolute inset-0 bg-black/25 pointer-events-none z-[5]" />
        )}

        {/* Status badge — top left */}
        <div className="absolute top-[var(--p-space-150)] left-[var(--p-space-150)] z-10">
          <span className="inline-flex items-center gap-[var(--p-space-050)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-150)] py-[var(--p-space-025)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
            <StatusDot tone={statusInfo.tone} size="sm" />
            <span className="text-[0.5625rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
              {statusInfo.label}
            </span>
          </span>
        </div>

        {/* Selection indicator — top right */}
        <div className="absolute top-[var(--p-space-150)] right-[var(--p-space-150)] z-10">
          {isSelected ? (
            <div className="size-6 rounded-full bg-[var(--p-color-bg-fill-success)] flex items-center justify-center shadow-[var(--p-shadow-200)]">
              <CheckIcon className="size-3.5 fill-white" />
            </div>
          ) : (
            <div className="size-6 rounded-full bg-[var(--p-color-bg-surface)]/80 backdrop-blur-sm border border-[var(--p-color-border)] flex items-center justify-center shadow-[var(--p-shadow-100)] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <PlusIcon className="size-3.5 fill-[var(--p-color-icon)]" />
            </div>
          )}
        </div>

        {/* Quantity stepper — bottom, only when selected and showQuantity */}
        {isSelected && showQuantity && onQuantityChange && (
          <div
            data-stepper
            className="absolute bottom-[var(--p-space-150)] left-1/2 -translate-x-1/2 z-10"
          >
            <div className="flex items-center rounded-[var(--p-border-radius-full)] bg-[var(--p-color-bg-surface)]/95 backdrop-blur-sm shadow-[var(--p-shadow-300)] border border-[var(--p-color-border-secondary)] overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity > 1) onQuantityChange(dish.id, quantity - 1);
                }}
                disabled={quantity <= 1}
                className="flex items-center justify-center size-6 hover:bg-[var(--p-color-bg-surface-hover)] active:bg-[var(--p-color-bg-surface-active)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <MinusIcon className="size-3 fill-[var(--p-color-icon)]" />
              </button>
              <span className="w-6 text-center text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(dish.id, quantity + 1);
                }}
                className="flex items-center justify-center size-6 hover:bg-[var(--p-color-bg-surface-hover)] active:bg-[var(--p-color-bg-surface-active)] transition-colors cursor-pointer"
              >
                <PlusIcon className="size-3 fill-[var(--p-color-icon)]" />
              </button>
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
