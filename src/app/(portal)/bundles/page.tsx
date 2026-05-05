/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

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
  {
    id: 1,
    name: "Family Dinner for 4",
    image: "https://images.unsplash.com/photo-1542528180-a1208c5169a5?w=600&h=450&fit=crop",
    items: 5,
    price: 65,
    status: "published",
  },
  {
    id: 2,
    name: "Weekly Meal Prep",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=450&fit=crop",
    items: 7,
    price: 75,
    status: "published",
  },
  {
    id: 3,
    name: "Mezze Tasting Plate",
    image: "https://images.unsplash.com/photo-1542528180-a1208c5169a5?w=600&h=450&fit=crop",
    items: 4,
    price: 42,
    status: "draft",
  },
  {
    id: 4,
    name: "Sweet Tooth Box",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=450&fit=crop",
    items: 3,
    price: 32,
    status: "published",
  },
];

function statusBadge(status: BundleStatus) {
  switch (status) {
    case "published":
      return { dot: "var(--color-sage)", bg: "rgba(121,173,99,0.15)", color: "var(--color-sage-deep)", label: "Published" };
    case "draft":
      return { dot: "var(--color-orange)", bg: "rgba(252,157,53,0.15)", color: "var(--color-orange-text)", label: "Draft" };
    case "archived":
      return { dot: "var(--color-brown-soft-2)", bg: "rgba(138,120,132,0.15)", color: "var(--color-brown-soft)", label: "Archived" };
  }
}

export default function BundlesPage() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredBundles = BUNDLES.filter((b) => {
    const passesStatus =
      activeStatus === "All" ||
      (activeStatus === "Published" && b.status === "published") ||
      (activeStatus === "Draft" && b.status === "draft") ||
      (activeStatus === "Archived" && b.status === "archived");
    const passesSearch =
      search.trim() === "" ||
      b.name.toLowerCase().includes(search.toLowerCase());
    return passesStatus && passesSearch;
  });

  const statusFilters = [
    { label: "All", count: BUNDLES.length },
    { label: "Published", count: BUNDLES.filter((b) => b.status === "published").length },
    { label: "Draft", count: BUNDLES.filter((b) => b.status === "draft").length },
    { label: "Archived", count: BUNDLES.filter((b) => b.status === "archived").length },
  ];

  return (
    <div className="section-stack">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="fraunces" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              Bundles
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0 0" }}>
              Create curated meal bundles to increase average order value
            </p>
          </div>
          <Link
            href="/menu/new"
            className="btn"
            style={{
              background: "var(--color-brown)",
              color: "#fff",
              borderColor: "var(--color-brown)",
              textDecoration: "none",
            }}
          >
            <Plus size={16} strokeWidth={2} />
            Create Bundle
          </Link>
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

      {/* Search */}
      <div className="relative" style={{ marginTop: -8 }}>
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
          placeholder="Search bundles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Bundle grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {filteredBundles.map((bundle) => {
          const badge = statusBadge(bundle.status);
          return (
            <Link
              key={bundle.id}
              href="/menu/new"
              className="card-hover bg-white rounded-xl shadow-card overflow-hidden block group"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* Image */}
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={bundle.image}
                  alt={bundle.name}
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
                {/* Item count pill */}
                <div
                  className="absolute pill pill-sage"
                  style={{
                    bottom: 8,
                    left: 8,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {bundle.items} items
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
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                    lineHeight: 1.3,
                  }}
                >
                  {bundle.name}
                </div>
                <div
                  className="tnum"
                  style={{
                    fontSize: 14,
                    color: "var(--color-brown-soft)",
                    marginTop: 3,
                  }}
                >
                  From ${bundle.price.toFixed(2)}
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
          Showing 1-{filteredBundles.length} of {filteredBundles.length}
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
    </div>
  );
}
