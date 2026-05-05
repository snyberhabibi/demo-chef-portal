"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb"

/**
 * Polaris Page Header
 * - Page title + optional breadcrumb + actions
 * - Matches Polaris Page component header pattern
 */

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  badge?: React.ReactNode
}

function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  badge,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("space-y-[var(--p-space-200)]", className)}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      <div className="flex items-start justify-between gap-[var(--p-space-400)]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[var(--p-space-200)]">
            <h1 className="text-[1.25rem] leading-[1.5rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-dense)] text-[var(--p-color-text)] truncate">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[0.8125rem] leading-[1.25rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">
              {subtitle}
            </p>
          )}
        </div>
        {(primaryAction || secondaryActions) && (
          <div className="flex items-center gap-[var(--p-space-200)] shrink-0">
            {secondaryActions}
            {primaryAction}
          </div>
        )}
      </div>
    </div>
  )
}

export { PageHeader }
