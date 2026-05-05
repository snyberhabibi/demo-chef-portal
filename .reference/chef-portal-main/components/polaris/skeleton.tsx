"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Skeleton — loading placeholders
 *
 * - SkeletonText: text line placeholders
 * - SkeletonThumbnail: image/avatar placeholders
 * - SkeletonCard: full card placeholder
 */

interface SkeletonTextProps extends React.ComponentProps<"div"> {
  lines?: number
  width?: "full" | "half" | "third" | "quarter"
}

function SkeletonText({
  lines = 1,
  width = "full",
  className,
  ...props
}: SkeletonTextProps) {
  const widthMap = {
    full: "w-full",
    half: "w-1/2",
    third: "w-1/3",
    quarter: "w-1/4",
  }

  return (
    <div className={cn("space-y-[var(--p-space-200)]", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-[0.5rem] rounded-[var(--p-border-radius-100)]",
            "bg-[var(--p-color-bg-fill-secondary)]",
            "animate-pulse",
            i === lines - 1 && lines > 1 ? "w-2/3" : widthMap[width],
          )}
        />
      ))}
    </div>
  )
}

interface SkeletonThumbnailProps extends React.ComponentProps<"div"> {
  size?: "small" | "medium" | "large"
}

function SkeletonThumbnail({
  size = "medium",
  className,
  ...props
}: SkeletonThumbnailProps) {
  const sizeMap = {
    small: "size-[2rem]",
    medium: "size-[3rem]",
    large: "size-[4rem]",
  }

  return (
    <div
      className={cn(
        "rounded-[var(--p-border-radius-200)]",
        "bg-[var(--p-color-bg-fill-secondary)]",
        "animate-pulse",
        sizeMap[size],
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--p-border-radius-300)]",
        "bg-[var(--p-color-bg-surface)]",
        "shadow-[var(--p-shadow-300)]",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Image placeholder */}
      <div className="w-full aspect-[4/3] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
      {/* Text placeholder */}
      <div className="p-[var(--p-space-300)] space-y-[var(--p-space-200)]">
        <SkeletonText width="third" />
        <SkeletonText width="full" />
        <SkeletonText width="quarter" />
      </div>
    </div>
  )
}

// ── FormWizard Skeleton ──────────────────────────────────────────────

interface FormWizardSkeletonProps extends React.ComponentProps<"div"> {
  /** Number of step items in the sidebar (default: 5) */
  stepCount?: number
}

