/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal } from "lucide-react";

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
    <div className="content-wide section-stack page-fade">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Bundles</h1>
          <p className="body-sm" style={{ marginTop: 4 }}>
            Create curated meal bundles to increase average order value
          </p>
        </div>
        <Link href="/menu/new" className="btn btn-dark" style={{ textDecoration: "none" }}>
          <Plus size={16} strokeWidth={2.2} />
          Create Bundle
        </Link>
      </div>

      {/* ── Filters Row ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        {/* Status pills */}
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

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div className="relative" style={{ width: 280, flexShrink: 0 }}>
          <Search
            size={15}
            strokeWidth={2}
            className="absolute"
            style={{
              left: 12,
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
            style={{ paddingLeft: 36, height: 36, fontSize: 13, borderRadius: 10 }}
          />
        </div>
      </div>

      {/* ── Bundle Grid ── */}
      <div
        className="line-reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {filteredBundles.map((bundle) => {
          const badge = statusBadge(bundle.status);
          return (
            <Link
              key={bundle.id}
              href="/menu/new"
              className="card card-hover group"
              style={{
                padding: 0,
                overflow: "hidden",
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

                {/* Status badge */}
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
                  style={{ bottom: 8, left: 8, fontSize: 11, fontWeight: 600 }}
                >
                  {bundle.items} items
                </div>

                {/* 3-dot menu (hover) */}
                <div
                  className="absolute opacity-0 group-hover:opacity-100"
                  style={{
                    top: 8,
                    right: 8,
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity var(--t-fast)",
                    color: "var(--color-brown)",
                  }}
                >
                  <MoreHorizontal size={15} />
                </div>

                {/* Hover tint */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: "rgba(51,31,46,0.05)",
                    transition: "opacity var(--t-fast)",
                    borderRadius: "12px 12px 0 0",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: "10px 14px 14px" }}>
                <div className="heading-sm" style={{ fontSize: 14, lineHeight: 1.3 }}>
                  {bundle.name}
                </div>
                <div className="body-sm tnum" style={{ marginTop: 3 }}>
                  From ${bundle.price.toFixed(2)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between" style={{ paddingTop: 4 }}>
        <span className="caption">
          Showing 1&ndash;{filteredBundles.length} of {filteredBundles.length}
        </span>
        <div className="flex gap-1">
          <button
            className="pill pill-brown"
            style={{ cursor: "pointer", minWidth: 32, justifyContent: "center" }}
          >
            1
          </button>
        </div>
      </div>
    </div>
  );
}
