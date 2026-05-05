"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckSmallIcon, MinusIcon } from "@shopify/polaris-icons"

import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Checkbox
 * Source: @shopify/polaris-tokens v9.4.2 + Polaris Checkbox source
 *
 * Key specs:
 * - Size: 1.125rem (18px) — Polaris uses 18x18
 * - Border: 0.0625rem (1px) solid input-border
 * - Border radius: 0.25rem (4px) — border-radius-100
 * - Background: input-bg-surface (unchecked), bg-fill-brand (checked)
 * - Checkmark: white, centered
 * - Focus: 2px blue outline, 1px offset
 * - Disabled: bg-surface-disabled, no border
 * - Error: critical border
 */

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  error?: boolean
  indeterminate?: boolean
}

function Checkbox({
  className,
  error,
  indeterminate,
  checked,
  ...props
}: CheckboxProps) {
  const resolvedChecked = indeterminate ? "indeterminate" : checked

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={resolvedChecked}
      className={cn(
        /* Size */
        "size-[1.125rem] shrink-0",
        /* Border */
        "border-[length:var(--p-border-width-025)]",
        "border-solid",
        "border-[var(--p-color-input-border)]",
        "rounded-[var(--p-border-radius-100)]",
        /* Background */
        "bg-[var(--p-color-input-bg-surface)]",
        /* Transition */
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
        /* Hover */
        "hover:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        /* Checked state */
        "data-[state=checked]:bg-[var(--p-color-bg-fill-brand)]",
        "data-[state=checked]:border-[var(--p-color-bg-fill-brand)]",
        "data-[state=checked]:text-white",
        "data-[state=checked]:hover:not-disabled:bg-[var(--p-color-bg-fill-brand-hover)]",
        "data-[state=checked]:hover:not-disabled:border-[var(--p-color-bg-fill-brand-hover)]",
        /* Indeterminate state */
        "data-[state=indeterminate]:bg-[var(--p-color-bg-fill-brand)]",
        "data-[state=indeterminate]:border-[var(--p-color-bg-fill-brand)]",
        "data-[state=indeterminate]:text-white",
        /* Focus */
        "outline-none",
        "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        /* Disabled */
        "disabled:cursor-not-allowed",
        "disabled:border-none",
        "disabled:bg-[var(--p-color-checkbox-bg-surface-disabled)]",
        "disabled:data-[state=checked]:bg-[var(--p-color-checkbox-bg-surface-disabled)]",
        /* Error */
        error && "border-[var(--p-color-border-critical-secondary)]",
        /* Cursor */
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current animate-in zoom-in-50 duration-150"
      >
        {indeterminate ? (
          <MinusIcon className="size-4 fill-current" />
        ) : (
          <CheckSmallIcon className="size-4 fill-current" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

/**
 * Polaris CheckboxField — Checkbox with label, help text
 */
interface CheckboxFieldProps extends CheckboxProps {
  label: React.ReactNode
  helpText?: React.ReactNode
  id?: string
}

function CheckboxField({
  label,
  helpText,
  id,
  ...checkboxProps
}: CheckboxFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId

  return (
    <div className="flex gap-[var(--p-space-200)]">
      <Checkbox id={fieldId} {...checkboxProps} />
      <div className="flex flex-col gap-[var(--p-space-025)]">
        <label
          htmlFor={fieldId}
          className={cn(
            "text-[0.8125rem] leading-[1.25rem]",
            "font-[var(--p-font-weight-regular)]",
            "cursor-pointer select-none",
            checkboxProps.disabled
              ? "text-[var(--p-color-text-disabled)] cursor-default"
              : "text-[var(--p-color-text)]",
          )}
        >
          {label}
        </label>
        {helpText && (
          <span className={cn(
            "text-[0.6875rem] leading-[1rem]",
            checkboxProps.disabled
              ? "text-[var(--p-color-text-disabled)]"
              : "text-[var(--p-color-text-secondary)]",
          )}>
            {helpText}
          </span>
        )}
      </div>
    </div>
  )
}

export { Checkbox, CheckboxField }
