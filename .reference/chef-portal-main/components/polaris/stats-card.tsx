"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Stats Card / Metric
 * - Dashboard KPI display
 * - Animated count-up from 0
 * - Value + label + optional trend
 * - Icon with colored circle bg
 */

interface StatsCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string | number
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  illustration?: React.ReactNode
  helpText?: string
  animate?: boolean
}

function parseNumericValue(value: string | number): { prefix: string; number: number; suffix: string; decimals: number } | null {
  const str = String(value)
  const match = str.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/)
  if (!match) return null
  const prefix = match[1]
  const numStr = match[2].replace(/,/g, "")
  const number = parseFloat(numStr)
  const suffix = match[3]
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
  if (isNaN(number)) return null
  return { prefix, number, suffix, decimals }
}

function formatWithCommas(num: number, decimals: number): string {
  const fixed = num.toFixed(decimals)
  const [intPart, decPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return decPart ? `${withCommas}.${decPart}` : withCommas
}

function useCountUp(target: number, duration: number = 1200, enabled: boolean = true) {
  const [current, setCurrent] = React.useState(enabled ? 0 : target)
  const frameRef = React.useRef<number>(null)
  const startTimeRef = React.useRef<number>(null)

  React.useEffect(() => {
    if (!enabled) {
      setCurrent(target)
      return
    }

    setCurrent(0)
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(eased * target)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, enabled])

  return current
}

function AnimatedValue({ value, animate = true }: { value: string | number; animate?: boolean }) {
  const parsed = parseNumericValue(value)
  const [hasAppeared, setHasAppeared] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  // Intersection observer — only animate when visible
  React.useEffect(() => {
    if (!animate || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasAppeared(true) },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate])

  const animatedNumber = useCountUp(
    parsed?.number ?? 0,
    1200,
    animate && hasAppeared
  )

  if (!parsed) {
    return <span ref={ref}>{value}</span>
  }

  return (
    <span ref={ref}>
      {parsed.prefix}
      {formatWithCommas(animate && hasAppeared ? animatedNumber : parsed.number, parsed.decimals)}
      {parsed.suffix}
    </span>
  )
}

const trendColors = {
  up: "text-[rgba(4,123,93,1)] bg-[rgba(205,254,212,1)]",
  down: "text-[rgba(199,10,36,1)] bg-[rgba(254,232,235,1)]",
  neutral: "text-[var(--p-color-text-secondary)] bg-[var(--p-color-bg-fill-secondary)]",
}

const trendArrows = {
  up: "↑",
  down: "↓",
  neutral: "→",
}

function StatsCard({
  label,
  value,
  trend,
  icon: Icon,
  illustration,
  helpText,
  animate = true,
  className,
  ...props
}: StatsCardProps) {
  return (
    <div
      data-slot="stats-card"
      className={cn(
        "relative overflow-hidden",
        "bg-[var(--p-color-bg-surface)]",
        "rounded-[var(--p-border-radius-300)]",
        "shadow-[var(--p-shadow-300)]",
        "p-[var(--p-space-400)] xs:p-[var(--p-space-500)]",
        "flex flex-col gap-[var(--p-space-300)]",
        className
      )}
      {...props}
    >
      {/* Header: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[0.875rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)]">
          {label}
        </span>
        {illustration ? (
          <div className="shrink-0">{illustration}</div>
        ) : Icon ? (
          <div className="size-[2.75rem] rounded-[var(--p-border-radius-300)] bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center shrink-0">
            <Icon className="size-[1.375rem] fill-white" />
          </div>
        ) : null}

      </div>

      {/* Value + trend */}
      <div className="flex items-end gap-[var(--p-space-200)]">
        <span className="text-[2.25rem] leading-[2.75rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-densest)] text-[var(--p-color-text)] tabular-nums">
          <AnimatedValue value={value} animate={animate} />
        </span>
        {trend && (
          <span className={cn(
            "text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-semibold)]",
            "px-[var(--p-space-150)] py-[var(--p-space-025)]",
            "rounded-[var(--p-border-radius-full)]",
            "mb-[var(--p-space-100)]",
            trendColors[trend.direction],
          )}>
            {trendArrows[trend.direction]} {trend.value}
          </span>
        )}
      </div>

      {/* Help text */}
      {helpText && (
        <span className="text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">
          {helpText}
        </span>
      )}
    </div>
  )
}

export { StatsCard }
