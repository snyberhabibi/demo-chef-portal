"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Polaris Divider
 * - Horizontal or vertical line
 * - Uses border-secondary color
 */

interface DividerProps extends React.ComponentProps<"hr"> {
  orientation?: "horizontal" | "vertical"
}

function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      data-slot="divider"
      className={cn(
        "border-none",
        orientation === "horizontal"
          ? "h-px w-full bg-[var(--p-color-border-secondary)]"
          : "w-px h-full bg-[var(--p-color-border-secondary)]",
        className
      )}
      {...props}
    />
  )
}

export { Divider }
