"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris ProgressBar
 *
 * - Height: 0.5rem default, 0.25rem small
 * - Border radius: full
 * - Track: bg-fill-secondary
 * - Fill: bg-fill-brand (default), success, critical
 * - Animated fill width
 */

interface ProgressBarProps extends React.ComponentProps<"div"> {
  progress: number
  size?: "small" | "medium"
  tone?: "default" | "success" | "critical"
  animated?: boolean
}

const toneClasses = {
  default: "bg-[var(--p-color-bg-fill-brand)]",
  success: "bg-[rgba(4,123,93,1)]",
  critical: "bg-[rgba(199,10,36,1)]",
}

function ProgressBar({
  progress,
  size = "medium",
  tone = "default",
  animated = true,
  className,
  ...props
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div
      data-slot="progress-bar"
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "w-full rounded-[var(--p-border-radius-full)] overflow-hidden",
        "bg-[var(--p-color-bg-fill-secondary)]",
        size === "small" ? "h-[0.25rem]" : "h-[0.5rem]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-[var(--p-border-radius-full)]",
          toneClasses[tone],
          animated && "transition-[width] duration-300 ease-out",
        )}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  )
}

export { ProgressBar }
