"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Avatar
 *
 * - Sizes: xs (1.5rem), sm (2rem), md (2.5rem), lg (3.75rem), xl (6.5rem)
 * - Round: border-radius-full
 * - Fallback: initials on colored bg
 * - 7 color variants assigned by name hash (matches Polaris)
 * - Subtle border for definition
 * - Image: object-cover, fully rounded
 */

interface AvatarProps extends React.ComponentProps<"div"> {
  source?: string
  name?: string
  initials?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  xs: "size-[1.5rem] text-[0.625rem]",
  sm: "size-[2rem] text-[0.6875rem]",
  md: "size-[2.5rem] text-[0.75rem]",
  lg: "size-[3.75rem] text-[1rem]",
  xl: "size-[6.5rem] text-[1.75rem]",
}

/* Polaris 7 avatar color variants — bg + text class pairs */
const avatarColorClasses = [
  "bg-[rgba(197,48,197,1)] text-[rgba(253,239,253,1)]",      // one — purple
  "bg-[rgba(82,244,144,1)] text-[rgba(1,75,64,1)]",          // two — green
  "bg-[rgba(44,224,212,1)] text-[rgba(3,60,57,1)]",          // three — teal
  "bg-[rgba(81,192,255,1)] text-[rgba(0,33,51,1)]",          // four — blue
  "bg-[rgba(253,75,146,1)] text-[rgba(255,246,248,1)]",      // five — pink
  "bg-[rgba(37,232,43,1)] text-[rgba(3,61,5,1)]",            // six — bright green
  "bg-[rgba(148,116,255,1)] text-[rgba(248,247,255,1)]",     // seven — violet
]

const defaultColorClass = "bg-[rgba(181,181,181,1)] text-white"

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getInitials(name?: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase()
  if (!name) return ""
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || ""
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Avatar({
  source,
  name,
  initials,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const displayInitials = getInitials(name, initials)
  const colorClass = name
    ? avatarColorClasses[hashName(name) % avatarColorClasses.length]
    : defaultColorClass

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative inline-flex items-center justify-center shrink-0",
        "rounded-full overflow-hidden",
        "font-[var(--p-font-weight-medium)]",
        "select-none",
        /* Border for definition against backgrounds */
        "ring-1 ring-black/10",
        /* Shadow for depth */
        "shadow-[var(--p-shadow-100)]",
        sizeMap[size],
        source ? "bg-[var(--p-color-bg-surface-secondary)]" : colorClass,
        className
      )}
      {...props}
    >
      {source ? (
        <img
          src={source}
          alt={name || ""}
          className="size-full object-cover"
        />
      ) : (
        <span>{displayInitials}</span>
      )}
    </div>
  )
}

export { Avatar }
