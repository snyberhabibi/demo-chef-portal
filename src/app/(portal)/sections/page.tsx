/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

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

let nextId = 5;

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCreateSection = () => {
    const newSection: Section = {
      id: nextId++,
      name: `New Section ${sections.length + 1}`,
      dishCount: 0,
      active: true,
    };
    setSections((prev) => [...prev, newSection]);
    toast("Section created");
  };

  return (
    <div className="content-default section-stack page-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Custom Menu Sections</h1>
          <p className="body-sm" style={{ marginTop: 4 }}>
            Organize how sections appear on your store-front
          </p>
        </div>
        <button className="btn btn-dark" onClick={handleCreateSection}>
          <Plus size={16} strokeWidth={2.2} />
          Create Section
        </button>
      </div>

      {/* Section List */}
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
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--color-cream-deep)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              {/* Order number */}
              <span
                className="tnum"
                style={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  background: "var(--color-cream-sunken)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-brown-soft-2)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>

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
              <div style={{ position: "relative", flexShrink: 0 }}>
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
                    transition: "color var(--t-fast)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === section.id ? null : section.id);
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>

                {/* Dropdown */}
                {openMenuId === section.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      right: 0,
                      width: 140,
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 4px 16px rgba(51,31,46,0.12)",
                      overflow: "hidden",
                      zIndex: 20,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast(`Renamed: ${section.name}`);
                        setOpenMenuId(null);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-brown)",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid rgba(51,31,46,0.06)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast(`Deleted: ${section.name}`);
                        setSections((prev) => prev.filter((s) => s.id !== section.id));
                        setOpenMenuId(null);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-red)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
