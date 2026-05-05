/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

type DishStatus = "live" | "draft" | "archived";

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
    price: 14,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Mains",
  },
  {
    id: "knafeh",
    name: "Pistachio Knafeh",
    price: 9,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop",
    category: "Desserts",
  },
  {
    id: "baklava",
    name: "Walnut Baklava",
    price: 7,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
    category: "Desserts",
  },
  {
    id: "shawarma",
    name: "Chicken Shawarma",
    price: 12,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Mains",
  },
  {
    id: "hummus",
    name: "Smoky Hummus",
    price: 8,
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop",
    category: "Mezze",
  },
  {
    id: "falafel",
    name: "Crispy Falafel",
    price: 9,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop",
    category: "Mezze",
  },
  {
    id: "tabouleh",
    name: "Tabouleh Salad",
    price: 8,
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
    category: "Salads",
  },
  {
    id: "mandi",
    name: "Chicken Mandi",
    price: 18,
    status: "archived",
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop",
    category: "Mains",
  },
];

const categories = ["All", "Mains", "Desserts", "Mezze", "Salads"] as const;

function dotColor(status: DishStatus) {
  switch (status) {
    case "live":
      return "var(--color-sage)";
    case "draft":
      return "var(--color-orange)";
    case "archived":
      return "var(--color-brown-soft-2)";
  }
}

export default function MenuPage() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDishes = dishes.filter((dish) => {
    const passesStatus =
      activeStatus === "All" ||
      (activeStatus === "Live" && dish.status === "live") ||
      (activeStatus === "Drafts" && dish.status === "draft") ||
      (activeStatus === "Archived" && dish.status === "archived");
    const passesCategory =
      activeCategory === "All" || dish.category === activeCategory;
    return passesStatus && passesCategory;
  });

  const statusFilters = [
    { label: "All", count: dishes.length },
    { label: "Live", count: dishes.filter((d) => d.status === "live").length },
    { label: "Drafts", count: dishes.filter((d) => d.status === "draft").length },
    { label: "Archived", count: dishes.filter((d) => d.status === "archived").length },
  ];

  return (
    <div className="section-stack">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="fraunces" style={{ fontSize: 24, fontWeight: 700 }}>
          Menu
        </h1>
        <div className="flex-1" />
        <Link
          href="/menu/new"
          className="btn btn-red btn-sm"
          style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}
        >
          <Plus size={16} strokeWidth={2} />
          Add Dish
        </Link>
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
                minHeight: 44,
              }}
            >
              {f.label}
              <span
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

      {/* Category pills */}
      <div
        className="flex gap-2"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          marginTop: -8,
        }}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="pill"
              style={{
                cursor: "pointer",
                fontSize: 12,
                minHeight: 44,
                background: isActive
                  ? "var(--color-terracotta-soft)"
                  : "transparent",
                border: `1px solid ${isActive ? "var(--color-terracotta)" : "rgba(51,31,46,0.12)"}`,
                color: isActive
                  ? "var(--color-terracotta)"
                  : "var(--color-brown-soft)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Dish grid */}
      {filteredDishes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83C\uDF7D\uFE0F"}</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-brown)",
              marginBottom: 6,
            }}
          >
            No dishes here yet
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--color-brown-soft)",
              marginBottom: 20,
            }}
          >
            {activeStatus !== "All" || activeCategory !== "All"
              ? "Try changing your filters to see more dishes."
              : "Add your first dish to start building your menu."}
          </div>
          <Link
            href="/menu/new"
            className="btn btn-red btn-sm"
            style={{ display: "inline-flex", minHeight: 44, alignItems: "center" }}
          >
            <Plus size={16} strokeWidth={2} />
            Add Your First Dish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredDishes.map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="bg-white rounded-xl shadow-card overflow-hidden block group"
              style={{
                opacity: dish.status === "archived" ? 0.6 : 1,
                transition: "box-shadow 0.15s, transform 0.15s",
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
                {/* Status dot overlay */}
                <div
                  className="absolute"
                  style={{
                    top: 8,
                    right: 8,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: dotColor(dish.status),
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: "rgba(51,31,46,0.06)",
                    transition: "opacity 0.15s",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
              </div>
              {/* Info */}
              <div style={{ padding: "10px 12px" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    lineHeight: 1.3,
                  }}
                >
                  {dish.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-brown-soft)",
                    marginTop: 2,
                  }}
                >
                  From ${dish.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
