"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, MenuHorizontalIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"
import { Button } from "./button"

/**
 * Polaris Pagination with numbered pages
 *
 * Shows: < 1 2 3 ... 8 9 10 >
 * Collapses middle pages with ellipsis when there are many
 */

interface PaginationProps extends React.ComponentProps<"nav"> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function getPageNumbers(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalSlots = siblings * 2 + 5 // siblings on each side + first + last + current + 2 ellipsis slots

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblings
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...leftRange, "ellipsis", total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblings
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1)
    return [1, "ellipsis", ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  )
  return [1, "ellipsis", ...middleRange, "ellipsis", total]
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  return (
    <nav
      data-slot="pagination"
      aria-label="Pagination"
      className={cn(
        "flex items-center gap-[var(--p-space-100)]",
        className
      )}
      {...props}
    >
      {/* Previous */}
      <Button
        variant="tertiary"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-4 fill-current" />
      </Button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center size-[2rem] text-[var(--p-color-text-secondary)]"
          >
            <MenuHorizontalIcon className="size-4 fill-current" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className={cn(
              "flex items-center justify-center",
              "size-[2rem] rounded-[var(--p-border-radius-200)]",
              "text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-medium)]",
              "cursor-pointer select-none",
              "transition-colors duration-100",
              "outline-none",
              "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              page === currentPage
                ? "bg-[var(--p-color-bg-fill-brand)] text-white cursor-default"
                : "bg-transparent text-[var(--p-color-text)] hover:bg-[var(--p-color-bg-fill-transparent-hover)]",
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <Button
        variant="tertiary"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon className="size-4 fill-current" />
      </Button>
    </nav>
  )
}

export { Pagination }
