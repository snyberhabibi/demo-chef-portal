"use client"

import * as React from "react"
import { CheckSmallIcon, ChevronDownIcon, SearchIcon } from "@shopify/polaris-icons"
import { Command as CommandPrimitive } from "cmdk"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

/**
 * Pixel-perfect Polaris Searchable Select (Combobox)
 * Built on cmdk + Radix Popover with Polaris styling.
 *
 * - Trigger matches Polaris input styling
 * - Dropdown uses Polaris surface, shadow, radius
 * - Search input inside dropdown
 * - Items with check indicator
 */

interface SearchableSelectOption {
  value: string
  label: string
  [key: string]: unknown
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  error?: boolean
  renderOption?: (option: SearchableSelectOption) => React.ReactNode
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  disabled,
  error,
  renderOption,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOption = options.find((o) => o.value === value)

  React.useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          /* Layout */
          "flex w-full items-center justify-between gap-[var(--p-space-200)]",
          "min-h-[32px]",
          "px-[var(--p-space-300)] py-[var(--p-space-150)]",
          /* Typography */
          "text-[0.8125rem] leading-[1.25rem]",
          "font-[var(--p-font-weight-regular)]",
          /* Background & border */
          "bg-[var(--p-color-input-bg-surface)]",
          "border-[length:var(--p-border-width-0165)]",
          "border-solid",
          "border-[var(--p-color-control-border)]",
          "rounded-[var(--p-border-radius-200)]",
          /* Text color */
          selectedOption
            ? "text-[var(--p-color-text)]"
            : "text-[var(--p-color-text-secondary)]",
          /* Hover */
          "hover:not-disabled:border-[var(--p-color-input-border-hover)]",
          "hover:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
          /* Focus / Open */
          "outline-none",
          "data-[state=open]:border-[var(--p-color-control-border-focus)]",
          "data-[state=open]:bg-[var(--p-color-input-bg-surface-active)]",
          "data-[state=open]:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
          "focus-visible:border-[var(--p-color-control-border-focus)]",
          "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
          /* Disabled */
          "disabled:pointer-events-none",
          "disabled:border-none",
          "disabled:bg-[var(--p-color-bg-surface-disabled)]",
          "disabled:text-[var(--p-color-text-disabled)]",
          "disabled:cursor-default",
          /* Error */
          error && "border-[var(--p-color-border-critical-secondary)] bg-[var(--p-color-bg-surface-critical)]",
          "cursor-pointer",
          className
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 fill-[var(--p-color-icon)]" />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50",
            "w-[var(--radix-popover-trigger-width)]",
            "bg-[var(--p-color-bg-surface)]",
            "border border-[var(--p-color-border)]",
            "rounded-[var(--p-border-radius-300)]",
            "shadow-[var(--p-shadow-300)]",
            "overflow-hidden",
            /* Animation */
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          <CommandPrimitive shouldFilter={true}>
            {/* Search input */}
            <div className="flex items-center gap-[var(--p-space-200)] border-b border-[var(--p-color-border)] px-[var(--p-space-300)]">
              <SearchIcon className="size-4 shrink-0 fill-[var(--p-color-icon-secondary)]" />
              <CommandPrimitive.Input
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className={cn(
                  "flex h-[36px] w-full bg-transparent",
                  "text-[13px] leading-[20px] font-[var(--p-font-weight-regular)]",
                  "text-[var(--p-color-text)]",
                  "placeholder:text-[var(--p-color-text-secondary)]",
                  "outline-none border-none"
                )}
              />
            </div>

            {/* Options list */}
            <CommandPrimitive.List className="max-h-[240px] overflow-y-auto scroll-py-1 p-[var(--p-space-100)]">
              <CommandPrimitive.Empty className="py-[var(--p-space-600)] text-center text-[13px] text-[var(--p-color-text-secondary)]">
                {emptyMessage}
              </CommandPrimitive.Empty>

              <CommandPrimitive.Group>
                {options.map((option) => (
                  <CommandPrimitive.Item
                    key={option.value}
                    value={`${option.value} ${option.label}`}
                    onSelect={() => {
                      onValueChange?.(option.value === value ? "" : option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "relative flex w-full items-center gap-[var(--p-space-200)]",
                      "rounded-[var(--p-border-radius-150)]",
                      "py-[var(--p-space-150)] pr-[var(--p-space-800)] pl-[var(--p-space-200)]",
                      "text-[13px] leading-[20px] font-[var(--p-font-weight-regular)]",
                      "text-[var(--p-color-text)]",
                      "cursor-pointer select-none outline-hidden",
                      "data-[selected=true]:bg-[var(--p-color-bg-surface-hover)]",
                      value === option.value && "font-[var(--p-font-weight-medium)] bg-[var(--p-color-bg-surface-selected)]",
                      "data-[disabled=true]:pointer-events-none data-[disabled=true]:text-[var(--p-color-text-disabled)]",
                    )}
                  >
                    <span className="absolute right-[var(--p-space-200)] flex size-4 items-center justify-center">
                      {value === option.value && (
                        <CheckSmallIcon className="size-4 fill-[var(--p-color-icon)]" />
                      )}
                    </span>
                    {renderOption ? renderOption(option) : option.label}
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { SearchableSelect }
export type { SearchableSelectOption, SearchableSelectProps }