function SkeletonBox({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--p-border-radius-100)]",
        "bg-[var(--p-color-bg-fill-secondary)]",
        "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function FormWizardSkeleton({
  stepCount = 5,
  className,
  ...props
}: FormWizardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-8rem)]",
        "sm:rounded-[var(--p-border-radius-400)] sm:overflow-hidden",
        "border border-[var(--p-color-border-secondary)]",
        className
      )}
      {...props}
    >
      {/* ── Desktop Sidebar ── */}
      <aside className="w-72 shrink-0 hidden lg:flex flex-col border-r border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-400)]">
        {/* Step items */}
        <nav className="space-y-[var(--p-space-100)] flex-1">
          {Array.from({ length: stepCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-[var(--p-space-300)] p-[var(--p-space-300)] rounded-[var(--p-border-radius-200)]",
                i === 0 && "bg-[var(--p-color-bg-fill-secondary)]/50"
              )}
            >
              <SkeletonBox className="size-7 rounded-full shrink-0" />
              <div className="flex-1 space-y-[var(--p-space-150)]">
                <SkeletonBox className="h-[0.5rem] w-24" />
                <SkeletonBox className="h-[0.375rem] w-36" />
              </div>
            </div>
          ))}
        </nav>

        {/* Progress bar */}
        <div className="mt-[var(--p-space-400)] flex items-center gap-[var(--p-space-200)]">
          <SkeletonBox className="flex-1 h-1.5 rounded-full" />
          <SkeletonBox className="h-[0.5rem] w-8" />
        </div>

        {/* Preview card */}
        <div className="mt-[var(--p-space-400)]">
          <SkeletonBox className="h-[0.375rem] w-12 mb-[var(--p-space-200)]" />
          <SkeletonBox className="w-full aspect-[4/3] rounded-[var(--p-border-radius-200)]" />
          <div className="mt-[var(--p-space-200)] space-y-[var(--p-space-150)]">
            <SkeletonBox className="h-[0.5rem] w-2/3" />
            <SkeletonBox className="h-[0.375rem] w-1/2" />
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--p-color-bg-surface)]">
        {/* Header */}
        <header className="shrink-0 bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] px-[var(--p-space-500)] py-[var(--p-space-300)]">
          <div className="flex items-center justify-between gap-[var(--p-space-400)]">
            <div className="flex items-center gap-[var(--p-space-200)]">
              <SkeletonBox className="h-5 w-28" />
              <SkeletonBox className="h-4 w-20" />
              <SkeletonBox className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-center gap-[var(--p-space-200)]">
              <SkeletonBox className="h-8 w-20 rounded-[var(--p-border-radius-200)]" />
              <SkeletonBox className="h-8 w-16 rounded-[var(--p-border-radius-200)]" />
            </div>
          </div>
        </header>

        {/* Mobile stepper */}
        <div className="lg:hidden bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-200)]">
          <div className="flex gap-[var(--p-space-100)]">
            {Array.from({ length: stepCount }).map((_, i) => (
              <SkeletonBox
                key={i}
                className={cn(
                  "h-7 rounded-full shrink-0",
                  i === 0 ? "w-24" : "w-20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step title + description */}
          <div className="px-[var(--p-space-400)] sm:px-[var(--p-space-600)] pt-[var(--p-space-500)] pb-[var(--p-space-200)]">
            <SkeletonBox className="h-4 w-32" />
            <SkeletonBox className="h-3 w-52 mt-[var(--p-space-150)]" />
          </div>

          {/* Form fields placeholder */}
          <div className="px-[var(--p-space-400)] sm:px-[var(--p-space-600)] pb-[var(--p-space-600)] space-y-[var(--p-space-500)]">
            {/* Field group 1 */}
            <div className="space-y-[var(--p-space-200)]">
              <SkeletonBox className="h-3 w-16" />
              <SkeletonBox className="h-9 w-full rounded-[var(--p-border-radius-200)]" />
            </div>
            {/* Field group 2 */}
            <div className="space-y-[var(--p-space-200)]">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-20 w-full rounded-[var(--p-border-radius-200)]" />
            </div>
            {/* Field group 3 — two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
              <div className="space-y-[var(--p-space-200)]">
                <SkeletonBox className="h-3 w-20" />
                <SkeletonBox className="h-9 w-full rounded-[var(--p-border-radius-200)]" />
              </div>
              <div className="space-y-[var(--p-space-200)]">
                <SkeletonBox className="h-3 w-14" />
                <SkeletonBox className="h-9 w-full rounded-[var(--p-border-radius-200)]" />
              </div>
            </div>
            {/* Field group 4 */}
            <div className="space-y-[var(--p-space-200)]">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="h-9 w-full rounded-[var(--p-border-radius-200)]" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="shrink-0 bg-[var(--p-color-bg-surface)] border-t border-[var(--p-color-border-secondary)] px-[var(--p-space-500)] py-[var(--p-space-300)] flex items-center justify-between">
          <SkeletonBox className="h-8 w-16 rounded-[var(--p-border-radius-200)]" />
          {/* Progress dots */}
          <div className="hidden sm:flex gap-[var(--p-space-100)]">
            {Array.from({ length: stepCount }).map((_, i) => (
              <SkeletonBox
                key={i}
                className={cn(
                  "h-1.5 rounded-full",
                  i === 0 ? "w-8" : "w-4"
                )}
              />
            ))}
          </div>
          <SkeletonBox className="h-9 w-24 rounded-[var(--p-border-radius-200)]" />
        </footer>
      </div>
    </div>
  )
}

export { SkeletonText, SkeletonThumbnail, SkeletonCard, FormWizardSkeleton }
