"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Card
 * Source: polaris.shopify.com/components/layout-and-structure/card
 *
 * Key specs:
 * - Background: --p-color-bg-surface (white)
 * - Border radius: --p-border-radius-300 (12px), only above sm (490px)
 * - Shadow: --p-shadow-300 (0px 4px 6px -2px rgba(26,26,26,0.20))
 * - Padding: 16px (xs), 20px (sm+)
 * - No border — shadow provides edge definition
 * - roundedAbove defaults to sm (490px)
 */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-[var(--p-space-400)]",
        /* Background */
        "bg-[var(--p-color-bg-surface)]",
        "text-[var(--p-color-text)]",
        /* Padding: 16px on xs, 20px on sm+ */
        "p-[var(--p-space-400)] xs:p-[var(--p-space-500)]",
        /* Border radius: 0 on mobile, 12px on sm+ */
        "rounded-none xs:rounded-[var(--p-border-radius-300)]",
        /* Shadow: shadow-300 */
        "shadow-[var(--p-shadow-300)]",
        /* Mobile: no shadow */
        "max-xs:shadow-none",
        /* Overflow */
        "overflow-clip",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-[var(--p-space-200)]",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        /* Polaris headingSm: 13px, semibold 650, line-height 20px */
        "text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)]",
        "font-[var(--p-font-weight-semibold)]",
        "text-[var(--p-color-text)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        /* Polaris body-md subdued: 13px, regular 450, line-height 20px */
        "text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)]",
        "font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text-secondary)]",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-[var(--p-space-200)]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Polaris Divider (for use between card sections)
 * - 1px line using border-secondary color
 */
function CardDivider({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn(
        "border-none h-px",
        "bg-[var(--p-color-border-secondary)]",
        /* Bleed to card edges: negative margin to cancel card padding */
        "-mx-[var(--p-space-400)] xs:-mx-[var(--p-space-500)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardDivider,
}
