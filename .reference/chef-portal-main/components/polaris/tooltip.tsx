"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Tooltip
 * Supports both hover (default) and click trigger modes.
 *
 * - Background: bg-surface-inverse (dark gray)
 * - Text: white, 0.75rem
 * - Border-radius: 0.5rem
 * - Padding: 0.25rem 0.5rem
 * - Shadow: shadow-400
 * - Max-width: 12.5rem
 */

const tooltipContentClasses = cn(
  "z-50 max-w-[12.5rem]",
  "bg-[var(--p-color-bg-surface-inverse)]",
  "text-[var(--p-color-text-inverse)]",
  "rounded-[var(--p-border-radius-200)]",
  "px-[var(--p-space-200)] py-[var(--p-space-100)]",
  "shadow-[var(--p-shadow-400)]",
  "text-[0.75rem] leading-[1rem]",
  "font-[var(--p-font-weight-regular)]",
  "text-center",
  "animate-in fade-in-0 zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2",
  "data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2",
  "data-[side=top]:slide-in-from-bottom-2",
)

/* ============ HOVER TOOLTIP ============ */

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentClasses, className)}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

/* ============ CLICK TOOLTIP (uses Popover) ============ */

function ClickTooltip({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="click-tooltip" {...props} />
}

function ClickTooltipTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="click-tooltip-trigger" {...props} />
}

function ClickTooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="click-tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentClasses, className)}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  ClickTooltip, ClickTooltipTrigger, ClickTooltipContent,
}
