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

/* Dish images */
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
    <div className="content-default" style={{ margin: "-16px auto" }}>
      <style>{`
        @media (min-width: 1024px) {
          .store-preview-wrap { margin: -28px auto !important; max-width: 960px; }
        }
      `}</style>
      <div className="store-preview-wrap" style={{ margin: 0, background: "var(--color-cream)" }}>
        {/* Banner */}
        <div style={{ position: "relative" }}>
          <div style={{ height: 240, overflow: "hidden", borderRadius: "0 0 16px 16px" }}>
            <img
              src={bannerImg}
              alt="Kitchen banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
                background: "linear-gradient(to top, rgba(250,249,246,0.95), transparent)",
              }}
            />
          </div>

          {/* Back button */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-full glass"
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 40,
              height: 40,
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
            style={{ position: "absolute", top: 16, right: 16, zIndex: 2, fontSize: 11 }}
          >
            Preview Mode
          </div>

          {/* Chef avatar */}
          <div style={{ position: "absolute", bottom: -28, left: 24, zIndex: 2 }}>
            <img
              src={chefAvatar}
              alt="Chef Amira"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(51,31,46,0.12)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "40px 24px 40px" }}>
          {/* Kitchen name + tagline */}
          <h1 className="heading-lg" style={{ fontSize: 24 }}>
            Yalla Kitchen by Amira
          </h1>
          <p className="body-sm" style={{ marginTop: 4 }}>
            Authentic Palestinian home cooking
          </p>

          {/* Status + rating row */}
          <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 12 }}>
            <span className="flex items-center gap-1.5 body">
              <span className="dot dot-sage" />
              <span style={{ fontWeight: 600 }}>Open</span>
              <span className="caption">&middot; Closes at 6:00 PM</span>
            </span>
            <span className="flex items-center gap-1 body" style={{ fontWeight: 600 }}>
              4.0
              <Star size={14} fill="var(--color-sage)" color="var(--color-sage)" />
              <span className="caption" style={{ fontWeight: 400 }}>(4 reviews)</span>
            </span>
          </div>

          {/* Quick info pills */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 12 }}>
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
            <div className="heading-md" style={{ marginBottom: 14 }}>Popular Dishes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDishes.map((dish) => (
                <DishCard key={dish.name} dish={dish} />
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div style={{ marginTop: 32 }}>
            <div className="heading-md" style={{ marginBottom: 14 }}>Desserts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {desserts.map((dish) => (
                <DishCard key={dish.name} dish={dish} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-center gap-2"
            style={{ marginTop: 48, paddingTop: 24 }}
          >
            <div className="divider" style={{ flex: 1 }} />
            <span className="caption" style={{ whiteSpace: "nowrap" }}>
              Powered by{" "}
              <span className="fraunces" style={{ fontSize: 14, fontWeight: 700, color: "var(--color-red)" }}>
                Yalla Bites
              </span>
            </span>
            <div className="divider" style={{ flex: 1 }} />
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
    <div className="card card-hover" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: `transform 0.3s var(--ease-spring)`,
          }}
        />
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div className="heading-sm" style={{ fontSize: 14 }}>{dish.name}</div>
        <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
          <span className="fraunces" style={{ fontSize: 18, fontWeight: 600, color: "var(--color-brown)" }}>
            {dish.price}
          </span>
          <button
            className="btn btn-dark btn-sm"
            style={{ fontSize: 12, gap: 4 }}
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingCart size={14} strokeWidth={2} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
