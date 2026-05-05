/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
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
      {/* Mobile: centered title */}
      <div className="flex-1 lg:hidden" />
      <h1
        className="lg:hidden"
        style={{ fontSize: 16, fontWeight: 600, color: "var(--color-brown)" }}
      >
        {title}
      </h1>

      {/* Desktop: left-aligned title */}
      <h1
        className="hidden lg:block flex-1"
        style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)" }}
      >
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex-1 lg:flex-none flex items-center justify-end gap-2">
        {/* Search — desktop only */}
        <Link
          href="/menu"
          className="hidden lg:flex items-center justify-center rounded-lg transition-colors"
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
          <Search size={18} strokeWidth={1.8} />
        </Link>

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
          className="rounded-full overflow-hidden"
          style={{ width: 44, height: 44 }}
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
