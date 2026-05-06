"use client";

import Link from "next/link";
import {
  Home,
  Receipt,
  UtensilsCrossed,
  Star,
  User,
} from "lucide-react";
import { orders } from "@/lib/mock-data";
import { useDesignMode } from "@/lib/design-mode";

interface BottomTabBarProps {
  activePath: string;
  onMore?: () => void;
}

const newOrderCount = orders.filter((o) => o.status === "paid").length;

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: Receipt, badge: newOrderCount > 0 ? newOrderCount : undefined },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomTabBar({ activePath }: BottomTabBarProps) {
  const { mode } = useDesignMode();
  const isB = mode === "b";

  const activeColor = "#352431";
  const inactiveColor = "var(--color-brown-soft-2)";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 flex items-center justify-around"
      style={{
        height: 56,
        background: "#fafaf8",
        borderTop: "1px solid rgba(51,31,46,0.06)",
        paddingTop: 4,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/dashboard"
            ? activePath === "/dashboard" || activePath === "/"
            : activePath.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center relative"
            style={{
              flex: 1,
              minHeight: 44,
              gap: 2,
              color: isActive ? activeColor : inactiveColor,
              transition: "color var(--t-fast) var(--ease-spring)",
            }}
          >
            <span className="relative">
              <Icon
                size={20}
                strokeWidth={isActive ? 1.8 : 1.5}
              />
              {"badge" in tab && tab.badge && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    top: -4,
                    right: -10,
                    background: "#df4746",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 9999,
                    padding: "0 5px",
                    fontVariantNumeric: "tabular-nums",
                    boxShadow: "0 1px 3px rgba(223,71,70,0.3)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: isActive ? "0.01em" : "0.02em",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
