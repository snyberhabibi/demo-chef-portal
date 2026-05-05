"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronUpIcon, ChevronDownIcon } from "@shopify/polaris-icons"
import { Checkbox } from "./checkbox"
import { Spinner } from "./spinner"

/**
 * Polaris Data Table / Index Table
 *
 * - Desktop: standard table with sortable columns, selectable rows
 * - Mobile: card view — each row becomes a stacked card
 * - Loading and empty states
 */

type SortDirection = "asc" | "desc" | null

interface Column<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: "start" | "center" | "end"
  /** If true, this column is used as the card title on mobile */
  primary?: boolean
  /** Hide this column in card view (still visible in table) */
  hideOnMobile?: boolean
}

interface DataTableProps<T> extends React.ComponentProps<"div"> {
  columns: Column<T>[]
  data: T[]
  getRowId: (row: T) => string
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (ids: string[]) => void
  sortColumn?: string
  sortDirection?: SortDirection
  onSort?: (columnId: string, direction: SortDirection) => void
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  /** Breakpoint below which card view is shown. Default: 768px (tablet) */
  mobileBreakpoint?: number
}

function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = "No data",
  onRowClick,
  className,
  ...props
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0 && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(data.map(getRowId))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectionChange?.(selectedRows.filter((r) => r !== id))
    } else {
      onSelectionChange?.([...selectedRows, id])
    }
  }

  const handleSort = (columnId: string) => {
    if (!onSort) return
    if (sortColumn === columnId) {
      if (sortDirection === "asc") onSort(columnId, "desc")
      else if (sortDirection === "desc") onSort(columnId, null)
      else onSort(columnId, "asc")
    } else {
      onSort(columnId, "asc")
    }
  }

  const alignClass = (align?: string) => {
    if (align === "center") return "text-center"
    if (align === "end") return "text-end"
    return "text-start"
  }

  const primaryColumn = columns.find((c) => c.primary) || columns[0]
  const secondaryColumns = columns.filter((c) => c.id !== primaryColumn?.id && !c.hideOnMobile)

  if (loading) {
    return (
      <div className={cn("rounded-[var(--p-border-radius-300)] bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-300)] py-[var(--p-space-1200)] flex justify-center", className)}>
        <Spinner size="small" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-[var(--p-border-radius-300)] bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-300)] py-[var(--p-space-1200)] text-center text-[0.8125rem] text-[var(--p-color-text-secondary)]", className)}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      data-slot="data-table"
      className={cn(
        "rounded-[var(--p-border-radius-300)]",
        "bg-[var(--p-color-bg-surface)]",
        "shadow-[var(--p-shadow-300)]",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {/* ===== DESKTOP TABLE VIEW ===== */}
      <div className="hidden tablet:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--p-color-bg-surface-secondary)]">
              {selectable && (
                <th className="w-[3rem] px-[var(--p-space-300)] py-[var(--p-space-200)]">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-[var(--p-space-300)] py-[var(--p-space-200)]",
                    "text-[0.75rem] leading-[1rem] font-[var(--p-font-weight-semibold)]",
                    "text-[var(--p-color-text-secondary)]",
                    "border-b border-[var(--p-color-border)]",
                    alignClass(col.align),
                    col.sortable && "cursor-pointer select-none hover:text-[var(--p-color-text)]",
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <span className="inline-flex items-center gap-[var(--p-space-100)]">
                    {col.header}
                    {col.sortable && sortColumn === col.id && sortDirection && (
                      sortDirection === "asc"
                        ? <ChevronUpIcon className="size-3 fill-current" />
                        : <ChevronDownIcon className="size-3 fill-current" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const id = getRowId(row)
              const isSelected = selectedRows.includes(id)
              return (
                <tr
                  key={id}
                  className={cn(
                    "border-b border-[var(--p-color-border-secondary)]",
                    "transition-colors duration-100",
                    isSelected
                      ? "bg-[var(--p-color-bg-surface-selected)]"
                      : "hover:bg-[var(--p-color-bg-surface-hover)]",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="w-[3rem] px-[var(--p-space-300)] py-[var(--p-space-200)]">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={cn(
                        "px-[var(--p-space-300)] py-[var(--p-space-200)]",
                        "text-[0.8125rem] leading-[1.25rem]",
                        "text-[var(--p-color-text)]",
                        alignClass(col.align),
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARD VIEW ===== */}
      <div className="tablet:hidden">
        {/* Select all bar */}
        {selectable && (
          <div className="flex items-center gap-[var(--p-space-200)] px-[var(--p-space-300)] py-[var(--p-space-200)] bg-[var(--p-color-bg-surface-secondary)] border-b border-[var(--p-color-border)]">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-[0.75rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)]">
              {selectedRows.length > 0 ? `${selectedRows.length} selected` : "Select all"}
            </span>
          </div>
        )}

        {/* Cards */}
        <div className="divide-y divide-[var(--p-color-border-secondary)]">
          {data.map((row) => {
            const id = getRowId(row)
            const isSelected = selectedRows.includes(id)
            return (
              <div
                key={id}
                className={cn(
                  "flex gap-[var(--p-space-200)]",
                  "px-[var(--p-space-300)] py-[var(--p-space-300)]",
                  "transition-colors duration-100",
                  isSelected
                    ? "bg-[var(--p-color-bg-surface-selected)]"
                    : "active:bg-[var(--p-color-bg-surface-hover)]",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <div className="pt-[var(--p-space-025)]">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectRow(id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-[var(--p-space-150)]">
                  {/* Primary column — acts as card title */}
                  {primaryColumn && (
                    <div className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                      {primaryColumn.cell(row)}
                    </div>
                  )}
                  {/* Secondary columns — label: value pairs */}
                  <div className="flex flex-wrap gap-x-[var(--p-space-400)] gap-y-[var(--p-space-100)]">
                    {secondaryColumns.map((col) => (
                      <div key={col.id} className="flex items-center gap-[var(--p-space-100)]">
                        <span className="text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">
                          {col.header}:
                        </span>
                        <span className="text-[0.75rem] leading-[1rem] text-[var(--p-color-text)]">
                          {col.cell(row)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { DataTable }
export type { Column, DataTableProps, SortDirection }
