"use client";

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Badge
 * Source: @shopify/polaris Badge component + polaris-tokens v9.4.2
 *
 * Key specs:
 * - Pill shape (border-radius: 9999px)
 * - Font: 12px/16px, weight 450 (regular)
 * - Padding: 2px 8px (default), 0px 6px (small)
 * - No border — uses background color for tone
 * - Height: auto, min-height driven by padding + line-height
 * - Tones use semantic surface colors for bg, semantic text colors for text
 */

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-[var(--p-border-radius-full)]",
    "w-fit whitespace-nowrap shrink-0",
    "border-none",
    /* Typography: bodySm — 12px/16px, regular */
    "text-[12px] leading-[16px] font-[var(--p-font-weight-regular)]",
    /* Icon sizing */
    "[&>svg]:size-3 [&>svg]:pointer-events-none [&>svg]:shrink-0",
    "gap-[var(--p-space-100)]",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      tone: {
        /* Default — neutral gray */
        default: "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text)]",
        /* Info — azure/blue tint */
        info: "bg-[var(--p-color-bg-surface-info)] text-[var(--p-color-text-info)]",
        /* Success — green */
        success: "bg-[var(--p-color-bg-surface-success)] text-[var(--p-color-text-success)]",
        /* Warning — orange */
        warning: "bg-[var(--p-color-bg-surface-warning)] text-[var(--p-color-text-warning)]",
        /* Critical — red */
        critical: "bg-[var(--p-color-bg-surface-critical)] text-[var(--p-color-text-critical)]",
        /* Attention/Caution — yellow */
        attention: "bg-[var(--p-color-bg-surface-caution)] text-[var(--p-color-text-caution)]",
        /* New — emphasis/blue fill */
        new: "bg-[var(--p-color-bg-fill-info)] text-[var(--p-color-text-info-on-bg-fill)]",
        /* Magic — purple */
        magic: "bg-[var(--p-color-bg-surface-magic)] text-[var(--p-color-text-magic)]",
        /* Emphasis — blue filled */
        emphasis: "bg-[var(--p-color-bg-fill-emphasis)] text-white",
        /* Read-only — same as default but subdued */
        "read-only": "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]",
        /* Enabled — success filled */
        enabled: "bg-[var(--p-color-bg-fill-success)] text-white",
      },
      size: {
        /* Default: 2px 8px padding */
        default: "px-[var(--p-space-200)] py-[var(--p-space-050)]",
        /* Small: tighter padding */
        sm: "px-[var(--p-space-150)] py-0 text-[11px] leading-[16px]",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  tone,
  size,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
