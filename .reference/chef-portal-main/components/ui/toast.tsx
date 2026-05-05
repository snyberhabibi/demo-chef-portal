"use client"

import posthog from "posthog-js"

type ToastType = "success" | "error" | "warning" | "info"

// Singleton ref — set by ToastBridge component mounted inside ToastProvider
let addToastFn: ((toast: {
  message: string
  title?: string
  tone?: "default" | "success" | "critical" | "info"
  style?: "badge"
  duration?: number
}) => void) | null = null

export function setToastBridge(fn: typeof addToastFn) {
  addToastFn = fn
}

function trackToast(type: ToastType, title: string, description?: string) {
  try {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("toast_displayed", {
        type,
        title,
        description,
        page: window.location.pathname,
        portal: "chef",
      })
    }
  } catch {
    // Silently fail — toast display must never be blocked by analytics
  }
}

const toneMap: Record<ToastType, "success" | "critical" | "info" | "default"> = {
  success: "success",
  error: "critical",
  warning: "default",
  info: "info",
}

function showToast(type: ToastType, title: string, options?: { description?: string; duration?: number }) {
  trackToast(type, title, options?.description)

  if (addToastFn) {
    addToastFn({
      message: options?.description || title,
      title: options?.description ? title : undefined,
      tone: toneMap[type],
      style: "badge",
      duration: options?.duration || (type === "error" ? 4000 : 3000),
    })
  } else {
    // Fallback: console warning if ToastProvider isn't mounted yet
    console.warn(`[toast.${type}] ToastProvider not mounted:`, title)
  }
}

export const toast = {
  success: (title: string, options?: { description?: string; duration?: number }) =>
    showToast("success", title, options),

  error: (title: string, options?: { description?: string; duration?: number }) =>
    showToast("error", title, options),

  warning: (title: string, options?: { description?: string; duration?: number }) =>
    showToast("warning", title, options),

  info: (title: string, options?: { description?: string; duration?: number }) =>
    showToast("info", title, options),
}
