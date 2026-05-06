"use client";

import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
}

/**
 * Welcoming empty state for "New Applicant" demo mode.
 * Warm minimalism: centered, serif heading, generous padding,
 * aubergine CTA, terracotta/brown icon.
 */
export function EmptyState({ icon: Icon, heading, subtitle, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "60px 24px",
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(161,120,97,0.08)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(161,120,97,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Icon
          size={28}
          strokeWidth={1.5}
          style={{ color: "var(--color-terracotta, #a17861)" }}
        />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-serif, Georgia, serif)",
          fontSize: 22,
          fontWeight: 500,
          color: "var(--color-brown, #331f2e)",
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-brown-soft, #6b5a64)",
          margin: "0 0 24px",
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "#352431",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(53,36,49,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
