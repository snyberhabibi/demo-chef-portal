"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, ClockIcon } from "@shopify/polaris-icons";
import { StatusDot } from "@/components/polaris";

interface DishPreviewCardProps {
  name?: string;
  category?: string;
  price?: number;
  image?: string | null;
  status?: "draft" | "published" | "archived";
  leadTime?: number;
  className?: string;
}

const statusTone: Record<string, "success" | "warning" | "critical"> = {
  published: "success",
  draft: "warning",
  archived: "critical",
};

export function DishPreviewCard({
  name,
  category,
  price,
  image,
  status = "draft",
  leadTime,
  className,
}: DishPreviewCardProps) {
  return (
    <div className={cn("rounded-[var(--p-border-radius-200)] overflow-hidden border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)]", className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[var(--p-color-bg-surface-secondary)]">
        {image ? (
          <img src={image} alt={name || "Dish"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-[var(--p-space-100)]">
            <ImageIcon className="size-6 fill-[var(--p-color-icon-secondary)]" />
            <span className="text-[0.5625rem] text-[var(--p-color-text-secondary)]">No image yet</span>
          </div>
        )}
        {/* Status */}
        <div className="absolute top-[var(--p-space-100)] left-[var(--p-space-100)]">
          <span className="inline-flex items-center gap-[var(--p-space-050)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-150)] py-[var(--p-space-025)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
            <StatusDot tone={statusTone[status] || "warning"} size="sm" />
            <span className="text-[0.5rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] capitalize">{status}</span>
          </span>
        </div>
      </div>
      {/* Info */}
      <div className="p-[var(--p-space-200)] space-y-[var(--p-space-025)]">
        <p className="text-[0.5625rem] text-[var(--p-color-text-secondary)] truncate">
          {category || "No category"}
        </p>
        <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
          {name || "Untitled Dish"}
        </p>
        <p className="text-[0.6875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {price !== undefined && price > 0 ? `$${price.toFixed(2)}` : "—"}
        </p>
        {leadTime !== undefined && leadTime > 0 && (
          <div className="flex items-center gap-[var(--p-space-050)] text-[0.5625rem] text-[var(--p-color-text-secondary)]">
            <ClockIcon className="size-2.5 fill-current" />
            <span>{leadTime >= 24 ? `${(leadTime / 24).toFixed(1)}d` : `${leadTime}h`} lead</span>
          </div>
        )}
      </div>
    </div>
  );
}
