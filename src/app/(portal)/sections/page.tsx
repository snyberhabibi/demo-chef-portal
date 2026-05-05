/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { GripVertical, MoreHorizontal, Plus, Check } from "lucide-react";

const SECTIONS = [
  {
    id: 1,
    name: "Best Sellers",
    count: 5,
    active: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=80&h=80&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Main Dishes",
    count: 8,
    active: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=80&h=80&fit=crop",
    ],
  },
  {
    id: 3,
    name: "Appetizers & Sides",
    count: 6,
    active: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=80&h=80&fit=crop",
    ],
  },
  {
    id: 4,
    name: "Desserts",
    count: 4,
    active: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop",
    ],
  },
  {
    id: 5,
    name: "Drinks",
    count: 3,
    active: false,
    thumbnails: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop",
    ],
  },
];

export default function SectionsPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [createFeedback, setCreateFeedback] = useState(false);

  const toggleActive = (id: number) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleCreate = () => {
    setCreateFeedback(true);
    setTimeout(() => setCreateFeedback(false), 2000);
  };

  return (
    <div className="section-stack" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
          {sections.length} sections &middot; Drag to reorder
        </div>
        <button
          className="btn btn-red btn-sm"
          style={{ minHeight: 44, transition: "all 0.15s ease" }}
          onClick={handleCreate}
        >
          {createFeedback ? (
            <>
              <Check size={16} style={{ color: "#fff" }} />
              Created
            </>
          ) : (
            <>
              <Plus size={16} />
              New Section
            </>
          )}
        </button>
      </div>

      {/* Section list */}
      <div className="card" style={{ padding: 0, transition: "box-shadow 0.2s ease" }}>
        {sections.map((section, i) => (
          <div
            key={section.id}
            className="flex items-center gap-3"
            style={{
              padding: "14px 16px",
              borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
              opacity: section.active ? 1 : 0.6,
              transition: "opacity 0.2s ease, background 0.15s ease",
              cursor: "pointer",
              minHeight: 56,
            }}
          >
            {/* Drag handle */}
            <GripVertical
              size={18}
              style={{ color: "var(--color-brown-soft-2)", cursor: "grab", flexShrink: 0 }}
            />

            {/* Section name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{section.name}</div>
            </div>

            {/* Thumbnails */}
            <div className="hidden sm:flex items-center" style={{ gap: -4 }}>
              {section.thumbnails.map((src, j) => (
                <img
                  key={j}
                  src={src}
                  alt=""
                  className="rounded-md object-cover"
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid #fff",
                    marginLeft: j > 0 ? -6 : 0,
                  }}
                />
              ))}
            </div>

            {/* Count badge */}
            <span className="pill pill-mute tnum" style={{ flexShrink: 0 }}>
              {section.count}
            </span>

            {/* Active toggle */}
            <button
              className={`toggle ${section.active ? "is-on" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(section.id);
              }}
              style={{ minWidth: 44, minHeight: 28 }}
            >
              <span className="toggle-thumb" />
            </button>

            {/* More menu */}
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
                transition: "background 0.15s ease",
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
