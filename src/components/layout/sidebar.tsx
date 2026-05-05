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
      className="hidden lg:flex flex-col sticky top-0 h-screen transition-[width] duration-200"
      style={{
        width: collapsed ? 48 : 280,
        background: "var(--color-cream-deep)",
        borderRight: "1px solid rgba(51,31,46,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center"
        style={{
          borderBottom: "1px solid rgba(51,31,46,0.05)",
          padding: collapsed ? "16px 8px" : "16px 20px",
          minHeight: 56,
        }}
      >
        <Link href="/dashboard" className="flex-shrink-0">
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 32 }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3" style={{ paddingLeft: collapsed ? 0 : 12, paddingRight: collapsed ? 0 : 12 }}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-brown-soft-2)",
                  padding: "8px 12px 6px",
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = activePath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className="flex items-center rounded-lg transition-colors"
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    padding: collapsed ? "12px 0" : "12px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : 10,
                    height: 48,
                    color: isActive
                      ? "var(--color-brown)"
                      : "var(--color-brown-soft)",
                    background: isActive ? "var(--color-cream)" : undefined,
                    borderLeft: isActive ? "2px solid var(--color-red)" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(51,31,46,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "";
                    }
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className="inline-flex items-center justify-center"
                          style={{
                            background: "var(--color-red)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: 18,
                            height: 18,
                            borderRadius: 9999,
                            padding: "0 5px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.newBadge && (
                        <span
                          style={{
                            background: "var(--color-red)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            borderRadius: 9999,
                            padding: "2px 6px",
                            lineHeight: 1,
                          }}
                        >
                          New
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer — storefront card */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div
            className="flex items-center gap-2.5"
            style={{
              background: "var(--color-cream)",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
              alt="Chef avatar"
              className="rounded-full object-cover"
              style={{ width: 36, height: 36, flexShrink: 0 }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 7,
                    height: 7,
                    background: "var(--color-sage)",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--color-sage-deep)",
                  }}
                >
                  Live
                </span>
              </div>
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
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--color-red)",
                }}
              >
                View My Store &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex items-center justify-center transition-colors"
        style={{
          height: 40,
          borderTop: "1px solid rgba(51,31,46,0.08)",
          color: "var(--color-brown-soft-2)",
          background: "transparent",
          border: "none",
          borderTopStyle: "solid",
          borderTopWidth: 1,
          borderTopColor: "rgba(51,31,46,0.08)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(51,31,46,0.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "";
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
