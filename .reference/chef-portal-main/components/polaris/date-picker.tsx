"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"
import { Label } from "./input"
import { Button } from "./button"

/**
 * Polaris Date & Time Pickers
 *
 * - DatePicker: calendar in popover
 * - TimePicker: hour/minute selector
 * - DateTimePicker: combined date + time
 */

// ===== HELPERS =====

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(hours: number, minutes: number): string {
  const h = hours % 12 || 12
  const m = minutes.toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  return `${h}:${m} ${ampm}`
}

function formatDateTime(date: Date): string {
  return `${formatDate(date)}, ${formatTime(date.getHours(), date.getMinutes())}`
}

// ===== POLARIS CALENDAR =====

function PolarisCalendar({
  selected,
  onSelect,
  ...props
}: {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
} & Omit<React.ComponentProps<typeof DayPicker>, "mode" | "selected" | "onSelect">) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      showOutsideDays
      className="w-fit"
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col", defaultClassNames.months),
        month: cn("flex flex-col gap-[var(--p-space-200)]", defaultClassNames.month),
        nav: cn("flex items-center justify-between w-full", defaultClassNames.nav),
        button_previous: cn(
          "size-[1.75rem] inline-flex items-center justify-center rounded-[var(--p-border-radius-200)]",
          "text-[var(--p-color-icon)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] cursor-pointer",
          "aria-disabled:opacity-30 aria-disabled:cursor-default",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "size-[1.75rem] inline-flex items-center justify-center rounded-[var(--p-border-radius-200)]",
          "text-[var(--p-color-icon)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] cursor-pointer",
          "aria-disabled:opacity-30 aria-disabled:cursor-default",
          defaultClassNames.button_next
        ),
        month_caption: cn("flex items-center justify-center h-[1.75rem]", defaultClassNames.month_caption),
        caption_label: cn("text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] select-none", defaultClassNames.caption_label),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("text-[var(--p-color-text-secondary)] text-[0.6875rem] font-[var(--p-font-weight-medium)] size-[2.5rem] tablet:size-[2rem] flex items-center justify-center select-none", defaultClassNames.weekday),
        week: cn("flex", defaultClassNames.week),
        day: cn("relative size-[2.5rem] tablet:size-[2rem] p-0 text-center select-none", defaultClassNames.day),
        today: cn("bg-[var(--p-color-bg-surface-selected)] rounded-[var(--p-border-radius-200)]", defaultClassNames.today),
        outside: cn("text-[var(--p-color-text-disabled)]", defaultClassNames.outside),
        disabled: cn("text-[var(--p-color-text-disabled)] opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeftIcon className="size-4 fill-current" />
          return <ChevronRightIcon className="size-4 fill-current" />
        },
        DayButton: ({ day, modifiers, className: _cn, ...dayProps }) => (
          <button
            type="button"
            className={cn(
              "size-[2.5rem] tablet:size-[2rem] rounded-[var(--p-border-radius-200)]",
              "text-[0.875rem] tablet:text-[0.75rem] font-[var(--p-font-weight-regular)]",
              "inline-flex items-center justify-center",
              "cursor-pointer select-none",
              "transition-colors duration-100",
              "outline-none",
              "touch-manipulation",
              "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              "hover:bg-[var(--p-color-bg-surface-hover)]",
              "active:bg-[var(--p-color-bg-surface-active)]",
              modifiers.selected
                ? "!bg-[var(--p-color-bg-fill-brand)] !text-white hover:!bg-[var(--p-color-bg-fill-brand-hover)] active:!bg-[var(--p-color-bg-fill-brand-active)]"
                : "text-[var(--p-color-text)]",
              modifiers.today && !modifiers.selected && "font-[var(--p-font-weight-semibold)]",
              modifiers.outside && !modifiers.selected && "text-[var(--p-color-text-disabled)]",
              modifiers.disabled && "opacity-50 cursor-default",
            )}
            {...dayProps}
          >
            {day.date.getDate()}
          </button>
        ),
      }}
      {...props}
    />
  )
}

// ===== TIME PICKER WHEEL =====

