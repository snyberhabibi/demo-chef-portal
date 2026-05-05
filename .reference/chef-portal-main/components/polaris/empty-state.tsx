"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

/**
 * Polaris EmptyState
 *
 * - Centered layout
 * - Optional image/icon
 * - Heading + description
 * - Primary + secondary actions
 */

interface EmptyStateProps extends React.ComponentProps<"div"> {
  heading: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  image?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  heading,
  description,
  icon: Icon,
  image,
  primaryAction,
  secondaryAction,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-[var(--p-space-1200)] px-[var(--p-space-600)]",
        "max-w-[25rem] mx-auto",
        className
      )}
      {...props}
    >
      {/* Image or icon */}
      {image && (
        <img src={image} alt="" className="w-[10rem] h-auto mb-[var(--p-space-400)]" />
      )}
      {Icon && !image && (
        <div className="mb-[var(--p-space-400)] p-[var(--p-space-400)] rounded-full bg-[var(--p-color-bg-surface-secondary)]">
          <Icon className="size-8 fill-[var(--p-color-icon-secondary)]" />
        </div>
      )}

      {/* Heading */}
      <h2 className="text-[var(--p-font-size-500)] leading-[var(--p-font-line-height-600)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
        {heading}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-[0.8125rem] leading-[1.25rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">
          {description}
        </p>
      )}

      {/* Custom content */}
      {children && (
        <div className="mt-[var(--p-space-400)]">{children}</div>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-[var(--p-space-200)] mt-[var(--p-space-500)]">
          {primaryAction && (
            <Button variant="default" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="tertiary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
