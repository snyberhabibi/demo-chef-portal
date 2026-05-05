"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris ActionList — dropdown menu of actions
 *
 * - Used inside Popover for context menus
 * - Items with icon + label + optional description
 * - Destructive variant
 * - Section dividers
 */

interface ActionListItem {
  id: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
  destructive?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface ActionListSection {
  title?: string
  items: ActionListItem[]
}

interface ActionListProps extends React.ComponentProps<"div"> {
  sections?: ActionListSection[]
  items?: ActionListItem[]
  onAction?: (id: string) => void
}

function ActionList({
  sections,
  items,
  onAction,
  className,
  ...props
}: ActionListProps) {
  const resolvedSections = sections || (items ? [{ items }] : [])

  return (
    <div
      data-slot="action-list"
      className={cn("py-[var(--p-space-100)]", className)}
      {...props}
    >
      {resolvedSections.map((section, sIdx) => (
        <div key={sIdx}>
          {section.title && (
            <p className="px-[var(--p-space-300)] py-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider">
              {section.title}
            </p>
          )}
          <ul>
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      item.onClick?.()
                      onAction?.(item.id)
                    }}
                    disabled={item.disabled}
                    className={cn(
                      "flex items-start gap-[var(--p-space-200)] w-full",
                      "px-[var(--p-space-300)] py-[var(--p-space-200)]",
                      "text-start",
                      "cursor-pointer select-none",
                      "transition-colors duration-100",
                      "outline-none",
                      "focus-visible:bg-[var(--p-color-bg-surface-hover)]",
                      item.destructive
                        ? "text-[var(--p-color-text-critical)] hover:bg-[var(--p-color-bg-surface-critical)]"
                        : "text-[var(--p-color-text)] hover:bg-[var(--p-color-bg-surface-hover)]",
                      item.disabled && "opacity-50 cursor-default",
                    )}
                  >
                    {Icon && (
                      <Icon className={cn(
                        "size-5 shrink-0 mt-px",
                        item.destructive ? "fill-[var(--p-color-icon-critical)]" : "fill-[var(--p-color-icon)]",
                      )} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-regular)]">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
          {sIdx < resolvedSections.length - 1 && (
            <div className="my-[var(--p-space-100)] h-px bg-[var(--p-color-border-secondary)]" />
          )}
        </div>
      ))}
    </div>
  )
}

export { ActionList }
export type { ActionListItem, ActionListSection }
