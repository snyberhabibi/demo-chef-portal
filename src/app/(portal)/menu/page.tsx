/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, X, ClipboardList, Copy, MoreHorizontal } from "lucide-react";

type DishStatus = "published" | "draft" | "archived";

interface Dish {
  id: string;
  name: string;
  price: number;
  status: DishStatus;
  image: string;
  category: string;
}

const dishes: Dish[] = [
  {
    id: "mansaf",
    name: "Homemade Mansaf",
    price: 100,
    status: "published",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Main Dishes",
  },
  {
    id: "knafeh",
    name: "Pistachio Knafeh",
    price: 18,
    status: "published",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop",
    category: "Desserts",
  },
  {
    id: "baklava",
    name: "Walnut Baklava",
    price: 14,
    status: "published",
    image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
    category: "Desserts",
  },
  {
    id: "shawarma",
    name: "Chicken Shawarma",
    price: 16,
    status: "published",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Main Dishes",
  },
  {
    id: "hummus",
    name: "Smoky Hummus",
    price: 10,
    status: "draft",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop",
    category: "Appetizers",
  },
  {
    id: "falafel",
    name: "Crispy Falafel",
    price: 12,
    status: "published",
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop",
    category: "Appetizers",
  },
  {
    id: "tabouleh",
    name: "Tabouleh Salad",
    price: 11,
    status: "draft",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=450&fit=crop",
    category: "Salads",
  },
  {
    id: "mandi",
    name: "Chicken Mandi",
    price: 22,
    status: "archived",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop",
    category: "Main Dishes",
  },
  {
    id: "fattoush",
    name: "Garden Fattoush",
    price: 10,
    status: "published",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
    category: "Salads",
  },
  {
    id: "kibbeh",
    name: "Lamb Kibbeh",
    price: 16,
    status: "published",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Appetizers",
  },
  {
    id: "manaqish",
    name: "Manaqish",
    price: 8,
    status: "draft",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Bakery",
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

function statusBadge(status: DishStatus) {
  switch (status) {
    case "published":
      return { dot: "var(--color-sage)", bg: "rgba(121,173,99,0.15)", color: "var(--color-sage-deep)", label: "Published" };
    case "draft":
      return { dot: "var(--color-orange)", bg: "rgba(252,157,53,0.15)", color: "var(--color-orange-text)", label: "Draft" };
    case "archived":
      return { dot: "var(--color-brown-soft-2)", bg: "rgba(138,120,132,0.15)", color: "var(--color-brown-soft)", label: "Archived" };
  }
}

export default function MenuPage() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredDishes = dishes.filter((dish) => {
    const passesStatus =
      activeStatus === "All" ||
      (activeStatus === "Published" && dish.status === "published") ||
      (activeStatus === "Draft" && dish.status === "draft") ||
      (activeStatus === "Archived" && dish.status === "archived");
    const passesCategory =
      activeCategory === "All" || dish.category === activeCategory;
    const passesSearch =
      search.trim() === "" ||
      dish.name.toLowerCase().includes(search.toLowerCase());
    return passesStatus && passesCategory && passesSearch;
  });

  const statusFilters = [
    { label: "All", count: dishes.length },
    { label: "Published", count: dishes.filter((d) => d.status === "published").length },
    { label: "Draft", count: dishes.filter((d) => d.status === "draft").length },
    { label: "Archived", count: dishes.filter((d) => d.status === "archived").length },
  ];

  return (
    <div className="section-stack">
      {/* Create Dish Modal */}
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
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 520,
              margin: "0 16px",
              padding: "28px",
              position: "relative",
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
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <X size={18} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-brown)", marginBottom: 4 }}>
              Create New Dish
            </h2>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "0 0 24px 0" }}>
              Choose how you want to create your dish
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/menu/new"
                className="card-hover"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(51,31,46,0.1)",
                  background: "#fff",
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "center",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
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
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)", marginBottom: 4 }}>
                  Create from Scratch
                </div>
                <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                  Start with a blank canvas
                </div>
              </Link>
              <Link
                href="/menu/new"
                className="card-hover"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(51,31,46,0.1)",
                  background: "#fff",
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "center",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
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
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)", marginBottom: 4 }}>
                  Create from Template
                </div>
                <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                  Use a pre-made template
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="fraunces" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              Dishes
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0 0" }}>
              Manage your menu dishes
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn"
            style={{
              background: "var(--color-brown)",
              color: "#fff",
              borderColor: "var(--color-brown)",
            }}
          >
            <Plus size={16} strokeWidth={2} />
            Create Dish
          </button>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => {
          const isActive = f.label === activeStatus;
          return (
            <button
              key={f.label}
              onClick={() => setActiveStatus(f.label)}
              className={`pill ${isActive ? "pill-brown" : ""}`}
              style={{
                cursor: "pointer",
                border: isActive ? undefined : "1px solid rgba(51,31,46,0.1)",
                minHeight: 36,
                fontSize: 13,
              }}
            >
              {f.label}
              <span
                className="tnum"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  opacity: isActive ? 0.7 : 0.5,
                  marginLeft: 2,
                }}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-2"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          marginTop: -8,
          paddingBottom: 2,
        }}
      >
        {categories.map((cat) => {
          const isActive = cat.label === activeCategory;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className="pill"
              style={{
                cursor: "pointer",
                fontSize: 12,
                minHeight: 36,
                background: isActive ? "var(--color-terracotta-soft)" : "transparent",
                border: `1px solid ${isActive ? "var(--color-terracotta)" : "rgba(51,31,46,0.12)"}`,
                color: isActive ? "var(--color-terracotta)" : "var(--color-brown-soft)",
                fontWeight: isActive ? 600 : 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {cat.emoji ? `${cat.emoji} ` : ""}{cat.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          strokeWidth={2}
          className="absolute"
          style={{
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-brown-soft-2)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          className="input"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 40, marginTop: -8 }}
        />
      </div>

      {/* Dish grid */}
      {filteredDishes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u{1F37D}\u{FE0F}"}</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-brown)",
              marginBottom: 6,
            }}
          >
            No dishes yet
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-brown-soft)",
              marginBottom: 20,
            }}
          >
            Create your first dish to start receiving orders
          </div>
          <Link
            href="/menu/new"
            className="btn btn-red"
            style={{ display: "inline-flex" }}
          >
            <Plus size={16} strokeWidth={2} />
            Create Dish
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
            className="sm:!grid-cols-3 md:!grid-cols-3 lg:!grid-cols-4 xl:!grid-cols-5"
          >
            {filteredDishes.map((dish) => {
              const badge = statusBadge(dish.status);
              return (
                <Link
                  key={dish.id}
                  href="/menu/new"
                  className="card-hover bg-white rounded-xl shadow-card overflow-hidden block group"
                  style={{
                    opacity: dish.status === "archived" ? 0.65 : 1,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {/* Image */}
                  <div className="relative" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: "12px 12px 0 0" }}
                    />
                    {/* Status badge overlay */}
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
                    {/* 3-dot menu */}
                    <div
                      className="absolute opacity-0 group-hover:opacity-100"
                      style={{
                        top: 8,
                        right: 8,
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.15s",
                        color: "var(--color-brown)",
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "rgba(51,31,46,0.06)",
                        transition: "opacity 0.15s",
                        borderRadius: "12px 12px 0 0",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  {/* Info */}
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--color-brown-soft-2)",
                        marginBottom: 2,
                      }}
                    >
                      {dish.category}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--color-brown)",
                        lineHeight: 1.3,
                      }}
                    >
                      {dish.name}
                    </div>
                    <div
                      className="tnum"
                      style={{
                        fontSize: 14,
                        color: "var(--color-brown-soft)",
                        marginTop: 3,
                      }}
                    >
                      ${dish.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-between"
            style={{ paddingTop: 8 }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--color-brown-soft)",
              }}
            >
              Showing 1-{filteredDishes.length} of {filteredDishes.length}
            </span>
            <div className="flex gap-1">
              <button
                className="pill pill-brown"
                style={{
                  cursor: "pointer",
                  minWidth: 32,
                  justifyContent: "center",
                }}
              >
                1
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @media (min-width: 640px) {
          .sm\\:!grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .md\\:!grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 1280px) {
          .xl\\:!grid-cols-5 { grid-template-columns: repeat(5, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
