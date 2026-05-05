/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Truck,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Static data — hardcoded for order #a8f2c1 (Sarah K., paid)         */
/* ------------------------------------------------------------------ */
const orderHash = "#a8f2c1";
const orderStatus: "paid" | "confirmed" | "preparing" | "ready" = "paid";
const orderMethod: "delivery" | "pickup" = "delivery";

const steps = [
  { label: "Confirmed", done: false },
  { label: "Preparing", done: false },
  { label: "Ready", done: false },
  { label: "Delivered", done: false },
];

/* Determine current step index based on status */
function currentStepIndex(status: string): number {
  switch (status) {
    case "confirmed":
      return 0;
    case "preparing":
      return 1;
    case "ready":
      return 2;
    case "delivered":
      return 3;
    default:
      return -1; /* paid = before confirmed */
  }
}

const items = [
  {
    name: "Homemade Mansaf",
    qty: 2,
    portion: "Family Size",
    customizations: [
      { label: "SPICE", value: "Medium" },
      { label: "EXTRAS", value: "Extra pine nuts" },
    ],
    price: "$28.00",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
  },
  {
    name: "Walnut Baklava",
    qty: 1,
    portion: "Box of 12",
    customizations: [{ label: "EXTRAS", value: "Extra syrup" }],
    price: "$18.00",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
  },
];

const timeline = [
  { time: "2:30 PM", label: "Order placed by Sarah Khan", done: true },
  { time: "2:32 PM", label: "Order confirmed", done: true },
  { time: "2:45 PM", label: "Preparing started", done: true },
  { time: "—", label: "Next step pending", done: false },
];

/* ------------------------------------------------------------------ */
/*  Action button helpers                                              */
/* ------------------------------------------------------------------ */
function actionButtonLabel(s: string): string {
  switch (s) {
    case "paid":
      return "Confirm Order";
    case "confirmed":
      return "Start Preparing";
    case "preparing":
      return "Mark Ready";
    case "ready":
      return "Hand Off to Driver";
    default:
      return "Update";
  }
}

function actionBtnClass(s: string): string {
  switch (s) {
    case "paid":
      return "btn-red";
    case "confirmed":
      return "btn-amber";
    case "preparing":
      return "btn-sage";
    default:
      return "";
  }
}

function actionBtnStyle(s: string): React.CSSProperties | undefined {
  if (s === "ready") {
    return {
      background: "var(--color-terracotta)",
      color: "#fff",
      borderColor: "var(--color-terracotta)",
    };
  }
  return undefined;
}

function statusPillClass(s: string): string {
  switch (s) {
    case "paid":
    case "confirmed":
      return "pill-orange";
    case "preparing":
      return "pill-orange";
    case "ready":
      return "pill-sage";
    case "delivered":
      return "pill-sage";
    default:
      return "pill-mute";
  }
}

