"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "@shopify/polaris-icons";

import { cn } from "@/lib/utils";

/**
 * Pixel-perfect Polaris Modal/Dialog
 * Built on Radix Dialog primitive with Polaris styling.
 *
 * Key specs:
 * - Backdrop: rgba(0,0,0,0.71)
 * - Surface: white, border-radius 12px (--p-border-radius-300)
 * - Shadow: shadow-600
 * - Padding: 20px (--p-space-500)
 * - Title: heading-lg (20px, semibold)
 * - Max-width: 620px (Polaris default modal)
 */

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/25 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50",
          "translate-x-[-50%] translate-y-[-50%]",
          "w-full max-w-[calc(100%-2rem)] sm:max-w-[620px]",
          /* Surface */
          "bg-[var(--p-color-bg-surface)]",
          "rounded-[var(--p-border-radius-300)]",
          "shadow-[var(--p-shadow-600)]",
          /* Layout */
          "grid gap-0 [&>*]:min-w-0",
          "overflow-hidden",
          /* Animation */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-200",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              "absolute top-[var(--p-space-400)] right-[var(--p-space-400)]",
              "rounded-[var(--p-border-radius-200)]",
              "text-[var(--p-color-icon-secondary)]",
              "hover:text-[var(--p-color-icon-hover)]",
              "hover:bg-[var(--p-color-bg-fill-transparent-hover)]",
              "p-[var(--p-space-100)]",
              "outline-none cursor-pointer",
              "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
            )}
          >
            <XIcon className="fill-current" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "px-[var(--p-space-500)] pt-[var(--p-space-500)] pb-[var(--p-space-400)]",
        "bg-[var(--p-color-bg-surface-secondary)]",
        "border-b border-[var(--p-color-border)]",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex justify-end gap-[var(--p-space-200)]",
        "px-[var(--p-space-500)] py-[var(--p-space-400)]",
        "border-t border-[var(--p-color-border)]",
        className
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "px-[var(--p-space-500)] py-[var(--p-space-400)]",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        /* Polaris heading-lg: 20px, semibold, dense tracking */
        "text-[var(--p-font-size-500)] leading-[var(--p-font-line-height-600)]",
        "font-[var(--p-font-weight-semibold)]",
        "tracking-[var(--p-font-letter-spacing-dense)]",
        "text-[var(--p-color-text)]",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)]",
        "text-[var(--p-color-text-secondary)]",
        "mt-[var(--p-space-100)]",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBody,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
