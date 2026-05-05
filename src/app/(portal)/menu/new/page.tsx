/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Dish Details", desc: "Name, description, category & cuisine" },
  { num: 2, label: "Media", desc: "Photos & gallery" },
  { num: 3, label: "Specs & Portions", desc: "Sizes, dietary & allergens" },
  { num: 4, label: "Availability", desc: "Schedule & stock limits" },
  { num: 5, label: "Customizations", desc: "Modifiers & add-ons" },
];

const categoryOptions = [
  { emoji: "\u{1F951}", label: "Appetizers" },
  { emoji: "\u{1F356}", label: "Main Dishes" },
  { emoji: "\u{1F372}", label: "Soups" },
  { emoji: "\u{1F957}", label: "Salads" },
  { emoji: "\u{1F35E}", label: "Bakery" },
  { emoji: "\u{1F353}", label: "Pastries" },
  { emoji: "\u{1F370}", label: "Desserts" },
  { emoji: "\u2615", label: "Coffee" },
  { emoji: "\u{1F37A}", label: "Drinks" },
];

const cuisineOptions = [
  "Palestinian",
  "Lebanese",
  "Jordanian",
  "Iraqi",
  "Mexican",
  "Indian",
  "Italian",
  "American",
];

const spiceLevels = ["None", "Mild", "Medium", "Hot", "Extra Hot"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface SizeRow {
  id: number;
  portionLabel: string;
  size: string;
  price: string;
}

export default function CreateDishPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Dish Details
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [leadTime, setLeadTime] = useState("");
  const [leadTimeUnit, setLeadTimeUnit] = useState("hours");

  // Step 3: Specs & Portions
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([
    { id: 1, portionLabel: "", size: "", price: "" },
  ]);
  const [nextSizeId, setNextSizeId] = useState(2);

  // Step 4: Availability
  const [maxQty, setMaxQty] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
  ]);

  // Step 5: Customizations
  const [customGroups] = useState<string[]>([]);

  const addSizeRow = () => {
    setSizeRows((prev) => [
      ...prev,
      { id: nextSizeId, portionLabel: "", size: "", price: "" },
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

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const progress = (currentStep / 5) * 100;
  const firstPrice = sizeRows[0]?.price || "0.00";

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 flex-wrap"
        style={{
          padding: "16px 0",
          borderBottom: "1px solid var(--color-cream-sunken)",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-brown)" }}>
          Create New Dish
        </h1>
        <span
          className="tnum"
          style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
        >
          Step {currentStep} of 5
        </span>
        <span className="pill pill-orange" style={{ fontSize: 11 }}>
          Draft
        </span>
        <div className="flex-1" />
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => router.push("/menu")}
        >
          Discard
        </button>
        <button
          className="btn btn-sm"
          style={{
            background: "var(--color-brown)",
            color: "#fff",
            borderColor: "var(--color-brown)",
          }}
          onClick={() => router.push("/menu")}
        >
          Save Dish
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left sidebar (desktop) */}
        <div
          className="hidden lg:block sticky"
          style={{
            width: 240,
            flexShrink: 0,
            top: 84,
            alignSelf: "flex-start",
          }}
        >
          {/* Steps */}
          <div className="flex flex-col gap-1" style={{ marginBottom: 20 }}>
            {STEPS.map((step) => {
              const isCompleted = step.num < currentStep;
              const isCurrent = step.num === currentStep;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className="flex items-start gap-3"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isCurrent ? "var(--color-cream-deep)" : "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    width: "100%",
                  }}
                >
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                      background: isCompleted
                        ? "var(--color-sage)"
                        : isCurrent
                        ? "var(--color-brown)"
                        : "var(--color-cream-sunken)",
                      color: isCompleted || isCurrent ? "#fff" : "var(--color-brown-soft)",
                    }}
                  >
                    {isCompleted ? <Check size={13} strokeWidth={3} /> : step.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isCurrent ? "var(--color-brown)" : "var(--color-brown-soft)",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-brown-soft-2)",
                        marginTop: 1,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-brown-soft)" }}>
                Progress
              </span>
              <span className="tnum" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-brown-soft)" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "var(--color-cream-sunken)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--color-sage)",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Preview card */}
          <div
            style={{
              background: "var(--color-cream-deep)",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Preview
            </div>
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div
                className="placeholder-img"
                style={{ aspectRatio: "4/3", fontSize: 28 }}
              >
                <span style={{ opacity: 0.4 }}>
                  <Upload size={28} strokeWidth={1.5} />
                </span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                  }}
                >
                  {dishName || "Your Dish Name"}
                </div>
                {selectedCategory && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-brown-soft-2)",
                      marginTop: 2,
                    }}
                  >
                    {selectedCategory}
                  </div>
                )}
                <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
                  <span
                    className="tnum"
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    ${firstPrice || "0.00"}
                  </span>
                  <span className="pill pill-orange" style={{ fontSize: 10 }}>
                    {status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip box */}
          <div
            style={{
              background: "rgba(252,157,53,0.12)",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Lightbulb
              size={16}
              strokeWidth={2}
              style={{ color: "var(--color-orange)", flexShrink: 0, marginTop: 1 }}
            />
            <span style={{ fontSize: 12, color: "var(--color-orange-text)", lineHeight: 1.5 }}>
              Tip: Dishes with clear, descriptive names get 40% more orders.
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0" style={{ paddingBottom: 100 }}>
          {/* Step 1: Dish Details */}
          {currentStep === 1 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 1 &mdash; Dish Details
              </div>
              <div className="flex flex-col gap-5">
                {/* Dish Name */}
                <div>
                  <label style={labelStyle}>Dish Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Traditional Shawarma Plate"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea
                    className="textarea"
                    placeholder="Describe the ingredients and flavors..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Cuisine */}
                <div>
                  <label style={labelStyle}>Cuisine *</label>
                  <div className="relative">
                    <select
                      className="select"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      style={{ appearance: "none", paddingRight: 36 }}
                    >
                      <option value="">Select cuisine</option>
                      {cuisineOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
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

                {/* Category */}
                <div>
                  <label style={labelStyle}>Category *</label>
                  <div className="relative">
                    <select
                      className="select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ appearance: "none", paddingRight: 36 }}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.label} value={cat.label}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
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

                {/* Status */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <div className="relative">
                    <select
                      className="select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ appearance: "none", paddingRight: 36 }}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <ChevronDown
                      size={16}
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

                {/* Lead Time */}
                <div>
                  <label style={labelStyle}>Lead Time *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input tnum"
                      placeholder="e.g., 2.5"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      style={{ flex: "1 1 120px" }}
                    />
                    <div className="relative" style={{ flex: "0 0 120px" }}>
                      <select
                        className="select"
                        value={leadTimeUnit}
                        onChange={(e) => setLeadTimeUnit(e.target.value)}
                        style={{ appearance: "none", paddingRight: 36 }}
                      >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                      <ChevronDown
                        size={16}
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
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-brown-soft-2)",
                      marginTop: 6,
                    }}
                  >
                    How far in advance customers need to order
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 2 &mdash; Media
              </div>

              {/* Upload zone */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  border: "2px dashed rgba(51,31,46,0.2)",
                  borderRadius: 16,
                  height: 200,
                  background: "var(--color-cream-deep)",
                  cursor: "pointer",
                }}
              >
                <Upload
                  size={28}
                  strokeWidth={1.5}
                  style={{ color: "var(--color-brown-soft-2)", marginBottom: 8 }}
                />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    marginBottom: 4,
                  }}
                >
                  Drag and drop or click to upload
                </div>
                <div style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>
                  Up to 4 images &middot; PNG, JPG &middot; Max 25MB each
                </div>
              </div>

              {/* Image slots */}
              <div className="grid grid-cols-2 gap-3" style={{ marginTop: 16 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center rounded-xl"
                    style={{
                      aspectRatio: "1/1",
                      border: "2px dashed rgba(51,31,46,0.12)",
                      background: "var(--color-cream-deep)",
                      cursor: "pointer",
                      position: "relative",
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
                      {i === 0 ? "Primary" : "Add photo"}
                    </span>
                    {i === 0 && (
                      <span
                        className="pill pill-sage"
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          fontSize: 10,
                        }}
                      >
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Specs & Portions */}
          {currentStep === 3 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 3 &mdash; Specs & Portions
              </div>

              {/* Spice Level */}
              <div>
                <label style={labelStyle}>Spice Level</label>
                <div className="flex gap-2 flex-wrap">
                  {spiceLevels.map((level) => {
                    const isActive = level === spiceLevel;
                    return (
                      <button
                        key={level}
                        onClick={() => setSpiceLevel(level)}
                        className="pill"
                        style={{
                          cursor: "pointer",
                          background: isActive ? "var(--color-brown)" : "transparent",
                          color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                          border: `1px solid ${isActive ? "var(--color-brown)" : "rgba(51,31,46,0.12)"}`,
                          minHeight: 36,
                          fontSize: 13,
                        }}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Portion Sizes */}
              <div style={{ marginTop: 20 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Portion Sizes *</label>
                  <button
                    onClick={addSizeRow}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 12 }}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    Add
                  </button>
                </div>

                {/* Header row */}
                <div
                  className="flex items-center gap-2"
                  style={{
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-brown-soft-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <div style={{ flex: "1 1 140px" }}>Portion Label</div>
                  <div style={{ flex: "1 1 100px" }}>Size</div>
                  <div style={{ width: 100 }}>Price</div>
                  <div style={{ width: 44 }} />
                </div>

                {/* Size rows */}
                <div className="flex flex-col gap-2" style={{ marginTop: 4 }}>
                  {sizeRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center gap-2 bg-white rounded-xl"
                      style={{
                        padding: "8px 12px",
                        border: "1px solid rgba(51,31,46,0.08)",
                      }}
                    >
                      <div className="relative" style={{ flex: "1 1 140px" }}>
                        <select
                          className="select"
                          value={row.portionLabel}
                          onChange={(e) =>
                            updateSizeRow(row.id, "portionLabel", e.target.value)
                          }
                          style={{
                            appearance: "none",
                            paddingRight: 28,
                            fontSize: 13,
                            padding: "8px 10px",
                            minHeight: 40,
                          }}
                        >
                          <option value="">Select</option>
                          <option value="portion">Portion</option>
                          <option value="box">Box</option>
                          <option value="tray">Tray</option>
                          <option value="plate">Plate</option>
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
                        placeholder="e.g., Regular"
                        value={row.size}
                        onChange={(e) =>
                          updateSizeRow(row.id, "size", e.target.value)
                        }
                        className="input"
                        style={{
                          flex: "1 1 100px",
                          padding: "8px 10px",
                          fontSize: 13,
                          minHeight: 40,
                        }}
                      />
                      <div className="relative" style={{ width: 100 }}>
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
                          placeholder="0.00"
                          style={{
                            padding: "8px 10px 8px 22px",
                            fontSize: 13,
                            width: "100%",
                            minHeight: 40,
                          }}
                        />
                      </div>
                      <button
                        onClick={() => removeSizeRow(row.id)}
                        className="flex items-center justify-center rounded-lg"
                        style={{
                          width: 40,
                          height: 40,
                          minWidth: 40,
                          color: "var(--color-red)",
                          background: "var(--color-red-soft)",
                          flexShrink: 0,
                          border: "none",
                        }}
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients placeholder */}
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Ingredients</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select ingredients..."
                  readOnly
                />
              </div>

              {/* Allergens placeholder */}
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Allergens</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select allergens..."
                  readOnly
                />
              </div>

              {/* Dietary labels placeholder */}
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Dietary Labels</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select dietary labels..."
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Step 4: Availability */}
          {currentStep === 4 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 4 &mdash; Availability
              </div>

              {/* Max Quantity */}
              <div>
                <label style={labelStyle}>Max Quantity Per Day</label>
                <input
                  type="number"
                  className="input tnum"
                  placeholder="Leave empty for unlimited"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                />
              </div>

              {/* Available Days */}
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Available Days</label>
                <div className="flex gap-2 flex-wrap">
                  {daysOfWeek.map((day) => {
                    const isActive = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className="pill"
                        style={{
                          cursor: "pointer",
                          minWidth: 52,
                          justifyContent: "center",
                          background: isActive ? "var(--color-brown)" : "transparent",
                          color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                          border: `1px solid ${isActive ? "var(--color-brown)" : "rgba(51,31,46,0.12)"}`,
                          minHeight: 36,
                          fontSize: 13,
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Customizations */}
          {currentStep === 5 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 5 &mdash; Customizations
              </div>

              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: 0 }}>
                  Add customization groups for modifiers and add-ons
                </p>
                <button className="btn btn-ghost btn-sm">
                  <Plus size={14} strokeWidth={2.5} />
                  Add Group
                </button>
              </div>

              {customGroups.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "var(--color-brown-soft-2)",
                    fontSize: 14,
                    background: "var(--color-cream-deep)",
                    borderRadius: 12,
                  }}
                >
                  No customization groups yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid var(--color-cream-sunken)",
          padding: "12px 24px",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
          }}
          disabled={currentStep === 1}
          style={{ opacity: currentStep === 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {/* Step dots */}
        <div className="flex gap-2">
          {STEPS.map((step) => (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              style={{
                width: step.num === currentStep ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  step.num === currentStep
                    ? "var(--color-brown)"
                    : step.num < currentStep
                    ? "var(--color-sage)"
                    : "var(--color-cream-sunken)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          className="btn btn-sm"
          style={{
            background: "var(--color-brown)",
            color: "#fff",
            borderColor: "var(--color-brown)",
          }}
          onClick={() => {
            if (currentStep < 5) setCurrentStep(currentStep + 1);
            else router.push("/menu");
          }}
        >
          {currentStep === 5 ? "Save Dish" : "Continue"}
          {currentStep < 5 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--color-brown)",
  display: "block",
  marginBottom: 6,
};