function statusLabel(s: string): string {
  switch (s) {
    case "paid":
      return "Paid";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Ready";
    case "delivered":
      return "Delivered";
    default:
      return s;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OrderDetailPage() {
  const { toast } = useToast();
  const curStep = currentStepIndex(orderStatus);

  return (
    <div className="section-stack" style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 100 }}>
      {/* -------- Header -------- */}
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
          Order {orderHash}
        </h1>
        <span className="pill pill-sage" style={{ gap: 4 }}>
          {orderMethod === "delivery" ? (
            <Truck size={12} strokeWidth={2} />
          ) : (
            <ShoppingBag size={12} strokeWidth={2} />
          )}
          {orderMethod === "delivery" ? "Delivery" : "Pickup"}
        </span>
        <span className={`pill ${statusPillClass(orderStatus)}`}>
          {statusLabel(orderStatus)}
        </span>
      </div>

      {/* -------- Progress stepper -------- */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "8px 0" }}
      >
        {steps.map((step, i) => {
          const isDone = i < curStep;
          const isCurrent = i === curStep;
          return (
            <div
              key={step.label}
              className="flex items-center"
              style={{ flex: i < steps.length - 1 ? 1 : undefined }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isCurrent ? 36 : 32,
                    height: isCurrent ? 36 : 32,
                    background: isDone
                      ? "var(--color-sage)"
                      : isCurrent
                        ? "var(--color-red)"
                        : "var(--color-cream-sunken)",
                    color:
                      isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: isCurrent
                      ? "0 0 0 4px rgba(229,65,65,0.18)"
                      : undefined,
                    transition: "all 0.2s",
                  }}
                >
                  {isDone ? <Check size={16} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      isDone || isCurrent
                        ? "var(--color-brown)"
                        : "var(--color-brown-soft-2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: isDone
                      ? "var(--color-sage)"
                      : "var(--color-cream-sunken)",
                    margin: "0 8px",
                    marginBottom: 20,
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* -------- ETA card -------- */}
      <div
        className="card-cream"
        style={{ textAlign: "center" }}
      >
        <div className="eyebrow">READY BY</div>
        <div
          className="fraunces"
          style={{
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 4,
            color: "var(--color-brown)",
          }}
        >
          Today 6:30 PM
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          In 3h 45m
        </div>
      </div>

      {/* -------- 2-column layout -------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 20,
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .order-detail-grid {
              grid-template-columns: 7fr 5fr !important;
            }
          }
        `}</style>
        <div className="order-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {/* ========== Left column ========== */}
          <div className="section-stack">
            {/* -- Order items -- */}
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
                        style={{ width: 48, height: 48, flexShrink: 0 }}
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
                              &times; {item.qty} &middot; {item.portion}
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
                              borderLeft:
                                "2px solid var(--color-cream-sunken)",
                            }}
                          >
                            {item.customizations.map((c) => (
                              <div
                                key={c.label}
                                style={{
                                  fontSize: 12,
                                  color: "var(--color-brown-soft-2)",
                                }}
                              >
                                <span style={{ fontWeight: 600 }}>
                                  {c.label}:
                                </span>{" "}
                                {c.value}
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

            {/* -- Special instructions -- */}
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
                Special Instructions
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

            {/* -- Customer -- */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Customer
              </div>
              <div
                className="bg-white rounded-xl shadow-card"
                style={{ padding: 16 }}
              >
                <div
                  className="flex items-center gap-3"
                  style={{ marginBottom: 12 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                    alt="Sarah Khan"
                    className="rounded-full object-cover"
                    style={{ width: 48, height: 48 }}
                  />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                      Sarah Khan
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+14695550142"
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
                    (469) 555-0142
                  </a>
                  <a
                    href="mailto:sarah.khan@email.com"
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
                    sarah.khan@email.com
                  </a>
                  <div
                    className="flex items-start gap-2"
                    style={{ minHeight: 44, padding: "6px 0" }}
                  >
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
                      <div
                        style={{ fontSize: 13, color: "var(--color-brown)" }}
                      >
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
          </div>

          {/* ========== Right column ========== */}
          <div className="section-stack">
            {/* -- Order summary -- */}
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
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown-soft)",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>$46.00</span>
                  </div>
                  <div
                    className="flex justify-between tnum"
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown-soft)",
                    }}
                  >
                    <span>Platform fee</span>
                    <span>$4.60</span>
                  </div>
                  <div
                    className="flex justify-between tnum"
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown-soft)",
                    }}
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

              {/* Payout highlight */}
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
                  className="flex justify-between items-center"
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

            {/* -- Activity timeline -- */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Activity Timeline
              </div>
              <div className="flex flex-col" style={{ paddingLeft: 6 }}>
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-3" style={{ minHeight: 40 }}>
                    <div className="flex flex-col items-center">
                      <div
                        className="rounded-full"
                        style={{
                          width: 8,
                          height: 8,
                          background: event.done
                            ? i === 0
                              ? "var(--color-red)"
                              : "var(--color-sage)"
                            : "var(--color-cream-sunken)",
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
                      <div
                        style={{
                          fontSize: 13,
                          color: event.done
                            ? "var(--color-brown)"
                            : "var(--color-brown-soft-2)",
                          fontStyle: event.done ? "normal" : "italic",
                        }}
                      >
                        {event.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel link */}
            <div style={{ textAlign: "center", paddingTop: 4 }}>
              <button
                onClick={() => toast("Cancellation requested for " + orderHash)}
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
          </div>
        </div>
      </div>

      {/* -------- Sticky bottom bar (mobile only) -------- */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden"
        style={{
          height: 80,
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
          background: "#fff",
          borderTop: "1px solid rgba(51,31,46,0.08)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          className={`btn btn-lg btn-block ${actionBtnClass(orderStatus)}`}
          style={{
            minHeight: 56,
            ...actionBtnStyle(orderStatus),
          }}
          onClick={() => toast(`Order ${orderHash} updated`)}
        >
          {actionButtonLabel(orderStatus)}
        </button>
      </div>
    </div>
  );
}
