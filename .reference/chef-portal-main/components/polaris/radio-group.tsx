"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris RadioButton
 * Source: @shopify/polaris-tokens v9.4.2 + Polaris RadioButton source
 *
 * Key specs:
 * - Size: 1.125rem (18px) — same as checkbox
 * - Fully round: border-radius-full
 * - Border: 0.0625rem (1px) solid input-border
 * - Background: input-bg-surface (unchecked), bg-fill-brand (selected)
 * - Inner dot: white, 0.5rem (8px)
 * - Focus: blue focus ring
 * - Disabled: radio-button-bg-surface-disabled
 */

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-[var(--p-space-300)]", className)}
      {...props}
    />
  )
}

interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  error?: boolean
}

function RadioGroupItem({
  className,
  error,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        /* Size */
        "size-[1.125rem] shrink-0",
        /* Shape */
        "rounded-full",
        /* Border */
        "border-[length:var(--p-border-width-025)]",
        "border-solid",
        "border-[var(--p-color-input-border)]",
        /* Background */
        "bg-[var(--p-color-input-bg-surface)]",
        /* Transition */
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
        /* Hover */
        "hover:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        /* Selected state */
        "data-[state=checked]:bg-[var(--p-color-bg-fill-brand)]",
        "data-[state=checked]:border-[var(--p-color-bg-fill-brand)]",
        "data-[state=checked]:hover:not-disabled:bg-[var(--p-color-bg-fill-brand-hover)]",
        "data-[state=checked]:hover:not-disabled:border-[var(--p-color-bg-fill-brand-hover)]",
        /* Focus */
        "outline-none",
        "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        /* Disabled */
        "disabled:cursor-not-allowed",
        "disabled:border-none",
        "disabled:bg-[var(--p-color-radio-button-bg-surface-disabled)]",
        "disabled:data-[state=checked]:bg-[var(--p-color-radio-button-bg-surface-disabled)]",
        /* Error */
        error && "border-[var(--p-color-border-critical-secondary)]",
        /* Cursor */
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center animate-in zoom-in-0 duration-150"
      >
        <div className="size-[0.5rem] rounded-full bg-white animate-in scale-in-0 duration-200" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

/**
 * Polaris RadioField — Radio with label and optional help text
 */
interface RadioFieldProps extends RadioGroupItemProps {
  label: React.ReactNode
  helpText?: React.ReactNode
  id?: string
}

function RadioField({
  label,
  helpText,
  id,
  ...radioProps
}: RadioFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId

  return (
    <div className="flex gap-[var(--p-space-200)]">
      <RadioGroupItem id={fieldId} {...radioProps} />
      <div className="flex flex-col gap-[var(--p-space-025)]">
        <label
          htmlFor={fieldId}
          className={cn(
            "text-[0.8125rem] leading-[1.25rem]",
            "font-[var(--p-font-weight-regular)]",
            "cursor-pointer select-none",
            radioProps.disabled
              ? "text-[var(--p-color-text-disabled)] cursor-default"
              : "text-[var(--p-color-text)]",
          )}
        >
          {label}
        </label>
        {helpText && (
          <span className={cn(
            "text-[0.6875rem] leading-[1rem]",
            radioProps.disabled
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

export { RadioGroup, RadioGroupItem, RadioField }
