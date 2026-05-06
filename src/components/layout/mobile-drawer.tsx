/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { X, LogOut } from "lucide-react";
import { navGroups } from "@/lib/constants/navigation";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  activePath: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ open, onClose, activePath, triggerRef }: MobileDrawerProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      // Focus close button when drawer opens
      const t = setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => clearTimeout(t);
    } else if (visible) {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 300);
      // Return focus to hamburger trigger when closing
      triggerRef?.current?.focus();
      return () => clearTimeout(timer);
    }
  }, [open, visible, triggerRef]);

  /* Escape key handler */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .drawer-backdrop,
          .drawer-panel {
            transition: none !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="drawer-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(51,31,46,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 60,
          opacity: animating ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleKeyDown}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 280,
          background: "var(--color-cream)",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
          transform: animating ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          overflowY: "auto",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "none",
            border: "none",
            color: "var(--color-brown-soft-2)",
            cursor: "pointer",
          }}
          aria-label="Close navigation"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Logo */}
        <div style={{ padding: "20px 20px 8px" }}>
          <Link href="/dashboard" onClick={onClose}>
            <img
              src="/logo-light.png"
              alt="Yalla Bites"
              style={{ height: 28 }}
            />
          </Link>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: "4px 12px 12px" }}>
          {navGroups.map((group, groupIdx) => (
            <div key={group.label}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {group.items.map((item) => {
                  const isActive = activePath === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center"
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 500,
                        height: 44,
                        borderRadius: 10,
                        padding: isActive ? "0 10px 0 8px" : "0 10px",
                        gap: 10,
                        color: isActive
                          ? "var(--color-brown)"
                          : "rgba(51,31,46,0.55)",
                        background: isActive ? "var(--color-cream-deep)" : "transparent",
                        borderLeft: isActive
                          ? "2px solid var(--color-red)"
                          : "2px solid transparent",
                        boxShadow: isActive
                          ? "0 1px 2px rgba(51,31,46,0.04)"
                          : "none",
                        textDecoration: "none",
                        transition: "all var(--t-fast) var(--ease-spring)",
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        style={{ flexShrink: 0 }}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="badge-count">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — chef avatar + sign out */}
        <div style={{ padding: "0 12px 12px" }}>
          <div
            className="flex items-center"
            style={{
              background: "var(--color-cream-deep)",
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
                href="/login"
                onClick={onClose}
                className="flex items-center gap-1"
                style={{
                  fontSize: 11,
                  color: "var(--color-brown-soft-2)",
                  lineHeight: 1.3,
                  textDecoration: "none",
                }}
              >
                <LogOut size={10} />
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
