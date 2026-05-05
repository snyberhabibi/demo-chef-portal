"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Toggle / Switch
 *
 * - Track: 2.25rem x 1.25rem (36x20), border-radius-full
 * - Thumb: 0.875rem (14px) circle, white
 * - Off: bg-fill-secondary, On: bg-fill-brand
 * - Thumb translates on toggle
 */

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center",
        "h-[1.25rem] w-[2.25rem]",
        "rounded-full",
        "border-none",
        /* Transition */
        "transition-[background-color,box-shadow] duration-200 ease-out",
        /* Off state */
        "bg-[var(--p-color-bg-fill-tertiary)]",
        /* On state */
        "data-[state=checked]:bg-[var(--p-color-bg-fill-brand)]",
        /* Hover */
        "hover:not-disabled:bg-[var(--p-color-bg-fill-tertiary-hover)]",
        "data-[state=checked]:hover:not-disabled:bg-[var(--p-color-bg-fill-brand-hover)]",
        /* Focus */
        "outline-none",
        "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        /* Disabled */
        "disabled:cursor-not-allowed",
        "disabled:bg-[var(--p-color-bg-fill-disabled)]",
        "disabled:data-[state=checked]:bg-[var(--p-color-bg-fill-disabled)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-[var(--p-shadow-200)]",
          "size-[0.875rem]",
          "transition-transform duration-200 ease-out",
          "data-[state=unchecked]:translate-x-[0.1875rem]",
          "data-[state=checked]:translate-x-[1.1875rem]",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

interface SwitchFieldProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label: React.ReactNode
  helpText?: React.ReactNode
  id?: string
}

function SwitchField({
  label,
  helpText,
  id,
  ...switchProps
}: SwitchFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId

  return (
    <div className="flex items-start justify-between gap-[var(--p-space-400)]">
      <div className="flex flex-col gap-[var(--p-space-025)]">
        <label
          htmlFor={fieldId}
          className={cn(
            "text-[0.8125rem] leading-[1.25rem]",
            "font-[var(--p-font-weight-regular)]",
            "cursor-pointer select-none",
            switchProps.disabled
              ? "text-[var(--p-color-text-disabled)] cursor-default"
              : "text-[var(--p-color-text)]",
          )}
        >
          {label}
        </label>
        {helpText && (
          <span className={cn(
            "text-[0.6875rem] leading-[1rem]",
            switchProps.disabled
              ? "text-[var(--p-color-text-disabled)]"
              : "text-[var(--p-color-text-secondary)]",
          )}>
            {helpText}
          </span>
        )}
      </div>
      <Switch id={fieldId} {...switchProps} />
    </div>
  )
}

export { Switch, SwitchField }
