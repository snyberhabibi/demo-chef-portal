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
  GripVertical,
  X,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "Dish Details", desc: "Name, description, category & cuisine", icon: "1" },
  { num: 2, label: "Media", desc: "Photos & gallery", icon: "2" },
  { num: 3, label: "Specs & Portions", desc: "Sizes, dietary & allergens", icon: "3" },
  { num: 4, label: "Availability", desc: "Schedule & stock limits", icon: "4" },
  { num: 5, label: "Customizations", desc: "Modifiers & add-ons", icon: "5" },
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

interface Modifier {
  id: number;
  name: string;
  priceAdjustment: string;
  maxQuantity: string;
}

interface CustomGroup {
  id: number;
  name: string;
  required: boolean;
  selectionType: "single" | "multiple" | "quantity";
  totalRequired: string;
  minOptions: string;
  maxOptions: string;
  modifiers: Modifier[];
}

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
  const [customGroups, setCustomGroups] = useState<CustomGroup[]>([
    {
      id: 1,
      name: "Spice Level",
      required: true,
      selectionType: "single",
      totalRequired: "",
      minOptions: "",
      maxOptions: "",
      modifiers: [
        { id: 1, name: "Mild", priceAdjustment: "+$0.00", maxQuantity: "" },
        { id: 2, name: "Medium", priceAdjustment: "+$0.00", maxQuantity: "" },
        { id: 3, name: "Hot", priceAdjustment: "+$0.00", maxQuantity: "" },
        { id: 4, name: "Extra Hot", priceAdjustment: "+$1.00", maxQuantity: "" },
      ],
    },
    {
      id: 2,
      name: "Extras",
      required: false,
      selectionType: "multiple",
      totalRequired: "",
      minOptions: "",
      maxOptions: "",
      modifiers: [
        { id: 1, name: "Extra Pita", priceAdjustment: "+$2.00", maxQuantity: "" },
        { id: 2, name: "Toum Sauce", priceAdjustment: "+$1.50", maxQuantity: "" },
        { id: 3, name: "Pickles", priceAdjustment: "+$0.50", maxQuantity: "" },
      ],
    },
  ]);
  const [nextGroupId, setNextGroupId] = useState(3);
  const [nextModifierId, setNextModifierId] = useState(10);

  const addCustomGroup = () => {
    setCustomGroups((prev) => [
      ...prev,
      {
        id: nextGroupId,
        name: "",
        required: false,
        selectionType: "single",
        totalRequired: "",
        minOptions: "",
        maxOptions: "",
        modifiers: [{ id: nextModifierId, name: "", priceAdjustment: "", maxQuantity: "" }],
      },
    ]);
    setNextGroupId((prev) => prev + 1);
    setNextModifierId((prev) => prev + 1);
  };

  const removeCustomGroup = (groupId: number) => {
    setCustomGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateCustomGroup = (groupId: number, field: keyof CustomGroup, value: unknown) => {
    setCustomGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, [field]: value } : g))
    );
  };

  const addModifier = (groupId: number) => {
    setCustomGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              modifiers: [
                ...g.modifiers,
                { id: nextModifierId, name: "", priceAdjustment: "", maxQuantity: "" },
              ],
            }
          : g
      )
    );
    setNextModifierId((prev) => prev + 1);
  };

  const removeModifier = (groupId: number, modifierId: number) => {
    setCustomGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, modifiers: g.modifiers.filter((m) => m.id !== modifierId) }
          : g
      )
    );
  };

  const updateModifier = (groupId: number, modifierId: number, field: keyof Modifier, value: string) => {
    setCustomGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              modifiers: g.modifiers.map((m) =>
                m.id === modifierId ? { ...m, [field]: value } : m
              ),
            }
          : g
      )
    );
  };

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
    <div className="page-fade" style={{ minHeight: "100vh" }}>
      {/* ── Top Bar ── */}
      <div
        className="flex items-center gap-3 flex-wrap"
        style={{
          padding: "16px 0",
          borderBottom: "1px solid rgba(51,31,46,0.06)",
          marginBottom: 28,
        }}
      >
        <h1 className="heading-md">Create New Dish</h1>
        <span className={`pill ${status === "published" ? "pill-sage" : "pill-orange"}`} style={{ fontSize: 11, transition: "all 0.2s ease" }}>
          {status === "published" ? "Published" : "Draft"}
        </span>
        <div className="flex-1" />
        <button className="btn btn-ghost btn-sm" onClick={() => router.push("/menu")}>
          Discard
        </button>
        <button className="btn btn-dark btn-sm" onClick={() => router.push("/menu")}>
          Save Dish
        </button>
      </div>

      {/* ── Desktop Layout: Sidebar + Content ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 28,
          alignItems: "start",
        }}
        className="wizard-layout"
      >
        {/* ── Left Sidebar (desktop) ── */}
        <div
          className="hidden lg:block"
          style={{
            position: "sticky",
            top: 84,
            background: "var(--color-cream-deep)",
            borderRadius: 16,
            padding: "20px 16px",
          }}
        >
          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
            {STEPS.map((step) => {
              const isCompleted = step.num < currentStep;
              const isCurrent = step.num === currentStep;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isCurrent ? "#fff" : "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background var(--t-fast)",
                    width: "100%",
                    minHeight: 48,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isCompleted
                        ? "var(--color-sage)"
                        : isCurrent
                        ? "var(--color-red)"
                        : "var(--color-cream-sunken)",
                      color: isCompleted || isCurrent ? "#fff" : "var(--color-brown-soft)",
                      transition: "all var(--t-base) var(--ease-spring)",
                    }}
                  >
                    {isCompleted ? <Check size={13} strokeWidth={3} /> : step.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isCurrent ? 700 : 500,
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
          <div style={{ marginBottom: 20, padding: "0 4px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span className="caption" style={{ fontWeight: 600 }}>Progress</span>
              <span className="caption tnum" style={{ fontWeight: 600 }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--color-cream-sunken)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--color-sage)",
                  borderRadius: 2,
                  transition: "width 0.4s var(--ease-spring)",
                }}
              />
            </div>
          </div>

          {/* Preview card */}
          <div
            className="card-gradient-border"
            style={{
              padding: 0,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              className="placeholder-img"
              style={{ aspectRatio: "4/3", fontSize: 28 }}
            >
              <span style={{ opacity: 0.35 }}>
                <Upload size={24} strokeWidth={1.5} />
              </span>
            </div>
            <div style={{ padding: "10px 14px 14px" }}>
              <div className="heading-sm" style={{ fontSize: 14 }}>
                {dishName || "Your Dish Name"}
              </div>
              {selectedCategory && (
                <div className="caption" style={{ marginTop: 2 }}>
                  {selectedCategory}
                </div>
              )}
              <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                <span className="tnum" style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)" }}>
                  ${firstPrice || "0.00"}
                </span>
                <span className="pill pill-orange" style={{ fontSize: 10 }}>
                  {status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <div className="caption" style={{ marginTop: 6 }}>
                {customGroups.length > 0
                  ? `${customGroups.length} customization group${customGroups.length > 1 ? "s" : ""}`
                  : "No customizations"}
              </div>
            </div>
          </div>

          {/* Tip box */}
          <div
            style={{
              background: "rgba(252,157,53,0.08)",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              borderLeft: "3px solid var(--color-orange)",
            }}
          >
            <Lightbulb
              size={15}
              strokeWidth={2}
              style={{ color: "var(--color-orange)", flexShrink: 0, marginTop: 1 }}
            />
            <span style={{ fontSize: 12, color: "var(--color-orange-text)", lineHeight: 1.5, fontStyle: "italic" }}>
              Dishes with clear, descriptive names get 40% more orders.
            </span>
          </div>
        </div>

        {/* ── Main Content Area ── */}
        <div style={{ paddingBottom: 100, maxWidth: 800 }}>
          {/* Mobile step indicator */}
          <div
            className="lg:hidden flex items-center gap-2 justify-center"
            style={{ marginBottom: 24 }}
          >
            {STEPS.map((step) => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                style={{
                  width: step.num === currentStep ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    step.num === currentStep
                      ? "var(--color-red)"
                      : step.num < currentStep
                      ? "var(--color-sage)"
                      : "var(--color-cream-sunken)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s var(--ease-spring)",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Step 1: Dish Details */}
          {currentStep === 1 && (
            <div className="section-stack">
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Step 1 &mdash; Dish Details
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Dish Name */}
                <div>
                  <label className="field-label">Dish Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Traditional Shawarma Plate"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    style={{ borderRadius: 10 }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="field-label">Description *</label>
                  <textarea
                    className="textarea"
                    placeholder="Describe the ingredients and flavors..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{ borderRadius: 10 }}
                  />
                </div>

                {/* Cuisine */}
                <div>
                  <label className="field-label">Cuisine *</label>
                  <div className="relative">
                    <select
                      className="select"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      style={{ appearance: "none", paddingRight: 36, borderRadius: 10 }}
                    >
                      <option value="">Select cuisine</option>
                      {cuisineOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
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

                {/* Category — visual grid */}
                <div>
                  <label className="field-label">Category *</label>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3"
                    style={{
                      gap: 8,
                    }}
                  >
                    {categoryOptions.map((cat) => {
                      const isSelected = selectedCategory === cat.label;
                      return (
                        <button
                          key={cat.label}
                          onClick={() => setSelectedCategory(cat.label)}
                          className="h-[52px] sm:h-[64px]"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            border: `1.5px solid ${isSelected ? "var(--color-orange)" : "rgba(51,31,46,0.1)"}`,
                            background: isSelected ? "rgba(252,157,53,0.05)" : "#fff",
                            cursor: "pointer",
                            transition: "all var(--t-fast) var(--ease-spring)",
                            gap: 4,
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 500, color: isSelected ? "var(--color-brown)" : "var(--color-brown-soft)" }}>
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="field-label">Status</label>
                  <div className="relative">
                    <select
                      className="select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ appearance: "none", paddingRight: 36, borderRadius: 10 }}
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
                  <label className="field-label">Lead Time *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input tnum"
                      placeholder="e.g., 2.5"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      style={{ flex: "1 1 120px", borderRadius: 10 }}
                    />
                    <div className="relative" style={{ flex: "0 0 120px" }}>
                      <select
                        className="select"
                        value={leadTimeUnit}
                        onChange={(e) => setLeadTimeUnit(e.target.value)}
                        style={{ appearance: "none", paddingRight: 36, borderRadius: 10 }}
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
                  <div className="field-help">
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
                  border: "2px dashed rgba(51,31,46,0.18)",
                  borderRadius: 16,
                  height: 200,
                  background: "var(--color-cream-deep)",
                  cursor: "pointer",
                  transition: "border-color var(--t-fast)",
                }}
              >
                <Upload
                  size={28}
                  strokeWidth={1.5}
                  style={{ color: "var(--color-brown-soft-2)", marginBottom: 8 }}
                />
                <div className="heading-sm" style={{ fontSize: 14, marginBottom: 4 }}>
                  Drag and drop or click to upload
                </div>
                <div className="caption">
                  Up to 4 images &middot; PNG, JPG &middot; Max 25MB each
                </div>
              </div>

              {/* Image slots */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 16 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center"
                    style={{
                      aspectRatio: "1/1",
                      border: "2px dashed rgba(51,31,46,0.1)",
                      borderRadius: 10,
                      background: "var(--color-cream-deep)",
                      cursor: "pointer",
                      position: "relative",
                      transition: "border-color var(--t-fast)",
                    }}
                  >
                    <Upload size={20} strokeWidth={1.8} style={{ color: "var(--color-brown-soft-2)" }} />
                    <span className="caption" style={{ marginTop: 6, fontWeight: 500 }}>
                      {i === 0 ? "Primary" : "Add photo"}
                    </span>
                    {i === 0 && (
                      <span
                        className="pill pill-sage"
                        style={{ position: "absolute", top: 8, left: 8, fontSize: 10 }}
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

              {/* Spice Level — pill toggles */}
              <div>
                <label className="field-label">Spice Level</label>
                <div className="flex gap-2 flex-wrap">
                  {spiceLevels.map((level) => {
                    const isActive = level === spiceLevel;
                    return (
                      <button
                        key={level}
                        onClick={() => setSpiceLevel(level)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0 16px",
                          height: 36,
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1.5px solid ${isActive ? "var(--color-brown)" : "rgba(51,31,46,0.12)"}`,
                          background: isActive ? "var(--color-brown)" : "transparent",
                          color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                          transition: "all var(--t-fast) var(--ease-spring)",
                        }}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Portion Sizes */}
              <div style={{ marginTop: 24 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Portion Sizes *</label>
                  <button onClick={addSizeRow} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                    <Plus size={14} strokeWidth={2.5} />
                    Add
                  </button>
                </div>

                {/* Header row */}
                <div
                  className="flex items-center gap-2 eyebrow"
                  style={{ padding: "6px 12px", fontSize: 10, letterSpacing: "0.08em" }}
                >
                  <div style={{ flex: "1 1 140px" }}>Portion Label</div>
                  <div style={{ flex: "1 1 100px" }}>Size</div>
                  <div style={{ width: 100 }}>Price</div>
                  <div style={{ width: 44 }} />
                </div>

                {/* Size rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                  {sizeRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center gap-2"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1px solid rgba(51,31,46,0.08)",
                        background: "#fff",
                      }}
                    >
                      <div className="relative" style={{ flex: "1 1 140px" }}>
                        <select
                          className="select"
                          value={row.portionLabel}
                          onChange={(e) => updateSizeRow(row.id, "portionLabel", e.target.value)}
                          style={{
                            appearance: "none",
                            paddingRight: 28,
                            fontSize: 13,
                            padding: "8px 10px",
                            minHeight: 40,
                            borderRadius: 10,
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
                        onChange={(e) => updateSizeRow(row.id, "size", e.target.value)}
                        className="input"
                        style={{ flex: "1 1 100px", padding: "8px 10px", fontSize: 13, minHeight: 40, borderRadius: 10 }}
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
                          onChange={(e) => updateSizeRow(row.id, "price", e.target.value)}
                          className="input tnum"
                          placeholder="0.00"
                          style={{ padding: "8px 10px 8px 22px", fontSize: 13, width: "100%", minHeight: 40, borderRadius: 10 }}
                        />
                      </div>
                      <button
                        onClick={() => removeSizeRow(row.id)}
                        style={{
                          width: 40,
                          height: 40,
                          minWidth: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 10,
                          color: "var(--color-red)",
                          background: "var(--color-red-soft)",
                          flexShrink: 0,
                          border: "none",
                          transition: "opacity var(--t-fast)",
                        }}
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div style={{ marginTop: 24 }}>
                <label className="field-label">Ingredients</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select ingredients..."
                  readOnly
                  style={{ borderRadius: 10 }}
                />
              </div>

              {/* Allergens */}
              <div style={{ marginTop: 20 }}>
                <label className="field-label">Allergens</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select allergens..."
                  readOnly
                  style={{ borderRadius: 10 }}
                />
              </div>

              {/* Dietary Labels */}
              <div style={{ marginTop: 20 }}>
                <label className="field-label">Dietary Labels</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Select dietary labels..."
                  readOnly
                  style={{ borderRadius: 10 }}
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
                <label className="field-label">Max Quantity Per Day</label>
                <input
                  type="number"
                  className="input tnum"
                  placeholder="Leave empty for unlimited"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  style={{ borderRadius: 10 }}
                />
                <div className="field-help">Set a daily limit or leave blank for unlimited</div>
              </div>

              {/* Available Days */}
              <div style={{ marginTop: 24 }}>
                <label className="field-label">Available Days</label>
                <div className="flex gap-2 flex-wrap">
                  {daysOfWeek.map((day) => {
                    const isActive = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 52,
                          height: 36,
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1.5px solid ${isActive ? "var(--color-brown)" : "rgba(51,31,46,0.12)"}`,
                          background: isActive ? "var(--color-brown)" : "transparent",
                          color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                          transition: "all var(--t-fast) var(--ease-spring)",
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

              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <p className="body-sm" style={{ margin: 0 }}>
                  Add customization groups for modifiers and add-ons
                </p>
                <button className="btn btn-ghost btn-sm" onClick={addCustomGroup}>
                  <Plus size={14} strokeWidth={2.5} />
                  Add Group
                </button>
              </div>

              {customGroups.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 20px",
                    color: "var(--color-brown-soft-2)",
                    fontSize: 14,
                    background: "var(--color-cream-deep)",
                    borderRadius: 14,
                  }}
                >
                  No customization groups yet
                </div>
              )}

              {customGroups.map((group) => (
                <div
                  key={group.id}
                  style={{
                    border: "1px solid rgba(51,31,46,0.1)",
                    borderRadius: 16,
                    padding: 20,
                    background: "#fff",
                    marginBottom: 16,
                  }}
                >
                  {/* Group header row */}
                  <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Spice Level, Size, Add-ons"
                      value={group.name}
                      onChange={(e) => updateCustomGroup(group.id, "name", e.target.value)}
                      style={{ flex: 1, borderRadius: 10, fontSize: 14, fontWeight: 600 }}
                    />
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-brown-soft)",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        onClick={() => updateCustomGroup(group.id, "required", !group.required)}
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: 10,
                          background: group.required ? "var(--color-sage)" : "var(--color-cream-sunken)",
                          position: "relative",
                          display: "inline-block",
                          transition: "background 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: group.required ? 18 : 2,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "#fff",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            transition: "left 0.2s ease",
                          }}
                        />
                      </span>
                      Required
                    </label>
                    <button
                      onClick={() => removeCustomGroup(group.id)}
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        color: "var(--color-red)",
                        background: "var(--color-red-soft)",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>

                  {/* Selection type pills */}
                  <div className="flex gap-2" style={{ marginBottom: 14 }}>
                    {(["single", "multiple", "quantity"] as const).map((type) => {
                      const isActive = group.selectionType === type;
                      const labels = { single: "Single", multiple: "Multiple", quantity: "Quantity" };
                      return (
                        <button
                          key={type}
                          onClick={() => updateCustomGroup(group.id, "selectionType", type)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0 16px",
                            height: 36,
                            borderRadius: 9999,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            border: `1.5px solid ${isActive ? "var(--color-brown)" : "rgba(51,31,46,0.12)"}`,
                            background: isActive ? "var(--color-brown)" : "transparent",
                            color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                            transition: "all var(--t-fast) var(--ease-spring)",
                          }}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quantity-specific fields */}
                  {group.selectionType === "quantity" && (
                    <div style={{ marginBottom: 14 }}>
                      <div className="flex gap-2" style={{ marginBottom: 6 }}>
                        <div style={{ flex: 1 }}>
                          <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Total Required
                          </label>
                          <input
                            type="number"
                            className="input tnum"
                            placeholder="e.g., 7"
                            value={group.totalRequired}
                            onChange={(e) => updateCustomGroup(group.id, "totalRequired", e.target.value)}
                            style={{ borderRadius: 10, fontSize: 13 }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Min Different Options
                          </label>
                          <input
                            type="number"
                            className="input tnum"
                            placeholder="e.g., 1"
                            value={group.minOptions}
                            onChange={(e) => updateCustomGroup(group.id, "minOptions", e.target.value)}
                            style={{ borderRadius: 10, fontSize: 13 }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Max Different Options
                          </label>
                          <input
                            type="number"
                            className="input tnum"
                            placeholder="blank = no limit"
                            value={group.maxOptions}
                            onChange={(e) => updateCustomGroup(group.id, "maxOptions", e.target.value)}
                            style={{ borderRadius: 10, fontSize: 13 }}
                          />
                        </div>
                      </div>
                      <div className="caption" style={{ color: "var(--color-brown-soft-2)", fontStyle: "italic" }}>
                        Customer must select exactly {group.totalRequired || "[total]"} items, choosing from at least {group.minOptions || "[min]"} different options.
                      </div>
                    </div>
                  )}

                  {/* Column headers */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: group.selectionType === "quantity"
                        ? "20px 1fr 100px 70px 32px"
                        : "20px 1fr 100px 32px",
                      gap: 8,
                      padding: "0 8px",
                      marginBottom: 6,
                    }}
                  >
                    <div />
                    <span className="caption" style={{ fontWeight: 600 }}>Option Name</span>
                    <span className="caption" style={{ fontWeight: 600 }}>Price Adj.</span>
                    {group.selectionType === "quantity" && (
                      <span className="caption" style={{ fontWeight: 600 }}>Max Qty</span>
                    )}
                    <div />
                  </div>

                  {/* Modifier options list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {group.modifiers.map((mod) => (
                      <div
                        key={mod.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: group.selectionType === "quantity"
                            ? "20px 1fr 100px 70px 32px"
                            : "20px 1fr 100px 32px",
                          gap: 8,
                          alignItems: "center",
                          padding: "6px 8px",
                          borderRadius: 10,
                          background: "var(--color-cream-deep)",
                        }}
                      >
                        <GripVertical
                          size={14}
                          strokeWidth={1.8}
                          style={{ color: "var(--color-brown-soft-2)", cursor: "grab" }}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Mild"
                          value={mod.name}
                          onChange={(e) => updateModifier(group.id, mod.id, "name", e.target.value)}
                          style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                        />
                        <input
                          type="text"
                          className="input tnum"
                          placeholder="+$0.00"
                          value={mod.priceAdjustment}
                          onChange={(e) => updateModifier(group.id, mod.id, "priceAdjustment", e.target.value)}
                          style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                        />
                        {group.selectionType === "quantity" && (
                          <input
                            type="number"
                            className="input tnum"
                            placeholder="—"
                            value={mod.maxQuantity}
                            onChange={(e) => updateModifier(group.id, mod.id, "maxQuantity", e.target.value)}
                            style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                          />
                        )}
                        <button
                          onClick={() => removeModifier(group.id, mod.id)}
                          style={{
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 8,
                            color: "var(--color-brown-soft-2)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Option button */}
                  <button
                    onClick={() => addModifier(group.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 10, fontSize: 12 }}
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Add Option
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div
        className="glass wizard-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid rgba(51,31,46,0.06)",
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
                transition: "all 0.2s var(--ease-spring)",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          className="btn btn-sm btn-dark"
          onClick={() => {
            if (currentStep < 5) setCurrentStep(currentStep + 1);
            else router.push("/menu");
          }}
        >
          {currentStep === 5 ? "Save Dish" : "Continue"}
          {currentStep < 5 && <ChevronRight size={16} />}
        </button>
      </div>

      {/* Responsive: collapse sidebar on mobile, wizard bottom nav above tab bar */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .wizard-layout {
            grid-template-columns: 1fr !important;
          }
          .wizard-bottom-nav {
            bottom: 56px !important;
          }
        }
        @media (min-width: 1024px) {
          .wizard-bottom-nav {
            left: 260px !important;
          }
        }
      `}</style>
    </div>
  );
}
