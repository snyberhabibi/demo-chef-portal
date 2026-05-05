"use client";

import { useState } from "react";
import { ExternalLink, ArrowRight, Check } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    emoji: "\uD83E\uDD61",
    name: "Kraft Containers (25 pk)",
    desc: "Microwave-safe, leak-proof",
    price: "$12.99",
  },
  {
    id: 2,
    emoji: "\uD83E\uDDCB",
    name: "Soup & Stew Cups (20 pk)",
    desc: "16oz with tamper-evident lids",
    price: "$9.99",
  },
  {
    id: 3,
    emoji: "\uD83C\uDF70",
    name: "Dessert Boxes (15 pk)",
    desc: "Window box, perfect for pastries",
    price: "$14.99",
  },
  {
    id: 4,
    emoji: "\uD83C\uDF75",
    name: "Sauce Cups (50 pk)",
    desc: "2oz portion cups with lids",
    price: "$6.99",
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
            className="card flex items-start gap-4"
            style={{ transition: "box-shadow 0.2s ease, transform 0.15s ease", minHeight: 56 }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "var(--color-cream-sunken)",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              {product.emoji}
            </div>
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 2 }}>
                {product.desc}
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
                <span className="tnum" style={{ fontWeight: 700, fontSize: 15 }}>
                  {product.price}
                </span>
                <a
                  href="#"
                  className="btn btn-ghost btn-sm"
                  style={{
                    minHeight: 44,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Shop Now
                  <ExternalLink size={12} />
                </a>
              </div>
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
          transition: "box-shadow 0.2s ease",
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
          style={{ minHeight: 48, transition: "all 0.15s ease" }}
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
