"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Thumbnail } from "./thumbnail"

/**
 * Polaris Resource Item
 * - List row with image + title + meta
 * - Clickable, hover state
 * - Optional actions on the right
 */

interface ResourceItemProps extends React.ComponentProps<"div"> {
  image?: string | null
  title: string
  subtitle?: string
  meta?: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
}

function ResourceItem({
  image,
  title,
  subtitle,
  meta,
  actions,
  onClick,
  className,
  ...props
}: ResourceItemProps) {
  return (
    <div
      data-slot="resource-item"
      onClick={onClick}
      className={cn(
        "flex items-center gap-[var(--p-space-300)]",
        "px-[var(--p-space-400)] py-[var(--p-space-300)]",
        "border-b border-[var(--p-color-border-secondary)]",
        "transition-colors duration-100",
        "hover:bg-[var(--p-color-bg-surface-hover)]",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {image !== undefined && (
        <Thumbnail source={image} alt={title} size="medium" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-[0.75rem] leading-[1rem] text-[var(--p-color-text-secondary)] truncate mt-[var(--p-space-025)]">
            {subtitle}
          </p>
        )}
      </div>
      {meta && (
        <div className="shrink-0 text-[0.75rem] text-[var(--p-color-text-secondary)]">
          {meta}
        </div>
      )}
      {actions && (
        <div className="shrink-0">{actions}</div>
      )}
    </div>
  )
}

export { ResourceItem }
