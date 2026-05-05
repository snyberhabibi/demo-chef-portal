"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SearchIcon, XSmallIcon } from "@shopify/polaris-icons"

/**
 * Polaris Search Bar
 * - Search icon on left
 * - Clear button on right when has value
 * - Optional keyboard shortcut hint
 * - Matches Polaris input styling
 */

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  shortcutHint?: string
}

function SearchBar({
  value = "",
  onChange,
  onClear,
  shortcutHint,
  placeholder = "Search...",
  className,
  ...props
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange?.("")
    onClear?.()
    inputRef.current?.focus()
  }

  // Keyboard shortcut
  React.useEffect(() => {
    if (!shortcutHint) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [shortcutHint])

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-[var(--p-space-300)] top-1/2 -translate-y-1/2 size-[1.125rem] fill-[var(--p-color-icon-secondary)] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full",
          "min-h-[2.25rem]",
          "pl-[2.25rem] pr-[var(--p-space-300)] py-[var(--p-space-150)]",
          value && "pr-[2.25rem]",
          shortcutHint && !value && "pr-[4rem]",
          "text-[0.8125rem] leading-[1.25rem]",
          "font-[var(--p-font-weight-regular)]",
          "text-[var(--p-color-text)]",
          "bg-[var(--p-color-input-bg-surface)]",
          "border-[length:var(--p-border-width-0165)]",
          "border-solid",
          "border-[var(--p-color-control-border)]",
          "rounded-[var(--p-border-radius-200)]",
          "placeholder:text-[var(--p-color-text-secondary)]",
          "outline-none",
          "focus-visible:border-[var(--p-color-control-border-focus)]",
          "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
          "hover:not-focus-visible:not-disabled:border-[var(--p-color-input-border-hover)]",
          "hover:not-focus-visible:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
          "disabled:pointer-events-none disabled:border-none disabled:bg-[var(--p-color-bg-surface-disabled)]",
        )}
        {...props}
      />
      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-[var(--p-space-200)] top-1/2 -translate-y-1/2 size-[1.25rem] rounded-[var(--p-border-radius-100)] flex items-center justify-center text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] cursor-pointer"
        >
          <XSmallIcon className="size-3.5 fill-current" />
        </button>
      )}
      {/* Keyboard shortcut hint */}
      {shortcutHint && !value && (
        <span className="absolute right-[var(--p-space-300)] top-1/2 -translate-y-1/2 text-[0.6875rem] text-[var(--p-color-text-disabled)] font-[var(--p-font-weight-medium)] pointer-events-none border border-[var(--p-color-border)] rounded-[var(--p-border-radius-100)] px-[var(--p-space-100)] py-[var(--p-space-025)]">
          {shortcutHint}
        </span>
      )}
    </div>
  )
}

export { SearchBar }
