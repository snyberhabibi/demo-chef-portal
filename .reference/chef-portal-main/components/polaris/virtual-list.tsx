"use client"

import * as React from "react"
import { Virtuoso, VirtuosoGrid, GridComponents } from "react-virtuoso"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

/**
 * Polaris Virtual List & Grid
 *
 * - VirtualList: vertical scrolling list, renders only visible items
 * - VirtualGrid: responsive grid with virtualization
 * - Supports loading more (infinite scroll)
 * - Empty state
 * - Header/footer slots
 */

// ===== VIRTUAL LIST =====

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  height?: number | string
  estimatedItemHeight?: number
  onEndReached?: () => void
  endReachedThreshold?: number
  loading?: boolean
  emptyMessage?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

function VirtualList<T>({
  items,
  renderItem,
  height = 600,
  estimatedItemHeight = 64,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  emptyMessage = "No items",
  header,
  footer,
  className,
}: VirtualListProps<T>) {
  if (items.length === 0 && !loading) {
    return (
      <div className={cn("flex items-center justify-center py-[var(--p-space-1200)] text-[0.8125rem] text-[var(--p-color-text-secondary)]", className)}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <Virtuoso
      style={{ height }}
      data={items}
      defaultItemHeight={estimatedItemHeight}
      endReached={onEndReached}
      overscan={endReachedThreshold}
      className={className}
      components={{
        Header: header ? () => <>{header}</> : undefined,
        Footer: () => (
          <>
            {loading && (
              <div className="flex justify-center py-[var(--p-space-400)]">
                <Spinner size="small" />
              </div>
            )}
            {footer}
          </>
        ),
      }}
      itemContent={(index, item) => renderItem(item, index)}
    />
  )
}

// ===== VIRTUAL GRID =====

interface VirtualGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  columns?: {
    default: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  height?: number | string
  gap?: number
  onEndReached?: () => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

const GridContainer: GridComponents["List"] = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(var(--vg-columns), 1fr)",
      gap: "var(--vg-gap)",
      ...style,
    }}
  >
    {children}
  </div>
))
GridContainer.displayName = "GridContainer"

const GridItem: GridComponents["Item"] = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>{children}</div>
))
GridItem.displayName = "GridItem"

function VirtualGrid<T>({
  items,
  renderItem,
  columns = { default: 2, sm: 3, md: 4, lg: 5 },
  height = 800,
  gap = 16,
  onEndReached,
  loading = false,
  emptyMessage = "No items",
  className,
}: VirtualGridProps<T>) {
  const [columnCount, setColumnCount] = React.useState(columns.default)

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1280 && columns.xl) setColumnCount(columns.xl)
      else if (w >= 1024 && columns.lg) setColumnCount(columns.lg)
      else if (w >= 768 && columns.md) setColumnCount(columns.md)
      else if (w >= 640 && columns.sm) setColumnCount(columns.sm)
      else if (w >= 480 && columns.xs) setColumnCount(columns.xs)
      else setColumnCount(columns.default)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [columns])

  if (items.length === 0 && !loading) {
    return (
      <div className={cn("flex items-center justify-center py-[var(--p-space-1200)] text-[0.8125rem] text-[var(--p-color-text-secondary)]", className)}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className={cn("w-full", className)}
      style={{ "--vg-columns": columnCount, "--vg-gap": `${gap}px` } as React.CSSProperties}
    >
      <VirtuosoGrid
        totalCount={items.length}
        style={{ height }}
        components={{
          List: GridContainer,
          Item: GridItem,
        }}
        endReached={onEndReached}
        itemContent={(index) => renderItem(items[index], index)}
      />
      {loading && (
        <div className="flex justify-center py-[var(--p-space-400)]">
          <Spinner size="small" />
        </div>
      )}
    </div>
  )
}

export { VirtualList, VirtualGrid }
