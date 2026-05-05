"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Toggle Group / Segmented Control
 * - Single or multi select
 * - Horizontal button group with shared background
 * - Active button pops out with surface + shadow
 */

interface ToggleOption {
  id: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  disabled?: boolean
}

interface ToggleGroupProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  options: ToggleOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  size?: "sm" | "default" | "lg"
  fullWidth?: boolean
}

const sizeClasses = {
  sm: "px-[var(--p-space-200)] py-[var(--p-space-050)] text-[0.6875rem]",
  default: "px-[var(--p-space-300)] py-[var(--p-space-100)] text-[0.75rem]",
  lg: "px-[var(--p-space-400)] py-[var(--p-space-150)] text-[0.8125rem]",
}

function ToggleGroup({
  options,
  value,
  onChange,
  multiple = false,
  size = "default",
  fullWidth = false,
  className,
  ...props
}: ToggleGroupProps) {
  const selectedSet = new Set(Array.isArray(value) ? value : [value])

  const handleClick = (id: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [value]
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id]
      onChange(next)
    } else {
      onChange(id)
    }
  }

  return (
    <div
      data-slot="toggle-group"
      className={cn(
        "inline-flex",
        "rounded-[var(--p-border-radius-200)]",
        "bg-[var(--p-color-bg-fill-secondary)]",
        "p-[var(--p-space-050)]",
        fullWidth && "flex w-full",
        className
      )}
      role="group"
      {...props}
    >
      {options.map((opt) => {
        const isActive = selectedSet.has(opt.id)
        const Icon = opt.icon
        return (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.id)}
            disabled={opt.disabled}
            className={cn(
              "inline-flex items-center justify-center gap-[var(--p-space-100)]",
              "rounded-[var(--p-border-radius-150)]",
              "font-[var(--p-font-weight-medium)]",
              "cursor-pointer select-none",
              "transition-all duration-200",
              "outline-none",
              "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              sizeClasses[size],
              fullWidth && "flex-1",
              isActive
                ? "bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-200)] text-[var(--p-color-text)]"
                : "bg-transparent text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)]",
              opt.disabled && "opacity-50 cursor-default",
            )}
          >
            {Icon && <Icon className="size-4 fill-current" />}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export { ToggleGroup }
export type { ToggleOption }