function TimePickerWheel({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
}: {
  hours: number
  minutes: number
  onHoursChange: (h: number) => void
  onMinutesChange: (m: number) => void
}) {
  const displayHour = hours % 12 || 12
  const isPM = hours >= 12

  const [hourInput, setHourInput] = React.useState<string | null>(null)
  const [minuteInput, setMinuteInput] = React.useState<string | null>(null)

  const toggleAMPM = () => {
    onHoursChange(isPM ? hours - 12 : hours + 12)
  }

  const incrementHour = () => onHoursChange((hours + 1) % 24)
  const decrementHour = () => onHoursChange((hours - 1 + 24) % 24)
  const incrementMin = () => onMinutesChange((minutes + 1) % 60)
  const decrementMin = () => onMinutesChange((minutes - 1 + 60) % 60)

  const commitHour = (raw: string) => {
    const num = parseInt(raw, 10)
    if (isNaN(num) || num < 1) return

    if (num > 12) {
      // Treat as 24h input — set directly (clamp to 23)
      onHoursChange(Math.min(num, 23))
    } else {
      // 12h input — convert based on AM/PM
      if (isPM) {
        onHoursChange(num === 12 ? 12 : num + 12)
      } else {
        onHoursChange(num === 12 ? 0 : num)
      }
    }
  }

  const commitMinute = (raw: string) => {
    const num = parseInt(raw, 10)
    if (isNaN(num)) return
    onMinutesChange(Math.min(Math.max(num, 0), 59))
  }

  const handleHourInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2)
    setHourInput(raw)
  }

  const handleHourBlur = () => {
    if (hourInput !== null && hourInput !== "") {
      commitHour(hourInput)
    }
    setHourInput(null)
  }

  const handleMinuteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2)
    setMinuteInput(raw)
  }

  const handleMinuteBlur = () => {
    if (minuteInput !== null && minuteInput !== "") {
      commitMinute(minuteInput)
    }
    setMinuteInput(null)
  }

  const handleHourKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); incrementHour() }
    if (e.key === "ArrowDown") { e.preventDefault(); decrementHour() }
  }

  const handleMinuteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); incrementMin() }
    if (e.key === "ArrowDown") { e.preventDefault(); decrementMin() }
  }

  const inputClasses = cn(
    "w-[2.5rem] text-center",
    "text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-semibold)]",
    "text-[var(--p-color-text)] tabular-nums",
    "bg-transparent border-none outline-none",
    "focus:bg-[var(--p-color-bg-surface-selected)] rounded-[var(--p-border-radius-150)]",
    "selection:bg-[var(--p-color-bg-fill-emphasis)] selection:text-white",
  )

  const arrowClasses = "size-[1.75rem] flex items-center justify-center rounded-[var(--p-border-radius-200)] text-[var(--p-color-icon-secondary)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] cursor-pointer"

  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <button onClick={incrementHour} className={arrowClasses}>
          <ChevronLeftIcon className="size-4 fill-current rotate-90" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={hourInput !== null ? hourInput : displayHour.toString().padStart(2, "0")}
          onChange={handleHourInput}
          onBlur={handleHourBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") { handleHourBlur(); (e.target as HTMLInputElement).blur() }
            handleHourKeyDown(e)
          }}
          onFocus={(e) => { setHourInput(""); e.target.select() }}
          className={inputClasses}
          maxLength={2}
        />
        <button onClick={decrementHour} className={arrowClasses}>
          <ChevronLeftIcon className="size-4 fill-current -rotate-90" />
        </button>
      </div>

      <span className="text-[1.25rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)]">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <button onClick={incrementMin} className={arrowClasses}>
          <ChevronLeftIcon className="size-4 fill-current rotate-90" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={minuteInput !== null ? minuteInput : minutes.toString().padStart(2, "0")}
          onChange={handleMinuteInput}
          onBlur={handleMinuteBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") { handleMinuteBlur(); (e.target as HTMLInputElement).blur() }
            handleMinuteKeyDown(e)
          }}
          onFocus={(e) => { setMinuteInput(""); e.target.select() }}
          className={inputClasses}
          maxLength={2}
        />
        <button onClick={decrementMin} className={arrowClasses}>
          <ChevronLeftIcon className="size-4 fill-current -rotate-90" />
        </button>
      </div>

      {/* AM/PM toggle */}
      <div className="flex flex-col gap-[var(--p-space-100)]">
        <button
          onClick={() => { if (isPM) toggleAMPM() }}
          className={cn(
            "px-[var(--p-space-300)] py-[var(--p-space-150)]",
            "rounded-[var(--p-border-radius-200)]",
            "text-[0.8125rem] font-[var(--p-font-weight-semibold)]",
            "cursor-pointer touch-manipulation",
            "transition-colors duration-100",
            "min-h-[2.25rem] min-w-[2.75rem]",
            !isPM
              ? "bg-[var(--p-color-bg-fill-brand)] text-white"
              : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-bg-fill-secondary-hover)]",
          )}
        >
          AM
        </button>
        <button
          onClick={() => { if (!isPM) toggleAMPM() }}
          className={cn(
            "px-[var(--p-space-300)] py-[var(--p-space-150)]",
            "rounded-[var(--p-border-radius-200)]",
            "text-[0.8125rem] font-[var(--p-font-weight-semibold)]",
            "cursor-pointer touch-manipulation",
            "transition-colors duration-100",
            "min-h-[2.25rem] min-w-[2.75rem]",
            isPM
              ? "bg-[var(--p-color-bg-fill-brand)] text-white"
              : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-bg-fill-secondary-hover)]",
          )}
        >
          PM
        </button>
      </div>
    </div>
  )
}

// ===== SHARED TRIGGER BUTTON =====

function PickerTrigger({
  icon: Icon,
  value,
  placeholder,
  disabled,
  error,
  open,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value?: string
  placeholder: string
  disabled?: boolean
  error?: boolean
  open?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[var(--p-space-200)] w-full",
        "min-h-[2rem]",
        "px-[var(--p-space-300)] py-[var(--p-space-150)]",
        "text-[0.8125rem] leading-[1.25rem]",
        "font-[var(--p-font-weight-regular)]",
        "bg-[var(--p-color-input-bg-surface)]",
        "border-[length:var(--p-border-width-0165)]",
        "border-solid",
        "border-[var(--p-color-control-border)]",
        "rounded-[var(--p-border-radius-200)]",
        "outline-none cursor-pointer",
        "hover:not-disabled:border-[var(--p-color-input-border-hover)]",
        "hover:not-disabled:bg-[var(--p-color-input-bg-surface-hover)]",
        open && "border-[var(--p-color-control-border-focus)] shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
        disabled && "pointer-events-none border-none bg-[var(--p-color-bg-surface-disabled)] text-[var(--p-color-text-disabled)]",
        error && "!border-[var(--p-color-bg-fill-critical)]",
        value ? "text-[var(--p-color-text)]" : "text-[var(--p-color-text-secondary)]",
      )}
    >
      <Icon className="size-4 shrink-0 fill-[var(--p-color-icon-secondary)]" />
      <span className="flex-1 text-start truncate">
        {value || placeholder}
      </span>
    </div>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

