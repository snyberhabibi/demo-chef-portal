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
    <div className="content-default section-stack page-fade">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Custom Menu Sections</h1>
          <p className="body-sm" style={{ marginTop: 4 }}>
            Drag to reorder how sections appear on your store-front
          </p>
        </div>
        <button className="btn btn-dark">
          <Plus size={16} strokeWidth={2.2} />
          Create Section
        </button>
      </div>

      {/* ── Section List ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {sections.map((section, i) => (
          <div key={section.id}>
            {/* Divider between rows */}
            {i > 0 && <div className="divider" />}

            <div
              className="flex items-center gap-3 group"
              style={{
                padding: "0 16px",
                minHeight: 52,
                transition: "background var(--t-fast)",
                cursor: "pointer",
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
                size={16}
                style={{
                  color: "var(--color-brown-soft-2)",
                  cursor: "grab",
                  flexShrink: 0,
                  opacity: 0.5,
                }}
              />

              {/* Section name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="heading-sm" style={{ fontSize: 15 }}>
                  {section.name}
                </div>
              </div>

              {/* Dish count */}
              <span className="caption tnum" style={{ flexShrink: 0 }}>
                {section.dishCount} dishes
              </span>

              {/* Status badge */}
              <span
                className={`pill ${section.active ? "pill-sage" : "pill-orange"}`}
                style={{ flexShrink: 0, fontSize: 11 }}
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
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  flexShrink: 0,
                  transition: "color var(--t-fast)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
