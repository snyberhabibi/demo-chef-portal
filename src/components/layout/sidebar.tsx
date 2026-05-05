/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  Home,
  Receipt,
  UtensilsCrossed,
  Package,
  Layers,
  Clock,
  MapPin,
  Star,
  User,
  Wallet,
  Webhook,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  activePath: string;
}

const navGroups = [
  {
    label: "Operate",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/orders", label: "Orders", icon: Receipt, badge: "2" },
    ],
  },
  {
    label: "Create",
    items: [
      { href: "/menu", label: "Menu", icon: UtensilsCrossed },
      { href: "/bundles", label: "Bundles", icon: Package },
      { href: "/sections", label: "Sections", icon: Layers },
    ],
  },
  {
    label: "Storefront",
    items: [
      { href: "/operations", label: "Operations & Hours", icon: Clock },
      { href: "/pickup-address", label: "Pickup Address", icon: MapPin },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: User, dot: "orange" as const },
      { href: "/payments", label: "Payments", icon: Wallet },
      { href: "/integrations", label: "POS & Integrations", icon: Webhook },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help Center", icon: HelpCircle },
    ],
  },
];

export function Sidebar({ activePath }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0 h-screen"
      style={{
        width: 280,
        background: "var(--color-cream-deep)",
        borderRight: "1px solid rgba(51,31,46,0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid rgba(51,31,46,0.05)" }}
      >
        <Link href="/dashboard">
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 36 }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
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
            {group.items.map((item) => {
              const isActive = activePath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg transition-colors"
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    padding: "9px 12px",
                    color: isActive
                      ? "var(--color-brown)"
                      : "var(--color-brown-soft)",
                    background: isActive ? "var(--color-cream)" : undefined,
                    boxShadow: isActive
                      ? "0 1px 2px rgba(51,31,46,0.04)"
                      : undefined,
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
                  <Icon size={18} strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && (
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
                  {"dot" in item && item.dot === "orange" && (
                    <span className="dot dot-orange" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer — storefront card */}
      <div className="px-3 pb-4">
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
            style={{ width: 36, height: 36 }}
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
              View My Store
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
