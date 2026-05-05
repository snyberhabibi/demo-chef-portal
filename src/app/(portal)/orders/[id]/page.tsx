/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Truck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

const steps = [
  { label: "Confirmed", done: true },
  { label: "Preparing", active: true },
  { label: "Ready", done: false },
  { label: "Delivered", done: false },
];

const items = [
  {
    name: "Homemade Mansaf",
    qty: 2,
    size: "Family Size",
    customizations: ["Extra pine nuts", "Spicy"],
    price: "$28.00",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
  },
  {
    name: "Walnut Baklava",
    qty: 1,
    size: "Box of 12",
    customizations: ["Extra syrup"],
    price: "$18.00",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
  },
];

const timeline = [
  { time: "5:42 PM", label: "Prep started by Amira" },
  { time: "5:38 PM", label: "Order confirmed" },
  { time: "5:35 PM", label: "Order placed by Sarah K." },
];

export default function OrderDetailPage() {
  return (
    <div className="section-stack" style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/orders"
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            color: "var(--color-brown-soft)",
            background: "rgba(51,31,46,0.04)",
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
        </Link>
        <h1
          className="mono"
          style={{ fontSize: 18, fontWeight: 700, color: "var(--color-brown)" }}
        >
          Order #1042
        </h1>
        <span className="pill pill-mute" style={{ gap: 4 }}>
          <Truck size={12} strokeWidth={2} />
          Delivery
        </span>
        <span className="pill pill-orange">Preparing</span>
      </div>

      {/* Progress stepper */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "8px 0" }}
      >
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="flex items-center"
            style={{ flex: i < steps.length - 1 ? 1 : undefined }}
          >
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  background: step.done
                    ? "var(--color-sage)"
                    : step.active
                      ? "var(--color-red)"
                      : "var(--color-cream-sunken)",
                  color: step.done || step.active ? "#fff" : "var(--color-brown-soft-2)",
                  fontSize: 12,
                  fontWeight: 700,
                  boxShadow: step.active
                    ? "0 0 0 4px rgba(229,65,65,0.18)"
                    : undefined,
                }}
              >
                {step.done ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: step.done || step.active
                    ? "var(--color-brown)"
                    : "var(--color-brown-soft-2)",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: step.done
                    ? "var(--color-sage)"
                    : "var(--color-cream-sunken)",
                  margin: "0 8px",
                  marginBottom: 20,
                  borderRadius: 1,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ETA card */}
      <div className="card-cream" style={{ textAlign: "center" }}>
        <div className="eyebrow">Ready in</div>
        <div
          className="fraunces"
          style={{
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 4,
            color: "var(--color-brown)",
          }}
        >
          45:00
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          Scheduled for Today 6:30 PM
        </div>
      </div>

      {/* Order items */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Order Items
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl shadow-card"
              style={{ padding: 12 }}
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-lg object-cover"
                  style={{ width: 64, height: 64, flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-brown)",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-brown-soft)",
                          marginTop: 1,
                        }}
                      >
                        Qty: {item.qty} &middot; {item.size}
                      </div>
                    </div>
                    <span
                      className="tnum"
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-brown)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.customizations.length > 0 && (
                    <div
                      style={{
                        marginTop: 6,
                        paddingLeft: 10,
                        borderLeft: "2px solid var(--color-cream-sunken)",
                      }}
                    >
                      {item.customizations.map((c) => (
                        <div
                          key={c}
                          style={{
                            fontSize: 12,
                            color: "var(--color-brown-soft-2)",
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer note */}
      <div
        style={{
          background: "var(--color-orange-soft)",
          borderLeft: "3px solid var(--color-orange)",
          borderRadius: 8,
          padding: "12px 14px",
        }}
      >
        <div
          className="eyebrow"
          style={{ marginBottom: 4, color: "var(--color-orange-text)" }}
        >
          Customer Note
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--color-brown)",
            fontStyle: "italic",
          }}
        >
          &ldquo;Please make it extra spicy.&rdquo;
        </div>
      </div>

      {/* Customer section */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Customer
        </div>
        <div
          className="bg-white rounded-xl shadow-card"
          style={{ padding: 16 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              alt="Sarah K."
              className="rounded-full object-cover"
              style={{ width: 44, height: 44 }}
            />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Sarah K.</div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-brown-soft-2)",
                }}
              >
                3 previous orders
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="tel:+15551234567"
              className="flex items-center gap-2"
              style={{
                fontSize: 13,
                color: "var(--color-brown)",
                textDecoration: "none",
                minHeight: 44,
                padding: "6px 0",
              }}
            >
              <Phone
                size={15}
                strokeWidth={1.8}
                style={{ color: "var(--color-brown-soft-2)" }}
              />
              (555) 123-4567
            </a>
            <a
              href="mailto:sarah.k@email.com"
              className="flex items-center gap-2"
              style={{
                fontSize: 13,
                color: "var(--color-brown)",
                textDecoration: "none",
                minHeight: 44,
                padding: "6px 0",
              }}
            >
              <Mail
                size={15}
                strokeWidth={1.8}
                style={{ color: "var(--color-brown-soft-2)" }}
              />
              sarah.k@email.com
            </a>
            <div className="flex items-start gap-2" style={{ minHeight: 44, padding: "6px 0" }}>
              <MapPin
                size={15}
                strokeWidth={1.8}
                style={{
                  color: "var(--color-brown-soft-2)",
                  marginTop: 1,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 13, color: "var(--color-brown)" }}>
                  742 Evergreen Terrace, Springfield
                </div>
                <a
                  href="https://maps.google.com/?q=742+Evergreen+Terrace+Springfield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  style={{
                    fontSize: 12,
                    color: "var(--color-red)",
                    fontWeight: 500,
                    marginTop: 2,
                    textDecoration: "none",
                    minHeight: 44,
                    padding: "6px 0",
                  }}
                >
                  Open in Maps
                  <ExternalLink size={11} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Order Summary
        </div>
        <div
          className="bg-white rounded-xl shadow-card"
          style={{ padding: 16 }}
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex justify-between tnum"
              style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
            >
              <span>Subtotal</span>
              <span>$46.00</span>
            </div>
            <div
              className="flex justify-between tnum"
              style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
            >
              <span>Platform fee</span>
              <span>$4.60</span>
            </div>
            <div
              className="flex justify-between tnum"
              style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
            >
              <span>Delivery</span>
              <span>$4.99</span>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--color-cream-sunken)",
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <div
                className="flex justify-between tnum"
                style={{ fontSize: 15, fontWeight: 600 }}
              >
                <span>Total</span>
                <span>$55.59</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payout card */}
        <div
          className="rounded-xl"
          style={{
            marginTop: 8,
            padding: "12px 16px",
            background: "var(--color-sage-soft)",
            border: "1px solid var(--color-sage)",
          }}
        >
          <div
            className="flex justify-between items-center tnum"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-sage-deep)",
            }}
          >
            <span>Your payout</span>
            <span className="fraunces" style={{ fontSize: 18 }}>
              $45.20
            </span>
          </div>
        </div>
      </div>

      {/* Activity timeline */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Activity
        </div>
        <div className="flex flex-col" style={{ paddingLeft: 6 }}>
          {timeline.map((event, i) => (
            <div key={i} className="flex gap-3" style={{ minHeight: 40 }}>
              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background:
                      i === 0
                        ? "var(--color-red)"
                        : "var(--color-brown-soft-2)",
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                {i < timeline.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "var(--color-cream-sunken)",
                      minHeight: 20,
                    }}
                  />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 12 }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--color-brown-soft-2)",
                  }}
                >
                  {event.time}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-brown)" }}>
                  {event.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel link */}
      <div style={{ textAlign: "center", paddingTop: 4, paddingBottom: 80 }}>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-red)",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 2,
            minHeight: 44,
            padding: "10px 16px",
          }}
        >
          Cancel this order
        </button>
      </div>

      {/* Sticky bottom bar (mobile) */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden"
        style={{
          padding: "8px 16px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(250,249,246,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(51,31,46,0.08)",
          zIndex: 50,
        }}
      >
        <button
          className="btn btn-sage btn-lg btn-block"
          style={{ minHeight: 48 }}
        >
          Mark Ready
        </button>
      </div>
    </div>
  );
}
