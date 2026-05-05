"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { XSmallIcon } from "@shopify/polaris-icons"

/**
 * Polaris Tag / Chip
 * - Removable tags for allergens, ingredients, modifiers
 * - Pill shape, compact
 */

interface TagProps extends React.ComponentProps<"span"> {
  onRemove?: () => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
}

const tagSizes = {
  sm: "px-[var(--p-space-150)] py-0 text-[0.6875rem] leading-[1.25rem] gap-[var(--p-space-050)]",
  default: "px-[var(--p-space-200)] py-[var(--p-space-050)] text-[0.75rem] leading-[1rem] gap-[var(--p-space-100)]",
  lg: "px-[var(--p-space-300)] py-[var(--p-space-100)] text-[0.8125rem] leading-[1.25rem] gap-[var(--p-space-150)]",
}

const removeSizes = {
  sm: "size-[0.875rem]",
  default: "size-[1rem]",
  lg: "size-[1.25rem]",
}

const removeIconSizes = {
  sm: "size-2.5",
  default: "size-3",
  lg: "size-3.5",
}

function Tag({
  children,
  onRemove,
  disabled,
  size = "default",
  className,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex items-center",
        "rounded-[var(--p-border-radius-200)]",
        "bg-[var(--p-color-bg-fill-secondary)]",
        "font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text)]",
        tagSizes[size],
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {onRemove && !disabled && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className={cn(
            "shrink-0 rounded-[var(--p-border-radius-100)] flex items-center justify-center",
            "text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] cursor-pointer",
            removeSizes[size],
          )}
        >
          <XSmallIcon className={cn("fill-current", removeIconSizes[size])} />
        </button>
      )}
    </span>
  )
}

export { Tag }
