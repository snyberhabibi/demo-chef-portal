"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Button
 * Source: @shopify/polaris-tokens v9.4.2 + Polaris React component source
 *
 * States per variant (from Polaris source):
 *
 * PRIMARY (default):
 *   default  → bg-fill-brand + gradient + shadow-button-primary
 *   hover    → bg-fill-brand-hover + shadow-button-primary-hover
 *   active   → bg-fill-brand-active + shadow-button-primary-inset + content↓1px
 *   disabled → bg blackAlpha[9] + white text + no shadow + no gradient
 *   mobile   → no gradient, no shadows
 *
 * SECONDARY:
 *   default  → bg-fill + shadow-button
 *   hover    → bg-fill-hover + shadow-button-hover
 *   active   → bg-fill-active + shadow-button-inset + content↓1px
 *   pressed  → bg-fill-selected + shadow-button-inset
 *   disabled → bg-fill-disabled + text-disabled + no shadow
 *   mobile   → flat 1px border inset
 *
 * TERTIARY:
 *   default  → transparent + no shadow
 *   hover    → bg-fill-transparent-hover
 *   active   → bg-fill-transparent-active
 *   disabled → transparent + text-disabled
 *
 * PLAIN:
 *   default  → transparent + link color
 *   hover    → underline + link-hover color
 *   active   → underline + link-active color
 *   disabled → transparent + text-disabled
 */

