/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Truck, MapPin, Clock } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Verified working Unsplash URLs                                     */
/* ------------------------------------------------------------------ */
const bannerImg =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1600&h=600&fit=crop";
const chefAvatar =
  "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop";

/* Dish images — all verified working */
const mansafImg =
  "https://images.unsplash.com/photo-1547424850-28ac9f1cd013?w=600&h=400&fit=crop";
const hummusImg =
  "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=400&fit=crop";
const shawarmaImg =
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop";
const knafehImg =
  "https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&h=400&fit=crop";
const baklavaImg =
  "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=400&fit=crop";

interface Dish {
  name: string;
  price: string;
  image: string;
}

const popularDishes: Dish[] = [
  { name: "Grandma\u2019s Mansaf", price: "$22.00", image: mansafImg },
  { name: "Falafel Plate", price: "$14.00", image: hummusImg },
  { name: "Shawarma Bowl", price: "$16.00", image: shawarmaImg },
];

const desserts: Dish[] = [
  { name: "Knafeh", price: "$18.00", image: knafehImg },
  { name: "Baklava Box", price: "$12.00", image: baklavaImg },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function StorePreviewPage() {
  return (
    <div style={{ margin: "-16px" }}>
      <style>{`
        @media (min-width: 1024px) {
          .store-preview-wrap { margin: -28px !important; }
        }
      `}</style>
      <div className="store-preview-wrap" style={{ margin: 0, background: "var(--color-cream)" }}>
        {/* Back button overlay */}
        <div style={{ position: "relative" }}>
          {/* Banner */}
          <div
            style={{
              height: 220,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={bannerImg}
              alt="Kitchen banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background:
                  "linear-gradient(to top, rgba(250,249,246,0.9), transparent)",
              }}
            />
          </div>

          {/* Back button */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-full"
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 44,
              height: 44,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(51,31,46,0.12)",
              color: "var(--color-brown)",
              zIndex: 2,
            }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>

          {/* Preview badge */}
          <div
            className="pill pill-orange"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 2,
              fontSize: 11,
            }}
          >
            Preview Mode
          </div>

          {/* Chef avatar overlapping banner */}
          <div
            style={{
              position: "absolute",
              bottom: -32,
              left: 20,
              zIndex: 2,
            }}
          >
            <img
              src={chefAvatar}
              alt="Chef Amira"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(51,31,46,0.12)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "44px 20px 40px" }}>
          {/* Kitchen name + tagline */}
          <h1
            className="fraunces"
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--color-brown)",
              lineHeight: 1.2,
            }}
          >
            Yalla Kitchen by Amira
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--color-brown-soft)",
              marginTop: 4,
            }}
          >
            Authentic Palestinian home cooking
          </p>

          {/* Status + rating row */}
          <div
            className="flex items-center gap-4 flex-wrap"
            style={{ marginTop: 12 }}
          >
            <span className="flex items-center gap-1.5" style={{ fontSize: 14 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-sage)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontWeight: 600, color: "var(--color-brown)" }}>
                Open
              </span>
              <span style={{ color: "var(--color-brown-soft-2)" }}>
                &middot; Closes at 6:00 PM
              </span>
            </span>
            <span
              className="flex items-center gap-1"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-brown)",
              }}
            >
              4.0
              <Star
                size={14}
                fill="var(--color-sage)"
                color="var(--color-sage)"
              />
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--color-brown-soft-2)",
                }}
              >
                (4 reviews)
              </span>
            </span>
          </div>

          {/* Quick info pills */}
          <div
            className="flex items-center gap-2 flex-wrap"
            style={{ marginTop: 12 }}
          >
            <span className="pill pill-mute" style={{ gap: 4 }}>
              <Truck size={12} strokeWidth={2} /> Delivery
            </span>
            <span className="pill pill-mute" style={{ gap: 4 }}>
              <MapPin size={12} strokeWidth={2} /> Pickup
            </span>
            <span className="pill pill-mute" style={{ gap: 4 }}>
              <Clock size={12} strokeWidth={2} /> 24h notice
            </span>
          </div>

          {/* Popular Dishes */}
          <div style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Popular Dishes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDishes.map((dish) => (
                <DishCard key={dish.name} dish={dish} />
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Desserts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {desserts.map((dish) => (
                <DishCard key={dish.name} dish={dish} />
              ))}
            </div>
          </div>

          {/* Powered by Yalla Bites */}
          <div
            className="flex items-center justify-center gap-2"
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid var(--color-cream-sunken)",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-brown-soft-2)",
              }}
            >
              Powered by
            </span>
            <span
              className="fraunces"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-red)",
              }}
            >
              Yalla Bites
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish card                                                          */
/* ------------------------------------------------------------------ */
function DishCard({ dish }: { dish: Dish }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      style={{ transition: "box-shadow 0.15s, transform 0.15s" }}
    >
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
        />
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--color-brown)",
          }}
        >
          {dish.name}
        </div>
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 8 }}
        >
          <span
            className="fraunces"
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-brown)",
            }}
          >
            {dish.price}
          </span>
          <button
            className="btn btn-red btn-sm"
            style={{ fontSize: 12, gap: 4, minHeight: 36 }}
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingCart size={14} strokeWidth={2} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
