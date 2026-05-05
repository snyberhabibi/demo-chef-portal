"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export function SectionCard({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <div className="heading-sm">{title}</div>
          <div className="caption" style={{ marginTop: 1 }}>{subtitle}</div>
        </div>
        {open ? (
          <ChevronUp size={18} style={{ color: "var(--color-brown-soft-2)" }} />
        ) : (
          <ChevronDown size={18} style={{ color: "var(--color-brown-soft-2)" }} />
        )}
      </button>
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          maxHeight: open ? 3000 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid rgba(51,31,46,0.04)",
          }}
        >
          <div style={{ paddingTop: 16 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
