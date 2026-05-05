/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
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
  Quote,
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
      return -1;
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
/*  Action helpers                                                     */
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
    case "ready":
      return "btn-terracotta";
    default:
      return "";
  }
}

function statusPillClass(s: string): string {
  switch (s) {
    case "paid":
    case "confirmed":
    case "preparing":
      return "pill-orange";
    case "ready":
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
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const curStep = currentStepIndex(orderStatus);

  return (
    <div className="content-default" style={{ paddingBottom: 100 }}>
      <div className="section-stack">
        {/* ======== Header ======== */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/orders"
            className="btn btn-icon btn-ghost"
            style={{ width: 36, minWidth: 36, height: 36, minHeight: 36, borderRadius: 10 }}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </Link>
          <h1 className="mono heading-md" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
            Order {orderHash}
          </h1>
          <span
            className="pill pill-mute"
            style={{ gap: 4 }}
          >
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

        {/* ======== Progress stepper ======== */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "4px 0",
          }}
        >
          {steps.map((step, i) => {
            const isDone = i < curStep;
            const isCurrent = i === curStep;
            return (
              <div
                key={step.label}
                className="gap-1 sm:gap-2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: i < steps.length - 1 ? 1 : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {/* Circle */}
                  <div
                    className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px]"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: isDone
                        ? "var(--color-sage)"
                        : isCurrent
                          ? "var(--color-red)"
                          : "var(--color-cream-sunken)",
                      color:
                        isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                      fontSize: 11,
                      fontWeight: 700,
                      transition: "all var(--t-base)",
                    }}
                  >
                    {isDone ? <Check size={14} strokeWidth={2.5} /> : i + 1}
                    {/* Pulse ring for active */}
                    {isCurrent && (
                      <span
                        className="pulse-soft"
                        style={{
                          position: "absolute",
                          inset: -4,
                          borderRadius: "50%",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className="caption text-[10px] sm:text-[12px]"
                    style={{
                      fontWeight: isCurrent ? 700 : 500,
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
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: isDone
                        ? "var(--color-sage)"
                        : "var(--color-cream-sunken)",
                      margin: "0 10px",
                      marginBottom: 24,
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ======== ETA card ======== */}
        <div
          className="card-gradient-border"
          style={{ textAlign: "center", padding: "16px 24px" }}
        >
          <div className="eyebrow">READY BY</div>
          <div
            className="heading-md fraunces"
            style={{
              marginTop: 4,
              color: "var(--color-brown)",
              fontSize: "clamp(20px, 5vw, 28px)",
            }}
          >
            Today 6:30 PM
          </div>
          <div
            className="body-sm"
            style={{
              marginTop: 2,
              color: "var(--color-sage-deep)",
            }}
          >
            In 3h 45m
          </div>
        </div>

        {/* ======== 2-column layout ======== */}
        <style>{`
          @media (min-width: 1024px) {
            .order-detail-cols {
              display: grid !important;
              grid-template-columns: 1fr 360px !important;
              gap: 24px !important;
            }
          }
        `}</style>
        <div
          className="order-detail-cols"
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          {/* ========== Left column ========== */}
          <div className="section-stack">
            {/* -- Items -- */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Items
              </div>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {items.map((item, i) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 16px",
                      borderBottom:
                        i < items.length - 1
                          ? "1px solid rgba(51,31,46,0.06)"
                          : "none",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 sm:w-10 sm:h-10"
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
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
                          <div className="body-sm" style={{ marginTop: 1 }}>
                            &times;{item.qty} &middot; {item.portion}
                          </div>
                        </div>
                        <span
                          className="tnum"
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-brown)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {item.price}
                        </span>
                      </div>
                      {item.customizations.length > 0 && (
                        <div
                          className="caption"
                          style={{
                            marginTop: 6,
                            paddingLeft: 10,
                            borderLeft: "2px solid var(--color-cream-sunken)",
                          }}
                        >
                          {item.customizations.map((c) => (
                            <div key={c.label}>
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
                ))}
              </div>
            </div>

            {/* -- Customer note -- */}
            <div
              style={{
                background: "var(--color-cream-deep)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Quote
                size={16}
                strokeWidth={2}
                style={{
                  color: "var(--color-brown-soft-2)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>
                  Customer Note
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--color-brown)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;Please make it extra spicy.&rdquo;
                </div>
              </div>
            </div>

            {/* -- Customer -- */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Customer
              </div>
              <div
                className="card"
                style={{ padding: "14px 16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                    alt="Sarah Khan"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    Sarah Khan
                  </span>
                  <span style={{ flex: 1 }} />
                  <div className="flex gap-1 sm:gap-2 shrink-0">
                    <a
                      href="tel:+14695550142"
                      className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg"
                      style={{
                        background: "rgba(51,31,46,0.04)",
                        color: "var(--color-brown-soft)",
                        transition: "background var(--t-fast)",
                      }}
                      title="Call"
                    >
                      <Phone size={14} strokeWidth={2} />
                    </a>
                    <a
                      href="mailto:sarah.khan@email.com"
                      className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg"
                      style={{
                        background: "rgba(51,31,46,0.04)",
                        color: "var(--color-brown-soft)",
                        transition: "background var(--t-fast)",
                      }}
                      title="Email"
                    >
                      <Mail size={14} strokeWidth={2} />
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div
                  className="divider"
                  style={{ margin: "10px 0" }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <MapPin
                    size={14}
                    strokeWidth={2}
                    style={{
                      color: "var(--color-brown-soft-2)",
                      marginTop: 2,
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
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--color-red)",
                        marginTop: 2,
                      }}
                    >
                      Open in Maps
                      <ExternalLink size={10} strokeWidth={2} />
                    </a>
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
                Summary
              </div>
              <div className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Line items with receipt pattern */}
                  {[
                    { label: "Subtotal", amount: "$46.00" },
                    { label: "Platform fee", amount: "$4.60" },
                    { label: "Delivery", amount: "$4.99" },
                  ].map((row) => (
                    <div key={row.label} className="receipt-row tnum text-[12px] sm:text-[13px]">
                      <span className="receipt-label">{row.label}</span>
                      <span className="receipt-dots" />
                      <span className="receipt-value">{row.amount}</span>
                    </div>
                  ))}

                  {/* Total */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(51,31,46,0.08)",
                      paddingTop: 10,
                      marginTop: 4,
                    }}
                  >
                    <div className="receipt-row tnum" style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)" }}>
                      <span className="receipt-label" style={{ fontWeight: 600 }}>Total</span>
                      <span className="receipt-dots" />
                      <span className="receipt-value" style={{ fontWeight: 600 }}>$55.59</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout highlight */}
              <div
                className="glow-sage"
                style={{
                  marginTop: 8,
                  padding: "12px 16px",
                  background: "var(--color-sage-soft)",
                  borderRadius: 12,
                  border: "1px solid rgba(121,173,99,0.2)",
                }}
              >
                <div
                  className="tnum"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-sage-deep)",
                  }}
                >
                  <span>Your payout</span>
                  <span style={{ fontSize: 17 }}>$45.20</span>
                </div>
              </div>
            </div>

            {/* -- Activity timeline -- */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                Activity
              </div>
              <div style={{ paddingLeft: 4 }}>
                {timeline.map((event, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      minHeight: 36,
                    }}
                  >
                    {/* Dot + line */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: event.done
                            ? i === 0
                              ? "var(--color-red)"
                              : "var(--color-sage)"
                            : "var(--color-cream-sunken)",
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      />
                      {i < timeline.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            background: "var(--color-cream-sunken)",
                            minHeight: 16,
                          }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: 10 }}>
                      <div
                        className="mono caption"
                        style={{ fontSize: 11 }}
                      >
                        {event.time}
                      </div>
                      <div
                        className="caption"
                        style={{
                          color: event.done
                            ? "var(--color-brown)"
                            : "var(--color-brown-soft-2)",
                          fontStyle: event.done ? "normal" : "italic",
                          fontWeight: event.done ? 500 : 400,
                          fontSize: 13,
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
            <div style={{ paddingTop: 4 }}>
              <button
                onClick={() => setCancelConfirm(true)}
                className="caption"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-red)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontWeight: 500,
                  fontSize: 12,
                  padding: 0,
                }}
              >
                Cancel this order
              </button>
              {cancelConfirm && (
                <div
                  style={{
                    marginTop: 12,
                    borderLeft: "3px solid var(--color-red)",
                    borderRadius: 8,
                    padding: "14px 16px",
                  }}
                >
                  <div className="body-sm" style={{ marginBottom: 12, color: "var(--color-red-deep)" }}>
                    Are you sure? This will cancel order {orderHash}.
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setCancelConfirm(false)}>
                      Go Back
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: "var(--color-red-deep)", color: "#fff", border: "none" }}
                      onClick={() => {
                        toast("Order cancelled");
                        setCancelConfirm(false);
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======== Sticky bottom bar (mobile) ======== */}
      <style>{`
        @media (max-width: 1023px) {
          .order-sticky-bar { bottom: 56px !important; }
        }
        @media (max-width: 640px) {
          .order-stepper-circle { width: 24px !important; height: 24px !important; font-size: 10px !important; }
          .order-eta-number { font-size: 24px !important; }
        }
      `}</style>
      <div
        className="fixed left-0 right-0 lg:hidden glass order-sticky-bar"
        style={{
          bottom: 0,
          height: 64,
          padding: "8px 16px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
          borderTop: "1px solid rgba(51,31,46,0.06)",
          zIndex: 45,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          className={`btn btn-block ${actionBtnClass(orderStatus)}`}
          style={{ minHeight: 48, borderRadius: 12, fontSize: 15 }}
          onClick={() => toast(`Order ${orderHash} updated`)}
        >
          {actionButtonLabel(orderStatus)}
        </button>
      </div>
    </div>
  );
}
