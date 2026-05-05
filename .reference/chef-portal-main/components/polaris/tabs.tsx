"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Tabs with animated sliding underline
 */

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

  const updateIndicator = React.useCallback(() => {
    if (!listRef.current) return
    const activeTab = listRef.current.querySelector<HTMLElement>('[data-state="active"]')
    if (activeTab) {
      const listRect = listRef.current.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()
      setIndicator({
        left: tabRect.left - listRect.left,
        width: tabRect.width,
      })
    }
  }, [])

  React.useEffect(() => {
    updateIndicator()
    const observer = new MutationObserver(updateIndicator)
    if (listRef.current) {
      observer.observe(listRef.current, { attributes: true, subtree: true, attributeFilter: ["data-state"] })
    }
    window.addEventListener("resize", updateIndicator)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateIndicator)
    }
  }, [updateIndicator])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        "relative flex w-full",
        "border-b border-[var(--p-color-border)]",
        "gap-[var(--p-space-400)]",
        className
      )}
      {...props}
    >
      {children}
      {/* Sliding underline indicator */}
      <div
        className="absolute bottom-0 h-[0.125rem] bg-[var(--p-color-bg-fill-brand)] transition-all duration-250 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "pb-[var(--p-space-200)]",
        "text-[0.8125rem] leading-[1.25rem]",
        "font-[var(--p-font-weight-medium)]",
        "cursor-pointer select-none",
        /* Transition for text color */
        "transition-colors duration-150 ease-out",
        /* Inactive */
        "text-[var(--p-color-text-secondary)]",
        /* Hover */
        "hover:text-[var(--p-color-text)]",
        /* Active */
        "data-[state=active]:text-[var(--p-color-text)]",
        /* Focus */
        "outline-none",
        "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        "focus-visible:rounded-[var(--p-border-radius-100)]",
        /* Disabled */
        "disabled:pointer-events-none",
        "disabled:text-[var(--p-color-text-disabled)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "pt-[var(--p-space-400)]",
        "outline-none",
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
