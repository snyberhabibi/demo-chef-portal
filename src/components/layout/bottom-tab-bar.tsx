"use client";

import Link from "next/link";
import {
  Home,
  Receipt,
  UtensilsCrossed,
  User,
  MoreHorizontal,
} from "lucide-react";

interface BottomTabBarProps {
  activePath: string;
  onMore?: () => void;
}

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: Receipt, badge: 2 },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "More", icon: MoreHorizontal },
];

export function BottomTabBar({ activePath, onMore }: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 flex items-center justify-around glass"
      style={{
        height: 56,
        borderTop: "1px solid rgba(51,31,46,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {tabs.map((tab) => {
        const isMore = tab.label === "More";
        const isActive = isMore
          ? false
          : tab.href === "/dashboard"
            ? activePath === "/dashboard" || activePath === "/"
            : activePath.startsWith(tab.href);
        const Icon = tab.icon;

        if (isMore) {
          return (
            <button
              key={tab.href}
              onClick={() => onMore?.()}
              className="flex flex-col items-center justify-center relative"
              style={{
                flex: 1,
                minHeight: 44,
                gap: 2,
                color: "var(--color-brown-soft-2)",
                transition: "color var(--t-fast) var(--ease-spring)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center relative"
            style={{
              flex: 1,
              minHeight: 44,
              gap: 2,
              color: isActive
                ? "var(--color-brown)"
                : "var(--color-brown-soft-2)",
              transition: "color var(--t-fast) var(--ease-spring)",
            }}
          >
            <span className="relative">
              <Icon
                size={20}
                strokeWidth={1.5}
              />
              {"badge" in tab && tab.badge && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    top: -5,
                    right: -10,
                    background: "var(--color-red)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 9999,
                    padding: "0 4px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 600,
              }}
            >
              {tab.label}
            </span>
            {/* Active indicator dot */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--color-red)",
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
