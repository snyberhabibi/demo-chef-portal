'use client'

import { useEffect, useRef } from 'react'
import { refreshSessionAction } from '@/actions/auth'

const REFRESH_INTERVAL_MS = 9 * 60 * 1000 // 9 minutes

export function useSessionKeepAlive(enabled: boolean = true) {
  const lastRefreshRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return
    lastRefreshRef.current = Date.now()

    const refresh = async () => {
      lastRefreshRef.current = Date.now()
      await refreshSessionAction().catch(() => {})
    }

    // Periodic refresh
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS)

    // Refresh on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      const elapsed = Date.now() - lastRefreshRef.current
      // Only refresh if >2 minutes since last refresh (debounce)
      if (elapsed > 2 * 60 * 1000) {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled])
}
