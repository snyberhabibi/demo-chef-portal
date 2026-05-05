"use client";

import { useState } from "react";
import { ExternalLink, ArrowRight, Check } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Large Catering Bags",
    desc: "Heavy-duty bags for full tray orders and catering pickups. Reinforced handles.",
    price: "$18.99",
  },
  {
    id: 2,
    name: "Half Tray Boxes",
    desc: "Sturdy corrugated boxes sized for half-tray aluminum pans. Ventilated.",
    price: "$14.99",
  },
  {
    id: 3,
    name: "Full Tray Boxes",
    desc: "Extra-large boxes for full-size catering trays. Stackable design.",
    price: "$22.99",
  },
  {
    id: 4,
    name: "All Take-Out Supplies",
    desc: "Complete kit: containers, utensils, napkins, and sauce cups for individual orders.",
    price: "$29.99",
  },
];

export default function PackagingPage() {
  const [requestSent, setRequestSent] = useState(false);

  const handleBrandedRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <div className="section-stack" style={{ maxWidth: 640 }}>
      {/* Intro */}
      <div>
        <div className="fraunces" style={{ fontSize: 22, marginBottom: 4 }}>
          Packaging Supplies
        </div>
        <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: 0 }}>
          Food-safe containers and packaging recommended for home kitchen chefs.
        </p>
      </div>

      {/* Product cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="card card-hover flex flex-col"
            style={{ minHeight: 56 }}
          >
            {/* Placeholder image */}
            <div
              className="placeholder-img"
              style={{
                height: 120,
                borderRadius: 10,
                marginBottom: 14,
              }}
            />
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 4, lineHeight: 1.5 }}>
                {product.desc}
              </div>
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
              <span className="tnum" style={{ fontWeight: 700, fontSize: 15 }}>
                {product.price}
              </span>
              <a
                href="#"
                className="btn btn-ghost btn-sm"
                style={{
                  minHeight: 44,
                  textDecoration: "none",
                }}
              >
                Buy Now
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Branded packaging CTA */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, var(--color-cream-deep) 0%, var(--color-terracotta-soft) 100%)",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div className="fraunces" style={{ fontSize: 20, marginBottom: 6 }}>
          Want branded packaging?
        </div>
        <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "0 auto 16px", maxWidth: 380 }}>
          Add your kitchen logo and colors to your containers. Minimum order of 100 units. Stand out and build your brand with every delivery.
        </p>
        <button
          className="btn btn-terracotta"
          style={{ minHeight: 48 }}
          onClick={handleBrandedRequest}
        >
          {requestSent ? (
            <>
              <Check size={16} />
              Request Sent
            </>
          ) : (
            <>
              Learn More
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
