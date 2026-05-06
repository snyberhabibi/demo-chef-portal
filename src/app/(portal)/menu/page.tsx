/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, Search, X, ClipboardList, Copy, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import {
  dishes,
  menuCategories as categories,
  bundles as BUNDLES,
  menuSections as INITIAL_SECTIONS,
  type DishStatus,
  type Dish,
  type Bundle,
  type MenuSection,
} from "@/lib/mock-data";
import { dishStatusBadge } from "@/lib/utils/status-helpers";
import { useDesignMode } from "@/lib/design-mode";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type MenuTab = "dishes" | "bundles" | "sections";

/* dishes, categories, BUNDLES, INITIAL_SECTIONS imported from @/lib/mock-data */

/* bundleStatusBadge is identical to dishStatusBadge — reuse from shared helpers */
const bundleStatusBadge = dishStatusBadge;

/* ── Sections data — imported from @/lib/mock-data ── */
type Section = MenuSection;

/* ── Tab definitions ── */
const TABS: { key: MenuTab; label: string }[] = [
  { key: "dishes", label: "Dishes" },
  { key: "bundles", label: "Bundles" },
  { key: "sections", label: "Sections" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function MenuPage() {
  const { mode } = useDesignMode();
  const isB = mode === "b";

  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState<MenuTab>("dishes");

  /* Dishes state */
  const [localDishes, setLocalDishes] = useState<Dish[]>(dishes);
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* Bundles state */
  const [bundleStatus, setBundleStatus] = useState("All");
  const [bundleSearch, setBundleSearch] = useState("");

  /* Sections state */
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [openSectionMenuId, setOpenSectionMenuId] = useState<number | null>(null);
  const [renamingSectionId, setRenamingSectionId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  /* Bundle creator state */
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set());
  const [localBundles, setLocalBundles] = useState<Bundle[]>(BUNDLES);

  const { toast } = useToast();
  const menuPageRef = useRef<HTMLDivElement>(null);
  const nextSectionIdRef = useRef(5);
  const nextBundleIdRef = useRef(BUNDLES.length + 1);

  /* ── Body overflow management for modals ── */
  useEffect(() => {
    if (showCreateModal || showBundleModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showCreateModal, showBundleModal]);

  /* Click-outside to close dish card and section row dropdown menus */
  useEffect(() => {
    if (openMenuId === null && openSectionMenuId === null) return;
    const handler = (e: MouseEvent) => {
      if (menuPageRef.current && !menuPageRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setOpenSectionMenuId(null);
        return;
      }
      /* Close if clicked outside any dropdown trigger/menu */
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-trigger]") && !target.closest("[data-menu-dropdown]")) {
        setOpenMenuId(null);
        setOpenSectionMenuId(null);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [openMenuId, openSectionMenuId]);

  /* ── Dishes filtering ── */
  const filteredDishes = localDishes.filter((dish) => {
    const passesStatus =
      activeStatus === "All" ||
      (activeStatus === "Published" && dish.status === "published") ||
      (activeStatus === "Draft" && dish.status === "draft") ||
      (activeStatus === "Archived" && dish.status === "archived");
    const passesCategory =
      activeCategory === "All" || dish.category === activeCategory;
    const q = search.trim().toLowerCase();
    const passesSearch =
      q === "" ||
      dish.name.toLowerCase().includes(q) ||
      dish.category.toLowerCase().includes(q) ||
      dish.cuisine.toLowerCase().includes(q);
    return passesStatus && passesCategory && passesSearch;
  });

  const statusFilters = [
    { label: "All", count: localDishes.length },
    { label: "Published", count: localDishes.filter((d) => d.status === "published").length },
    { label: "Draft", count: localDishes.filter((d) => d.status === "draft").length },
    { label: "Archived", count: localDishes.filter((d) => d.status === "archived").length },
  ];

  /* ── Bundles filtering ── */
  const filteredBundles = localBundles.filter((b) => {
    const passesStatus =
      bundleStatus === "All" ||
      (bundleStatus === "Published" && b.status === "published") ||
      (bundleStatus === "Draft" && b.status === "draft") ||
      (bundleStatus === "Archived" && b.status === "archived");
    const passesSearch =
      bundleSearch.trim() === "" ||
      b.name.toLowerCase().includes(bundleSearch.toLowerCase());
    return passesStatus && passesSearch;
  });

  const bundleStatusFilters = [
    { label: "All", count: localBundles.length },
    { label: "Published", count: localBundles.filter((b) => b.status === "published").length },
    { label: "Draft", count: localBundles.filter((b) => b.status === "draft").length },
    { label: "Archived", count: localBundles.filter((b) => b.status === "archived").length },
  ];

  /* ── Bundle creator handlers ── */
  const openBundleCreator = () => {
    setBundleName("");
    setBundlePrice("");
    setSelectedDishIds(new Set());
    setShowBundleModal(true);
  };

  const toggleDishInBundle = (dishId: string) => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev);
      if (next.has(dishId)) next.delete(dishId);
      else next.add(dishId);
      return next;
    });
  };

  const saveBundle = () => {
    const name = bundleName.trim();
    const price = parseFloat(bundlePrice);
    if (!name) { toast("Bundle name is required", "warning"); return; }
    if (isNaN(price) || price <= 0) { toast("Enter a valid price", "warning"); return; }
    if (selectedDishIds.size === 0) { toast("Select at least one dish", "warning"); return; }
    const newBundle: Bundle = {
      id: nextBundleIdRef.current++,
      name,
      image: dishes.find((d) => selectedDishIds.has(d.id))?.image || "/food/bundle-placeholder.jpg",
      items: selectedDishIds.size,
      price,
      status: "draft",
    };
    setLocalBundles((prev) => [...prev, newBundle]);
    setShowBundleModal(false);
    toast(`Bundle "${name}" created as draft`);
  };

  /* ── Sections handlers ── */
  const handleCreateSection = () => {
    const newSection: Section = {
      id: nextSectionIdRef.current++,
      name: `New Section ${sections.length + 1}`,
      dishCount: 0,
      active: true,
    };
    setSections((prev) => [...prev, newSection]);
    toast("Section created");
  };

  if (!loaded) {
    return (
      <div className="content-wide section-stack page-fade">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="content-wide section-stack page-fade page-enter">
      {/* ── Create Dish Modal ── */}
      {showCreateModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 70 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          {/* Backdrop */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(51,31,46,0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }} onClick={() => setShowCreateModal(false)} />

          {/* Desktop: centered card / Mobile: bottom-sheet style */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            pointerEvents: "none",
          }}
          className="create-dish-modal-container"
          >
            <div
              className="card create-dish-modal"
              style={{
                width: "100%",
                maxWidth: 400,
                maxHeight: "80dvh",
                overflowY: "auto",
                margin: "0",
                position: "relative",
                animation: "scaleIn 0.2s var(--ease-spring) both",
                pointerEvents: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(51,31,46,0.06)",
                  border: "none",
                  color: "var(--color-brown-soft)",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "background var(--t-fast), color var(--t-fast)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(51,31,46,0.1)"; e.currentTarget.style.color = "var(--color-brown)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(51,31,46,0.06)"; e.currentTarget.style.color = "var(--color-brown-soft)"; }}
              >
                <X size={16} />
              </button>

              <h2 className="heading-md" style={{ marginBottom: 4 }}>
                Create New Dish
              </h2>
              <p className="body-sm" style={{ margin: "0 0 24px 0" }}>
                Choose how you want to create your dish
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Link
                  href="/menu/new"
                  className="card card-hover"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "28px 16px",
                    textDecoration: "none",
                    color: "inherit",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "var(--color-cream-deep)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                      color: "var(--color-brown)",
                    }}
                  >
                    <ClipboardList size={22} strokeWidth={1.8} />
                  </div>
                  <div className="heading-sm" style={{ marginBottom: 4 }}>
                    From Scratch
                  </div>
                  <div className="body-sm">
                    Start with a blank canvas
                  </div>
                </Link>

                <button
                  onClick={() => {
                    toast("Template library \u2014 coming soon", "info");
                    setShowCreateModal(false);
                  }}
                  className="card card-hover"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "28px 16px",
                    textDecoration: "none",
                    color: "inherit",
                    textAlign: "center",
                    cursor: "pointer",
                    border: "none",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "var(--color-cream-deep)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                      color: "var(--color-brown)",
                    }}
                  >
                    <Copy size={22} strokeWidth={1.8} />
                  </div>
                  <div className="heading-sm" style={{ marginBottom: 4 }}>
                    From Template
                  </div>
                  <div className="body-sm">
                    Use a pre-made template
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Bundle Modal ── */}
      {showBundleModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 70 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBundleModal(false); }}
        >
          {/* Backdrop */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(51,31,46,0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }} onClick={() => setShowBundleModal(false)} />

          {/* Modal content */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            pointerEvents: "none",
          }}
          className="create-dish-modal-container"
          >
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: 480,
                margin: "0",
                position: "relative",
                animation: "scaleIn 0.2s var(--ease-spring) both",
                pointerEvents: "auto",
                maxHeight: "80dvh",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowBundleModal(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(51,31,46,0.06)",
                  border: "none",
                  color: "var(--color-brown-soft)",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <X size={16} />
              </button>

              <h2 className="heading-md" style={{ marginBottom: 4 }}>
                Create New Bundle
              </h2>
              <p className="body-sm" style={{ margin: "0 0 20px 0" }}>
                Combine dishes into a curated meal bundle
              </p>

              {/* Bundle Name */}
              <div style={{ marginBottom: 14 }}>
                <label className="caption" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Bundle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Family Feast, Date Night Box"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  style={{
                    width: "100%",
                    height: 42,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(51,31,46,0.12)",
                    background: "#fff",
                    color: "var(--color-brown)",
                    fontSize: 14,
                  }}
                />
              </div>

              {/* Bundle Price */}
              <div style={{ marginBottom: 16 }}>
                <label className="caption" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="29.99"
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                  style={{
                    width: "100%",
                    height: 42,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(51,31,46,0.12)",
                    background: "#fff",
                    color: "var(--color-brown)",
                    fontSize: 14,
                  }}
                />
              </div>

              {/* Dish Selection */}
              <div style={{ marginBottom: 16 }}>
                <label className="caption" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  Select Dishes ({selectedDishIds.size} selected)
                </label>
                <div style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  border: "1px solid rgba(51,31,46,0.08)",
                  borderRadius: 12,
                }}>
                  {dishes.filter((d) => d.status === "published").map((dish) => {
                    const isSelected = selectedDishIds.has(dish.id);
                    return (
                      <label
                        key={dish.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(51,31,46,0.04)",
                          background: isSelected ? "rgba(223,71,70,0.04)" : "transparent",
                          transition: "background var(--t-fast)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDishInBundle(dish.id)}
                          style={{ width: 18, height: 18, accentColor: "#df4746", flexShrink: 0 }}
                        />
                        <img
                          src={dish.image}
                          alt={dish.name}
                          style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)", lineHeight: 1.3 }}>
                            {dish.name}
                          </div>
                          <div className="caption">{dish.category}</div>
                        </div>
                        <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown-soft)", flexShrink: 0 }}>
                          ${dish.price.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setShowBundleModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  style={{
                    flex: 1,
                    background: "#df4746",
                    border: "none",
                    borderRadius: 12,
                    opacity: bundleName.trim() && bundlePrice && selectedDishIds.size > 0 ? 1 : 0.5,
                  }}
                  onClick={saveBundle}
                >
                  Save Bundle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? "var(--color-red)" : "var(--color-brown-soft)",
              borderBottom: activeTab === t.key ? "2px solid var(--color-red)" : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
              transition: "color var(--t-fast) var(--ease-spring)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ DISHES TAB ══ */}
      {activeTab === "dishes" && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`heading-lg${isB ? " heading-gradient" : ""}`}>Dishes</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-dark"
              style={{ gap: 6, transition: "box-shadow var(--t-fast)", ...(isB ? { background: "#df4746", border: "none", borderRadius: 12 } : {}) }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = isB ? "0 0 20px rgba(223,71,70,0.4)" : "0 0 20px rgba(51,31,46,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <Plus size={18} strokeWidth={2.5} />
              Create Dish
            </button>
          </div>

          {/* Filters Row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {statusFilters.map((f) => {
                const isActive = f.label === activeStatus;
                return (
                  <button
                    key={f.label}
                    onClick={() => setActiveStatus(f.label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "0 12px",
                      height: 32,
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isActive ? "none" : "1px solid rgba(51,31,46,0.1)",
                      background: isActive ? "var(--color-brown)" : "transparent",
                      color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                      transition: "all var(--t-fast) var(--ease-spring)",
                    }}
                  >
                    {f.label}
                    <span className="tnum" style={{ fontSize: 11, fontWeight: 700, opacity: isActive ? 0.7 : 0.5 }}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ width: 1, height: 20, background: "rgba(51,31,46,0.1)" }} />

            <div
              style={{
                display: "flex",
                gap: 6,
                flex: 1,
                overflowX: "auto",
                scrollbarWidth: "none",
                paddingBottom: 2,
                maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%)",
              }}
            >
              {categories.map((cat) => {
                const isCatActive = cat.label === activeCategory;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "0 10px",
                      height: 32,
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: isCatActive ? 600 : 500,
                      cursor: "pointer",
                      border: isB ? "none" : `1px solid ${isCatActive ? "var(--color-terracotta)" : "rgba(51,31,46,0.1)"}`,
                      background: isB
                        ? (isCatActive ? "#df4746" : "rgba(223,71,70,0.08)")
                        : (isCatActive ? "var(--color-terracotta-soft)" : "transparent"),
                      color: isB
                        ? (isCatActive ? "#fff" : "var(--color-brown-soft)")
                        : (isCatActive ? "var(--color-terracotta)" : "var(--color-brown-soft)"),
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "all var(--t-fast) var(--ease-spring)",
                    }}
                  >
                    {cat.emoji && <span style={{ fontSize: 14 }}>{cat.emoji}</span>}
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Search bar */}
          <form role="search" onSubmit={(e) => e.preventDefault()} style={{ position: "relative", width: "100%" }}>
            <Search
              size={16}
              strokeWidth={2}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-brown-soft-2)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, category, or cuisine..."
              aria-label="Search dishes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=""
              style={{
                width: "100%",
                height: 44,
                paddingLeft: 40,
                paddingRight: 14,
                borderRadius: 10,
                border: "1px solid rgba(51,31,46,0.1)",
                background: "#fff",
                color: "var(--color-brown)",
              }}
            />
          </form>

          {/* Dish Grid */}
          {filteredDishes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u{1F37D}\u{FE0F}"}</div>
              <div className="heading-md" style={{ marginBottom: 6 }}>
                No dishes yet
              </div>
              <p className="body-sm" style={{ marginBottom: 24 }}>
                Create your first dish to start receiving orders
              </p>
              <Link href="/menu/new" className="btn btn-dark" style={{ display: "inline-flex", gap: 6 }}>
                <Plus size={18} strokeWidth={2.5} />
                Create Dish
              </Link>
            </div>
          ) : (
            <div
              className="line-reveal"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {filteredDishes.map((dish) => {
                const badge = dishStatusBadge(dish.status);
                const isMenuOpen = openMenuId === dish.id;
                return (
                  <div
                    key={dish.id}
                    className={`card-photo card-interactive group overflow-hidden relative rounded-[16px]`}
                    style={{
                      padding: 0,
                      opacity: dish.status === "archived" ? 0.6 : 1,
                      transition: "box-shadow 0.3s ease",
                      ...(isB ? { borderLeft: "none" } : {}),
                    }}
                    onMouseEnter={(e) => { if (isB) e.currentTarget.style.boxShadow = "0 0 24px rgba(223,71,70,0.15)"; }}
                    onMouseLeave={(e) => { if (isB) e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Link
                      href={`/menu/new?edit=${dish.id}`}
                      onClick={() => toast(`Editing: ${dish.name}`)}
                      style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                      <div className="relative" style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03]"
                          style={{ borderRadius: "16px 16px 0 0", transition: "transform 0.4s var(--ease-spring)" }}
                        />
                        <div
                          className="absolute"
                          style={{
                            top: 8,
                            left: 8,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px 3px 8px",
                            borderRadius: 9999,
                            background: badge.bg,
                            backdropFilter: "blur(8px)",
                            fontSize: 11,
                            fontWeight: 600,
                            color: badge.color,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: badge.dot,
                              flexShrink: 0,
                            }}
                          />
                          {badge.label}
                        </div>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          style={{
                            background: isB ? "rgba(223,71,70,0.06)" : "rgba(51,31,46,0.05)",
                            transition: "opacity var(--t-fast)",
                            borderRadius: "16px 16px 0 0",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                      <div style={{ padding: "10px 14px 14px" }}>
                        <div className="caption" style={{ marginBottom: 2 }}>
                          {dish.category}
                        </div>
                        <div className="heading-sm" style={{ fontSize: 14, lineHeight: 1.3 }}>
                          {dish.name}
                        </div>
                        <div className="body-sm tnum" style={{ marginTop: 3 }}>
                          ${dish.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>

                    <div
                      className="absolute opacity-100"
                      style={{
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        transition: "opacity var(--t-fast)",
                      }}
                    >
                      <button
                        data-menu-trigger="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : dish.id);
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-brown)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {isMenuOpen && (
                        <div
                          data-menu-dropdown="true"
                          style={{
                            position: "absolute",
                            top: 34,
                            right: 0,
                            width: 140,
                            background: "#fff",
                            borderRadius: 10,
                            boxShadow: "0 4px 16px rgba(51,31,46,0.12)",
                            overflow: "hidden",
                            zIndex: 20,
                          }}
                        >
                          <Link
                            href={`/menu/new?edit=${dish.id}`}
                            onClick={() => { toast(`Editing ${dish.name}`); setOpenMenuId(null); }}
                            style={{
                              display: "block",
                              padding: "10px 14px",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--color-brown)",
                              textDecoration: "none",
                              borderBottom: "1px solid rgba(51,31,46,0.06)",
                            }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocalDishes((prev) => prev.map((d) => d.id === dish.id ? { ...d, status: "archived" as DishStatus } : d));
                              toast("Dish archived", "warning");
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
                            Archive
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocalDishes((prev) => prev.filter((d) => d.id !== dish.id));
                              toast("Dish deleted", "warning");
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
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ══ BUNDLES TAB ══ */}
      {activeTab === "bundles" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`heading-lg${isB ? " heading-gradient" : ""}`}>Bundles</h1>
              <p className="body-sm" style={{ marginTop: 4 }}>
                Create curated meal bundles to increase average order value
              </p>
            </div>
            <button className="btn btn-dark" style={{ gap: 6 }} onClick={openBundleCreator}>
              <Plus size={18} strokeWidth={2.5} />
              Create Bundle
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {bundleStatusFilters.map((f) => {
                const isActive = f.label === bundleStatus;
                return (
                  <button
                    key={f.label}
                    onClick={() => setBundleStatus(f.label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "0 12px",
                      height: 32,
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isActive ? "none" : "1px solid rgba(51,31,46,0.1)",
                      background: isActive ? "var(--color-brown)" : "transparent",
                      color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                      transition: "all var(--t-fast) var(--ease-spring)",
                    }}
                  >
                    {f.label}
                    <span className="tnum" style={{ fontSize: 11, fontWeight: 700, opacity: isActive ? 0.7 : 0.5 }}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Search bar */}
          <form role="search" onSubmit={(e) => e.preventDefault()} style={{ position: "relative", width: "100%" }}>
            <Search
              size={16}
              strokeWidth={2}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-brown-soft-2)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search bundles..."
              aria-label="Search bundles"
              value={bundleSearch}
              onChange={(e) => setBundleSearch(e.target.value)}
              className=""
              style={{
                width: "100%",
                height: 44,
                paddingLeft: 40,
                paddingRight: 14,
                borderRadius: 10,
                border: "1px solid rgba(51,31,46,0.1)",
                background: "#fff",
                color: "var(--color-brown)",
              }}
            />
          </form>

          <div
            className="line-reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {filteredBundles.map((bundle) => {
              const badge = bundleStatusBadge(bundle.status);
              return (
                <Link
                  key={bundle.id}
                  href="/menu/new"
                  className="card card-photo card-interactive group"
                  style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit" }}
                >
                  <div className="relative" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: "16px 16px 0 0" }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: 8, left: 8, display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 10px 3px 8px", borderRadius: 9999,
                        background: badge.bg, backdropFilter: "blur(8px)", fontSize: 11, fontWeight: 600, color: badge.color,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.dot, flexShrink: 0 }} />
                      {badge.label}
                    </div>
                    <div className="absolute pill pill-sage" style={{ bottom: 8, left: 8, fontSize: 11, fontWeight: 600 }}>
                      {bundle.items} items
                    </div>
                    <div
                      className="absolute opacity-0 group-hover:opacity-100"
                      style={{
                        top: 8, right: 8, width: 30, height: 30, borderRadius: 8,
                        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "opacity var(--t-fast)", color: "var(--color-brown)",
                      }}
                    >
                      <MoreHorizontal size={15} />
                    </div>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "rgba(51,31,46,0.05)", transition: "opacity var(--t-fast)",
                        borderRadius: "16px 16px 0 0", pointerEvents: "none",
                      }}
                    />
                  </div>
                  <div style={{ padding: "10px 14px 14px" }}>
                    <div className="heading-sm" style={{ fontSize: 14, lineHeight: 1.3 }}>{bundle.name}</div>
                    <div className="body-sm tnum" style={{ marginTop: 3 }}>From ${bundle.price.toFixed(2)}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="card-cream" style={{ marginTop: 24, padding: 16 }}>
            <div className="heading-sm">Bundle Customizations</div>
            <div className="body-sm" style={{ marginTop: 4 }}>
              Bundles support &ldquo;Pick Your Own&rdquo; quantity selection &mdash; customers choose N items from your options with +/- steppers.
              <Link href="/menu/new" style={{ color: "var(--color-red)", fontWeight: 600 }}> Create a bundle with quantity selection &rarr;</Link>
            </div>
            <div className="body-sm" style={{ marginTop: 10, color: "var(--color-brown-soft)", fontStyle: "italic" }}>
              Bundle creation uses the same form as dishes. Select &ldquo;Weekly cutoff&rdquo; lead time for meal prep bundles.
            </div>
          </div>

        </>
      )}

      {/* ══ SECTIONS TAB ══ */}
      {activeTab === "sections" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`heading-lg${isB ? " heading-gradient" : ""}`}>Custom Menu Sections</h1>
              <p className="body-sm" style={{ marginTop: 4 }}>
                Organize how sections appear on your store-front
              </p>
            </div>
            <button className="btn btn-dark" style={{ gap: 6 }} onClick={handleCreateSection}>
              <Plus size={18} strokeWidth={2.5} />
              Create Section
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {sections.map((section, i) => (
              <div key={section.id}>
                {i > 0 && <div className="divider" />}
                <div
                  className="flex items-center gap-3 group"
                  style={{
                    padding: "0 16px", minHeight: 52, transition: "background var(--t-fast)",
                    cursor: "pointer", position: "relative",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--color-cream-deep)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <span
                    className="tnum"
                    style={{
                      width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 6, background: "var(--color-cream-sunken)", fontSize: 12,
                      fontWeight: 700, color: "var(--color-brown-soft-2)", flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {renamingSectionId === section.id ? (
                      <input
                        type="text"
                        className="input"
                        value={renameValue}
                        autoFocus
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const trimmed = renameValue.trim();
                            if (trimmed) {
                              setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, name: trimmed } : s));
                              toast(`Section renamed to "${trimmed}"`);
                            }
                            setRenamingSectionId(null);
                          } else if (e.key === "Escape") {
                            setRenamingSectionId(null);
                          }
                        }}
                        onBlur={() => {
                          const trimmed = renameValue.trim();
                          if (trimmed && trimmed !== section.name) {
                            setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, name: trimmed } : s));
                            toast(`Section renamed to "${trimmed}"`);
                          }
                          setRenamingSectionId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: 15, fontWeight: 600, padding: "4px 8px", borderRadius: 8, minHeight: 32 }}
                      />
                    ) : (
                      <div className="heading-sm" style={{ fontSize: 15 }}>{section.name}</div>
                    )}
                  </div>
                  <span className="caption tnum" style={{ flexShrink: 0 }}>{section.dishCount} dishes</span>
                  <span className={`pill ${section.active ? "pill-sage" : "pill-orange"}`} style={{ flexShrink: 0, fontSize: 11 }}>
                    {section.active ? "Active" : "Inactive"}
                  </span>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <button
                      data-menu-trigger="true"
                      style={{
                        background: "none", border: "none", color: "var(--color-brown-soft-2)",
                        padding: 4, cursor: "pointer", width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 8, transition: "color var(--t-fast)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSectionMenuId(openSectionMenuId === section.id ? null : section.id);
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openSectionMenuId === section.id && (
                      <div
                        data-menu-dropdown="true"
                        style={{
                          position: "absolute", top: 38, right: 0, width: 140,
                          background: "#fff", borderRadius: 10,
                          boxShadow: "0 4px 16px rgba(51,31,46,0.12)", overflow: "hidden", zIndex: 20,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingSectionId(section.id);
                            setRenameValue(section.name);
                            setOpenSectionMenuId(null);
                          }}
                          style={{
                            display: "block", width: "100%", padding: "10px 14px", fontSize: 13, fontWeight: 500,
                            color: "var(--color-brown)", background: "none", border: "none",
                            borderBottom: "1px solid rgba(51,31,46,0.06)", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast(`Deleted: ${section.name}`, "warning");
                            setSections((prev) => prev.filter((s) => s.id !== section.id));
                            setOpenSectionMenuId(null);
                          }}
                          style={{
                            display: "block", width: "100%", padding: "10px 14px", fontSize: 13, fontWeight: 500,
                            color: "var(--color-red)", background: "none", border: "none", cursor: "pointer", textAlign: "left",
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
        </>
      )}
    </div>
  );
}
