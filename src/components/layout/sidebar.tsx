/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Receipt,
  Star,
  UtensilsCrossed,
  Package,
  LayoutList,
  MapPin,
  ShoppingBag,
  BookOpen,
  BookMarked,
  Settings,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  activePath: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  newBadge?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/orders", label: "Orders", icon: Receipt, badge: "2" },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Menu Management",
    items: [
      { href: "/menu", label: "Dishes", icon: UtensilsCrossed },
      { href: "/bundles", label: "Bundles", icon: Package, newBadge: true },
      { href: "/sections", label: "Custom Menu Sections", icon: LayoutList },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/pickup-address", label: "Address Management", icon: MapPin },
      { href: "/packaging", label: "Buy Packaging", icon: ShoppingBag, newBadge: true },
    ],
  },
  {
    label: "Help & Guides",
    items: [
      { href: "/tutorials", label: "Tutorials", icon: BookOpen, newBadge: true },
      { href: "/portal-guide", label: "Portal Guide", icon: BookMarked },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings", label: "Account Settings", icon: Settings },
      { href: "/profile", label: "Profile", icon: User },
      { href: "/payments", label: "Payment Methods", icon: CreditCard },
    ],
  },
];

export function Sidebar({ activePath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0 h-screen"
      style={{
        width: collapsed ? 56 : 260,
        background: "var(--color-cream-deep)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(51,31,46,0.02) 100%)",
        borderRight: "1px solid rgba(51,31,46,0.06)",
        overflow: "hidden",
        transition: `width var(--t-base) var(--ease-spring)`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center"
        style={{
          padding: 20,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Link href="/dashboard" className="flex-shrink-0">
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 28 }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto"
        style={{
          paddingLeft: collapsed ? 8 : 12,
          paddingRight: collapsed ? 8 : 12,
          paddingTop: 4,
          paddingBottom: 12,
        }}
      >
        {navGroups.map((group, groupIdx) => (
          <div key={group.label}>
            {/* Group label */}
            {!collapsed && (
              <div
                className="eyebrow"
                style={{
                  padding: "0 10px",
                  marginTop: groupIdx === 0 ? 20 : 16,
                  marginBottom: 6,
                }}
              >
                {group.label}
              </div>
            )}
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((item) => {
                const isActive = activePath === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center"
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      height: 40,
                      borderRadius: 10,
                      padding: collapsed ? "0" : isActive ? "0 10px 0 8px" : "0 10px",
                      paddingLeft: collapsed ? 0 : isActive ? 8 : 10,
                      justifyContent: collapsed ? "center" : "flex-start",
                      gap: collapsed ? 0 : 10,
                      color: isActive
                        ? "var(--color-brown)"
                        : "rgba(51,31,46,0.55)",
                      background: isActive ? "var(--color-cream)" : "transparent",
                      borderLeft: isActive
                        ? "2px solid var(--color-red)"
                        : "2px solid transparent",
                      boxShadow: isActive
                        ? "0 1px 2px rgba(51,31,46,0.04)"
                        : "none",
                      transition: `all var(--t-fast) var(--ease-spring)`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "rgba(250,249,246,0.5)";
                        el.style.color = "var(--color-brown)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "transparent";
                        el.style.color = "rgba(51,31,46,0.55)";
                      }
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      style={{ flexShrink: 0 }}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="badge-count">{item.badge}</span>
                        )}
                        {item.newBadge && (
                          <span className="badge-new">New</span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — storefront card */}
      {!collapsed && (
        <div style={{ padding: "0 12px 12px" }}>
          <div
            className="flex items-center"
            style={{
              background: "var(--color-cream)",
              borderRadius: 16,
              padding: 12,
              gap: 10,
            }}
          >
            {/* Avatar with green dot */}
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
                alt="Chef avatar"
                className="rounded-full object-cover"
                style={{ width: 32, height: 32 }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: -1,
                  right: -1,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-sage)",
                  border: "2px solid #fff",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-brown)",
                  lineHeight: 1.3,
                }}
              >
                Yalla Kitchen by Amira
              </div>
              <Link
                href="/store-preview"
                style={{
                  fontSize: 11,
                  color: "var(--color-brown-soft-2)",
                  lineHeight: 1.3,
                  display: "inline-block",
                }}
                className="hover:underline"
              >
                View My Store
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex items-center justify-center"
        style={{
          height: 40,
          borderTop: "1px solid rgba(51,31,46,0.06)",
          color: "var(--color-brown-soft-2)",
          background: "transparent",
          border: "none",
          borderTopStyle: "solid",
          borderTopWidth: 1,
          borderTopColor: "rgba(51,31,46,0.06)",
          cursor: "pointer",
          transition: `all var(--t-fast) var(--ease-spring)`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(51,31,46,0.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {collapsed ? (
          <ChevronRight size={16} strokeWidth={2} />
        ) : (
          <ChevronLeft size={16} strokeWidth={2} />
        )}
      </button>
    </aside>
  );
}
