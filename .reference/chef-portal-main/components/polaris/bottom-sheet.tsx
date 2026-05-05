"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"

/**
 * Polaris Bottom Sheet — slides up from the bottom
 *
 * - Full width on mobile
 * - Max-height: 85vh
 * - Rounded top corners
 * - Drag handle indicator
 * - Background: bg-surface
 * - Shadow: shadow-600
 */

function BottomSheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="bottom-sheet" {...props} />
}

function BottomSheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />
}

function BottomSheetClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="bottom-sheet-close" {...props} />
}

function BottomSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="bottom-sheet-overlay"
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

function BottomSheetContent({
  className,
  children,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showHandle?: boolean
}) {
  return (
    <DialogPrimitive.Portal>
      <BottomSheetOverlay />
      <DialogPrimitive.Content
        data-slot="bottom-sheet-content"
        className={cn(
          "fixed z-50 bottom-0 left-0 right-0",
          "max-h-[85vh]",
          "bg-[var(--p-color-bg-surface)]",
          "rounded-t-[var(--p-border-radius-400)]",
          "shadow-[var(--p-shadow-600)]",
          "flex flex-col",
          "overflow-hidden",
          /* Animation */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          className
        )}
        {...props}
      >
        {/* Drag handle */}
        {showHandle && (
          <div className="flex justify-center pt-[var(--p-space-200)] pb-[var(--p-space-100)]">
            <div className="w-[2.25rem] h-[0.25rem] rounded-[var(--p-border-radius-full)] bg-[var(--p-color-bg-fill-tertiary)]" />
          </div>
        )}
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-[var(--p-space-300)] right-[var(--p-space-300)]",
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

function BottomSheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn(
        "px-[var(--p-space-500)] pt-[var(--p-space-200)] pb-[var(--p-space-300)]",
        "border-b border-[var(--p-color-border)]",
        className
      )}
      {...props}
    />
  )
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="bottom-sheet-title"
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

function BottomSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-body"
      className={cn(
        "flex-1 overflow-y-auto",
        "px-[var(--p-space-500)] py-[var(--p-space-400)]",
        className
      )}
      {...props}
    />
  )
}

function BottomSheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-footer"
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

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetBody,
  BottomSheetFooter,
}
