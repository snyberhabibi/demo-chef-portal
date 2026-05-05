"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ImageIcon } from "@shopify/polaris-icons"

/**
 * Polaris Thumbnail
 * - Small image preview with fallback
 * - Sizes: small, medium, large
 */

interface ThumbnailProps extends React.ComponentProps<"div"> {
  source?: string | null
  alt?: string
  size?: "small" | "medium" | "large"
}

const sizeMap = {
  small: "size-[2rem]",
  medium: "size-[2.5rem]",
  large: "size-[3.75rem]",
}

function Thumbnail({
  source,
  alt = "",
  size = "medium",
  className,
  ...props
}: ThumbnailProps) {
  return (
    <div
      data-slot="thumbnail"
      className={cn(
        "rounded-[var(--p-border-radius-200)]",
        "overflow-hidden shrink-0",
        "border border-[var(--p-color-border-secondary)]",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {source ? (
        <img src={source} alt={alt} className="size-full object-cover" />
      ) : (
        <div className="size-full bg-[var(--p-color-bg-surface-secondary)] flex items-center justify-center">
          <ImageIcon className={cn(
            "fill-[var(--p-color-icon-secondary)]",
            size === "small" ? "size-3" : size === "medium" ? "size-4" : "size-6",
          )} />
        </div>
      )}
    </div>
  )
}

export { Thumbnail }
