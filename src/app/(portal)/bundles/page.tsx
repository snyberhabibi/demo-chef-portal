/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus } from "lucide-react";

const BUNDLES = [
  {
    id: 1,
    name: "Family Feast",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    dishes: 4,
    price: "$48.00",
    status: "live" as const,
  },
  {
    id: 2,
    name: "Date Night",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    dishes: 3,
    price: "$36.00",
    status: "live" as const,
  },
  {
    id: 3,
    name: "Mezze Sampler",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    dishes: 6,
    price: "$28.00",
    status: "draft" as const,
  },
  {
    id: 4,
    name: "Dessert Box",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
    dishes: 3,
    price: "$22.00",
    status: "live" as const,
  },
];

export default function BundlesPage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="section-stack">
      {/* Info banner */}
      {showBanner && (
        <div className="card-cream" style={{ position: "relative" }}>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "none",
              border: "none",
              color: "var(--color-brown-soft-2)",
              cursor: "pointer",
              width: 44,
              height: 44,
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
            Bundles let you package dishes together
          </div>
          <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: 0, maxWidth: 480 }}>
            Create curated meal bundles for families, date nights, or parties. Bundles appear as a single item on your store and often increase average order value.
          </p>
        </div>
      )}

      {/* Header + Create */}
      <div className="flex items-center justify-between">
        <div>
          <span style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
            {BUNDLES.length} bundles
          </span>
        </div>
        <Link
          href="/menu/new"
          className="btn btn-red btn-sm"
          style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}
        >
          <Plus size={16} />
          New Bundle
        </Link>
      </div>

      {/* Bundle grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {BUNDLES.map((bundle) => (
          <Link
            key={bundle.id}
            href="/menu/new"
            className="card block group"
            style={{
              padding: 0,
              overflow: "hidden",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
              transition: "box-shadow 0.15s, transform 0.15s",
            }}
          >
            <div className="relative" style={{ overflow: "hidden" }}>
              <img
                src={bundle.image}
                alt={bundle.name}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  transition: "transform 0.2s",
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "rgba(51,31,46,0.06)",
                  transition: "opacity 0.15s",
                }}
              />
            </div>
            <div style={{ padding: 16 }}>
              <div className="flex items-start justify-between gap-2">
                <div style={{ fontWeight: 600, fontSize: 15 }}>{bundle.name}</div>
                <span
                  className={`dot ${bundle.status === "live" ? "dot-sage" : "dot-orange"}`}
                  style={{ marginTop: 6 }}
                />
              </div>
              <div
                className="flex items-center justify-between"
                style={{ marginTop: 8, fontSize: 13, color: "var(--color-brown-soft)" }}
              >
                <span>{bundle.dishes} dishes</span>
                <span className="tnum" style={{ fontWeight: 600, color: "var(--color-brown)" }}>
                  {bundle.price}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
