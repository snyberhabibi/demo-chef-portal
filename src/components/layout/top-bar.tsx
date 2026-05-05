/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Bell, Search, Menu } from "lucide-react";

interface TopBarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMobileMenuToggle?: () => void;
}

export function TopBar({ title, breadcrumbs, onMobileMenuToggle }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center"
      style={{
        height: 56,
        background: "rgba(250,249,246,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(51,31,46,0.06)",
        padding: "0 16px",
      }}
    >
      {/* Mobile: hamburger left, title center */}
      <button
        className="lg:hidden flex items-center justify-center rounded-lg"
        style={{
          width: 44,
          height: 44,
          color: "var(--color-brown-soft)",
          background: "transparent",
          border: "none",
        }}
        onClick={onMobileMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>
      <h1
        className="lg:hidden flex-1 text-center truncate"
        style={{ fontSize: 16, fontWeight: 600, color: "var(--color-brown)" }}
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
                    &gt;
                  </span>
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-brown-soft-2)",
                    }}
                    className="hover:underline truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="truncate"
                    style={{
                      fontSize: 14,
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
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-brown)",
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Search — desktop only */}
        <button
          className="hidden lg:flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: 44,
            height: 44,
            color: "var(--color-brown-soft)",
            background: "transparent",
            border: "none",
          }}
          aria-label="Search"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(51,31,46,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
          }}
        >
          <Search size={18} strokeWidth={1.8} />
        </button>

        {/* Bell with red dot — links to orders */}
        <Link
          href="/orders"
          className="relative flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: 44,
            height: 44,
            color: "var(--color-brown-soft)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(51,31,46,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
          }}
        >
          <Bell size={18} strokeWidth={1.8} />
          <span
            className="absolute"
            style={{
              top: 10,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-red)",
              border: "2px solid rgba(250,249,246,0.85)",
            }}
          />
        </Link>

        {/* Avatar — links to settings */}
        <Link
          href="/settings"
          className="rounded-full overflow-hidden flex-shrink-0"
          style={{ width: 36, height: 36 }}
        >
          <img
            src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
