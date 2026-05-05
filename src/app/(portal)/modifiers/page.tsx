"use client";

import { useState } from "react";
import { Plus, Flame, Maximize2, PlusCircle, ChevronRight, MoreHorizontal, Check } from "lucide-react";

const TEMPLATES = [
  {
    id: "spice",
    icon: Flame,
    name: "Spice Level",
    desc: "Mild, Medium, Hot, Extra Hot",
    color: "var(--color-red-soft)",
    iconColor: "var(--color-red)",
  },
  {
    id: "size",
    icon: Maximize2,
    name: "Size Options",
    desc: "Small, Regular, Large, Family",
    color: "var(--color-orange-soft)",
    iconColor: "var(--color-orange)",
  },
  {
    id: "addons",
    icon: PlusCircle,
    name: "Add-ons",
    desc: "Extra protein, sauce, toppings",
    color: "var(--color-sage-soft)",
    iconColor: "var(--color-sage)",
  },
];

const MODIFIER_GROUPS = [
  { id: 1, name: "Spice Level", options: 4, usage: 12 },
  { id: 2, name: "Protein Choice", options: 3, usage: 8 },
  { id: 3, name: "Size", options: 3, usage: 6 },
  { id: 4, name: "Extra Toppings", options: 6, usage: 4 },
  { id: 5, name: "Sauce Options", options: 5, usage: 3 },
];

export default function ModifiersPage() {
  const [groups] = useState(MODIFIER_GROUPS);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [createFeedback, setCreateFeedback] = useState(false);

  const handleTemplateClick = (id: string) => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
  };

  const handleCreateGroup = () => {
    setCreateFeedback(true);
    setTimeout(() => setCreateFeedback(false), 2000);
  };

  return (
    <div className="section-stack" style={{ maxWidth: 680 }}>
      {/* Quick-start templates */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Quick-start templates</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                className="card"
                style={{
                  padding: 16,
                  textAlign: "left",
                  border: isSelected ? "2px solid var(--color-red)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease, box-shadow 0.2s ease",
                  minHeight: 44,
                }}
                onClick={() => handleTemplateClick(t.id)}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: t.color,
                    marginBottom: 10,
                    transition: "transform 0.15s ease",
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Icon size={18} style={{ color: t.iconColor }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modifier groups list */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div className="eyebrow">Your Modifier Groups</div>
          <button
            className="btn btn-red btn-sm"
            style={{ minHeight: 44, transition: "all 0.15s ease" }}
            onClick={handleCreateGroup}
          >
            {createFeedback ? (
              <>
                <Check size={16} style={{ color: "#fff" }} />
                Created
              </>
            ) : (
              <>
                <Plus size={16} />
                New Group
              </>
            )}
          </button>
        </div>

        <div className="card" style={{ padding: 0, transition: "box-shadow 0.2s ease" }}>
          {groups.map((g, i) => (
            <div
              key={g.id}
              className="flex items-center gap-3"
              style={{
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
                cursor: "pointer",
                transition: "background 0.15s ease",
                minHeight: 56,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
              </div>

              <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>
                {g.options} options
              </span>

              <span
                style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}
                className="tnum hidden sm:inline"
              >
                Used by {g.usage} dishes
              </span>

              <ChevronRight size={16} style={{ color: "var(--color-brown-soft-2)" }} />

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
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
