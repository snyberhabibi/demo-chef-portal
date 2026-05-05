"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris TextField (Input)
 * Source: @shopify/polaris TextField component + polaris-tokens v9.4.2
 *
 * Architecture: Polaris uses a wrapper with an absolutely-positioned Backdrop
 * for border/bg, and the input sits on top with z-index. We simplify this
 * into a single input element with matching styles.
 *
 * Key specs:
 * - Border: 0.66px solid gray-12, top border slightly different (#898f94)
 * - Background: rgba(253,253,253,1) — not pure white
 * - Border radius: 8px
 * - Min-height: 32px
 * - Padding: 6px 12px
 * - Font: 13px/20px, weight 450 (desktop), 16px/24px (mobile)
 * - Focus: border thickens to 1px, color goes to gray-16, outline 2px blue
 * - Hover: border darkens to gray-13, bg slightly darker
 * - No transitions — instant state changes
 */

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={error || undefined}
      className={cn(
        /* Base */
        "w-full min-w-0 appearance-none",
        "min-h-[2.25rem]",
        "px-[var(--p-space-300)] py-[var(--p-space-150)]",
        /* Typography: 13px/20px desktop, 16px/24px mobile */
        "text-[0.8125rem] leading-[1.25rem]",
        "font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text)]",
        "caret-[var(--p-color-text)]",
        /* Background & border */
        "bg-[var(--p-color-input-bg-surface)]",
        "border-[length:var(--p-border-width-0165)]",
        "border-solid",
        "border-[var(--p-color-control-border)]",
        "rounded-[var(--p-border-radius-200)]",
        /* Placeholder */
        "placeholder:text-[var(--p-color-text-secondary)]",
        /* Hover (not focus, not disabled) */
        "hover:not-focus-visible:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-focus-visible:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        "outline-none",
        /* Focus — only color changes, no width change */
        "focus-visible:border-[var(--p-color-control-border-focus)]",
        "focus-visible:bg-[var(--p-color-input-bg-surface-active)]",
        "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        /* Disabled */
        "disabled:pointer-events-none",
        "disabled:border-none",
        "disabled:bg-[var(--p-color-bg-surface-disabled)]",
        "disabled:text-[var(--p-color-text-disabled)]",
        "disabled:[-webkit-text-fill-color:var(--p-color-text-disabled)]",
        "disabled:opacity-100",
        "disabled:cursor-default",
        /* Error state */
        error && [
          "!border-[var(--p-color-bg-fill-critical)]",
          "bg-[var(--p-color-bg-surface-critical)]",
          "focus-visible:!border-[var(--p-color-bg-fill-critical)]",
          "focus-visible:bg-[var(--p-color-bg-surface-critical)]",
          "focus-visible:!shadow-[0_0_0_1px_var(--p-color-bg-fill-critical)]",
          "hover:not-focus-visible:not-disabled:!border-[var(--p-color-bg-fill-critical)]",
          "hover:not-focus-visible:not-disabled:bg-[var(--p-color-bg-surface-critical)]",
        ],
        /* File input */
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        /* Selection */
        "selection:bg-[var(--p-color-bg-fill-emphasis)] selection:text-white",
        className
      )}
      {...props}
    />
  )
}

/**
 * Polaris Textarea (multiline TextField)
 *
 * Same styling as Input but with:
 * - resize: none (height controlled by content or rows prop)
 * - Horizontal padding only (vertical comes from rows)
 */