const buttonVariants = cva(
  [
    /* Reset + base layout */
    "relative box-border inline-flex items-center justify-center",
    "select-none touch-manipulation",
    "cursor-pointer",
    /* Border radius: var(--p-border-radius-200) = 0.5rem */
    "rounded-[var(--p-border-radius-200)]",
    /* No border — Polaris uses box-shadow for all borders */
    "border-none",
    /* Gap: var(--p-space-050) = 0.125rem */
    "gap-[var(--p-space-050)]",
    /* No transitions — Polaris state changes are instant */
    /* Icon sizing */
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    /* Focus: 2px solid blue outline, 1px offset */
    "outline-none",
    "focus-visible:outline-[length:var(--p-border-width-050)]",
    "focus-visible:outline-solid",
    "focus-visible:outline-[color:var(--p-color-border-focus)]",
    "focus-visible:outline-offset-[var(--p-space-025)]",
    /* Disabled: explicit colors, no pointer events, no shadow */
    "disabled:pointer-events-none disabled:shadow-none disabled:cursor-default",
  ].join(" "),
  {
    variants: {
      variant: {
        /* ============ PRIMARY ============ */
        default: [
          /* Default state */
          "bg-[var(--p-color-bg-fill-brand)]",
          "[background-image:var(--p-color-button-gradient-bg-fill)]",
          "text-[var(--p-color-text-brand-on-bg-fill)]",
          "shadow-[var(--p-shadow-button-primary)]",
          "font-[var(--p-font-weight-medium)] max-tablet:font-[var(--p-font-weight-semibold)]",
          /* Hover: darker bg + different shadow */
          "hover:bg-[var(--p-color-bg-fill-brand-hover)]",
          "hover:shadow-[0_0_0_0_transparent,0.0625rem_0_0_0_rgba(255,255,255,0.20)_inset,-0.0625rem_0_0_0_rgba(255,255,255,0.20)_inset,0_-0.0625rem_0_0_rgba(0,0,0,0.20)_inset]",
          /* Active: inset shadow + content shifts down 1px */
          "active:bg-[var(--p-color-bg-fill-brand-active)]",
          "active:shadow-[var(--p-shadow-button-primary-inset)]",
          "active:[&>*]:translate-y-px",
          /* Disabled */
          "disabled:bg-[var(--p-color-bg-fill-brand-disabled)]",
          "disabled:text-[var(--p-color-text-brand-on-bg-fill)]",
          "disabled:[background-image:none]",
          /* Mobile: no gradient, no shadows */
          "max-tablet:[background-image:none]",
          "max-tablet:shadow-none max-tablet:hover:shadow-none max-tablet:active:shadow-none",
        ].join(" "),

        /* ============ SECONDARY ============ */
        secondary: [
          /* Default state */
          "bg-[var(--p-color-bg-fill)]",
          "text-[var(--p-color-text)]",
          "shadow-[var(--p-shadow-button)]",
          "font-[var(--p-font-weight-medium)]",
          /* Hover: slightly darker bg + different shadow */
          "hover:bg-[var(--p-color-bg-fill-hover)]",
          "hover:shadow-[var(--p-shadow-button-hover)]",
          /* Active: pressed in shadow + content shifts down 1px */
          "active:bg-[var(--p-color-bg-fill-active)]",
          "active:shadow-[var(--p-shadow-button-inset)]",
          "active:[&>*]:translate-y-px",
          /* Disabled */
          "disabled:bg-[var(--p-color-bg-fill-disabled)]",
          "disabled:text-[var(--p-color-text-disabled)]",
          /* Mobile: flat 1px border instead of bevel shadows */
          "max-tablet:shadow-[0_0_0_var(--p-border-width-025)_var(--p-color-border)_inset]",
          "max-tablet:hover:shadow-[0_0_0_var(--p-border-width-025)_var(--p-color-border)_inset]",
          "max-tablet:active:shadow-[0_0_0_var(--p-border-width-025)_var(--p-color-border)_inset]",
        ].join(" "),

        /* ============ TERTIARY ============ */
        tertiary: [
          /* Default state */
          "bg-transparent",
          "text-[var(--p-color-text)]",
          "shadow-none",
          "font-[var(--p-font-weight-medium)]",
          /* Hover */
          "hover:bg-[var(--p-color-bg-fill-transparent-hover)]",
          /* Active */
          "active:bg-[var(--p-color-bg-fill-transparent-active)]",
          /* Disabled */
          "disabled:bg-transparent",
          "disabled:text-[var(--p-color-text-disabled)]",
        ].join(" "),

        /* ============ PLAIN (link-style) ============ */
        plain: [
          /* Default state */
          "bg-transparent",
          "text-[var(--p-color-text-link)]",
          "shadow-none",
          "font-[var(--p-font-weight-regular)]",
          /* Negative margin to sit flush (cancels padding) */
          "-m-[var(--p-space-150)_var(--p-space-300)]",
          /* Hover: underline + darker */
          "hover:text-[var(--p-color-text-link-hover)]",
          "hover:underline",
          /* Active: underline + darkest */
          "active:text-[var(--p-color-text-link-active)]",
          "active:underline",
          /* Focus */
          "focus-visible:underline",
          "focus-visible:rounded-[var(--p-border-radius-300)]",
          /* Disabled */
          "disabled:bg-transparent",
          "disabled:text-[var(--p-color-text-disabled)]",
          "disabled:no-underline",
        ].join(" "),

        /* ============ DESTRUCTIVE (critical + primary) ============ */
        destructive: [
          /* Default state */
          "bg-[rgba(199,10,36,1)]",
          "[background-image:var(--p-color-button-gradient-bg-fill)]",
          "text-white",
          "shadow-[var(--p-shadow-button-primary-critical)]",
          "font-[var(--p-font-weight-medium)] max-tablet:font-[var(--p-font-weight-semibold)]",
          /* Hover */
          "hover:bg-[rgba(163,10,36,1)]",
          "hover:shadow-[var(--p-shadow-button-primary-critical-hover)]",
          /* Active */
          "active:bg-[rgba(142,11,33,1)]",
          "active:shadow-[var(--p-shadow-button-primary-critical-inset)]",
          "active:[&>*]:translate-y-px",
          /* Disabled */
          "disabled:bg-[rgba(0,0,0,0.17)]",
          "disabled:text-white",
          "disabled:[background-image:none]",
          /* Mobile */
          "max-tablet:[background-image:none]",
          "max-tablet:shadow-none max-tablet:hover:shadow-none max-tablet:active:shadow-none",
        ].join(" "),

        /* ============ SUCCESS (success + primary) ============ */
        success: [
          /* Default state */
          "bg-[rgba(4,123,93,1)]",
          "[background-image:var(--p-color-button-gradient-bg-fill)]",
          "text-white",
          "shadow-[var(--p-shadow-button-primary-success)]",
          "font-[var(--p-font-weight-medium)] max-tablet:font-[var(--p-font-weight-semibold)]",
          /* Hover */
          "hover:bg-[rgba(3,94,76,1)]",
          "hover:shadow-[var(--p-shadow-button-primary-success-hover)]",
          /* Active */
          "active:bg-[rgba(1,75,64,1)]",
          "active:shadow-[var(--p-shadow-button-primary-success-inset)]",
          "active:[&>*]:translate-y-px",
          /* Disabled */
          "disabled:bg-[rgba(0,0,0,0.17)]",
          "disabled:text-white",
          "disabled:[background-image:none]",
          /* Mobile */
          "max-tablet:[background-image:none]",
          "max-tablet:shadow-none max-tablet:hover:shadow-none max-tablet:active:shadow-none",
        ].join(" "),
      },

      size: {
        /* MEDIUM (default) — bodySm: 0.75rem/1rem */
        default: [
          "min-h-[1.75rem] min-w-[1.75rem]",
          "px-[0.75rem] py-[0.375rem]",
          "text-[0.75rem] leading-[1rem]",
          "max-tablet:text-[0.875rem] max-tablet:leading-[1.25rem]",
          "max-tablet:min-h-[2rem] max-tablet:min-w-[2rem]",
        ].join(" "),

        /* SLIM — same as medium */
        sm: [
          "min-h-[1.75rem] min-w-[1.75rem]",
          "px-[0.75rem] py-[0.375rem]",
          "text-[0.75rem] leading-[1rem]",
          "max-tablet:text-[0.875rem] max-tablet:leading-[1.25rem]",
          "max-tablet:min-h-[2rem] max-tablet:min-w-[2rem]",
        ].join(" "),

        /* MICRO */
        micro: [
          "min-h-[1.5rem] min-w-[1.5rem]",
          "px-[0.5rem] py-[0.25rem]",
          "text-[0.75rem] leading-[1rem]",
          "max-tablet:text-[0.875rem] max-tablet:leading-[1.25rem]",
          "max-tablet:min-h-[1.75rem] max-tablet:min-w-[1.75rem]",
        ].join(" "),

        /* LARGE — bodyMd: 0.8125rem/1.25rem */
        lg: [
          "min-h-[2rem] min-w-[2rem]",
          "px-[0.75rem] py-[0.375rem]",
          "text-[0.8125rem] leading-[1.25rem]",
          "max-tablet:text-[1rem] max-tablet:leading-[1.5rem]",
          "max-tablet:min-h-[2.25rem] max-tablet:min-w-[2.25rem]",
        ].join(" "),

        /* ICON-ONLY */
        icon: [
          "min-h-[1.75rem] min-w-[1.75rem] p-[0.25rem]",
          "max-tablet:min-h-[2rem] max-tablet:min-w-[2rem]",
        ].join(" "),
        "icon-micro": [
          "min-h-[1.5rem] min-w-[1.5rem] p-[0.125rem]",
          "max-tablet:min-h-[1.75rem] max-tablet:min-w-[1.75rem]",
        ].join(" "),
        "icon-lg": [
          "min-h-[2rem] min-w-[2rem] p-[0.375rem]",
          "max-tablet:min-h-[2.25rem] max-tablet:min-w-[2.25rem]",
        ].join(" "),
      },

      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
