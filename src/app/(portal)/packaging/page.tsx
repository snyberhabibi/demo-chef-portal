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
    <div className="content-default section-stack">
      {/* Intro */}
      <div>
        <div className="heading-lg">Packaging Supplies</div>
        <p className="body-sm" style={{ marginTop: 4 }}>
          Food-safe containers and packaging recommended for home kitchen chefs.
        </p>
      </div>

      {/* Product grid - 2x2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="card card-hover flex flex-col"
          >
            {/* Placeholder image area - 120px */}
            <div
              className="placeholder-img"
              style={{
                height: 120,
                borderRadius: 10,
                marginBottom: 14,
              }}
            />
            <div className="flex-1">
              <div className="heading-sm">{product.name}</div>
              <div className="body-sm" style={{ marginTop: 4, lineHeight: 1.5 }}>
                {product.desc}
              </div>
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
              <span className="caption tnum" style={{ fontWeight: 700, fontSize: 14 }}>
                {product.price}
              </span>
              <a href="#" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                Shop Now
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Branded packaging CTA */}
      <div className="card-sticker" style={{ textAlign: "center" }}>
        <div className="heading-md" style={{ marginBottom: 6 }}>
          Want branded packaging?
        </div>
        <p className="body-sm" style={{ maxWidth: 380, margin: "0 auto 20px" }}>
          Add your kitchen logo and colors to your containers. Minimum order of 100 units. Stand out and build your brand with every delivery.
        </p>
        <button className="btn btn-dark" onClick={handleBrandedRequest}>
          {requestSent ? (
            <><Check size={16} /> Request Sent</>
          ) : (
            <>Learn More <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}
