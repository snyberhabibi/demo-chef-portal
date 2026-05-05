"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"

/**
 * Polaris Sheet / Drawer — slides in from the right
 *
 * - Width: 23.75rem (380px) on desktop
 * - Full width on mobile
 * - Background: bg-surface
 * - Shadow: shadow-600
 */

function Sheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/25 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "left" | "right"
}) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 top-0 bottom-0",
          "w-full xs:w-[23.75rem]",
          "bg-[var(--p-color-bg-surface)]",
          "shadow-[var(--p-shadow-600)]",
          "flex flex-col",
          "overflow-hidden",
          /* Animation */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          side === "right" && "right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" && "left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-[var(--p-space-400)] right-[var(--p-space-400)]",
            "rounded-[var(--p-border-radius-200)]",
            "text-[var(--p-color-icon-secondary)]",
            "hover:text-[var(--p-color-icon-hover)]",
            "hover:bg-[var(--p-color-bg-fill-transparent-hover)]",
            "p-[var(--p-space-100)]",
            "outline-none cursor-pointer",
            "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
          )}
        >
          <XIcon className="size-5 fill-current" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "px-[var(--p-space-500)] pt-[var(--p-space-500)] pb-[var(--p-space-400)]",
        "bg-[var(--p-color-bg-surface-secondary)]",
        "border-b border-[var(--p-color-border)]",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-[var(--p-font-size-500)] leading-[var(--p-font-line-height-600)]",
        "font-[var(--p-font-weight-semibold)]",
        "text-[var(--p-color-text)]",
        className
      )}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex-1 overflow-y-auto",
        "px-[var(--p-space-500)] py-[var(--p-space-400)]",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex justify-end gap-[var(--p-space-200)]",
        "px-[var(--p-space-500)] py-[var(--p-space-400)]",
        "border-t border-[var(--p-color-border)]",
        className
      )}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter }
