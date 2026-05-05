/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, X, ClipboardList, Copy, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type MenuTab = "dishes" | "bundles" | "sections";

type DishStatus = "published" | "draft" | "archived";

interface Dish {
  id: string;
  name: string;
  price: number;
  status: DishStatus;
  image: string;
  category: string;
  cuisine: string;
}

const dishes: Dish[] = [
  {
    id: "mansaf",
    name: "Homemade Mansaf",
    price: 28,
    status: "published",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Jordanian",
  },
  {
    id: "knafeh",
    name: "Pistachio Knafeh",
    price: 18,
    status: "published",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop",
    category: "Desserts",
    cuisine: "Palestinian",
  },
  {
    id: "baklava",
    name: "Walnut Baklava",
    price: 14,
    status: "published",
    image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
    category: "Desserts",
    cuisine: "Turkish",
  },
  {
    id: "shawarma",
    name: "Chicken Shawarma",
    price: 16,
    status: "published",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Lebanese",
  },
  {
    id: "hummus",
    name: "Smoky Hummus",
    price: 10,
    status: "draft",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Middle Eastern",
  },
  {
    id: "falafel",
    name: "Crispy Falafel",
    price: 12,
    status: "published",
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Egyptian",
  },
  {
    id: "tabouleh",
    name: "Tabouleh Salad",
    price: 11,
    status: "draft",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=450&fit=crop",
    category: "Salads",
    cuisine: "Lebanese",
  },
  {
    id: "mandi",
    name: "Chicken Mandi",
    price: 22,
    status: "archived",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Yemeni",
  },
  {
    id: "fattoush",
    name: "Garden Fattoush",
    price: 10,
    status: "published",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
    category: "Salads",
    cuisine: "Lebanese",
  },
  {
    id: "kibbeh",
    name: "Lamb Kibbeh",
    price: 16,
    status: "published",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Syrian",
  },
  {
    id: "manaqish",
    name: "Manaqish",
    price: 8,
    status: "draft",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Bakery",
    cuisine: "Lebanese",
  },
];

const categories = [
  { label: "All", emoji: "" },
  { label: "Appetizers", emoji: "\u{1F951}" },
  { label: "Main Dishes", emoji: "\u{1F356}" },
  { label: "Soups", emoji: "\u{1F372}" },
  { label: "Salads", emoji: "\u{1F957}" },
  { label: "Bakery", emoji: "\u{1F35E}" },
  { label: "Pastries", emoji: "\u{1F353}" },
  { label: "Desserts", emoji: "\u{1F370}" },
  { label: "Coffee", emoji: "\u2615" },
  { label: "Drinks", emoji: "\u{1F37A}" },
];

function dishStatusBadge(status: DishStatus) {
  switch (status) {
    case "published":
      return { dot: "var(--color-sage)", bg: "rgba(121,173,99,0.15)", color: "var(--color-sage-deep)", label: "Published" };
    case "draft":
      return { dot: "var(--color-orange)", bg: "rgba(252,157,53,0.15)", color: "var(--color-orange-text)", label: "Draft" };
    case "archived":
      return { dot: "var(--color-brown-soft-2)", bg: "rgba(138,120,132,0.15)", color: "var(--color-brown-soft)", label: "Archived" };
  }
}

/* ── Bundles data ── */
type BundleStatus = "published" | "draft" | "archived";

interface Bundle {
  id: number;
  name: string;
  image: string;
  items: number;
  price: number;
  status: BundleStatus;
}

const BUNDLES: Bundle[] = [
  { id: 1, name: "Family Dinner for 4", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", items: 5, price: 65, status: "published" },
  { id: 2, name: "Weekly Meal Prep", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop", items: 7, price: 75, status: "published" },
  { id: 3, name: "Mezze Tasting Plate", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", items: 4, price: 42, status: "draft" },
  { id: 4, name: "Sweet Tooth Box", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop", items: 3, price: 32, status: "published" },
];

function bundleStatusBadge(status: BundleStatus) {
  switch (status) {
    case "published":
      return { dot: "var(--color-sage)", bg: "rgba(121,173,99,0.15)", color: "var(--color-sage-deep)", label: "Published" };
    case "draft":
      return { dot: "var(--color-orange)", bg: "rgba(252,157,53,0.15)", color: "var(--color-orange-text)", label: "Draft" };
    case "archived":
      return { dot: "var(--color-brown-soft-2)", bg: "rgba(138,120,132,0.15)", color: "var(--color-brown-soft)", label: "Archived" };
  }
}

/* ── Sections data ── */
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

let nextSectionId = 5;

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
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState<MenuTab>("dishes");

  /* Dishes state */
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

  const { toast } = useToast();

  /* ── Dishes filtering ── */
  const filteredDishes = dishes.filter((dish) => {
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
    { label: "All", count: dishes.length },
    { label: "Published", count: dishes.filter((d) => d.status === "published").length },
    { label: "Draft", count: dishes.filter((d) => d.status === "draft").length },
    { label: "Archived", count: dishes.filter((d) => d.status === "archived").length },
  ];

  /* ── Bundles filtering ── */
  const filteredBundles = BUNDLES.filter((b) => {
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
    { label: "All", count: BUNDLES.length },
    { label: "Published", count: BUNDLES.filter((b) => b.status === "published").length },
    { label: "Draft", count: BUNDLES.filter((b) => b.status === "draft").length },
    { label: "Archived", count: BUNDLES.filter((b) => b.status === "archived").length },
  ];

  /* ── Sections handlers ── */
  const handleCreateSection = () => {
    const newSection: Section = {
      id: nextSectionId++,
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
    <div className="content-wide section-stack page-fade">
      {/* ── Create Dish Modal ── */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(51,31,46,0.4)",
            backdropFilter: "blur(6px)",
            animation: "fadeIn 0.15s ease-out both",
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 480,
              margin: "0 16px",
              position: "relative",
              animation: "scaleIn 0.2s var(--ease-spring) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                color: "var(--color-brown-soft-2)",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                transition: "color var(--t-fast)",
              }}
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
                  <Copy size={22} strokeWidth={1.8} />
                </div>
                <div className="heading-sm" style={{ marginBottom: 4 }}>
                  From Template
                </div>
                <div className="body-sm">
                  Use a pre-made template
                </div>
              </Link>
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
              <h1 className="heading-lg">Dishes</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-dark"
              style={{ gap: 6, transition: "box-shadow var(--t-fast)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(51,31,46,0.25)"; }}
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
                const isActive = cat.label === activeCategory;
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
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      border: `1px solid ${isActive ? "var(--color-terracotta)" : "rgba(51,31,46,0.1)"}`,
                      background: isActive ? "var(--color-terracotta-soft)" : "transparent",
                      color: isActive ? "var(--color-terracotta)" : "var(--color-brown-soft)",
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
          <div style={{ position: "relative", width: "100%" }}>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm sm:text-sm"
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
          </div>

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
                    className="card-photo group overflow-hidden rounded-[16px] relative"
                    style={{
                      padding: 0,
                      opacity: dish.status === "archived" ? 0.6 : 1,
                    }}
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
                            background: "rgba(51,31,46,0.05)",
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
                            onClick={(e) => { e.stopPropagation(); toast("Dish archived"); setOpenMenuId(null); }}
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
                            onClick={(e) => { e.stopPropagation(); toast("Dish deleted"); setOpenMenuId(null); }}
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
              <h1 className="heading-lg">Bundles</h1>
              <p className="body-sm" style={{ marginTop: 4 }}>
                Create curated meal bundles to increase average order value
              </p>
            </div>
            <Link href="/menu/new" className="btn btn-dark" style={{ gap: 6, textDecoration: "none" }}>
              <Plus size={18} strokeWidth={2.5} />
              Create Bundle
            </Link>
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
          <div style={{ position: "relative", width: "100%" }}>
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
              value={bundleSearch}
              onChange={(e) => setBundleSearch(e.target.value)}
              className="text-sm sm:text-sm"
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
          </div>

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
                  className="card card-photo card-hover group"
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
              <h1 className="heading-lg">Custom Menu Sections</h1>
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
                    <div className="heading-sm" style={{ fontSize: 15 }}>{section.name}</div>
                  </div>
                  <span className="caption tnum" style={{ flexShrink: 0 }}>{section.dishCount} dishes</span>
                  <span className={`pill ${section.active ? "pill-sage" : "pill-orange"}`} style={{ flexShrink: 0, fontSize: 11 }}>
                    {section.active ? "Active" : "Inactive"}
                  </span>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <button
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
                        style={{
                          position: "absolute", top: 38, right: 0, width: 140,
                          background: "#fff", borderRadius: 10,
                          boxShadow: "0 4px 16px rgba(51,31,46,0.12)", overflow: "hidden", zIndex: 20,
                        }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toast(`Renamed: ${section.name}`); setOpenSectionMenuId(null); }}
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
                            toast(`Deleted: ${section.name}`);
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
