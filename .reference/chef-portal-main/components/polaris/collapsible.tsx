"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "@shopify/polaris-icons"

/**
 * Polaris Collapsible / Accordion
 * - Single or multiple open sections
 * - Smooth height animation
 * - Chevron rotates on open
 */

interface CollapsibleProps extends React.ComponentProps<"div"> {
  open?: boolean
  onToggle?: () => void
  trigger: React.ReactNode
}

function Collapsible({
  open = false,
  onToggle,
  trigger,
  children,
  className,
  ...props
}: CollapsibleProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)
  const [animating, setAnimating] = React.useState(false)
  const [currentHeight, setCurrentHeight] = React.useState<string>(open ? "auto" : "0px")
  const prevOpen = React.useRef(open)

  React.useEffect(() => {
    if (prevOpen.current === open) return
    prevOpen.current = open

    const inner = innerRef.current
    if (!inner) return

    const fullHeight = inner.scrollHeight

    if (open) {
      // Expanding: 0 -> measured height -> auto
      setCurrentHeight("0px")
      setAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentHeight(`${fullHeight}px`)
        })
      })
      const timer = setTimeout(() => {
        setCurrentHeight("auto")
        setAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      // Collapsing: auto -> measured height -> 0
      setCurrentHeight(`${fullHeight}px`)
      setAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentHeight("0px")
        })
      })
      const timer = setTimeout(() => {
        setAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <div data-slot="collapsible" className={cn(className)} {...props}>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between w-full",
          "py-[var(--p-space-300)]",
          "text-start cursor-pointer select-none",
          "outline-none",
          "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
          "focus-visible:rounded-[var(--p-border-radius-100)]",
        )}
      >
        <span className="flex-1">{trigger}</span>
        <ChevronDownIcon
          className={cn(
            "size-5 fill-[var(--p-color-icon-secondary)] shrink-0",
            "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden",
          animating && "transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        )}
        style={{ height: currentHeight }}
      >
        <div ref={innerRef} className="pb-[var(--p-space-300)]">
          <div className={cn(
            "transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface AccordionItem {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
}

interface AccordionProps extends React.ComponentProps<"div"> {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
}

function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen)

  const toggle = (id: string) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setOpenItems((prev) => prev.includes(id) ? [] : [id])
    }
  }

  return (
    <div data-slot="accordion" className={cn("divide-y divide-[var(--p-color-border)]", className)} {...props}>
      {items.map((item) => (
        <Collapsible
          key={item.id}
          open={openItems.includes(item.id)}
          onToggle={() => toggle(item.id)}
          trigger={item.trigger}
        >
          {item.content}
        </Collapsible>
      ))}
    </div>
  )
}

export { Collapsible, Accordion }
export type { AccordionItem }
