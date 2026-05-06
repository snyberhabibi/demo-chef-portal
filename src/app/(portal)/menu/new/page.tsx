/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Lightbulb,
  GripVertical,
  X,
  Clock,
  CalendarClock,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { SectionCard } from "@/components/ui/section-card";
import { useDesignMode } from "@/lib/design-mode";
import { getRecipesForDish, type RecipeIngredient } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

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
const dietaryLabels = ["Halal", "Vegan", "Vegetarian", "Gluten-Free", "Keto", "Dairy-Free"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysOfWeekFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateTimeOptions(): string[] {
  const times: string[] = [];
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const mins = m.toString().padStart(2, "0");
      times.push(`${hour12}:${mins} ${ampm}`);
    }
  }
  return times;
}

const TIME_OPTIONS = generateTimeOptions();

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Dish data for edit mode (mirrors menu page data)                   */
/* ------------------------------------------------------------------ */
const EDITABLE_DISHES: Record<string, { name: string; price: string; category: string; cuisine: string; description: string; status: "draft" | "published" }> = {
  mansaf: { name: "Homemade Mansaf", price: "28.00", category: "Main Dishes", cuisine: "Jordanian", description: "Traditional Jordanian lamb dish cooked in fermented dried yogurt and served with rice.", status: "published" },
  knafeh: { name: "Pistachio Knafeh", price: "18.00", category: "Desserts", cuisine: "Palestinian", description: "Crispy shredded phyllo pastry filled with sweet cheese and topped with pistachios.", status: "published" },
  baklava: { name: "Walnut Baklava", price: "14.00", category: "Desserts", cuisine: "Turkish", description: "Layers of flaky phyllo dough filled with chopped walnuts, sweetened with honey syrup.", status: "published" },
  shawarma: { name: "Chicken Shawarma", price: "16.00", category: "Main Dishes", cuisine: "Lebanese", description: "Marinated chicken slow-roasted on a vertical spit, served with garlic sauce.", status: "published" },
  hummus: { name: "Smoky Hummus", price: "10.00", category: "Appetizers", cuisine: "Middle Eastern", description: "Classic chickpea dip with a smoky twist, drizzled with olive oil.", status: "draft" },
  falafel: { name: "Crispy Falafel", price: "12.00", category: "Appetizers", cuisine: "Egyptian", description: "Golden fried chickpea fritters, crispy outside, fluffy inside.", status: "published" },
  tabouleh: { name: "Tabouleh Salad", price: "11.00", category: "Salads", cuisine: "Lebanese", description: "Fresh parsley and bulgur salad with tomatoes, mint, and lemon dressing.", status: "draft" },
  mandi: { name: "Chicken Mandi", price: "22.00", category: "Main Dishes", cuisine: "Yemeni", description: "Aromatic rice and chicken cooked with a blend of Yemeni spices.", status: "published" },
  fattoush: { name: "Garden Fattoush", price: "10.00", category: "Salads", cuisine: "Lebanese", description: "Crispy pita chip salad with fresh vegetables and sumac dressing.", status: "published" },
  kibbeh: { name: "Lamb Kibbeh", price: "16.00", category: "Appetizers", cuisine: "Syrian", description: "Fried bulgur shells stuffed with seasoned ground lamb and pine nuts.", status: "published" },
  manaqish: { name: "Manaqish", price: "8.00", category: "Bakery", cuisine: "Lebanese", description: "Lebanese flatbread topped with za'atar, cheese, or ground meat.", status: "draft" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CreateDishPage() {
  return (
    <Suspense fallback={<div className="content-default section-stack page-fade"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>}>
      <CreateDishPageInner />
    </Suspense>
  );
}

function CreateDishPageInner() {
  const { mode } = useDesignMode();
  const isB = mode === "b";
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const editDish = editId ? EDITABLE_DISHES[editId] : null;
  const isEditMode = !!editDish;

  /* ── Section collapse state ── */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basics: true,
    photos: true,
    pricing: true,
    leadTime: true,
    dietary: false,
    customizations: false,
    recipe: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ── The Basics ── */
  const [dishName, setDishName] = useState(editDish?.name ?? "");
  const [description, setDescription] = useState(editDish?.description ?? "");
  const [cuisine, setCuisine] = useState(editDish?.cuisine ?? "");
  const [selectedCategory, setSelectedCategory] = useState(editDish?.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(editDish?.status ?? "draft");

  /* ── Photo Upload ── */
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Pricing & Sizes ── */
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([
    { id: 1, portionLabel: editDish ? "portion" : "", size: editDish ? "Regular" : "", price: editDish?.price ?? "" },
  ]);
  const [nextSizeId, setNextSizeId] = useState(2);

  /* ── Lead Time & Availability ── */
  const [leadTimeMode, setLeadTimeMode] = useState<"rolling" | "cutoff">("rolling");
  const [leadTimeValue, setLeadTimeValue] = useState("");
  const [leadTimeUnit, setLeadTimeUnit] = useState("hours");
  const [cutoffDay, setCutoffDay] = useState("Sunday");
  const [cutoffTime, setCutoffTime] = useState("11:00 PM");
  const [fulfillmentDay, setFulfillmentDay] = useState("Wednesday");
  const [maxQty, setMaxQty] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  /* ── Dietary & Allergens ── */
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState("");

  /* ── Customizations ── */
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
        { id: 5, name: "Extra Pita", priceAdjustment: "+$2.00", maxQuantity: "" },
        { id: 6, name: "Toum Sauce", priceAdjustment: "+$1.50", maxQuantity: "" },
        { id: 7, name: "Pickles", priceAdjustment: "+$0.50", maxQuantity: "" },
      ],
    },
  ]);
  const [nextGroupId, setNextGroupId] = useState(3);
  const [nextModifierId, setNextModifierId] = useState(10);

  /* ── Recipe (Private Notes) ── */
  const [recipePortionIdx, setRecipePortionIdx] = useState(0);
  const [recipeData, setRecipeData] = useState<
    Record<number, { ingredients: RecipeIngredient[]; steps: string[] }>
  >(() => {
    if (!editId) return {};
    // Initialize from mock data for edit mode
    const recipes = getRecipesForDish(editId);
    const data: Record<number, { ingredients: RecipeIngredient[]; steps: string[] }> = {};
    recipes.forEach((r, idx) => {
      data[idx] = {
        ingredients: r.ingredients.map((ing) => ({ ...ing })),
        steps: [...r.steps],
      };
    });
    return data;
  });

  const currentPortionRecipe = recipeData[recipePortionIdx] || { ingredients: [], steps: [] };

  const updateRecipeIngredient = (idx: number, field: "name" | "quantity", value: string) => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      const newIngredients = [...current.ingredients];
      newIngredients[idx] = { ...newIngredients[idx], [field]: value };
      return { ...prev, [recipePortionIdx]: { ...current, ingredients: newIngredients } };
    });
    markDirty();
  };

  const addRecipeIngredient = () => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      return {
        ...prev,
        [recipePortionIdx]: {
          ...current,
          ingredients: [...current.ingredients, { name: "", quantity: "" }],
        },
      };
    });
    markDirty();
  };

  const removeRecipeIngredient = (idx: number) => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      return {
        ...prev,
        [recipePortionIdx]: {
          ...current,
          ingredients: current.ingredients.filter((_, i) => i !== idx),
        },
      };
    });
    markDirty();
  };

  const updateRecipeStep = (idx: number, value: string) => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      const newSteps = [...current.steps];
      newSteps[idx] = value;
      return { ...prev, [recipePortionIdx]: { ...current, steps: newSteps } };
    });
    markDirty();
  };

  const addRecipeStep = () => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      return {
        ...prev,
        [recipePortionIdx]: {
          ...current,
          steps: [...current.steps, ""],
        },
      };
    });
    markDirty();
  };

  const removeRecipeStep = (idx: number) => {
    setRecipeData((prev) => {
      const current = prev[recipePortionIdx] || { ingredients: [], steps: [] };
      return {
        ...prev,
        [recipePortionIdx]: {
          ...current,
          steps: current.steps.filter((_, i) => i !== idx),
        },
      };
    });
    markDirty();
  };

  /* ── Handlers ── */

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

  const toggleDietary = (label: string) => {
    setSelectedDietary((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

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
        modifiers: [
          { id: nextModifierId, name: "", priceAdjustment: "", maxQuantity: "" },
        ],
      },
    ]);
    setNextGroupId((prev) => prev + 1);
    setNextModifierId((prev) => prev + 1);
  };

  const removeCustomGroup = (groupId: number) => {
    setCustomGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateCustomGroup = (
    groupId: number,
    field: keyof CustomGroup,
    value: unknown
  ) => {
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
                {
                  id: nextModifierId,
                  name: "",
                  priceAdjustment: "",
                  maxQuantity: "",
                },
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

  const updateModifier = (
    groupId: number,
    modifierId: number,
    field: keyof Modifier,
    value: string
  ) => {
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

  /* ── Unsaved changes guard ── */
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Mark dirty on any meaningful field change
  const markDirty = () => { if (!isDirty) setIsDirty(true); };

  const handleSave = (asDraft: boolean) => {
    setIsDirty(false);
    if (asDraft) {
      setStatus("draft");
      toast("Dish saved as draft");
    } else {
      setStatus("published");
      toast("Dish published");
    }
    router.push("/menu");
  };

  // Wrap state setters to auto-mark dirty
  const setDishNameDirty = (v: string) => { setDishName(v); markDirty(); };
  const setDescriptionDirty = (v: string) => { setDescription(v); markDirty(); };
  const setCuisineDirty = (v: string) => { setCuisine(v); markDirty(); };
  const setSelectedCategoryDirty = (v: string) => { setSelectedCategory(v); markDirty(); };

  /* ── Derived values ── */
  const firstPrice = sizeRows[0]?.price || "0.00";
  const cutoffDayShort = cutoffDay.slice(0, 3);
  const fulfillmentDayShort = fulfillmentDay.slice(0, 3);

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
        <h1 className={`heading-md${isB ? " heading-gradient" : ""}`}>{isEditMode ? `Edit: ${editDish.name}` : "Create New Dish"}</h1>
        <span
          className={`pill ${status === "published" ? "pill-sage" : "pill-orange"}`}
          style={{ fontSize: 11, transition: "all 0.2s ease" }}
        >
          {status === "published" ? "Published" : "Draft"}
        </span>
        <div className="flex-1" />
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
            setIsDirty(false);
            toast("Changes discarded", "info");
            router.push("/menu");
          }}
        >
          Discard
        </button>
        <button
          className="btn btn-dark btn-sm"
          style={isB ? { background: "#df4746", border: "none", borderRadius: 12 } : {}}
          onClick={() => handleSave(false)}
        >
          Save Dish
        </button>
      </div>

      {/* ── Desktop Layout: Content + Optional Sidebar ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          gap: 28,
          alignItems: "start",
        }}
        className="create-dish-layout"
      >
        {/* ── Main Form ── */}
        <div
          className="content-default section-stack"
          style={{ paddingBottom: 120, maxWidth: "none" }}
        >
          {/* ════════════ Section 1: The Basics ════════════ */}
          <SectionCard
            title="The Basics"
            subtitle="Name, description, category, and cuisine"
            open={openSections.basics}
            onToggle={() => toggleSection("basics")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Dish Name */}
              <div>
                <label className="field-label">Dish Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Homemade Mansaf"
                  value={dishName}
                  onChange={(e) => setDishNameDirty(e.target.value)}
                  style={{ borderRadius: 10 }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="field-label">Description *</label>
                <textarea
                  className="textarea"
                  placeholder="Describe your dish..."
                  value={description}
                  onChange={(e) => setDescriptionDirty(e.target.value)}
                  rows={3}
                  style={{ borderRadius: 10 }}
                />
              </div>

              {/* Category — visual grid */}
              <div>
                <label className="field-label">Category *</label>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3"
                  style={{ gap: 8 }}
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
                          border: `1.5px solid ${isSelected ? (isB ? "#df4746" : "var(--color-orange)") : "rgba(51,31,46,0.1)"}`,
                          background: isSelected
                            ? (isB ? "rgba(223,71,70,0.06)" : "rgba(252,157,53,0.05)")
                            : "#fff",
                          cursor: "pointer",
                          transition:
                            "all var(--t-fast) var(--ease-spring)",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected
                              ? "var(--color-brown)"
                              : "var(--color-brown-soft)",
                          }}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label className="field-label">Cuisine *</label>
                <div className="relative">
                  <select
                    className="select"
                    value={cuisine}
                    onChange={(e) => setCuisineDirty(e.target.value)}
                    style={{
                      appearance: "none",
                      paddingRight: 36,
                      borderRadius: 10,
                    }}
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
            </div>
          </SectionCard>

          {/* ════════════ Section 2: Photos ════════════ */}
          <SectionCard
            title="Photos"
            subtitle="Upload up to 4 images of your dish"
            open={openSections.photos}
            onToggle={() => toggleSection("photos")}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* Upload zone */}
            <div
              className="flex flex-col items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
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
                style={{
                  color: "var(--color-brown-soft-2)",
                  marginBottom: 8,
                }}
              />
              <div
                className="heading-sm"
                style={{ fontSize: 14, marginBottom: 4 }}
              >
                Drag and drop or click to upload
              </div>
              <div className="caption">
                Up to 4 images &middot; PNG, JPG &middot; Max 25MB
              </div>
            </div>

            {/* Image slots */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginTop: 16,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    aspectRatio: "1/1",
                    border: photoPreview && i === 0 ? "2px solid var(--color-sage)" : "2px dashed rgba(51,31,46,0.1)",
                    borderRadius: 10,
                    background: "var(--color-cream-deep)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "border-color var(--t-fast)",
                    overflow: "hidden",
                  }}
                >
                  {photoPreview && i === 0 ? (
                    <img
                      src={photoPreview}
                      alt="Dish preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>
                      <Upload
                        size={20}
                        strokeWidth={1.8}
                        style={{ color: "var(--color-brown-soft-2)" }}
                      />
                      <span
                        className="caption"
                        style={{ marginTop: 6, fontWeight: 500 }}
                      >
                        {i === 0 ? "Primary" : "Add photo"}
                      </span>
                    </>
                  )}
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
          </SectionCard>

          {/* ════════════ Section 3: Pricing & Sizes ════════════ */}
          <SectionCard
            title="Pricing & Sizes"
            subtitle="Set portion sizes and pricing"
            open={openSections.pricing}
            onToggle={() => toggleSection("pricing")}
          >
            {/* Template buttons */}
            <div className="flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
              {[
                { label: "Individual ($)", portion: "portion", size: "Regular" },
                { label: "Small Tray ($$)", portion: "tray", size: "Small" },
                { label: "Large Tray ($$$)", portion: "tray", size: "Large" },
              ].map((tmpl) => (
                <button
                  key={tmpl.label}
                  onClick={() => {
                    const newRow: SizeRow = {
                      id: nextSizeId,
                      portionLabel: tmpl.portion,
                      size: tmpl.size,
                      price: "",
                    };
                    setSizeRows((prev) => [...prev, newRow]);
                    setNextSizeId((prev) => prev + 1);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0 16px",
                    height: 36,
                    borderRadius: 9999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1.5px solid rgba(51,31,46,0.12)",
                    background: "transparent",
                    color: "var(--color-brown-soft)",
                    transition: "all var(--t-fast) var(--ease-spring)",
                  }}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>
                Portion Sizes *
              </label>
              <button
                onClick={addSizeRow}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 12 }}
              >
                <Plus size={14} strokeWidth={2.5} />
                Add size
              </button>
            </div>

            <div
              className="hidden sm:flex items-center gap-2 eyebrow"
              style={{
                padding: "6px 12px",
                fontSize: 10,
                letterSpacing: "0.08em",
              }}
            >
              <div style={{ flex: "1 1 140px" }}>Portion Label</div>
              <div style={{ flex: "1 1 100px" }}>Size</div>
              <div style={{ width: 100 }}>Price</div>
              <div style={{ width: 44 }} />
            </div>

            {/* Size rows */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 6,
              }}
            >
              {sizeRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
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
                      onChange={(e) =>
                        updateSizeRow(row.id, "portionLabel", e.target.value)
                      }
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
                    onChange={(e) =>
                      updateSizeRow(row.id, "size", e.target.value)
                    }
                    className="input"
                    style={{
                      flex: "1 1 100px",
                      padding: "8px 10px",
                      fontSize: 13,
                      minHeight: 40,
                      borderRadius: 10,
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
                        borderRadius: 10,
                      }}
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
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ════════════ Section 4: Lead Time & Availability ════════════ */}
          <SectionCard
            title="Lead Time & Availability"
            subtitle="Set how and when customers can order"
            open={openSections.leadTime}
            onToggle={() => toggleSection("leadTime")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Lead time mode selector */}
              <div>
                <label className="field-label">How do customers order?</label>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Rolling lead time */}
                  <label
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${leadTimeMode === "rolling" ? "var(--color-orange)" : "rgba(51,31,46,0.1)"}`,
                      background: leadTimeMode === "rolling" ? "rgba(252,157,53,0.04)" : "#fff",
                      cursor: "pointer",
                      transition: "all var(--t-fast) var(--ease-spring)",
                      alignItems: "flex-start",
                    }}
                    onClick={() => setLeadTimeMode("rolling")}
                  >
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: `2px solid ${leadTimeMode === "rolling" ? "var(--color-orange)" : "rgba(51,31,46,0.2)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "border-color var(--t-fast)",
                        }}
                      >
                        {leadTimeMode === "rolling" && (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "var(--color-orange)",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Clock size={16} style={{ color: "var(--color-brown-soft)" }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)" }}>
                          Rolling lead time
                        </span>
                      </div>
                      <div className="caption" style={{ marginTop: 4 }}>
                        Customers order X hours/days before they want it
                      </div>
                    </div>
                  </label>

                  {/* Rolling fields */}
                  {leadTimeMode === "rolling" && (
                    <div style={{ paddingLeft: 32 }}>
                      <div className="flex gap-2" style={{ marginBottom: 6 }}>
                        <input
                          type="number"
                          className="input tnum"
                          placeholder="e.g., 24"
                          value={leadTimeValue}
                          onChange={(e) => setLeadTimeValue(e.target.value)}
                          style={{ flex: "1 1 120px", borderRadius: 10 }}
                          min={0}
                        />
                        <div className="relative" style={{ flex: "0 0 120px" }}>
                          <select
                            className="select"
                            value={leadTimeUnit}
                            onChange={(e) => setLeadTimeUnit(e.target.value)}
                            style={{
                              appearance: "none",
                              paddingRight: 36,
                              borderRadius: 10,
                            }}
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
                        e.g., 24 hours means customers must order at least a day ahead
                      </div>
                    </div>
                  )}

                  {/* Weekly cutoff */}
                  <label
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${leadTimeMode === "cutoff" ? "var(--color-orange)" : "rgba(51,31,46,0.1)"}`,
                      background: leadTimeMode === "cutoff" ? "rgba(252,157,53,0.04)" : "#fff",
                      cursor: "pointer",
                      transition: "all var(--t-fast) var(--ease-spring)",
                      alignItems: "flex-start",
                    }}
                    onClick={() => setLeadTimeMode("cutoff")}
                  >
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: `2px solid ${leadTimeMode === "cutoff" ? "var(--color-orange)" : "rgba(51,31,46,0.2)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "border-color var(--t-fast)",
                        }}
                      >
                        {leadTimeMode === "cutoff" && (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "var(--color-orange)",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CalendarClock size={16} style={{ color: "var(--color-brown-soft)" }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)" }}>
                          Weekly cutoff
                        </span>
                        <span
                          className="pill pill-sage"
                          style={{ fontSize: 10, fontWeight: 600 }}
                        >
                          best for meal prep
                        </span>
                      </div>
                      <div className="caption" style={{ marginTop: 4 }}>
                        All orders must be in by a specific day and time
                      </div>
                    </div>
                  </label>

                  {/* Cutoff fields */}
                  {leadTimeMode === "cutoff" && (
                    <div
                      style={{
                        paddingLeft: 32,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2"
                        style={{ gap: 12 }}
                      >
                        {/* Cutoff Day */}
                        <div>
                          <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Cutoff Day
                          </label>
                          <div className="relative">
                            <select
                              className="select"
                              value={cutoffDay}
                              onChange={(e) => setCutoffDay(e.target.value)}
                              style={{
                                appearance: "none",
                                paddingRight: 36,
                                borderRadius: 10,
                              }}
                            >
                              {daysOfWeekFull.map((d) => (
                                <option key={d} value={d}>
                                  {d}
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

                        {/* Cutoff Time */}
                        <div>
                          <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Cutoff Time
                          </label>
                          <div className="relative">
                            <select
                              className="select"
                              value={cutoffTime}
                              onChange={(e) => setCutoffTime(e.target.value)}
                              style={{
                                appearance: "none",
                                paddingRight: 36,
                                borderRadius: 10,
                              }}
                            >
                              {TIME_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                  {t}
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
                      </div>

                      {/* Fulfillment Day */}
                      <div>
                        <label className="caption" style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                          Fulfillment Day
                        </label>
                        <div className="relative" style={{ maxWidth: 240 }}>
                          <select
                            className="select"
                            value={fulfillmentDay}
                            onChange={(e) => setFulfillmentDay(e.target.value)}
                            style={{
                              appearance: "none",
                              paddingRight: 36,
                              borderRadius: 10,
                            }}
                          >
                            {daysOfWeekFull.map((d) => (
                              <option key={d} value={d}>
                                {d}
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

                      <div className="field-help">
                        Orders placed after {cutoffDay} {cutoffTime} will be for the following week
                      </div>

                      {/* Preview text */}
                      <div
                        style={{
                          background: "rgba(121,173,99,0.08)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          borderLeft: "3px solid var(--color-sage)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--color-sage-deep)",
                            fontWeight: 500,
                          }}
                        >
                          Customers see: &ldquo;Order by {cutoffDayShort} {cutoffTime} for {fulfillmentDayShort} delivery&rdquo;
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Max Quantity Per Day */}
              <div>
                <label className="field-label">Max Quantity Per Day</label>
                <input
                  type="number"
                  className="input tnum"
                  placeholder="Leave empty for unlimited"
                  value={maxQty}
                  onChange={(e) => setMaxQty(e.target.value)}
                  style={{ borderRadius: 10 }}
                  min={0}
                />
                <div className="field-help">
                  Set a daily limit or leave blank for unlimited
                </div>
              </div>

              {/* Available Days */}
              <div>
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
                          background: isActive
                            ? "var(--color-brown)"
                            : "transparent",
                          color: isActive
                            ? "var(--color-cream)"
                            : "var(--color-brown-soft)",
                          transition:
                            "all var(--t-fast) var(--ease-spring)",
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ════════════ Section 5: Dietary & Allergens ════════════ */}
          <SectionCard
            title="Dietary & Allergens"
            subtitle="Spice level, dietary labels, ingredients, and allergens"
            open={openSections.dietary}
            onToggle={() => toggleSection("dietary")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Spice Level */}
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
                          background: isActive
                            ? "var(--color-brown)"
                            : "transparent",
                          color: isActive
                            ? "var(--color-cream)"
                            : "var(--color-brown-soft)",
                          transition:
                            "all var(--t-fast) var(--ease-spring)",
                        }}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Labels */}
              <div>
                <label className="field-label">Dietary Labels</label>
                <div className="flex gap-2 flex-wrap">
                  {dietaryLabels.map((label) => {
                    const isActive = selectedDietary.includes(label);
                    return (
                      <button
                        key={label}
                        onClick={() => toggleDietary(label)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0 16px",
                          height: 36,
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1.5px solid ${isActive ? "var(--color-sage)" : "rgba(51,31,46,0.12)"}`,
                          background: isActive
                            ? "var(--color-sage)"
                            : "transparent",
                          color: isActive
                            ? "#fff"
                            : "var(--color-brown-soft)",
                          transition:
                            "all var(--t-fast) var(--ease-spring)",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="field-label">Ingredients</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Type and press Enter or comma to add..."
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = ingredientInput.replace(/,/g, "").trim();
                      if (val && !ingredients.includes(val)) {
                        setIngredients((prev) => [...prev, val]);
                      }
                      setIngredientInput("");
                    }
                  }}
                  style={{ borderRadius: 10 }}
                />
                {ingredients.length > 0 && (
                  <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                    {ingredients.map((ing) => (
                      <span
                        key={ing}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 600,
                          background: "var(--color-cream-deep)",
                          color: "var(--color-brown)",
                        }}
                      >
                        {ing}
                        <button
                          type="button"
                          onClick={() => setIngredients((prev) => prev.filter((i) => i !== ing))}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            color: "var(--color-brown-soft-2)",
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergens */}
              <div>
                <label className="field-label">Allergens</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Type and press Enter or comma to add..."
                  value={allergenInput}
                  onChange={(e) => setAllergenInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = allergenInput.replace(/,/g, "").trim();
                      if (val && !allergens.includes(val)) {
                        setAllergens((prev) => [...prev, val]);
                      }
                      setAllergenInput("");
                    }
                  }}
                  style={{ borderRadius: 10 }}
                />
                {allergens.length > 0 && (
                  <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                    {allergens.map((alg) => (
                      <span
                        key={alg}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 600,
                          background: "rgba(229,65,65,0.08)",
                          color: "var(--color-red-deep)",
                        }}
                      >
                        {alg}
                        <button
                          type="button"
                          onClick={() => setAllergens((prev) => prev.filter((a) => a !== alg))}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            color: "var(--color-red)",
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ════════════ Section 6: Customizations ════════════ */}
          <SectionCard
            title="Customizations"
            subtitle="Modifiers, add-ons, and selection groups"
            open={openSections.customizations}
            onToggle={() => toggleSection("customizations")}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <p className="body-sm" style={{ margin: 0 }}>
                Add customization groups for modifiers and add-ons
              </p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={addCustomGroup}
              >
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
                <div
                  className="flex items-center gap-3"
                  style={{ marginBottom: 14 }}
                >
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Spice Level, Size, Add-ons"
                    value={group.name}
                    onChange={(e) =>
                      updateCustomGroup(group.id, "name", e.target.value)
                    }
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
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
                    <button
                      type="button"
                      role="switch"
                      aria-checked={group.required}
                      aria-label={`${group.name || "Group"} required`}
                      onClick={() =>
                        updateCustomGroup(
                          group.id,
                          "required",
                          !group.required
                        )
                      }
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        background: group.required
                          ? "var(--color-sage)"
                          : "var(--color-cream-sunken)",
                        position: "relative",
                        display: "inline-block",
                        transition: "background 0.2s ease",
                        cursor: "pointer",
                        border: "none",
                        padding: 0,
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
                    </button>
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
                  {(["single", "multiple", "quantity"] as const).map(
                    (type) => {
                      const isActive = group.selectionType === type;
                      const labels = {
                        single: "Single",
                        multiple: "Multiple",
                        quantity: "Quantity",
                      };
                      return (
                        <button
                          key={type}
                          onClick={() =>
                            updateCustomGroup(
                              group.id,
                              "selectionType",
                              type
                            )
                          }
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
                            background: isActive
                              ? "var(--color-brown)"
                              : "transparent",
                            color: isActive
                              ? "var(--color-cream)"
                              : "var(--color-brown-soft)",
                            transition:
                              "all var(--t-fast) var(--ease-spring)",
                          }}
                        >
                          {labels[type]}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Quantity-specific fields */}
                {group.selectionType === "quantity" && (
                  <div style={{ marginBottom: 14 }}>
                    <div className="flex flex-col sm:flex-row gap-2" style={{ marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <label
                          className="caption"
                          style={{
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Total Required
                        </label>
                        <input
                          type="number"
                          className="input tnum"
                          placeholder="e.g., 7"
                          value={group.totalRequired}
                          onChange={(e) =>
                            updateCustomGroup(
                              group.id,
                              "totalRequired",
                              e.target.value
                            )
                          }
                          style={{ borderRadius: 10 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          className="caption"
                          style={{
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Min Different Options
                        </label>
                        <input
                          type="number"
                          className="input tnum"
                          placeholder="e.g., 1"
                          value={group.minOptions}
                          onChange={(e) =>
                            updateCustomGroup(
                              group.id,
                              "minOptions",
                              e.target.value
                            )
                          }
                          style={{ borderRadius: 10 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          className="caption"
                          style={{
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Max Different Options
                        </label>
                        <input
                          type="number"
                          className="input tnum"
                          placeholder="blank = no limit"
                          value={group.maxOptions}
                          onChange={(e) =>
                            updateCustomGroup(
                              group.id,
                              "maxOptions",
                              e.target.value
                            )
                          }
                          style={{ borderRadius: 10 }}
                        />
                      </div>
                    </div>
                    <div
                      className="caption"
                      style={{
                        color: "var(--color-brown-soft-2)",
                        fontStyle: "italic",
                      }}
                    >
                      Customer must select exactly{" "}
                      {group.totalRequired || "[total]"} items, choosing from
                      at least {group.minOptions || "[min]"} different
                      options.
                    </div>
                  </div>
                )}

                {/* Column headers */}
                <div
                  className="hidden sm:grid"
                  style={{
                    gridTemplateColumns:
                      group.selectionType === "quantity"
                        ? "20px 1fr 100px 70px 32px"
                        : "20px 1fr 100px 32px",
                    gap: 8,
                    padding: "0 8px",
                    marginBottom: 6,
                  }}
                >
                  <div />
                  <span className="caption" style={{ fontWeight: 600 }}>
                    Option Name
                  </span>
                  <span className="caption" style={{ fontWeight: 600 }}>
                    Price Adj.
                  </span>
                  {group.selectionType === "quantity" && (
                    <span className="caption" style={{ fontWeight: 600 }}>
                      Max Qty
                    </span>
                  )}
                  <div />
                </div>

                {/* Modifier options list */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {group.modifiers.map((mod) => (
                    <div
                      key={mod.id}
                      className="modifier-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          group.selectionType === "quantity"
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
                        style={{
                          color: "var(--color-brown-soft-2)",
                          cursor: "grab",
                        }}
                      />
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Mild"
                        value={mod.name}
                        onChange={(e) =>
                          updateModifier(
                            group.id,
                            mod.id,
                            "name",
                            e.target.value
                          )
                        }
                        style={{
                          fontSize: 13,
                          padding: "8px 10px",
                          borderRadius: 8,
                          minHeight: 36,
                        }}
                      />
                      <input
                        type="text"
                        className="input tnum"
                        placeholder="+$0.00"
                        value={mod.priceAdjustment}
                        onChange={(e) =>
                          updateModifier(
                            group.id,
                            mod.id,
                            "priceAdjustment",
                            e.target.value
                          )
                        }
                        style={{
                          fontSize: 13,
                          padding: "8px 10px",
                          borderRadius: 8,
                          minHeight: 36,
                        }}
                      />
                      {group.selectionType === "quantity" && (
                        <input
                          type="number"
                          className="input tnum"
                          placeholder="--"
                          value={mod.maxQuantity}
                          onChange={(e) =>
                            updateModifier(
                              group.id,
                              mod.id,
                              "maxQuantity",
                              e.target.value
                            )
                          }
                          style={{
                            fontSize: 13,
                            padding: "8px 10px",
                            borderRadius: 8,
                            minHeight: 36,
                          }}
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
          </SectionCard>

          {/* ════════════ Section 7: Recipe (Private Notes) ════════════ */}
          <SectionCard
            title="Recipe (Private Notes)"
            subtitle="Your private kitchen notes per portion size"
            open={openSections.recipe}
            onToggle={() => toggleSection("recipe")}
          >
            {/* Portion size tabs — pulled from pricing sizeRows */}
            {sizeRows.length > 1 && (
              <div className="flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
                {sizeRows.map((row, idx) => {
                  const label = row.size || row.portionLabel || `Size ${idx + 1}`;
                  const isActive = idx === recipePortionIdx;
                  return (
                    <button
                      key={row.id}
                      onClick={() => setRecipePortionIdx(idx)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0 16px",
                        height: 34,
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: `1.5px solid ${isActive ? (isB ? "#df4746" : "var(--color-brown)") : "rgba(51,31,46,0.12)"}`,
                        background: isActive ? (isB ? "#df4746" : "var(--color-brown)") : "transparent",
                        color: isActive ? (isB ? "#fff" : "var(--color-cream)") : "var(--color-brown-soft)",
                        transition: "all var(--t-fast) var(--ease-spring)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {sizeRows.length <= 1 && sizeRows[0] && (
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                {sizeRows[0].size || sizeRows[0].portionLabel || "Default Portion"}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Ingredients</label>
                  <button onClick={addRecipeIngredient} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                    <Plus size={14} strokeWidth={2.5} />
                    Add ingredient
                  </button>
                </div>

                {currentPortionRecipe.ingredients.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 20px",
                      color: "var(--color-brown-soft-2)",
                      fontSize: 13,
                      background: "var(--color-cream-deep)",
                      borderRadius: 10,
                    }}
                  >
                    No ingredients yet — add your first ingredient above
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {/* Header */}
                    <div className="hidden sm:flex items-center gap-2 eyebrow" style={{ padding: "4px 8px", fontSize: 10, letterSpacing: "0.08em" }}>
                      <div style={{ flex: "2 1 200px" }}>Ingredient</div>
                      <div style={{ flex: "1 1 120px" }}>Quantity</div>
                      <div style={{ width: 32 }} />
                    </div>
                    {currentPortionRecipe.ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
                        style={{
                          padding: "6px 8px",
                          borderRadius: 10,
                          background: "var(--color-cream-deep)",
                        }}
                      >
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Lamb shoulder"
                          value={ing.name}
                          onChange={(e) => updateRecipeIngredient(idx, "name", e.target.value)}
                          style={{ flex: "2 1 200px", fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., 0.5 lb"
                          value={ing.quantity}
                          onChange={(e) => updateRecipeIngredient(idx, "quantity", e.target.value)}
                          style={{ flex: "1 1 120px", fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                        />
                        <button
                          onClick={() => removeRecipeIngredient(idx)}
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
                            flexShrink: 0,
                          }}
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Steps</label>
                  <button onClick={addRecipeStep} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                    <Plus size={14} strokeWidth={2.5} />
                    Add step
                  </button>
                </div>

                {currentPortionRecipe.steps.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 20px",
                      color: "var(--color-brown-soft-2)",
                      fontSize: 13,
                      background: "var(--color-cream-deep)",
                      borderRadius: 10,
                    }}
                  >
                    No steps yet — add your first step above
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {currentPortionRecipe.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                        style={{
                          padding: "6px 8px",
                          borderRadius: 10,
                          background: "var(--color-cream-deep)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            minWidth: 24,
                            borderRadius: "50%",
                            background: isB ? "rgba(223,71,70,0.08)" : "rgba(51,31,46,0.06)",
                            color: isB ? "#df4746" : "var(--color-brown-soft)",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          className="input"
                          placeholder={`Step ${idx + 1}...`}
                          value={step}
                          onChange={(e) => updateRecipeStep(idx, e.target.value)}
                          style={{ flex: 1, fontSize: 13, padding: "8px 10px", borderRadius: 8, minHeight: 36 }}
                        />
                        <button
                          onClick={() => removeRecipeStep(idx)}
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
                            flexShrink: 0,
                          }}
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Bottom bar (mobile: sticky glass, desktop: inline) ── */}
          <div
            className="create-dish-bottom-bar"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 8,
              paddingBottom: 40,
            }}
          >
            <button
              className="btn btn-ghost"
              onClick={() => handleSave(true)}
            >
              Save as Draft
            </button>
            <button
              className="btn btn-dark"
              style={isB ? { background: "#df4746", border: "none", borderRadius: 12 } : {}}
              onClick={() => handleSave(false)}
            >
              {status === "published" ? "Save" : "Publish"}
            </button>
          </div>
        </div>

        {/* ── Right Sidebar (desktop only) ── */}
        <div
          className="hidden lg:block"
          style={{
            position: "sticky",
            top: 84,
          }}
        >
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
              <div
                className="flex items-center justify-between"
                style={{ marginTop: 8 }}
              >
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
                <span
                  className={`pill ${status === "published" ? "pill-sage" : "pill-orange"}`}
                  style={{ fontSize: 10 }}
                >
                  {status === "published" ? "Published" : "Draft"}
                </span>
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
              style={{
                color: "var(--color-orange)",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "var(--color-orange-text)",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              Dishes with clear, descriptive names get 40% more orders.
            </span>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .create-dish-layout {
            grid-template-columns: 1fr !important;
          }
          .create-dish-bottom-bar {
            position: fixed !important;
            bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important;
            left: 0 !important;
            right: 0 !important;
            padding: 12px 24px !important;
            background: rgba(255, 255, 255, 0.97) !important;
            /* backdrop-filter REMOVED — causes iOS PWA rendering bugs on fixed elements */
            border-top: 1px solid rgba(51, 31, 46, 0.06) !important;
            z-index: 30 !important;
            justify-content: stretch !important;
          }
          .create-dish-bottom-bar .btn {
            flex: 1;
          }
        }
        @media (max-width: 639px) {
          .modifier-row {
            grid-template-columns: 1fr !important;
          }
          .modifier-row > *:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
