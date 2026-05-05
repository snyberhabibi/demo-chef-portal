/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

const categoryOptions = [
  { emoji: "\uD83C\uDF56", label: "Mains" },
  { emoji: "\uD83C\uDF70", label: "Desserts" },
  { emoji: "\uD83E\uDD57", label: "Mezze" },
  { emoji: "\uD83E\uDD64", label: "Beverages" },
  { emoji: "\uD83E\uDDC6", label: "Sides" },
  { emoji: "\uD83C\uDF5E", label: "Bread" },
] as const;

const sizeTemplates = ["Single", "Family", "Catering"] as const;

const collapsedSections = [
  { label: "DIETARY & ALLERGENS", number: 4 },
  { label: "AVAILABILITY", number: 5 },
  { label: "MODIFIERS & ADD-ONS", number: 6 },
] as const;

interface SizeRow {
  id: number;
  type: string;
  name: string;
  price: string;
}

export default function CreateDishPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Mains");
  const [leadTime, setLeadTime] = useState(24);
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("middle-eastern");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSizeTemplate, setActiveSizeTemplate] = useState("Single");
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([
    { id: 1, type: "portion", name: "Regular", price: "14.00" },
  ]);
  const [nextSizeId, setNextSizeId] = useState(2);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const addSizeRow = () => {
    setSizeRows((prev) => [
      ...prev,
      { id: nextSizeId, type: "portion", name: "", price: "" },
    ]);
    setNextSizeId((prev) => prev + 1);
  };

  const removeSizeRow = (id: number) => {
    setSizeRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateSizeRow = (id: number, field: keyof SizeRow, value: string) => {
    setSizeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const hasErrors = dishName.trim().length === 0;

  return (
    <div className="section-stack" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/menu"
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            color: "var(--color-brown-soft)",
            background: "rgba(51,31,46,0.04)",
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-brown)" }}>
          Create Dish
        </h1>
        <span className="pill pill-orange">Draft</span>
        <div className="flex-1" />
        <span
          className="flex items-center gap-1"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-sage-deep)",
          }}
        >
          <Check size={14} strokeWidth={2.5} />
          Saved
        </span>
      </div>

      {/* Publish warning */}
      {hasErrors ? (
        <button
          className="btn btn-amber btn-sm"
          style={{ opacity: 0.5, cursor: "not-allowed", width: "100%", minHeight: 44 }}
          disabled
        >
          Fix {dishName.trim().length === 0 ? 3 : 2} issues to publish
        </button>
      ) : (
        <button
          className="btn btn-sage btn-sm"
          style={{ width: "100%", minHeight: 44 }}
          onClick={() => router.push("/menu")}
        >
          Ready to publish
        </button>
      )}

      {/* Content: main + desktop preview */}
      <div className="flex gap-6 items-start">
        {/* Left / Main form */}
        <div className="flex-1 min-w-0 section-stack">
          {/* Section 1: THE BASICS */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              The Basics
            </div>
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  className={`input${dishName.trim().length === 0 ? " error" : ""}`}
                  placeholder="e.g. Grandma's Kibbeh"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  style={
                    dishName.trim().length === 0
                      ? { borderColor: "var(--color-red)" }
                      : undefined
                  }
                />
                {dishName.trim().length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-red)",
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    Give your dish a name.
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Description
                </label>
                <textarea
                  className="textarea"
                  placeholder="Tell customers what makes this dish special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  rows={3}
                />
                <div
                  className="tnum"
                  style={{
                    fontSize: 11,
                    color: "var(--color-brown-soft-2)",
                    textAlign: "right",
                    marginTop: 4,
                  }}
                >
                  {description.length}/300
                </div>
              </div>

              {/* Category grid */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categoryOptions.map((cat) => {
                    const isSelected = cat.label === selectedCategory;
                    return (
                      <button
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className="flex flex-col items-center justify-center rounded-xl"
                        style={{
                          padding: "14px 8px",
                          minHeight: 44,
                          border: isSelected
                            ? "2px solid var(--color-orange)"
                            : "1px solid rgba(51,31,46,0.1)",
                          background: isSelected
                            ? "var(--color-orange-soft)"
                            : "#fff",
                          cursor: "pointer",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isSelected
                              ? "var(--color-orange-text)"
                              : "var(--color-brown)",
                            marginTop: 4,
                          }}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuisine select */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Cuisine
                </label>
                <div className="relative">
                  <select
                    className="select"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      paddingRight: 36,
                      borderRadius: 8,
                      border: "1px solid var(--color-brown-soft-2)",
                      background: "#fff",
                      color: "var(--color-brown)",
                      fontSize: 16,
                      appearance: "none",
                      minHeight: 44,
                    }}
                  >
                    <option value="middle-eastern">Middle Eastern</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="levantine">Levantine</option>
                    <option value="north-african">North African</option>
                  </select>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className="absolute"
                    style={{
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-brown-soft-2)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Lead time stepper */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Lead Time (hours)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLeadTime(Math.max(1, leadTime - 1))}
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      border: "1px solid rgba(51,31,46,0.15)",
                      background: "#fff",
                      color: "var(--color-brown)",
                    }}
                  >
                    <Minus size={16} strokeWidth={2} />
                  </button>
                  <span
                    className="mono"
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      minWidth: 40,
                      textAlign: "center",
                    }}
                  >
                    {leadTime}
                  </span>
                  <button
                    onClick={() => setLeadTime(leadTime + 1)}
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      minHeight: 44,
                      border: "1px solid rgba(51,31,46,0.15)",
                      background: "#fff",
                      color: "var(--color-brown)",
                    }}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: PHOTOS */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Photos
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="flex flex-col items-center justify-center rounded-xl"
                  style={{
                    aspectRatio: "1/1",
                    border: "2px dashed rgba(51,31,46,0.15)",
                    background: "var(--color-cream-deep)",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    minHeight: 44,
                  }}
                >
                  <Upload
                    size={20}
                    strokeWidth={1.8}
                    style={{ color: "var(--color-brown-soft-2)" }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--color-brown-soft-2)",
                      marginTop: 6,
                    }}
                  >
                    {i === 0 ? "Main photo" : "Add photo"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: SIZES & PRICING */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Sizes & Pricing
            </div>

            {/* Template pills */}
            <div className="flex gap-2 flex-wrap" style={{ marginBottom: 12 }}>
              {sizeTemplates.map((tpl) => {
                const isActive = tpl === activeSizeTemplate;
                return (
                  <button
                    key={tpl}
                    onClick={() => setActiveSizeTemplate(tpl)}
                    className="pill"
                    style={{
                      cursor: "pointer",
                      minHeight: 44,
                      border: "1px solid rgba(51,31,46,0.12)",
                      background: isActive
                        ? "var(--color-brown)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-cream)"
                        : "var(--color-brown-soft)",
                    }}
                  >
                    {tpl}
                  </button>
                );
              })}
            </div>

            {/* Size rows */}
            <div className="flex flex-col gap-2">
              {sizeRows.map((row) => (
                <div
                  key={row.id}
                  className="bg-white rounded-xl"
                  style={{
                    padding: 12,
                    border: "1px solid rgba(51,31,46,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <div
                      className="relative"
                      style={{ flex: "1 1 100px", minWidth: 80 }}
                    >
                      <select
                        className="select"
                        value={row.type}
                        onChange={(e) =>
                          updateSizeRow(row.id, "type", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          paddingRight: 28,
                          borderRadius: 8,
                          border: "1px solid rgba(51,31,46,0.12)",
                          background: "#fff",
                          color: "var(--color-brown)",
                          fontSize: 13,
                          appearance: "none",
                          minHeight: 44,
                        }}
                      >
                        <option value="portion">Portion</option>
                        <option value="box">Box</option>
                        <option value="tray">Tray</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute"
                        style={{
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--color-brown-soft-2)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Size name"
                      value={row.name}
                      onChange={(e) =>
                        updateSizeRow(row.id, "name", e.target.value)
                      }
                      className="input"
                      style={{
                        flex: "1 1 100px",
                        minWidth: 80,
                        padding: "8px 10px",
                        fontSize: 13,
                        minHeight: 44,
                      }}
                    />
                    <div className="relative" style={{ width: 90 }}>
                      <span
                        className="absolute"
                        style={{
                          left: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 13,
                          color: "var(--color-brown-soft-2)",
                        }}
                      >
                        $
                      </span>
                      <input
                        type="text"
                        value={row.price}
                        onChange={(e) =>
                          updateSizeRow(row.id, "price", e.target.value)
                        }
                        className="input tnum"
                        style={{
                          padding: "8px 10px 8px 22px",
                          fontSize: 13,
                          width: "100%",
                          minHeight: 44,
                        }}
                      />
                    </div>
                    <button
                      onClick={() => removeSizeRow(row.id)}
                      className="flex items-center justify-center rounded-lg"
                      style={{
                        width: 44,
                        height: 44,
                        minWidth: 44,
                        minHeight: 44,
                        color: "var(--color-red)",
                        background: "var(--color-red-soft)",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add another size */}
            <button
              onClick={addSizeRow}
              className="flex items-center gap-1"
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-red)",
                background: "none",
                border: "none",
                padding: "10px 0",
                minHeight: 44,
                cursor: "pointer",
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Add another size
            </button>
          </div>

          {/* Collapsed sections 4-6 */}
          {collapsedSections.map((section) => (
            <button
              key={section.label}
              onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full"
              style={{
                padding: "14px 0",
                borderTop: "1px solid var(--color-cream-sunken)",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--color-cream-sunken)",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              <span className="eyebrow">{section.label}</span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                style={{
                  color: "var(--color-brown-soft-2)",
                  transform: expandedSections.includes(section.label)
                    ? "rotate(180deg)"
                    : undefined,
                  transition: "transform 0.2s",
                }}
              />
            </button>
          ))}
        </div>

        {/* Right: Desktop preview column */}
        <div
          className="hidden lg:block sticky"
          style={{
            width: 360,
            flexShrink: 0,
            top: 84,
            alignSelf: "flex-start",
          }}
        >
          <div
            className="rounded-2xl"
            style={{
              background: "var(--color-cream-deep)",
              padding: 20,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Preview
            </div>
            {/* Mock dish preview card */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div
                className="placeholder-img"
                style={{ aspectRatio: "4/3", fontSize: 28 }}
              >
                <span style={{ opacity: 0.4 }}>
                  <Upload size={32} strokeWidth={1.5} />
                </span>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                  }}
                >
                  {dishName || "Your Dish Name"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-brown-soft-2)",
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {description || "A short description of your dish will appear here..."}
                </div>
                <div
                  className="flex items-center justify-between"
                  style={{ marginTop: 10 }}
                >
                  <span
                    className="fraunces"
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    ${sizeRows[0]?.price || "0.00"}
                  </span>
                  <span className="pill pill-orange" style={{ fontSize: 11 }}>
                    Draft
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  style={{ marginTop: 8 }}
                >
                  <span
                    className="pill pill-mute"
                    style={{ fontSize: 11 }}
                  >
                    {selectedCategory}
                  </span>
                  <span
                    className="pill pill-mute"
                    style={{ fontSize: 11 }}
                  >
                    {leadTime}h lead
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div
        className="flex items-center gap-3 justify-end"
        style={{
          paddingTop: 8,
          borderTop: "1px solid var(--color-cream-sunken)",
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => router.push("/menu")}
          style={{ minHeight: 44 }}
        >
          Save as Draft
        </button>
        <button
          className="btn btn-red"
          onClick={() => router.push("/menu")}
          style={{ minHeight: 44 }}
        >
          {hasErrors ? "Fix issues" : "Publish"}
        </button>
      </div>
    </div>
  );
}