export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={error || undefined}
      className={cn(
        /* Base */
        "w-full min-w-0 appearance-none resize-none",
        "min-h-[2.25rem]",
        "px-[var(--p-space-300)] py-[var(--p-space-150)]",
        /* Typography */
        "text-[0.8125rem] leading-[1.25rem]",
        "font-[var(--p-font-weight-regular)]",
        "text-[var(--p-color-text)]",
        "caret-[var(--p-color-text)]",
        /* Background & border */
        "bg-[var(--p-color-input-bg-surface)]",
        "border-[length:var(--p-border-width-0165)]",
        "border-solid",
        "border-[var(--p-color-control-border)]",
        "rounded-[var(--p-border-radius-200)]",
        /* Placeholder */
        "placeholder:text-[var(--p-color-text-secondary)]",
        /* Hover */
        "hover:not-focus-visible:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-focus-visible:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        "outline-none",
        /* Focus — only color changes, no width change */
        "focus-visible:border-[var(--p-color-control-border-focus)]",
        "focus-visible:bg-[var(--p-color-input-bg-surface-active)]",
        "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        /* Disabled */
        "disabled:pointer-events-none",
        "disabled:border-none",
        "disabled:bg-[var(--p-color-bg-surface-disabled)]",
        "disabled:text-[var(--p-color-text-disabled)]",
        "disabled:[-webkit-text-fill-color:var(--p-color-text-disabled)]",
        "disabled:opacity-100",
        "disabled:cursor-default",
        /* Error state */
        error && [
          "!border-[var(--p-color-bg-fill-critical)]",
          "bg-[var(--p-color-bg-surface-critical)]",
          "focus-visible:!border-[var(--p-color-bg-fill-critical)]",
          "focus-visible:bg-[var(--p-color-bg-surface-critical)]",
          "focus-visible:!shadow-[0_0_0_1px_var(--p-color-bg-fill-critical)]",
          "hover:not-focus-visible:not-disabled:!border-[var(--p-color-bg-fill-critical)]",
          "hover:not-focus-visible:not-disabled:bg-[var(--p-color-bg-surface-critical)]",
        ],
        /* Selection */
        "selection:bg-[var(--p-color-bg-fill-emphasis)] selection:text-white",
        className
      )}
      {...props}
    />
  )
}

/**
 * Polaris Label
 *
 * - Font: 13px/20px, weight 450
 * - Color: gray-15
 * - Margin bottom: 4px
 */
export interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean
  disabled?: boolean
}

function Label({ className, children, required, disabled, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block",
        "text-[11px] leading-[16px]",
        "font-[var(--p-font-weight-medium)]",
        "mb-[var(--p-space-100)]",
        disabled
          ? "text-[var(--p-color-text-disabled)]"
          : "text-[var(--p-color-text)]",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-[var(--p-color-text-critical)] ml-[var(--p-space-100)]">*</span>
      )}
    </label>
  )
}

/**
 * Polaris InlineError
 *
 * - Font: 13px, color: critical
 * - Margin top: 4px
 * - Displayed with a diamond alert icon
 */
function InlineError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-start gap-[var(--p-space-100)]",
        "mt-[var(--p-space-100)]",
        "text-[11px] leading-[16px]",
        "text-[var(--p-color-text-critical)]",
        className
      )}
      {...props}
    >
      {/* Diamond alert icon (simplified) */}
      <svg
        viewBox="0 0 20 20"
        className="w-4 h-4 shrink-0 mt-0.5 fill-[var(--p-color-text-critical)]"
      >
        <path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" />
        <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path
          fillRule="evenodd"
          d="M11.237 3.177a1.75 1.75 0 0 0-2.474 0l-5.586 5.586a1.75 1.75 0 0 0 0 2.474l5.586 5.586a1.75 1.75 0 0 0 2.474 0l5.586-5.586a1.75 1.75 0 0 0 0-2.474l-5.586-5.586Zm-1.414 1.06a.25.25 0 0 1 .354 0l5.586 5.586a.25.25 0 0 1 0 .354l-5.586 5.586a.25.25 0 0 1-.354 0l-5.586-5.586a.25.25 0 0 1 0-.354l5.586-5.586Z"
        />
      </svg>
      <span>{children}</span>
    </div>
  )
}

/**
 * Polaris HelpText
 *
 * - Font: 13px, color: subdued
 * - Margin top: 4px
 */
function HelpText({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"p"> & { disabled?: boolean }) {
  return (
    <p
      className={cn(
        "mt-[var(--p-space-100)]",
        "text-[11px] leading-[16px]",
        disabled
          ? "text-[var(--p-color-text-disabled)]"
          : "text-[var(--p-color-text-secondary)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export { Input, Textarea, Label, InlineError, HelpText }
