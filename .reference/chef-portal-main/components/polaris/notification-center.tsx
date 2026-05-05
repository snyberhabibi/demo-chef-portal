"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { NotificationIcon } from "@shopify/polaris-icons"
import { Button } from "./button"
import { Badge } from "./badge"

/**
 * Polaris Notification Center
 * - Bell icon trigger with count badge
 * - Dropdown list of notifications
 * - Read/unread states
 * - Mark all as read action
 */

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface NotificationCenterProps {
  notifications: Notification[]
  onNotificationClick?: (id: string) => void
  onMarkAllRead?: () => void
  className?: string
}

function NotificationCenter({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  className,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <div className={cn("relative", className)}>
          <Button variant="tertiary" size="icon">
            <NotificationIcon className="size-5 fill-current" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-[1.125rem] rounded-full bg-[rgba(199,10,36,1)] text-white text-[0.625rem] font-[var(--p-font-weight-bold)] flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-[22rem]",
            "bg-[var(--p-color-bg-surface)]",
            "border border-[var(--p-color-border)]",
            "rounded-[var(--p-border-radius-300)]",
            "shadow-[var(--p-shadow-400)]",
            "overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] border-b border-[var(--p-color-border)]">
            <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
              Notifications
            </span>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                onClick={onMarkAllRead}
                className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-emphasis)] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[20rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-[var(--p-space-800)] text-center text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = notif.icon
                return (
                  <button
                    key={notif.id}
                    onClick={() => onNotificationClick?.(notif.id)}
                    className={cn(
                      "flex gap-[var(--p-space-300)] w-full text-start",
                      "px-[var(--p-space-400)] py-[var(--p-space-300)]",
                      "border-b border-[var(--p-color-border-secondary)]",
                      "cursor-pointer",
                      "hover:bg-[var(--p-color-bg-surface-hover)]",
                      "transition-colors duration-100",
                      !notif.read && "bg-[var(--p-color-bg-surface-info)]/30",
                    )}
                  >
                    {/* Unread dot */}
                    <div className="shrink-0 pt-[var(--p-space-100)]">
                      {!notif.read ? (
                        <div className="size-[0.5rem] rounded-full bg-[rgba(0,91,211,1)]" />
                      ) : (
                        <div className="size-[0.5rem]" />
                      )}
                    </div>
                    {Icon && (
                      <Icon className="size-5 shrink-0 fill-[var(--p-color-icon-secondary)] mt-[var(--p-space-025)]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-[0.8125rem] leading-[1.25rem] truncate",
                        notif.read
                          ? "font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)]"
                          : "font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]",
                      )}>
                        {notif.title}
                      </p>
                      <p className="text-[0.6875rem] leading-[1rem] text-[var(--p-color-text-secondary)] line-clamp-2 mt-[var(--p-space-025)]">
                        {notif.message}
                      </p>
                      <p className="text-[0.625rem] leading-[0.75rem] text-[var(--p-color-text-disabled)] mt-[var(--p-space-100)]">
                        {notif.timestamp}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { NotificationCenter }
export type { Notification }
