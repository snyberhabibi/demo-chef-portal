"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Icon Tabs
 *
 * Two variants:
 * - "pill" (default): icon above label, filled bg on active
 * - "underline": icon inline with label, underline on active (like dish category tabs)
 */

interface IconTab {
  id: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  image?: string | null
  count?: number
}

interface IconTabsProps extends React.ComponentProps<"div"> {
  tabs: IconTab[]
  activeTab: string
  onTabChange: (id: string) => void
  variant?: "pill" | "underline" | "card" | "segmented"
}

function TabIcon({ tab, className }: { tab: IconTab; className?: string }) {
  const Icon = tab.icon
  if (tab.image) {
    return <img src={tab.image} alt={tab.label} className={cn("object-cover rounded-full", className)} />
  }
  if (Icon) {
    return <Icon className={cn("fill-current", className)} />
  }
  return null
}

function IconTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "pill",
  className,
  ...props
}: IconTabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

  // Sliding underline for underline variant
  const updateIndicator = React.useCallback(() => {
    if (variant !== "underline" || !listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>('[aria-selected="true"]')
    if (activeEl) {
      const listRect = listRef.current.getBoundingClientRect()
      const tabRect = activeEl.getBoundingClientRect()
      setIndicator({
        left: tabRect.left - listRect.left + listRef.current.scrollLeft,
        width: tabRect.width,
      })
    }
  }, [variant, activeTab])

  React.useEffect(() => {
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [updateIndicator])

  if (variant === "underline") {
    return (
      <div
        ref={listRef}
        data-slot="icon-tabs"
        className={cn(
          "relative flex overflow-x-auto scrollbar-hide",
          "border-b border-[var(--p-color-border)]",
          "gap-0",
          className
        )}
        role="tablist"
        {...props}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-[var(--p-space-200)]",
                "px-[var(--p-space-400)] py-[var(--p-space-300)]",
                "cursor-pointer select-none shrink-0",
                "transition-colors duration-150",
                "outline-none",
                "text-[0.8125rem] leading-[1.25rem]",
                "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
                "focus-visible:rounded-[var(--p-border-radius-100)]",
                isActive
                  ? "text-[var(--p-color-text)] font-[var(--p-font-weight-semibold)]"
                  : "text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-regular)] hover:text-[var(--p-color-text)]",
              )}
            >
              <TabIcon tab={tab} className="size-5" />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  "text-[0.6875rem] font-[var(--p-font-weight-semibold)]",
                  "min-w-[1.25rem] text-center",
                  "px-[var(--p-space-100)] py-[var(--p-space-025)]",
                  "rounded-[var(--p-border-radius-full)]",
                  isActive
                    ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                    : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]",
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
        {/* Sliding underline */}
        <div
          className="absolute bottom-0 h-[0.125rem] bg-[var(--p-color-bg-fill-brand)] transition-all duration-250 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
    )
  }

  // ===== CARD VARIANT =====
  if (variant === "card") {
    return (
      <div
        data-slot="icon-tabs"
        className={cn(
          "flex gap-[var(--p-space-300)] overflow-x-auto scrollbar-hide",
          className
        )}
        role="tablist"
        {...props}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-[var(--p-space-150)]",
                "px-[var(--p-space-400)] py-[var(--p-space-300)]",
                "rounded-[var(--p-border-radius-300)]",
                "cursor-pointer select-none shrink-0",
                "transition-all duration-200",
                "outline-none",
                "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
                "min-w-[5.5rem]",
                isActive
                  ? "bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-300)] scale-[1.02]"
                  : "bg-[var(--p-color-bg-surface-secondary)] hover:bg-[var(--p-color-bg-surface)] hover:shadow-[var(--p-shadow-200)]",
              )}
            >
              {/* Icon with colored circle bg */}
              <div className={cn(
                "size-[2.25rem] rounded-full flex items-center justify-center",
                "transition-colors duration-200",
                isActive
                  ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                  : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-icon-secondary)]",
              )}>
                <TabIcon tab={tab} className="size-[1.125rem]" />
              </div>
              <span className={cn(
                "text-[0.6875rem] leading-[1rem] whitespace-nowrap",
                isActive
                  ? "font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
                  : "font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)]",
              )}>
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span className={cn(
                  "text-[0.625rem] leading-[0.75rem] font-[var(--p-font-weight-semibold)]",
                  "px-[var(--p-space-100)] py-[var(--p-space-025)]",
                  "rounded-[var(--p-border-radius-full)]",
                  isActive
                    ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                    : "bg-[var(--p-color-bg-fill-tertiary)] text-[var(--p-color-text-secondary)]",
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // ===== SEGMENTED VARIANT =====
  if (variant === "segmented") {
    return (
      <div
        data-slot="icon-tabs"
        className={cn(
          "inline-flex overflow-x-auto scrollbar-hide",
          "rounded-[var(--p-border-radius-200)]",
          "bg-[var(--p-color-bg-fill-secondary)]",
          "p-[var(--p-space-050)]",
          className
        )}
        role="tablist"
        {...props}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-[var(--p-space-150)]",
                "px-[var(--p-space-300)] py-[var(--p-space-150)]",
                "rounded-[var(--p-border-radius-150)]",
                "cursor-pointer select-none shrink-0",
                "transition-all duration-200",
                "outline-none",
                "text-[0.75rem] leading-[1rem]",
                "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
                isActive
                  ? "bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-200)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
                  : "bg-transparent font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)]",
              )}
            >
              <TabIcon tab={tab} className={cn(
                "size-4",
                isActive ? "text-[var(--p-color-text)]" : "text-[var(--p-color-icon-secondary)]"
              )} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  "text-[0.625rem] font-[var(--p-font-weight-semibold)]",
                  "min-w-[1rem] text-center",
                  "px-[var(--p-space-050)]",
                  "rounded-[var(--p-border-radius-full)]",
                  isActive
                    ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                    : "bg-[var(--p-color-bg-fill-tertiary)] text-[var(--p-color-text-secondary)]",
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // ===== PILL VARIANT (default) =====
  return (
    <div
      data-slot="icon-tabs"
      className={cn(
        "flex gap-[var(--p-space-200)] overflow-x-auto scrollbar-hide",
        className
      )}
      role="tablist"
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-[var(--p-space-100)]",
              "px-[var(--p-space-300)] py-[var(--p-space-200)]",
              "rounded-[var(--p-border-radius-200)]",
              "cursor-pointer select-none shrink-0",
              "transition-colors duration-150",
              "outline-none",
              "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              "min-w-[4.5rem]",
              isActive
                ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-bg-surface-hover)] shadow-[var(--p-shadow-100)]",
            )}
          >
            <TabIcon tab={tab} className="size-5" />
            <span className="text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-medium)] whitespace-nowrap">
              {tab.label}
            </span>
            {tab.count !== undefined && (
              <span className={cn(
                "text-[0.625rem] leading-[0.75rem] font-[var(--p-font-weight-semibold)]",
                "px-[var(--p-space-100)] py-[var(--p-space-025)]",
                "rounded-[var(--p-border-radius-full)]",
                isActive
                  ? "bg-white/20"
                  : "bg-[var(--p-color-bg-fill-secondary)]",
              )}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { IconTabs }
export type { IconTab }
