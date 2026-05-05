"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckSmallIcon, ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons"

import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Select
 * Built on Radix Select primitive (same as shadcn) with Polaris styling.
 *
 * - Trigger matches Polaris TextField styling (border, bg, radius, focus)
 * - Dropdown uses Polaris surface colors and shadows
 * - Items use Polaris hover/selected states
 */

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  error,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  error?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        /* Layout */
        "flex w-full items-center justify-between gap-[var(--p-space-200)]",
        "min-h-[2.25rem]",
        "px-[var(--p-space-300)] py-[var(--p-space-150)]",
        /* Typography */
        "text-[0.8125rem] leading-[1.25rem]",
        "font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text)]",
        /* Background & border — matches Input */
        "bg-[var(--p-color-input-bg-surface)]",
        "border-[length:var(--p-border-width-0165)]",
        "border-solid",
        "border-[var(--p-color-control-border)]",
        "rounded-[var(--p-border-radius-200)]",
        /* Placeholder */
        "data-[placeholder]:text-[var(--p-color-text-secondary)]",
        /* Hover */
        "hover:not-focus-visible:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-focus-visible:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        "outline-none",
        /* Focus — only color changes, no width change */
        "focus-visible:border-[var(--p-color-control-border-focus)]",
        "focus-visible:bg-[var(--p-color-input-bg-surface-active)]",
        "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        /* Open state — same as focus */
        "data-[state=open]:border-[var(--p-color-control-border-focus)]",
        "data-[state=open]:bg-[var(--p-color-input-bg-surface-active)]",
        "data-[state=open]:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        /* Disabled */
        "disabled:pointer-events-none",
        "disabled:border-none",
        "disabled:bg-[var(--p-color-bg-surface-disabled)]",
        "disabled:text-[var(--p-color-text-disabled)]",
        "disabled:cursor-default",
        /* Error */
        error && [
          "border-[var(--p-color-border-critical-secondary)]",
          "bg-[var(--p-color-bg-surface-critical)]",
        ],
        /* Value truncation */
        "*:data-[slot=select-value]:line-clamp-1",
        "*:data-[slot=select-value]:flex",
        "*:data-[slot=select-value]:items-center",
        "*:data-[slot=select-value]:gap-2",
        /* Icon */
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 fill-[var(--p-color-icon)]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          /* Surface */
          "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text)]",
          /* Border & shadow — Polaris dropdown */
          "border border-[var(--p-color-border)]",
          "rounded-[var(--p-border-radius-300)]",
          "shadow-[var(--p-shadow-300)]",
          /* Layout */
          "relative z-50",
          "max-h-(--radix-select-content-available-height)",
          "min-w-[8rem]",
          "origin-(--radix-select-content-transform-origin)",
          "overflow-x-hidden overflow-y-auto",
          /* Animation */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-[var(--p-space-100)]",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "text-[var(--p-color-text-secondary)]",
        "px-[var(--p-space-200)] py-[var(--p-space-100)]",
        "text-[12px] leading-[16px] font-[var(--p-font-weight-semibold)]",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        /* Layout */
        "relative flex w-full items-center gap-[var(--p-space-200)]",
        "rounded-[var(--p-border-radius-150)]",
        "py-[var(--p-space-150)] pr-[var(--p-space-800)] pl-[var(--p-space-200)]",
        /* Typography */
        "text-[13px] leading-[20px] font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text)]",
        /* States */
        "cursor-pointer select-none outline-hidden",
        "focus:bg-[var(--p-color-bg-surface-hover)]",
        "data-[state=checked]:bg-[var(--p-color-bg-surface-selected)]",
        "data-[state=checked]:font-[var(--p-font-weight-medium)]",
        /* Disabled */
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:text-[var(--p-color-text-disabled)]",
        /* Icon */
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckSmallIcon className="size-4 fill-[var(--p-color-icon)]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "bg-[var(--p-color-border-secondary)]",
        "pointer-events-none -mx-1 my-[var(--p-space-100)] h-px",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[var(--p-space-100)]",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4 fill-[var(--p-color-icon)]" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[var(--p-space-100)]",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4 fill-[var(--p-color-icon)]" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
