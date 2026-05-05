"use client"

import { useEffect } from "react"
import { useToast } from "@/components/polaris"
import { setToastBridge } from "./toast"

/**
 * Bridges the imperative toast.success/error/etc API to the Polaris ToastProvider.
 * Mount this inside <ToastProvider> to enable toast calls from anywhere.
 */
export function ToastBridge() {
  const { addToast } = useToast()

  useEffect(() => {
    setToastBridge(addToast)
    return () => setToastBridge(null)
  }, [addToast])

  return null
}
