"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon, InfoIcon, CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Banner
 *
 * - Full-width notification bar
 * - Tones: info, success, warning, critical
 * - Uses semantic surface bg + border colors
 * - Icon on the left, dismiss X on the right
 * - Border-radius: border-radius-300 (0.75rem)
 * - Padding: space-300 (0.75rem) to space-400 (1rem)
 */

const bannerVariants = cva(
  [
    "relative flex gap-[var(--p-space-300)]",
    "p-[var(--p-space-400)]",
    "rounded-[var(--p-border-radius-300)]",
    "border",
    "text-[0.8125rem] leading-[1.25rem]",
    "font-[var(--p-font-weight-regular)]",
  ].join(" "),
  {
    variants: {
      tone: {
        info: [
          "bg-[var(--p-color-bg-surface-info)]",
          "border-[var(--p-color-border-info)]",
          "text-[var(--p-color-text-info)]",
        ].join(" "),
        success: [
          "bg-[var(--p-color-bg-surface-success)]",
          "border-[var(--p-color-border-success)]",
          "text-[var(--p-color-text-success)]",
        ].join(" "),
        warning: [
          "bg-[var(--p-color-bg-surface-warning)]",
          "border-[var(--p-color-border-warning)]",
          "text-[var(--p-color-text-warning)]",
        ].join(" "),
        critical: [
          "bg-[var(--p-color-bg-surface-critical)]",
          "border-[var(--p-color-border-critical)]",
          "text-[var(--p-color-text-critical)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      tone: "info",
    },
  }
)

const toneIcons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  critical: AlertCircleIcon,
}

interface BannerProps extends Omit<React.ComponentProps<"div">, "title">,
  VariantProps<typeof bannerVariants> {
  title?: React.ReactNode
  onDismiss?: () => void
  hideIcon?: boolean
}

function Banner({
  className,
  tone = "info",
  title,
  onDismiss,
  hideIcon,
  children,
  ...props
}: BannerProps) {
  const Icon = toneIcons[tone || "info"]

  return (
    <div
      data-slot="banner"
      role="status"
      className={cn(bannerVariants({ tone }), className)}
      {...props}
    >
      {!hideIcon && (
        <Icon className="size-5 shrink-0 mt-px fill-current" />
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-[var(--p-font-weight-semibold)] mb-[var(--p-space-100)]">
            {title}
          </p>
        )}
        {children && <div>{children}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] hover:bg-black/5 cursor-pointer"
        >
          <XIcon className="size-4 fill-current" />
        </button>
      )}
    </div>
  )
}

export { Banner, bannerVariants }
