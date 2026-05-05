"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Spinner
 *
 * - Uses SVG spinner animation
 * - Sizes: small (1.25rem/20px), large (2.75rem/44px)
 * - Color: inherits from parent or uses icon color
 */

interface SpinnerProps extends React.ComponentProps<"div"> {
  size?: "small" | "large"
  tone?: "default" | "white"
  accessibilityLabel?: string
}

function Spinner({
  size = "large",
  tone = "default",
  accessibilityLabel = "Loading",
  className,
  ...props
}: SpinnerProps) {
  const sizeClass = size === "small" ? "size-[1.25rem]" : "size-[2.75rem]"
  const colorClass = tone === "white" ? "text-white" : "text-[var(--p-color-icon)]"

  return (
    <div
      data-slot="spinner"
      role="status"
      className={cn("inline-flex", className)}
      {...props}
    >
      <svg
        className={cn(sizeClass, "animate-spin", colorClass)}
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="4"
        />
        <path
          d="M22 4a18 18 0 0 1 18 18"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{accessibilityLabel}</span>
    </div>
  )
}

export { Spinner }
