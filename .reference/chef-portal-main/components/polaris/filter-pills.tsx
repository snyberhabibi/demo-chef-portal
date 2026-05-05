"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Filter Pills — toggleable pill buttons for filtering
 * Used for cuisine filters, weekday availability, status filters
 *
 * Supports single-select and multi-select modes
 */

interface FilterPill {
  id: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  count?: number
}

interface FilterPillsProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  pills: FilterPill[]
  selected: string | string[]
  onSelect: (id: string | string[]) => void
  multiple?: boolean
  label?: string
}

function FilterPills({
  pills,
  selected,
  onSelect,
  multiple = false,
  label,
  className,
  ...props
}: FilterPillsProps) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected])

  const handleClick = (id: string) => {
    if (multiple) {
      const current = Array.isArray(selected) ? selected : [selected]
      const next = current.includes(id)
        ? current.filter((s) => s !== id)
        : [...current, id]
      onSelect(next)
    } else {
      onSelect(id)
    }
  }

  return (
    <div data-slot="filter-pills" className={cn("space-y-[var(--p-space-200)]", className)} {...props}>
      {label && (
        <p className="text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)]">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-[var(--p-space-200)]">
        {pills.map((pill) => {
          const isSelected = selectedSet.has(pill.id)
          const Icon = pill.icon
          return (
            <button
              key={pill.id}
              onClick={() => handleClick(pill.id)}
              className={cn(
                "inline-flex items-center gap-[var(--p-space-150)]",
                "px-[var(--p-space-300)] py-[var(--p-space-100)]",
                "rounded-[var(--p-border-radius-full)]",
                "text-[0.75rem] leading-[1rem] font-[var(--p-font-weight-medium)]",
                "cursor-pointer select-none",
                "border",
                "transition-colors duration-150",
                "outline-none",
                "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
                isSelected
                  ? "bg-[var(--p-color-bg-fill-brand)] text-white border-transparent"
                  : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text)] border-[var(--p-color-border)] hover:bg-[var(--p-color-bg-surface-hover)]",
              )}
            >
              {Icon && <Icon className="size-3.5 fill-current" />}
              <span>{pill.label}</span>
              {pill.count !== undefined && (
                <span className={cn(
                  "text-[0.625rem] font-[var(--p-font-weight-semibold)]",
                  "min-w-[1rem] text-center",
                  "px-[var(--p-space-100)]",
                  "rounded-[var(--p-border-radius-full)]",
                  isSelected
                    ? "bg-white/20"
                    : "bg-[var(--p-color-bg-fill-secondary)]",
                )}>
                  {pill.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { FilterPills }
export type { FilterPill }
