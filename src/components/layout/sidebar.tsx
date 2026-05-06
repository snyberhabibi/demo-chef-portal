/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { navGroups } from "@/lib/constants/navigation";
import { useDesignMode } from "@/lib/design-mode";

interface SidebarProps {
  activePath: string;
}
export function Sidebar({ activePath }: SidebarProps) {
  const { mode } = useDesignMode();
  const isB = mode === "b";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0"
      style={{
        width: collapsed ? 56 : 260,
        height: "100dvh",
        background: "var(--color-cream-deep)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(51,31,46,0.02) 100%)",
        borderRight: "1px solid rgba(51,31,46,0.06)",
        overflow: "hidden",
        transition: `width var(--t-base) var(--ease-spring)`,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center"
        style={{
          padding: 20,
          justifyContent: collapsed ? "center" : "flex-start",
          ...(isB ? { background: "linear-gradient(135deg, rgba(223,71,70,0.04), rgba(241,158,55,0.04))" } : {}),
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
                      paddingLeft: collapsed ? 0 : isActive ? (isB ? 10 : 8) : 10,
                      justifyContent: collapsed ? "center" : "flex-start",
                      gap: collapsed ? 0 : 10,
                      color: isActive
                        ? (isB ? "#fff" : "var(--color-brown)")
                        : "rgba(51,31,46,0.55)",
                      background: isActive
                        ? (isB ? "linear-gradient(135deg, #df4746, #f19e37)" : "var(--color-cream)")
                        : "transparent",
                      borderLeft: isB
                        ? "none"
                        : (isActive
                          ? "2px solid var(--color-red)"
                          : "2px solid transparent"),
                      boxShadow: isActive
                        ? (isB ? "0 2px 8px rgba(223,71,70,0.25)" : "0 1px 2px rgba(51,31,46,0.04)")
                        : "none",
                      transition: `all var(--t-fast) var(--ease-spring)`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = isB ? "rgba(223,71,70,0.08)" : "rgba(250,249,246,0.5)";
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
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex items-center justify-center"
        style={{
          height: 40,
          color: "var(--color-brown-soft-2)",
          background: "transparent",
          borderTop: "1px solid rgba(51,31,46,0.06)",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: "none",
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
