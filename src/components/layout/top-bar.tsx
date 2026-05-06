/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useDesignMode } from "@/lib/design-mode";

interface TopBarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMobileMenuToggle?: () => void;
  hamburgerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function TopBar({ title, breadcrumbs, onMobileMenuToggle, hamburgerRef }: TopBarProps) {
  const { mode } = useDesignMode();
  const isB = mode === "b";
  const { toast } = useToast();

  return (
    <header
      className="sticky top-0 z-30 flex items-center glass"
      style={{
        minHeight: 52,
        borderBottom: "1px solid rgba(51,31,46,0.06)",
        padding: "0 16px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Mobile: hamburger left, title center */}
      <button
        ref={hamburgerRef}
        className="lg:hidden flex items-center justify-center rounded-lg"
        style={{
          width: 44,
          height: 44,
          color: "var(--color-brown-soft-2)",
          background: "transparent",
          border: "none",
          transition: `all var(--t-fast) var(--ease-spring)`,
        }}
        onClick={onMobileMenuToggle}
        aria-label="Open navigation menu"
      >
        <Menu size={18} strokeWidth={1.5} />
      </button>
      <h1
        className="lg:hidden flex-1 text-center truncate"
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--color-brown)",
        }}
      >
        {title}
      </h1>

      {/* Desktop: breadcrumb trail on left */}
      <div className="hidden lg:flex items-center flex-1 min-w-0 gap-1.5">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown-soft-2)",
                      userSelect: "none",
                    }}
                  >
                    /
                  </span>
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-brown-soft-2)",
                      transition: `color var(--t-fast)`,
                    }}
                    className="hover:underline truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="truncate"
                    style={{
                      fontSize: 13,
                      fontWeight: isLast ? 600 : 500,
                      color: isLast
                        ? "var(--color-brown)"
                        : "var(--color-brown-soft-2)",
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })
        ) : (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-brown)",
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Cmd+K search pill — desktop only */}
        <button
          className="hidden lg:flex items-center gap-1.5 rounded-lg"
          style={{
            height: 28,
            padding: "0 10px",
            background: isB ? "transparent" : "var(--color-cream-sunken)",
            border: isB ? "1.5px solid #df4746" : "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--color-brown-soft-2)",
            fontWeight: 500,
            transition: `all var(--t-fast) var(--ease-spring)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              isB ? "rgba(223,71,70,0.06)" : "rgba(51,31,46,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              isB ? "transparent" : "var(--color-cream-sunken)";
          }}
          aria-label="Search"
          onClick={() => toast("Search coming soon", "info")}
        >
          <span style={{ fontSize: 11 }}>&#x2318;K</span>
        </button>

        {/* Bell with red dot */}
        <Link
          href="/orders"
          aria-label="Notifications - 3 new"
          className="relative flex items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            color: "var(--color-brown-soft-2)",
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
          <Bell size={18} strokeWidth={1.5} />
          <span
            className="absolute"
            style={{
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#df4746",
              border: "1.5px solid rgba(250,249,246,0.88)",
            }}
          />
        </Link>

        {/* Avatar — 44px touch area, 28px visual */}
        <Link
          href="/profile"
          aria-label="Your profile"
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 44, height: 44 }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 28, height: 28 }}
          >
            <img
              src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
