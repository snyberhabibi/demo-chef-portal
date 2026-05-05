/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Star, Truck, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Verified working Unsplash URLs                                     */
/* ------------------------------------------------------------------ */
const bannerImg =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1600&h=600&fit=crop";
const chefAvatar =
  "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop";

/* Dish images */
const mansafImg =
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop";
const falafelImg =
  "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop";
const shawarmaImg =
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop";
const knafehImg =
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop";
const baklavaImg =
  "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop";

interface Dish {
  name: string;
  price: string;
  image: string;
}

const popularDishes: Dish[] = [
  { name: "Grandma\u2019s Mansaf", price: "$22.00", image: mansafImg },
  { name: "Falafel Plate", price: "$14.00", image: falafelImg },
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
  const router = useRouter();
  const { toast } = useToast();
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
          <div style={{ height: 240, overflow: "hidden", borderRadius: "0 0 16px 16px", position: "relative" }}>
            <img
              src={bannerImg}
              alt="Kitchen banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Subtle gradient overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: "linear-gradient(to top, rgba(51,31,46,0.25), transparent)",
              }}
            />
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
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
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          {/* Preview badge */}
          <div
            className="pill pill-orange glow-orange"
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

        {/* Kitchen info — light section */}
        <div style={{ padding: "40px 24px 24px", background: "var(--color-cream)" }}>
          {/* Kitchen name + tagline */}
          <h1 className="heading-lg" style={{ fontSize: 24, color: "var(--color-brown)" }}>
            Yalla Kitchen by Amira
          </h1>
          <p className="body-sm" style={{ marginTop: 4, color: "var(--color-brown-soft)" }}>
            Authentic Palestinian home cooking
          </p>

          {/* Status + rating row */}
          <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: 12 }}>
            <span className="flex items-center gap-1.5 body" style={{ color: "var(--color-brown)" }}>
              <span className="dot dot-sage" />
              <span style={{ fontWeight: 600 }}>Open</span>
              <span style={{ opacity: 0.6, fontSize: 12 }}>&middot; Closes at 6:00 PM</span>
            </span>
            <span className="flex items-center gap-1 body" style={{ fontWeight: 600, color: "var(--color-brown)" }}>
              4.8
              <Star size={14} fill="var(--color-sage)" color="var(--color-sage)" />
              <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 12 }}>(4 reviews)</span>
            </span>
          </div>

          {/* Quick info pills */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 12 }}>
            <span className="pill" style={{ gap: 4, background: "var(--color-cream-deep)", color: "var(--color-brown)", border: "1px solid rgba(51,31,46,0.08)" }}>
              <Truck size={12} strokeWidth={2} /> Delivery
            </span>
            <span className="pill" style={{ gap: 4, background: "var(--color-cream-deep)", color: "var(--color-brown)", border: "1px solid rgba(51,31,46,0.08)" }}>
              <MapPin size={12} strokeWidth={2} /> Pickup
            </span>
            <span className="pill" style={{ gap: 4, background: "var(--color-cream-deep)", color: "var(--color-brown)", border: "1px solid rgba(51,31,46,0.08)" }}>
              <Clock size={12} strokeWidth={2} /> 24h notice
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 24px 40px" }}>

          {/* About */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <p className="body-sm" style={{ margin: 0, lineHeight: 1.6 }}>
              Authentic Palestinian home cooking passed down through generations. Every dish is made fresh to order with love.
            </p>
            <a
              href="#"
              className="caption"
              style={{ color: "var(--color-red)", fontWeight: 500, marginTop: 8, display: "inline-block" }}
              onClick={(e) => e.preventDefault()}
            >
              Read more
            </a>
          </div>

          {/* Popular Dishes */}
          <div style={{ marginTop: 32 }}>
            <div className="heading-md" style={{ marginBottom: 14 }}>Popular Dishes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDishes.map((dish) => (
                <DishCard key={dish.name} dish={dish} onAdd={() => toast("Preview only — customers will see this")} />
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div style={{ marginTop: 32 }}>
            <div className="heading-md" style={{ marginBottom: 14 }}>Desserts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {desserts.map((dish) => (
                <DishCard key={dish.name} dish={dish} onAdd={() => toast("Preview only — customers will see this")} />
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
function DishCard({ dish, onAdd }: { dish: Dish; onAdd?: () => void }) {
  return (
    <div className="card-photo" style={{ padding: 0 }}>
      <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Overlay with text on gradient at bottom */}
        <div className="card-photo-overlay">
          <div className="flex items-end justify-between w-full" style={{ gap: 8 }}>
            <div>
              <div className="heading-sm" style={{ fontSize: 14, color: "#fff" }}>{dish.name}</div>
              <span className="fraunces" style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                {dish.price}
              </span>
            </div>
            <button
              className="btn btn-sm btn-dark"
              style={{ fontSize: 11, gap: 3, padding: "6px 14px", minHeight: 0, borderRadius: 9999 }}
              onClick={(e) => { e.preventDefault(); onAdd?.(); }}
            >
              <ShoppingCart size={12} strokeWidth={2} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
