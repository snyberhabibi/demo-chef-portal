"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "@shopify/polaris-icons"

/**
 * Polaris Breadcrumb
 * - Navigation trail
 * - Last item is current page (not clickable)
 * - Separator: chevron right
 */

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  items: BreadcrumbItem[]
}

function Breadcrumb({
  items,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      data-slot="breadcrumb"
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-[var(--p-space-100)]", className)}
      {...props}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <ChevronRightIcon className="size-4 fill-[var(--p-color-icon-secondary)] shrink-0" />
            )}
            {isLast ? (
              <span className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] truncate">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)] hover:underline underline-offset-2 cursor-pointer truncate outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)] focus-visible:rounded-[var(--p-border-radius-100)]"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbItem }
