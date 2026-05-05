"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { XIcon } from "@shopify/polaris-icons"
import { Button } from "./button"

/**
 * Polaris Toast — 9 style variants
 *
 * clean | tinted | badge | minimal | pill | slidebar | glass | dark | split
 */

interface Toast {
  id: string
  title?: string
  message: string
  tone?: "default" | "success" | "critical" | "info"
  style?: "clean" | "tinted" | "badge" | "minimal" | "pill" | "slidebar" | "glass" | "dark" | "split"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)
const ToastPositionContext = React.createContext<ToastPosition>("bottom-center")

function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

function ToastProvider({ children, position = "top-center" }: { children: React.ReactNode; position?: ToastPosition }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...toast }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastPositionContext.Provider value={position}>
        {children}
        <ToastContainer />
      </ToastPositionContext.Provider>
    </ToastContext.Provider>
  )
}

/* Solid filled status icons — circle bg with white symbol */
function FilledCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M8.5 13.5l-3-3 1.06-1.06L8.5 11.38l4.94-4.94L14.5 7.5l-6 6z" fill="white" />
    </svg>
  )
}

function FilledAlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <rect x="9" y="5" width="2" height="6" rx="1" fill="white" />
      <circle cx="10" cy="14" r="1.25" fill="white" />
    </svg>
  )
}

function FilledInfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <circle cx="10" cy="6.5" r="1.25" fill="white" />
      <rect x="9" y="9" width="2" height="6" rx="1" fill="white" />
    </svg>
  )
}

const toneConfig = {
  default: {
    icon: FilledInfoIcon,
    iconColor: "text-[var(--p-color-icon-secondary)]",
    iconColorWhite: "text-[rgba(181,181,181,1)]",
    badgeBg: "bg-[var(--p-color-bg-fill-secondary)]",
    tintedBg: "bg-[var(--p-color-bg-surface)]",
    tintedBorder: "border-[var(--p-color-border)]",
    splitBg: "bg-[var(--p-color-bg-fill-secondary)]",
    accentColor: "rgba(138,138,138,1)",
  },
  success: {
    icon: FilledCheckIcon,
    iconColor: "text-[rgba(4,123,93,1)]",
    iconColorWhite: "text-[rgba(82,244,144,1)]",
    badgeBg: "bg-[rgba(205,254,212,1)]",
    tintedBg: "bg-[var(--p-color-bg-surface-success)]",
    tintedBorder: "border-[var(--p-color-border-success)]",
    splitBg: "bg-[rgba(4,123,93,1)]",
    accentColor: "rgba(4,123,93,1)",
  },
  critical: {
    icon: FilledAlertIcon,
    iconColor: "text-[rgba(199,10,36,1)]",
    iconColorWhite: "text-[rgba(247,128,134,1)]",
    badgeBg: "bg-[rgba(254,232,235,1)]",
    tintedBg: "bg-[var(--p-color-bg-surface-critical)]",
    tintedBorder: "border-[var(--p-color-border-critical)]",
    splitBg: "bg-[rgba(199,10,36,1)]",
    accentColor: "rgba(199,10,36,1)",
  },
  info: {
    icon: FilledInfoIcon,
    iconColor: "text-[rgba(0,91,211,1)]",
    iconColorWhite: "text-[rgba(145,208,255,1)]",
    badgeBg: "bg-[rgba(234,244,255,1)]",
    tintedBg: "bg-[var(--p-color-bg-surface-info)]",
    tintedBorder: "border-[var(--p-color-border-info)]",
    splitBg: "bg-[rgba(0,91,211,1)]",
    accentColor: "rgba(0,91,211,1)",
  },
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "fixed top-[var(--p-space-600)] left-[var(--p-space-600)]",
  "top-center": "fixed top-[var(--p-space-600)] left-1/2 -translate-x-1/2",
  "top-right": "fixed top-[var(--p-space-600)] right-[var(--p-space-600)]",
  "bottom-left": "fixed bottom-[var(--p-space-600)] left-[var(--p-space-600)]",
  "bottom-center": "fixed bottom-[var(--p-space-600)] left-1/2 -translate-x-1/2",
  "bottom-right": "fixed bottom-[var(--p-space-600)] right-[var(--p-space-600)]",
}