function PopoverWrapper({
  children,
  trigger,
  open,
  onOpenChange,
  title,
}: {
  children: React.ReactNode
  trigger: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <>
        <div onClick={() => onOpenChange(true)}>{trigger}</div>
        {open && (
          <>
            {/* Full-screen overlay */}
            <div
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] animate-in fade-in-0 duration-200"
              onClick={() => onOpenChange(false)}
            />
            {/* Full-screen modal */}
            <div className={cn(
              "fixed inset-0 z-50 flex flex-col",
              "bg-[var(--p-color-bg-surface)]",
              "animate-in slide-in-from-bottom duration-300",
            )}>
              {/* Header */}
              <div className="flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] border-b border-[var(--p-color-border)]">
                <span className="text-[1rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  {title || "Select"}
                </span>
                <Button variant="tertiary" size="sm" onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              </div>
              {/* Content — centered */}
              <div className="flex-1 overflow-y-auto flex items-start justify-center p-[var(--p-space-400)] pt-[var(--p-space-600)]">
                {children}
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50",
            "bg-[var(--p-color-bg-surface)]",
            "border border-[var(--p-color-border)]",
            "rounded-[var(--p-border-radius-300)]",
            "shadow-[var(--p-shadow-300)]",
            "p-[var(--p-space-300)]",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ===== DATE PICKER =====

interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  helpText?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  className?: string
}

function DatePicker({
  label: labelText,
  value,
  onChange,
  placeholder = "Select date",
  helpText,
  error,
  errorMessage,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={className}>
      {labelText && <Label>{labelText}</Label>}
      <PopoverWrapper
        open={open}
        onOpenChange={setOpen}
        title="Select Date"
        trigger={
          <button disabled={disabled}>
            <PickerTrigger icon={CalendarIcon} value={value ? formatDate(value) : undefined} placeholder={placeholder} disabled={disabled} error={error} open={open} />
          </button>
        }
      >
        <PolarisCalendar
          selected={value}
          onSelect={(date) => { onChange?.(date); setOpen(false) }}
        />
      </PopoverWrapper>
      {helpText && !error && (
        <p className="mt-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">{helpText}</p>
      )}
      {error && errorMessage && (
        <p className="mt-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-critical)]">{errorMessage}</p>
      )}
    </div>
  )
}

// ===== TIME PICKER =====

interface TimePickerProps {
  label?: string
  hours?: number
  minutes?: number
  onChange?: (hours: number, minutes: number) => void
  placeholder?: string
  helpText?: string
  disabled?: boolean
  className?: string
}

function TimePicker({
  label: labelText,
  hours = 9,
  minutes = 0,
  onChange,
  placeholder = "Select time",
  helpText,
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [localH, setLocalH] = React.useState(hours)
  const [localM, setLocalM] = React.useState(minutes)

  React.useEffect(() => { setLocalH(hours); setLocalM(minutes) }, [hours, minutes])

  const handleDone = () => {
    onChange?.(localH, localM)
    setOpen(false)
  }

  return (
    <div className={className}>
      {labelText && <Label>{labelText}</Label>}
      <PopoverWrapper
        open={open}
        onOpenChange={setOpen}
        title="Select Time"
        trigger={
          <button disabled={disabled} className="w-full">
            <PickerTrigger icon={ClockIcon} value={formatTime(hours, minutes)} placeholder={placeholder} disabled={disabled} open={open} />
          </button>
        }
      >
        <div className="flex flex-col items-center gap-[var(--p-space-300)]">
          <TimePickerWheel
            hours={localH}
            minutes={localM}
            onHoursChange={setLocalH}
            onMinutesChange={setLocalM}
          />
          <Button variant="default" size="sm" fullWidth onClick={handleDone}>
            Done
          </Button>
        </div>
      </PopoverWrapper>
      {helpText && (
        <p className="mt-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">{helpText}</p>
      )}
    </div>
  )
}

// ===== DATE TIME PICKER =====

interface DateTimePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  helpText?: string
  error?: boolean
  disabled?: boolean
  className?: string
}

function DateTimePicker({
  label: labelText,
  value,
  onChange,
  placeholder = "Select date & time",
  helpText,
  error,
  disabled,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [localH, setLocalH] = React.useState(value?.getHours() ?? 9)
  const [localM, setLocalM] = React.useState(value?.getMinutes() ?? 0)

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setLocalH(value.getHours())
      setLocalM(value.getMinutes())
    }
  }, [value])

  const handleDone = () => {
    if (selectedDate) {
      const combined = new Date(selectedDate)
      combined.setHours(localH, localM, 0, 0)
      onChange?.(combined)
    }
    setOpen(false)
  }

  return (
    <div className={className}>
      {labelText && <Label>{labelText}</Label>}
      <PopoverWrapper
        open={open}
        onOpenChange={setOpen}
        title="Select Date & Time"
        trigger={
          <button disabled={disabled}>
            <PickerTrigger icon={CalendarIcon} value={value ? formatDateTime(value) : undefined} placeholder={placeholder} disabled={disabled} error={error} open={open} />
          </button>
        }
      >
        <div className="flex flex-col gap-[var(--p-space-300)]">
          <PolarisCalendar
            selected={selectedDate}
            onSelect={setSelectedDate}
          />

          {/* Divider */}
          <div className="h-px bg-[var(--p-color-border-secondary)]" />

          {/* Time section */}
          <div>
            <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">
              Time
            </p>
            <div className="flex justify-center">
              <TimePickerWheel
                hours={localH}
                minutes={localM}
                onHoursChange={setLocalH}
                onMinutesChange={setLocalM}
              />
            </div>
          </div>

          <Button variant="default" size="sm" fullWidth onClick={handleDone} disabled={!selectedDate}>
            Confirm
          </Button>
        </div>
      </PopoverWrapper>
      {helpText && (
        <p className="mt-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)]">{helpText}</p>
      )}
    </div>
  )
}

export { DatePicker, TimePicker, DateTimePicker, PolarisCalendar }
