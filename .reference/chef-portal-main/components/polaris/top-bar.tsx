"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "./avatar"

/**
 * Polaris Top Bar / App Header
 *
 * - Full width, sits inside SidebarInset
 * - Background: bg-surface
 * - Height: 3.5rem (56px)
 * - Navigation (trigger) on left, logo, spacer, actions, user on right
 */

interface TopBarProps extends React.ComponentProps<"header"> {
  navigation?: React.ReactNode
  logo?: React.ReactNode
  search?: React.ReactNode
  actions?: React.ReactNode
  user?: {
    name: string
    avatar?: string
    initials?: string
  }
  onUserClick?: () => void
}

function TopBar({
  navigation,
  logo,
  search,
  actions,
  user,
  onUserClick,
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "flex items-center shrink-0",
        "h-[3.5rem]",
        "px-[var(--p-space-400)]",
        "bg-[var(--p-color-bg-surface)]",
        "border-b border-[var(--p-color-border)]",
        "gap-[var(--p-space-300)]",
        className
      )}
      {...props}
    >
      {/* Navigation trigger */}
      {navigation && (
        <div className="shrink-0 flex items-center">{navigation}</div>
      )}

      {/* Logo */}
      {logo && (
        <div className="shrink-0 flex items-center">{logo}</div>
      )}

      {/* Search — flexible center */}
      {search && (
        <div className="flex-1 max-w-[30rem] mx-auto">
          {search}
        </div>
      )}

      {/* Spacer if no search */}
      {!search && <div className="flex-1" />}

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-[var(--p-space-200)] shrink-0">
          {actions}
        </div>
      )}

      {/* User */}
      {user && (
        <button
          onClick={onUserClick}
          className="flex items-center gap-[var(--p-space-200)] shrink-0 cursor-pointer rounded-[var(--p-border-radius-200)] p-[var(--p-space-100)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]"
        >
          <Avatar
            name={user.name}
            source={user.avatar}
            initials={user.initials}
            size="sm"
          />
          <span className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] hidden sm:block">
            {user.name}
          </span>
        </button>
      )}
    </header>
  )
}

export { TopBar }
