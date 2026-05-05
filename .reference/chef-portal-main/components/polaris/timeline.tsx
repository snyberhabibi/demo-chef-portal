"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Timeline
 * - Order status history
 * - Vertical line with dots
 * - Completed steps: solid dark circle with white filled tick
 * - Active step: brand color ring
 * - Pending step: gray dot
 */

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp?: string
  status: "completed" | "active" | "pending"
}

interface TimelineProps extends React.ComponentProps<"div"> {
  items: TimelineItem[]
  /** If true, most recent item appears at top (default). If false, oldest at top. */
  reversed?: boolean
}

/* Solid filled tick inside a circle */
function FilledTickCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M7.5 10.5l2 2 4-4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function Timeline({
  items,
  reversed = true,
  className,
  ...props
}: TimelineProps) {
  const orderedItems = reversed ? [...items].reverse() : items

  return (
    <div
      data-slot="timeline"
      className={cn("relative", className)}
      {...props}
    >
      {orderedItems.map((item, idx) => {
        const isLast = idx === orderedItems.length - 1

        return (
          <div key={item.id} className="relative flex gap-[var(--p-space-300)] pb-[var(--p-space-500)]">
            {/* Line + dot */}
            <div className="flex flex-col items-center shrink-0 w-[1.5rem]">
              {item.status === "completed" ? (
                <FilledTickCircle className="size-[1.5rem] text-[var(--p-color-bg-fill-brand)]" />
              ) : item.status === "active" ? (
                <div className="relative size-[1.5rem] flex items-center justify-center">
                  {/* Pulse ring */}
                  <div className="absolute size-[1.5rem] rounded-full border-[0.1875rem] border-[var(--p-color-bg-fill-brand)] animate-ping opacity-30" />
                  {/* Solid ring */}
                  <div className="size-[1.5rem] rounded-full border-[0.1875rem] border-[var(--p-color-bg-fill-brand)] bg-[var(--p-color-bg-surface)]">
                    <div className="size-full rounded-full bg-[var(--p-color-bg-fill-brand)] scale-[0.4]" />
                  </div>
                </div>
              ) : (
                <div className="size-[0.75rem] rounded-full bg-[var(--p-color-bg-fill-tertiary)] mt-[var(--p-space-100)]" />
              )}
              {!isLast && (
                <div className={cn(
                  "w-[0.125rem] flex-1 mt-[var(--p-space-100)]",
                  item.status === "completed"
                    ? "bg-[var(--p-color-bg-fill-brand)]"
                    : "bg-[var(--p-color-border)]",
                )} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-[var(--p-space-025)]">
              <p className={cn(
                "text-[0.8125rem] leading-[1.25rem]",
                item.status === "pending"
                  ? "font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)]"
                  : "font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]",
              )}>
                {item.title}
              </p>
              {item.description && (
                <p className="text-[0.75rem] leading-[1rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                  {item.description}
                </p>
              )}
              {item.timestamp && (
                <p className="text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-disabled)] mt-[var(--p-space-050)]">
                  {item.timestamp}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { Timeline }
export type { TimelineItem }
