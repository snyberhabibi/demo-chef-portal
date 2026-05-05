"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons"
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip"

/**
 * Polaris Navigation / Sidebar
 *
 * - Expanded: logo + icon + label
 * - Collapsed: icon only with tooltips
 * - Toggle button to collapse/expand
 * - Background: nav-bg
 * - Active item: bg-surface-selected
 * - Sections with optional titles
 */

interface NavItem {
  id: string
  label: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href?: string
  badge?: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  items?: NavItem[]
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface NavigationProps extends React.ComponentProps<"nav"> {
  sections: NavSection[]
  logo?: React.ReactNode
  logoCollapsed?: React.ReactNode
  footer?: React.ReactNode
  collapsed?: boolean
  onToggleCollapse?: () => void
}

function Navigation({
  sections,
  logo,
  logoCollapsed,
  footer,
  collapsed = false,
  onToggleCollapse,
  className,
  ...props
}: NavigationProps) {
  return (
    <nav
      data-slot="navigation"
      style={{ width: collapsed ? "4rem" : "15rem" }}
      className={cn(
        "flex flex-col h-full",
        "bg-[var(--p-color-nav-bg)]",
        "border-r border-[var(--p-color-border)]",
        "overflow-hidden shrink-0",
        "will-change-[width]",
        "transition-[width] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      {...props}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-[var(--p-color-border)]",
        "h-[3.5rem] shrink-0",
        collapsed ? "justify-center px-[var(--p-space-200)]" : "px-[var(--p-space-400)]",
      )}>
        {collapsed ? (
          logoCollapsed || (
            <div className="size-[2rem] rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center text-white text-[0.75rem] font-[var(--p-font-weight-bold)]">
              Y
            </div>
          )
        ) : (
          logo || (
            <span className="text-[0.875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] truncate">
              Yalla Bites
            </span>
          )
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-[var(--p-space-200)]">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="px-[var(--p-space-200)]">
            {section.title && !collapsed && (
              <p className="px-[var(--p-space-300)] pt-[var(--p-space-400)] pb-[var(--p-space-100)] text-[0.6875rem] leading-[1rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="my-[var(--p-space-200)] mx-[var(--p-space-100)] h-px bg-[var(--p-color-border)]" />
            )}
            <ul className="space-y-[var(--p-space-050)]">
              {section.items.map((item) => (
                <NavItemComponent key={item.id} item={item} collapsed={collapsed} />
              ))}
            </ul>
            {sIdx < sections.length - 1 && !section.title && (
              <div className="my-[var(--p-space-200)] mx-[var(--p-space-100)] h-px bg-[var(--p-color-border)]" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="px-[var(--p-space-300)] py-[var(--p-space-300)] border-t border-[var(--p-color-border)]">
          {footer}
        </div>
      )}

      {/* Collapse toggle */}
      {onToggleCollapse && (
        <div className={cn(
          "border-t border-[var(--p-color-border)]",
          "py-[var(--p-space-200)]",
          collapsed ? "px-[var(--p-space-200)] flex justify-center" : "px-[var(--p-space-200)]",
        )}>
          <button
            onClick={onToggleCollapse}
            className={cn(
              "flex items-center gap-[var(--p-space-200)] w-full",
              "px-[var(--p-space-300)] py-[var(--p-space-150)]",
              "rounded-[var(--p-border-radius-200)]",
              "text-[var(--p-color-text-secondary)]",
              "hover:bg-[var(--p-color-nav-bg-surface-hover)] hover:text-[var(--p-color-text)]",
              "cursor-pointer select-none",
              "transition-[background-color,padding] duration-150",
              "outline-none",
              "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              collapsed && "justify-center !px-[var(--p-space-200)]",
            )}
          >
            <div className="shrink-0 transition-transform duration-200" style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}>
              <ChevronLeftIcon className="size-5 fill-current" />
            </div>
            <span className={cn(
              "text-[0.75rem] font-[var(--p-font-weight-medium)] transition-[opacity,width] duration-200",
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
            )}>
              Collapse
            </span>
          </button>
        </div>
      )}
    </nav>
  )
}

function NavItemComponent({ item, depth = 0, collapsed = false }: { item: NavItem; depth?: number; collapsed?: boolean }) {
  const [expanded, setExpanded] = React.useState(
    item.items?.some((sub) => sub.active) || false
  )
  const Icon = item.icon
  const hasChildren = item.items && item.items.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded)
    }
    item.onClick?.()
  }

  const buttonContent = (
    <button
      onClick={handleClick}
      disabled={item.disabled}
      className={cn(
        "flex items-center w-full",
        "gap-[var(--p-space-200)]",
        "px-[var(--p-space-300)] py-[var(--p-space-150)]",
        "rounded-[var(--p-border-radius-200)]",
        "text-[0.8125rem] leading-[1.25rem]",
        "cursor-pointer select-none",
        "transition-[background-color,padding] duration-150",
        "outline-none",
        "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        collapsed && "justify-center !px-[var(--p-space-200)]",
        depth > 0 && !collapsed && "pl-[var(--p-space-800)]",
        item.active
          ? "bg-[var(--p-color-nav-bg-surface-selected)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
          : "font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-nav-bg-surface-hover)] hover:text-[var(--p-color-text)]",
        item.disabled && "opacity-50 cursor-default",
      )}
    >
      {Icon && <Icon className="size-5 shrink-0 fill-current" />}
      <span className={cn(
        "flex-1 text-start truncate transition-[opacity,width] duration-200",
        collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
      )}>
        {item.label}
      </span>
      {item.badge && (
        <span className={cn(
          "shrink-0 transition-opacity duration-200",
          collapsed ? "opacity-0 hidden" : "opacity-100",
        )}>
          {item.badge}
        </span>
      )}
    </button>
  )

  return (
    <li>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        buttonContent
      )}
      {hasChildren && expanded && !collapsed && (
        <ul className="mt-[var(--p-space-050)]">
          {item.items!.map((sub) => (
            <NavItemComponent key={sub.id} item={sub} depth={depth + 1} collapsed={collapsed} />
          ))}
        </ul>
      )}
    </li>
  )
}

export { Navigation }
export type { NavItem, NavSection }
