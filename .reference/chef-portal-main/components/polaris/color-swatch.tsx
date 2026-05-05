"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckSmallIcon } from "@shopify/polaris-icons"

/**
 * Polaris Color Swatch
 * - Color selection circles
 * - Selected state with checkmark
 * - Optional custom colors or predefined palette
 */

interface ColorSwatchProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  colors: string[]
  value?: string
  onChange?: (color: string) => void
  size?: "sm" | "default" | "lg"
}

const swatchSizes = {
  sm: "size-[1.5rem]",
  default: "size-[2rem]",
  lg: "size-[2.5rem]",
}

const checkSizes = {
  sm: "size-3",
  default: "size-4",
  lg: "size-5",
}

function ColorSwatch({
  colors,
  value,
  onChange,
  size = "default",
  className,
  ...props
}: ColorSwatchProps) {
  return (
    <div
      data-slot="color-swatch"
      className={cn("flex flex-wrap gap-[var(--p-space-200)]", className)}
      role="radiogroup"
      {...props}
    >
      {colors.map((color) => {
        const isSelected = value === color
        const isLight = isLightColor(color)
        return (
          <button
            key={color}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange?.(color)}
            className={cn(
              "rounded-full cursor-pointer",
              "flex items-center justify-center",
              "transition-all duration-150",
              "outline-none",
              "ring-1 ring-black/10",
              "hover:scale-110",
              "focus-visible:ring-2 focus-visible:ring-[var(--p-color-border-focus)] focus-visible:ring-offset-2",
              isSelected && "ring-2 ring-offset-2 ring-[var(--p-color-bg-fill-brand)]",
              swatchSizes[size],
            )}
            style={{ backgroundColor: color }}
          >
            {isSelected && (
              <CheckSmallIcon className={cn(
                "fill-current",
                checkSizes[size],
                isLight ? "text-[var(--p-color-text)]" : "text-white",
              )} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "")
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}

export { ColorSwatch }
