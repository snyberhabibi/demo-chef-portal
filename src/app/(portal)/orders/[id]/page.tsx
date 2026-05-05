/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { getOrderDetail, type OrderDetailData } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Order data — now from centralized @/lib/mock-data                  */
/* ------------------------------------------------------------------ */

/* LEGACY: Keeping old entries as fallback for hash-based routing.     */
/*         Primary data now comes from getOrderDetail().               */
const _LEGACY_HASH_DATA: Record<string, OrderDetailData> = {
  "b3d4e7": {
    orderHash: "#b3d4e7",
    orderStatus: "confirmed",
    orderMethod: "delivery",
    items: [
      { name: "Falafel Wrap", qty: 1, portion: "Regular", customizations: [{ label: "SPICE", value: "Mild" }], price: "$14.00", image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop" },
      { name: "Smoky Hummus", qty: 1, portion: "Regular", customizations: [], price: "$10.00", image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Marcus Thompson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550199", email: "marcus.t@email.com", address: "1200 Main St, Dallas", mapsQuery: "1200+Main+St+Dallas" },
    timeline: [
      { time: "3:15 PM", label: "Order placed by Marcus Thompson", done: true },
      { time: "3:17 PM", label: "Order confirmed", done: true },
      { time: "—", label: "Next step pending", done: false },
    ],
    readyBy: "Today 7:00 PM",
    readyIn: "In 3h",
    subtotal: "$24.00",
    platformFee: "$2.40",
    delivery: "$4.99",
    total: "$31.39",
    payout: "$22.10",
  },
  "c9e1f3": {
    orderHash: "#c9e1f3",
    orderStatus: "preparing",
    orderMethod: "delivery",
    items: [
      { name: "Pistachio Knafeh", qty: 1, portion: "Whole", customizations: [{ label: "EXTRAS", value: "Extra syrup on side" }], price: "$18.00", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Priya Ramirez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", phone: "+14695550177", email: "priya.r@email.com", address: "890 Oak Lane, Plano", mapsQuery: "890+Oak+Lane+Plano" },
    timeline: [
      { time: "1:55 PM", label: "Order placed by Priya Ramirez", done: true },
      { time: "1:57 PM", label: "Order confirmed", done: true },
      { time: "2:10 PM", label: "Preparing started", done: true },
      { time: "—", label: "Next step pending", done: false },
    ],
    readyBy: "Today 5:15 PM",
    readyIn: "OVERDUE",
    subtotal: "$18.00",
    platformFee: "$1.80",
    delivery: "$4.99",
    total: "$24.79",
    payout: "$16.50",
  },
  "d2f4a8": {
    orderHash: "#d2f4a8",
    orderStatus: "ready",
    orderMethod: "pickup",
    items: [
      { name: "Chicken Shawarma", qty: 3, portion: "Plate", customizations: [{ label: "SPICE", value: "Hot" }, { label: "EXTRAS", value: "Extra garlic sauce" }], price: "$48.00", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550188", email: "jordan.l@email.com", address: "456 Cedar Ave, Frisco", mapsQuery: "456+Cedar+Ave+Frisco" },
    timeline: [
      { time: "3:02 PM", label: "Order placed by Jordan Lee", done: true },
      { time: "3:04 PM", label: "Order confirmed", done: true },
      { time: "3:20 PM", label: "Preparing started", done: true },
      { time: "4:00 PM", label: "Marked ready for pickup", done: true },
    ],
    readyBy: "Ready now",
    readyIn: "Awaiting pickup",
    subtotal: "$48.00",
    platformFee: "$4.80",
    delivery: "$0.00",
    total: "$52.80",
    payout: "$44.10",
  },
  "e5g7b9": {
    orderHash: "#e5g7b9",
    orderStatus: "paid",
    orderMethod: "delivery",
    items: [
      { name: "Chicken Mandi", qty: 1, portion: "Regular", customizations: [], price: "$22.00", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop" },
      { name: "Tabouleh Salad", qty: 1, portion: "Regular", customizations: [], price: "$11.00", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Layla Mansour", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", phone: "+14695550166", email: "layla.m@email.com", address: "321 Elm St, Richardson", mapsQuery: "321+Elm+St+Richardson" },
    timeline: [
      { time: "Yesterday", label: "Order placed by Layla Mansour", done: true },
      { time: "—", label: "Cancelled by customer", done: false },
    ],
    readyBy: "—",
    readyIn: "Cancelled",
    subtotal: "$33.00",
    platformFee: "$3.30",
    delivery: "$4.99",
    total: "$41.29",
    payout: "$0.00",
  },
  "f8h2c4": {
    orderHash: "#f8h2c4",
    orderStatus: "ready",
    orderMethod: "pickup",
    items: [
      { name: "Family Dinner Bundle", qty: 1, portion: "Full", customizations: [], price: "$65.00", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Daniel Baker", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550155", email: "daniel.b@email.com", address: "789 Oak Dr, Allen", mapsQuery: "789+Oak+Dr+Allen" },
    timeline: [
      { time: "Yesterday", label: "Order placed by Daniel Baker", done: true },
      { time: "Yesterday", label: "Order confirmed", done: true },
      { time: "Yesterday", label: "Preparing started", done: true },
      { time: "Yesterday", label: "Delivered", done: true },
    ],
    readyBy: "Delivered",
    readyIn: "Complete",
    subtotal: "$65.00",
    platformFee: "$6.50",
    delivery: "$0.00",
    total: "$71.50",
    payout: "$59.80",
  },
  "g1j3d5": {
    orderHash: "#g1j3d5",
    orderStatus: "ready",
    orderMethod: "delivery",
    items: [
      { name: "Walnut Baklava", qty: 2, portion: "Box of 12", customizations: [], price: "$28.00", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop" },
      { name: "Smoky Hummus", qty: 1, portion: "Regular", customizations: [], price: "$10.00", image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Amina Hassan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", phone: "+14695550144", email: "amina.h@email.com", address: "555 Maple Ln, McKinney", mapsQuery: "555+Maple+Ln+McKinney" },
    timeline: [
      { time: "May 2", label: "Order placed by Amina Hassan", done: true },
      { time: "May 2", label: "Order confirmed", done: true },
      { time: "May 2", label: "Preparing started", done: true },
      { time: "May 2", label: "Picked up", done: true },
    ],
    readyBy: "Picked up",
    readyIn: "Complete",
    subtotal: "$28.00",
    platformFee: "$2.80",
    delivery: "$4.99",
    total: "$35.79",
    payout: "$25.40",
  },
  "h4k6e7": {
    orderHash: "#h4k6e7",
    orderStatus: "paid",
    orderMethod: "delivery",
    items: [
      { name: "Mansaf (Full Tray)", qty: 1, portion: "Full Tray", customizations: [{ label: "SPICE", value: "Medium" }], price: "$100.00", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Omar Suleiman", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550133", email: "omar.s@email.com", address: "900 Pine Rd, Plano", mapsQuery: "900+Pine+Rd+Plano" },
    timeline: [
      { time: "May 2", label: "Order placed by Omar Suleiman", done: true },
      { time: "—", label: "Awaiting confirmation", done: false },
    ],
    readyBy: "8:00 AM",
    readyIn: "Awaiting confirmation",
    subtotal: "$100.00",
    platformFee: "$10.00",
    delivery: "$4.99",
    total: "$114.99",
    payout: "$92.00",
  },
  "i7l9f8": {
    orderHash: "#i7l9f8",
    orderStatus: "ready",
    orderMethod: "pickup",
    items: [
      { name: "Crispy Falafel", qty: 4, portion: "Regular", customizations: [], price: "$36.00", image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Nadia Khalil", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", phone: "+14695550122", email: "nadia.k@email.com", address: "222 Birch St, Garland", mapsQuery: "222+Birch+St+Garland" },
    timeline: [
      { time: "May 1", label: "Order placed by Nadia Khalil", done: true },
      { time: "May 1", label: "Order confirmed", done: true },
      { time: "May 1", label: "Preparing started", done: true },
      { time: "May 1", label: "Delivered", done: true },
    ],
    readyBy: "Delivered",
    readyIn: "Complete",
    subtotal: "$36.00",
    platformFee: "$3.60",
    delivery: "$0.00",
    total: "$39.60",
    payout: "$33.20",
  },
  "j2m4g1": {
    orderHash: "#j2m4g1",
    orderStatus: "ready",
    orderMethod: "delivery",
    items: [
      { name: "Homemade Mansaf", qty: 1, portion: "Regular", customizations: [], price: "$28.00", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop" },
      { name: "Pistachio Knafeh", qty: 2, portion: "Regular", customizations: [], price: "$36.00", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Rami Abbas", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550111", email: "rami.a@email.com", address: "678 Walnut Blvd, Irving", mapsQuery: "678+Walnut+Blvd+Irving" },
    timeline: [
      { time: "May 1", label: "Order placed by Rami Abbas", done: true },
      { time: "May 1", label: "Order confirmed", done: true },
      { time: "May 1", label: "Preparing started", done: true },
      { time: "May 1", label: "Delivered", done: true },
    ],
    readyBy: "Delivered",
    readyIn: "Complete",
    subtotal: "$64.00",
    platformFee: "$6.40",
    delivery: "$4.99",
    total: "$75.39",
    payout: "$58.80",
  },
  "k5n7h3": {
    orderHash: "#k5n7h3",
    orderStatus: "paid",
    orderMethod: "delivery",
    items: [
      { name: "Bundle: Weekly Prep", qty: 1, portion: "Full", customizations: [], price: "$75.00", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Fatima Zahra", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", phone: "+14695550100", email: "fatima.z@email.com", address: "444 Spruce Way, Denton", mapsQuery: "444+Spruce+Way+Denton" },
    timeline: [
      { time: "Apr 30", label: "Order placed by Fatima Zahra", done: true },
      { time: "—", label: "Rejected", done: false },
    ],
    readyBy: "—",
    readyIn: "Rejected",
    subtotal: "$75.00",
    platformFee: "$7.50",
    delivery: "$4.99",
    total: "$87.49",
    payout: "$0.00",
  },
  "l8p2i5": {
    orderHash: "#l8p2i5",
    orderStatus: "ready",
    orderMethod: "pickup",
    items: [
      { name: "Chicken Shawarma", qty: 2, portion: "Plate", customizations: [], price: "$32.00", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop" },
      { name: "Tabouleh Salad", qty: 1, portion: "Regular", customizations: [], price: "$11.00", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=450&fit=crop" },
    ],
    customer: { name: "Hassan Wahid", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", phone: "+14695550099", email: "hassan.w@email.com", address: "111 Ash Ct, Carrollton", mapsQuery: "111+Ash+Ct+Carrollton" },
    timeline: [
      { time: "Apr 30", label: "Order placed by Hassan Wahid", done: true },
      { time: "Apr 30", label: "Order confirmed", done: true },
      { time: "Apr 30", label: "Preparing started", done: true },
      { time: "Apr 30", label: "Delivered", done: true },
    ],
    readyBy: "Delivered",
    readyIn: "Complete",
    subtotal: "$43.00",
    platformFee: "$4.30",
    delivery: "$0.00",
    total: "$47.30",
    payout: "$39.50",
  },
};

/* Default fallback — now uses centralized mock data */

const steps = [
  { label: "Confirmed", done: false },
  { label: "Preparing", done: false },
  { label: "Ready", done: false },
  { label: "Delivered", done: false },
];

function currentStepIndex(status: string): number {
  switch (status) {
    case "paid":
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
  const params = useParams();
  const orderId = typeof params.id === "string" ? params.id : "";
  const centralData = getOrderDetail(orderId);
  /* Fall back to legacy hash data for orders not fully defined in centralized mock-data */
  const order = centralData.orderHash === "#a8f2c1" && orderId !== "1042" && orderId !== "a8f2c1"
    ? (_LEGACY_HASH_DATA[orderId] || centralData)
    : centralData;
  const { orderHash, orderMethod, items, customer, timeline } = order;

  /* Read effective status from localStorage overrides (same pattern as orders list) */
  const [effectiveStatus, setEffectiveStatus] = useState<string>(order.orderStatus);

  useState(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("order-status-overrides");
      if (saved) {
        const overrides = JSON.parse(saved);
        if (overrides[orderHash]) {
          setEffectiveStatus(overrides[orderHash]);
        }
      }
    } catch { /* ignore */ }
  });

  const advanceStatus = () => {
    const nextMap: Record<string, string> = { paid: "confirmed", confirmed: "preparing", preparing: "ready", ready: "delivered", readyForPickup: "pickedUp" };
    const next = nextMap[effectiveStatus];
    if (next) {
      try {
        const saved = localStorage.getItem("order-status-overrides");
        const overrides = saved ? JSON.parse(saved) : {};
        overrides[orderHash] = next;
        localStorage.setItem("order-status-overrides", JSON.stringify(overrides));
      } catch { /* ignore */ }
      setEffectiveStatus(next);
      toast(`Order ${orderHash} updated to ${statusLabel(next)}`);
    } else {
      toast(`Order ${orderHash} updated`);
    }
  };

  const [cancelConfirm, setCancelConfirm] = useState(false);
  const orderStatus = effectiveStatus;
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
            {order.readyBy}
          </div>
          <div
            className="body-sm"
            style={{
              marginTop: 2,
              color: "var(--color-sage-deep)",
            }}
          >
            {order.readyIn}
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

            {/* -- Customer note (only for order #a8f2c1) -- */}
            {orderHash === "#a8f2c1" && (
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
            )}

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
                    src={customer.avatar}
                    alt={customer.name}
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
                    {customer.name}
                  </span>
                  <span style={{ flex: 1 }} />
                  <div className="flex gap-1 sm:gap-2 shrink-0">
                    <a
                      href={`tel:${customer.phone}`}
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
                      href={`mailto:${customer.email}`}
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
                      {customer.address}
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${customer.mapsQuery}`}
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
                    { label: "Subtotal", amount: order.subtotal },
                    { label: "Platform fee", amount: order.platformFee },
                    { label: "Delivery", amount: order.delivery },
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
                      <span className="receipt-value" style={{ fontWeight: 600 }}>{order.total}</span>
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
                  <span style={{ fontSize: 17 }}>{order.payout}</span>
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
                        toast("Order cancelled", "warning");
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
          onClick={advanceStatus}
        >
          {actionButtonLabel(orderStatus)} &rarr;
        </button>
      </div>
    </div>
  );
}
