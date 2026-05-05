"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MinusIcon, PlusIcon } from "@shopify/polaris-icons"
import { Label } from "./input"

/**
 * Polaris Number Input / Stepper
 * - Increment/decrement buttons
 * - Editable input field
 * - Min/max/step support
 */

interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  helpText?: string
  disabled?: boolean
  error?: boolean
  suffix?: string
  prefix?: string
  className?: string
}

function NumberInput({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  label: labelText,
  helpText,
  disabled,
  error,
  suffix,
  prefix,
  className,
}: NumberInputProps) {
  const [localValue, setLocalValue] = React.useState<string>(String(value))

  React.useEffect(() => {
    setLocalValue(String(value))
  }, [value])

  const clamp = (n: number) => {
    let clamped = n
    if (min !== undefined) clamped = Math.max(clamped, min)
    if (max !== undefined) clamped = Math.min(clamped, max)
    return clamped
  }

  const commit = (raw: string) => {
    const num = parseFloat(raw)
    if (isNaN(num)) {
      setLocalValue(String(value))
      return
    }
    const clamped = clamp(num)
    onChange?.(clamped)
    setLocalValue(String(clamped))
  }

  const increment = () => {
    const next = clamp(value + step)
    onChange?.(next)
  }

  const decrement = () => {
    const next = clamp(value - step)
    onChange?.(next)
  }

  const canDecrement = min === undefined || value > min
  const canIncrement = max === undefined || value < max

  const btnClass = cn(
    "size-[2rem] flex items-center justify-center shrink-0",
    "rounded-[var(--p-border-radius-200)]",
    "cursor-pointer select-none touch-manipulation",
    "transition-colors duration-100",
    "text-[var(--p-color-icon)]",
    "hover:bg-[var(--p-color-bg-fill-transparent-hover)]",
    "active:bg-[var(--p-color-bg-fill-transparent-active)]",
    "disabled:text-[var(--p-color-icon-disabled)] disabled:cursor-default disabled:hover:bg-transparent",
  )

  return (
    <div className={className}>
      {labelText && <Label>{labelText}</Label>}
      <div className={cn(
        "flex items-center",
        "bg-[var(--p-color-input-bg-surface)]",
        "border-[length:var(--p-border-width-0165)]",
        "border-solid",
        "border-[var(--p-color-control-border)]",
        "rounded-[var(--p-border-radius-200)]",
        "min-h-[2rem]",
        "outline-none",
        "focus-within:border-[var(--p-color-control-border-focus)]",
        "focus-within:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        "hover:not-focus-within:border-[var(--p-color-input-border-hover)]",
        disabled && "!border-none !bg-[var(--p-color-bg-surface-disabled)] opacity-50",
        error && "!border-[var(--p-color-bg-fill-critical)]",
      )}>
        <button onClick={decrement} disabled={disabled || !canDecrement} className={btnClass}>
          <MinusIcon className="size-4 fill-current" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-[var(--p-space-050)]">
          {prefix && <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => commit(localValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(localValue)
              if (e.key === "ArrowUp") { e.preventDefault(); increment() }
              if (e.key === "ArrowDown") { e.preventDefault(); decrement() }
            }}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            className={cn(
              "w-[3rem] text-center bg-transparent border-none outline-none",
              "text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]",
              "tabular-nums",
            )}
          />
          {suffix && <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">{suffix}</span>}
        </div>
        <button onClick={increment} disabled={disabled || !canIncrement} className={btnClass}>
          <PlusIcon className="size-4 fill-current" />
        </button>
      </div>
      {helpText && (
        <p className="mt-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">{helpText}</p>
      )}
    </div>
  )
}

export { NumberInput }
