"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Expandable Text
 * Truncates long text with "Show more" / "Show less" toggle
 */

interface ExpandableTextProps extends React.ComponentProps<"div"> {
  text: string
  lines?: number
  expandLabel?: string
  collapseLabel?: string
  /** CSS color for the fade gradient, should match the parent background */
  fadeColor?: string
}

function ExpandableText({
  text,
  lines = 3,
  expandLabel = "Show more",
  collapseLabel = "Show less",
  fadeColor,
  className,
  ...props
}: ExpandableTextProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [needsTruncation, setNeedsTruncation] = React.useState(false)
  const [height, setHeight] = React.useState<string>("auto")
  const [animating, setAnimating] = React.useState(false)
  const textRef = React.useRef<HTMLParagraphElement>(null)
  const innerRef = React.useRef<HTMLSpanElement>(null)
  const collapsedHeight = React.useRef(0)
  const prevExpanded = React.useRef(expanded)

  // Measure collapsed height and check if truncation is needed
  React.useEffect(() => {
    const el = textRef.current
    if (!el) return
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    collapsedHeight.current = lineHeight * lines
    setNeedsTruncation(el.scrollHeight > collapsedHeight.current + 2)
    if (!expanded) {
      setHeight(`${collapsedHeight.current}px`)
    }
  }, [text, lines])

  // Animate expand/collapse
  React.useEffect(() => {
    if (prevExpanded.current === expanded) return
    prevExpanded.current = expanded

    const el = textRef.current
    if (!el) return
    const fullHeight = el.scrollHeight

    if (expanded) {
      setHeight(`${collapsedHeight.current}px`)
      setAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(`${fullHeight}px`)
        })
      })
      const timer = setTimeout(() => {
        setHeight("auto")
        setAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setHeight(`${fullHeight}px`)
      setAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(`${collapsedHeight.current}px`)
        })
      })
      const timer = setTimeout(() => {
        setAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [expanded])

  return (
    <div data-slot="expandable-text" className={cn(className)} {...props}>
      <div className="relative">
        <div
          ref={textRef}
          className={cn(
            "overflow-hidden",
            animating && "transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          )}
          style={{ height }}
        >
          <span
            ref={innerRef}
            className="text-[0.8125rem] leading-[1.25rem] text-[var(--p-color-text)] block"
          >
            {text}
          </span>
        </div>
        {/* Fade out gradient overlay when collapsed */}
        {needsTruncation && !expanded && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[2.5rem]",
              !fadeColor && "bg-gradient-to-t from-[var(--p-color-bg-surface)] to-transparent",
              "pointer-events-none",
              "transition-opacity duration-300",
              animating ? "opacity-0" : "opacity-100",
            )}
            style={fadeColor ? { background: `linear-gradient(to top, ${fadeColor}, transparent)` } : undefined}
          />
        )}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-[var(--p-space-100)] text-[0.75rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-emphasis)] hover:underline underline-offset-2 cursor-pointer"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  )
}

export { ExpandableText }
