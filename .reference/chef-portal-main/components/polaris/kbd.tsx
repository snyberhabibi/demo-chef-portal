"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Kbd — keyboard shortcut display
 * Shows key combinations like ⌘K, Ctrl+S, etc.
 */

interface KbdProps extends React.ComponentProps<"kbd"> {
  keys?: string[]
}

function Kbd({
  keys,
  children,
  className,
  ...props
}: KbdProps) {
  if (keys) {
    return (
      <span className="inline-flex items-center gap-[var(--p-space-050)]">
        {keys.map((key, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[0.625rem] text-[var(--p-color-text-disabled)]">+</span>}
            <kbd
              className={cn(
                "inline-flex items-center justify-center",
                "min-w-[1.25rem] px-[var(--p-space-100)] py-[var(--p-space-025)]",
                "rounded-[var(--p-border-radius-100)]",
                "border border-[var(--p-color-border)]",
                "bg-[var(--p-color-bg-surface-secondary)]",
                "text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-medium)]",
                "text-[var(--p-color-text-secondary)]",
                "shadow-[var(--p-shadow-100)]",
                "font-[var(--p-font-family-mono)]",
                className
              )}
              {...props}
            >
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </span>
    )
  }

  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.25rem] px-[var(--p-space-100)] py-[var(--p-space-025)]",
        "rounded-[var(--p-border-radius-100)]",
        "border border-[var(--p-color-border)]",
        "bg-[var(--p-color-bg-surface-secondary)]",
        "text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-medium)]",
        "text-[var(--p-color-text-secondary)]",
        "shadow-[var(--p-shadow-100)]",
        "font-[var(--p-font-family-mono)]",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

export { Kbd }