const slideAnimations: Record<string, string> = {
  top: "animate-in slide-in-from-top-4 fade-in-0 duration-200",
  bottom: "animate-in slide-in-from-bottom-4 fade-in-0 duration-200",
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()
  const position = React.useContext(ToastPositionContext)
  const isTop = position.startsWith("top")
  const [expanded, setExpanded] = React.useState(false)
  const maxVisible = 3

  // Auto-collapse after expanding
  React.useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => setExpanded(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [expanded])

  // Reset expanded when toasts change
  React.useEffect(() => {
    if (toasts.length <= 1) setExpanded(false)
  }, [toasts.length])

  const visibleToasts = toasts.slice(-maxVisible)

  return (
    <div
      className={cn(positionClasses[position], "z-[9999]")}
      onMouseEnter={() => toasts.length > 1 && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={cn("relative flex items-center", isTop ? "flex-col" : "flex-col-reverse")}>
        {visibleToasts.map((toast, idx) => {
          const reverseIdx = visibleToasts.length - 1 - idx
          const isLatest = idx === visibleToasts.length - 1

          const stackOffset = reverseIdx * 0.625
          const stackScale = 1 - reverseIdx * 0.04
          const stackOpacity = 1 - reverseIdx * 0.15
          const expandGap = reverseIdx * 4.5

          const direction = isTop ? 1 : -1

          return (
            <div
              key={toast.id}
              className="transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                position: isLatest ? "relative" : "absolute",
                [isTop ? "top" : "bottom"]: isLatest ? 0 : undefined,
                transform: expanded
                  ? `translateY(${direction * expandGap}rem) scale(1)`
                  : isLatest
                    ? "scale(1)"
                    : `translateY(${direction * stackOffset}rem) scale(${stackScale})`,
                opacity: expanded ? 1 : (isLatest ? 1 : stackOpacity),
                zIndex: idx,
                transformOrigin: isTop ? "top center" : "bottom center",
              }}
            >
              <ToastItem toast={toast} onDismiss={() => removeToast(toast.id)} />
            </div>
          )
        })}
      </div>

      {/* Stack count indicator */}
      {toasts.length > 1 && !expanded && (
        <div className={cn("flex justify-center transition-opacity duration-300", isTop ? "mt-[var(--p-space-150)]" : "mt-[var(--p-space-150)]")}>
          <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-medium)]">
            {toasts.length} notification{toasts.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}

/* Shared close button — uses Polaris Button tertiary */
function CloseBtn({ onDismiss, dark = false }: { onDismiss: () => void; dark?: boolean }) {
  return (
    <Button
      variant="tertiary"
      size="icon-micro"
      onClick={onDismiss}
      className={cn(
        "shrink-0",
        dark && "!text-white/60 hover:!text-white hover:!bg-white/10",
      )}
    >
      <XIcon className="size-[1rem] fill-current" />
    </Button>
  )
}

/* Shared action button */
function ActionBtn({ action, onDismiss, dark = false }: { action: Toast["action"]; onDismiss: () => void; dark?: boolean }) {
  if (!action) return null
  return (
    <button
      onClick={(e) => { e.stopPropagation(); action.onClick(); onDismiss() }}
      className={cn(
        "text-[0.8125rem] font-[var(--p-font-weight-medium)] hover:underline underline-offset-2 cursor-pointer shrink-0",
        dark ? "text-white/80" : "text-[var(--p-color-text-emphasis)]",
      )}
    >
      {action.label}
    </button>
  )
}

/* Shared title + body */
function ToastContent({ toast, dark = false }: { toast: Toast; dark?: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      {toast.title && (
        <p className={cn("text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-semibold)]", dark ? "text-white" : "text-[var(--p-color-text)]")}>
          {toast.title}
        </p>
      )}
      <p className={cn(
        "text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-regular)]",
        dark
          ? (toast.title ? "text-white/70" : "text-white")
          : (toast.title ? "text-[var(--p-color-text-secondary)]" : "text-[var(--p-color-text)]"),
      )}>
        {toast.message}
      </p>
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const config = toneConfig[toast.tone || "default"]
  const Icon = config.icon
  const style = toast.style || "badge"
  const position = React.useContext(ToastPositionContext)
  const isTop = position.startsWith("top")

  React.useEffect(() => {
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onDismiss])

  const baseAnimation = isTop
    ? "animate-in slide-in-from-top-4 fade-in-0 duration-200"
    : "animate-in slide-in-from-bottom-4 fade-in-0 duration-200"

  // ===== 1. CLEAN =====
  if (style === "clean") {
    return (
      <div className={cn("flex items-start gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-400)] min-w-[20rem] max-w-[28rem] bg-[var(--p-color-bg-surface)] border border-[var(--p-color-border)]", baseAnimation)}>
        <Icon className={cn("size-5 shrink-0 mt-[0.0625rem]", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 2. TINTED =====
  if (style === "tinted") {
    return (
      <div className={cn("flex items-start gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-400)] min-w-[20rem] max-w-[28rem] border", config.tintedBg, config.tintedBorder, baseAnimation)}>
        <Icon className={cn("size-5 shrink-0 mt-[0.0625rem]", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 3. BADGE =====
  if (style === "badge") {
    return (
      <div className={cn("flex items-center gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-400)] min-w-[20rem] max-w-[28rem] bg-[var(--p-color-bg-surface)] border border-[var(--p-color-border)]", baseAnimation)}>
        <Icon className={cn("size-[1.75rem] shrink-0", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 4. MINIMAL =====
  if (style === "minimal") {
    return (
      <div className={cn("flex items-center gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-200)] min-w-[20rem] max-w-[28rem] bg-[var(--p-color-bg-surface)] border-y border-[var(--p-color-border)]", baseAnimation)}>
        <Icon className={cn("size-5 shrink-0", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 5. PILL =====
  if (style === "pill") {
    return (
      <div className={cn("flex items-center gap-[var(--p-space-200)] px-[var(--p-space-300)] py-[var(--p-space-150)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-400)] bg-[var(--p-color-bg-surface)] border border-[var(--p-color-border)]", baseAnimation)}>
        <Icon className={cn("size-4 shrink-0", config.iconColor)} />
        <span className="text-[0.75rem] leading-[1rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] whitespace-nowrap">
          {toast.title || toast.message}
        </span>
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 6. SLIDE BAR =====
  if (style === "slidebar") {
    return (
      <div className={cn("flex items-center gap-[var(--p-space-300)] px-[var(--p-space-500)] py-[var(--p-space-300)] w-[min(100vw,40rem)] shadow-[var(--p-shadow-300)] bg-[var(--p-color-bg-surface)] border border-[var(--p-color-border)] rounded-[var(--p-border-radius-200)]", baseAnimation)}>
        <div className="absolute left-0 top-0 bottom-0 w-[0.25rem] rounded-l-[var(--p-border-radius-200)]" style={{ backgroundColor: config.accentColor }} />
        <Icon className={cn("size-5 shrink-0", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 7. GLASS =====
  if (style === "glass") {
    return (
      <div className={cn("flex items-start gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-500)] min-w-[20rem] max-w-[28rem] bg-white/70 backdrop-blur-xl border border-white/40", baseAnimation)}>
        <Icon className={cn("size-5 shrink-0 mt-[0.0625rem]", config.iconColor)} />
        <ToastContent toast={toast} />
        <ActionBtn action={toast.action} onDismiss={onDismiss} />
        <CloseBtn onDismiss={onDismiss} />
      </div>
    )
  }

  // ===== 8. DARK =====
  if (style === "dark") {
    return (
      <div className={cn("flex items-start gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-500)] min-w-[20rem] max-w-[28rem] bg-[rgba(26,26,26,0.95)]", baseAnimation)}>
        <Icon className={cn("size-5 shrink-0 mt-[0.0625rem]", config.iconColorWhite)} />
        <ToastContent toast={toast} dark />
        <ActionBtn action={toast.action} onDismiss={onDismiss} dark />
        <CloseBtn onDismiss={onDismiss} dark />
      </div>
    )
  }

  // ===== 9. SPLIT =====
  if (style === "split") {
    return (
      <div className={cn("flex overflow-hidden rounded-[var(--p-border-radius-300)] shadow-[var(--p-shadow-400)] min-w-[20rem] max-w-[28rem] bg-[var(--p-color-bg-surface)] border border-[var(--p-color-border)]", baseAnimation)}>
        <div className={cn("flex items-center justify-center px-[var(--p-space-300)]", config.splitBg)}>
          <Icon className="size-5 fill-white" />
        </div>
        <div className="flex items-start gap-[var(--p-space-200)] flex-1 px-[var(--p-space-300)] py-[var(--p-space-300)]">
          <ToastContent toast={toast} />
          <ActionBtn action={toast.action} onDismiss={onDismiss} />
          <CloseBtn onDismiss={onDismiss} />
        </div>
      </div>
    )
  }

  // Fallback to clean
  return null
}

export { ToastProvider, useToast, ToastContainer }
export type { Toast }
