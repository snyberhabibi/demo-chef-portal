/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";

interface Section {
  id: number;
  name: string;
  dishCount: number;
  active: boolean;
}

const INITIAL_SECTIONS: Section[] = [
  { id: 1, name: "Ramadan Specials", dishCount: 5, active: true },
  { id: 2, name: "Weekly Specials", dishCount: 3, active: true },
  { id: 3, name: "Catering Menu", dishCount: 8, active: true },
  { id: 4, name: "Limited Time", dishCount: 2, active: false },
];

export default function SectionsPage() {
  const [sections] = useState<Section[]>(INITIAL_SECTIONS);

  return (
    <div className="section-stack" style={{ maxWidth: 720 }}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="fraunces" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              Custom Menu Sections
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0 0" }}>
              Drag to reorder how sections appear on your store-front
            </p>
          </div>
          <button
            className="btn"
            style={{
              background: "var(--color-brown)",
              color: "#fff",
              borderColor: "var(--color-brown)",
            }}
          >
            <Plus size={16} strokeWidth={2} />
            Create Section
          </button>
        </div>
      </div>

      {/* Section list */}
      <div className="card" style={{ padding: 0 }}>
        {sections.map((section, i) => (
          <div
            key={section.id}
            className="flex items-center gap-3"
            style={{
              padding: "14px 16px",
              borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
              transition: "background 0.15s",
              cursor: "pointer",
              minHeight: 60,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "var(--color-cream-deep)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            {/* Drag handle */}
            <GripVertical
              size={18}
              style={{
                color: "var(--color-brown-soft-2)",
                cursor: "grab",
                flexShrink: 0,
              }}
            />

            {/* Section name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-brown)" }}>
                {section.name}
              </div>
            </div>

            {/* Dish count */}
            <span
              className="tnum"
              style={{
                fontSize: 13,
                color: "var(--color-brown-soft)",
                flexShrink: 0,
              }}
            >
              {section.dishCount} dishes
            </span>

            {/* Status badge */}
            <span
              className={`pill ${section.active ? "pill-sage" : "pill-orange"}`}
              style={{
                flexShrink: 0,
                fontSize: 11,
              }}
            >
              {section.active ? "Active" : "Inactive"}
            </span>

            {/* 3-dot menu */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--color-brown-soft-2)",
                padding: 4,
                cursor: "pointer",
                minWidth: 44,
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
