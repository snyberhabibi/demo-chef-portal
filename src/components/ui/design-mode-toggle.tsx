"use client";

import { useDesignMode } from "@/lib/design-mode";
import { useState } from "react";

export function DesignModeToggle() {
  const { mode, toggle } = useDesignMode();
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    toggle();
    setTimeout(() => setPressed(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Switch to Mode ${mode === "a" ? "B" : "A"}`}
      title={`Switch to Mode ${mode === "a" ? "B" : "A"}`}
      className="design-mode-toggle-btn"
      style={{
        position: "fixed",
        zIndex: 90,
        width: "44px",
        height: "44px",
        borderRadius: "9999px",
        display: "grid",
        placeItems: "center",
        border: "2px dashed",
        borderColor: mode === "a" ? "var(--color-brown-soft-2)" : "#8b5cf6",
        background: mode === "a"
          ? "var(--color-cream-deep)"
          : "linear-gradient(135deg, #8b5cf6, #ec4899)",
        color: mode === "a" ? "var(--color-brown)" : "#fff",
        fontWeight: 800,
        fontSize: "16px",
        fontFamily: "var(--font-display), system-ui, sans-serif",
        cursor: "pointer",
        boxShadow: mode === "a"
          ? "0 2px 8px rgba(51,31,46,0.12)"
          : "0 2px 12px rgba(139,92,246,0.4)",
        transform: pressed ? "scale(0.85)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, background 0.2s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {mode === "a" ? "A" : "B"}
    </button>
  );
}
