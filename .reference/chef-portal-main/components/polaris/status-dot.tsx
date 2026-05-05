"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Status Dot
 * Tiny colored indicator for online/offline, active/inactive
 */

interface StatusDotProps extends React.ComponentProps<"span"> {
  tone?: "success" | "critical" | "warning" | "info" | "neutral"
  pulse?: boolean
  size?: "sm" | "default" | "lg"
  label?: string
}

const toneClasses = {
  success: "bg-[rgba(4,123,93,1)]",
  critical: "bg-[rgba(199,10,36,1)]",
  warning: "bg-[rgba(255,184,0,1)]",
  info: "bg-[rgba(0,91,211,1)]",
  neutral: "bg-[var(--p-color-bg-fill-tertiary)]",
}

const sizeClasses = {
  sm: "size-[0.375rem]",
  default: "size-[0.5rem]",
  lg: "size-[0.625rem]",
}

function StatusDot({
  tone = "neutral",
  pulse = false,
  size = "default",
  label,
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      className={cn("inline-flex items-center gap-[var(--p-space-150)]", className)}
      {...props}
    >
      <span className="relative inline-flex">
        {pulse && (
          <span className={cn(
            "absolute inset-0 rounded-full animate-ping opacity-40",
            toneClasses[tone],
          )} />
        )}
        <span className={cn(
          "rounded-full",
          toneClasses[tone],
          sizeClasses[size],
        )} />
      </span>
      {label && (
        <span className="text-[0.75rem] leading-[1rem] font-[var(--p-font-weight-regular)] text-[var(--p-color-text)]">
          {label}
        </span>
      )}
    </span>
  )
}

export { StatusDot }
