/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Truck, ShoppingBag, Clock } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type OrderStatus =
  | "paid"
  | "confirmed"
  | "preparing"
  | "ready"
  | "readyForPickup"
  | "outForDelivery"
  | "delivered"
  | "pickedUp"
  | "rescheduling"
  | "cancelled"
  | "rejected";

interface Order {
  hash: string;
  customer: string;
  items: { qty: number; name: string }[];
  modifiers?: { label: string; value: string }[];
  method: "delivery" | "pickup";
  date: string;
  time?: string;
  price: string;
  payout: string;
  status: OrderStatus;
  cancelNote?: string;
  readyBy?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const orders: Order[] = [
  {
    hash: "#a8f2c1",
    customer: "Sarah K.",
    items: [
      { qty: 2, name: "Mansaf" },
      { qty: 1, name: "Baklava" },
    ],
    method: "delivery",
    date: "Today",
    time: "2:30 PM",
    price: "$49.00",
    payout: "$45.20 payout",
    status: "paid",
    readyBy: "Ready by Today 6:30 PM",
  },
  {
    hash: "#b3d4e7",
    customer: "Marcus T.",
    items: [
      { qty: 1, name: "Falafel Wrap" },
      { qty: 1, name: "Hummus" },
    ],
    method: "delivery",
    date: "Today",
    time: "3:15 PM",
    price: "$26.50",
    payout: "$22.10 payout",
    status: "confirmed",
    readyBy: "Ready by Today 7:00 PM",
  },
  {
    hash: "#c9e1f3",
    customer: "Priya R.",
    items: [{ qty: 1, name: "Knafeh" }],
    method: "delivery",
    date: "Today",
    time: "1:55 PM",
    price: "$18.00",
    payout: "$16.50 payout",
    status: "preparing",
  },
  {
    hash: "#d2f4a8",
    customer: "Jordan L.",
    items: [{ qty: 3, name: "Shawarma" }],
    method: "pickup",
    date: "Today",
    time: "3:02 PM",
    price: "$48.00",
    payout: "$44.10 payout",
    status: "ready",
  },
  {
    hash: "#e5g7b9",
    customer: "Layla M.",
    items: [
      { qty: 1, name: "Mandi" },
      { qty: 1, name: "Tabouleh" },
    ],
    method: "delivery",
    date: "Yesterday",
    price: "$33.00",
    payout: "",
    status: "cancelled",
    cancelNote: "by customer",
  },
  {
    hash: "#f8h2c4",
    customer: "Daniel B.",
    items: [{ qty: 1, name: "Family Dinner Bundle" }],
    method: "pickup",
    date: "Yesterday",
    price: "$65.00",
    payout: "$59.80 payout",
    status: "delivered",
  },
  {
    hash: "#g1j3d5",
    customer: "Amina H.",
    items: [
      { qty: 2, name: "Baklava" },
      { qty: 1, name: "Hummus" },
    ],
    method: "delivery",
    date: "May 2",
    price: "$28.00",
    payout: "$25.40 payout",
    status: "pickedUp",
  },
  {
    hash: "#h4k6e7",
    customer: "Omar S.",
    items: [{ qty: 1, name: "Mansaf (Full Tray)" }],
    modifiers: [{ label: "PORTION", value: "Full Tray - Serves 5-6 - $100.00" }],
    method: "delivery",
    date: "May 2",
    price: "$100.00",
    payout: "$92.00 payout",
    status: "paid",
    readyBy: "Ready by May 3 8:00 AM",
  },
  {
    hash: "#i7l9f8",
    customer: "Nadia K.",
    items: [{ qty: 4, name: "Falafel" }],
    method: "pickup",
    date: "May 1",
    price: "$36.00",
    payout: "$33.20 payout",
    status: "delivered",
  },
  {
    hash: "#j2m4g1",
    customer: "Rami A.",
    items: [
      { qty: 1, name: "Mansaf" },
      { qty: 2, name: "Knafeh" },
    ],
    method: "delivery",
    date: "May 1",
    price: "$64.00",
    payout: "$58.80 payout",
    status: "delivered",
  },
  {
    hash: "#k5n7h3",
    customer: "Fatima Z.",
    items: [{ qty: 1, name: "Bundle: Weekly Prep" }],
    method: "delivery",
    date: "Apr 30",
    price: "$75.00",
    payout: "$69.00 payout",
    status: "rejected",
  },
  {
    hash: "#l8p2i5",
    customer: "Hassan W.",
    items: [
      { qty: 2, name: "Shawarma" },
      { qty: 1, name: "Tabouleh" },
    ],
    method: "pickup",
    date: "Apr 30",
    price: "$43.00",
    payout: "$39.50 payout",
    status: "delivered",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter tabs                                                        */
/* ------------------------------------------------------------------ */
const filterTabs: { label: string; match: (o: Order) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Confirmed", match: (o) => o.status === "confirmed" },
  { label: "Paid", match: (o) => o.status === "paid" },
  { label: "Preparing", match: (o) => o.status === "preparing" },
  { label: "Ready", match: (o) => o.status === "ready" },
  { label: "Pickup Ready", match: (o) => o.status === "readyForPickup" },
  { label: "Out for Delivery", match: (o) => o.status === "outForDelivery" },
  { label: "Delivered", match: (o) => o.status === "delivered" },
  { label: "Picked Up", match: (o) => o.status === "pickedUp" },
  { label: "Rescheduling", match: (o) => o.status === "rescheduling" },
  { label: "Cancelled", match: (o) => o.status === "cancelled" },
  { label: "Rejected", match: (o) => o.status === "rejected" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function statusLabel(s: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: "Paid",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    readyForPickup: "Pickup Ready",
    outForDelivery: "Out for Delivery",
    delivered: "Delivered",
    pickedUp: "Picked Up",
    rescheduling: "Rescheduling",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[s];
}

function statusDotClass(s: OrderStatus): string {
  switch (s) {
    case "paid":
    case "confirmed":
      return "dot-orange";
    case "preparing":
      return "dot-orange";
    case "ready":
    case "readyForPickup":
    case "delivered":
    case "pickedUp":
      return "dot-sage";
    case "outForDelivery":
      return "dot-sage";
    case "cancelled":
    case "rejected":
      return "dot-red";
    case "rescheduling":
      return "dot-orange";
    default:
      return "";
  }
}

function statusPillClass(s: OrderStatus): string {
  switch (s) {
    case "paid":
    case "confirmed":
      return "pill-orange";
    case "preparing":
      return "pill-orange";
    case "ready":
    case "readyForPickup":
    case "delivered":
    case "pickedUp":
    case "outForDelivery":
      return "pill-sage";
    case "cancelled":
    case "rejected":
      return "pill-red";
    case "rescheduling":
      return "pill-orange";
    default:
      return "pill-mute";
  }
}

function actionLabel(s: OrderStatus): string | null {
  switch (s) {
    case "paid":
      return "Confirm";
    case "confirmed":
      return "Start Prep";
    case "preparing":
      return "Mark Ready";
    case "ready":
    case "readyForPickup":
      return "Hand Off";
    default:
      return null;
  }
}

function actionBtnClass(s: OrderStatus): string {
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

function actionBtnStyle(s: OrderStatus): React.CSSProperties | undefined {
  if (s === "ready" || s === "readyForPickup") {
    return {
      background: "var(--color-terracotta)",
      color: "#fff",
      borderColor: "var(--color-terracotta)",
    };
  }
  return undefined;
}

function actionToastMsg(hash: string, s: OrderStatus): string {
  switch (s) {
    case "paid":
      return `Order ${hash} confirmed`;
    case "confirmed":
      return `Order ${hash} prep started`;
    case "preparing":
      return `Order ${hash} marked ready`;
    case "ready":
    case "readyForPickup":
      return `Order ${hash} handed off`;
    default:
      return `Order ${hash} updated`;
  }
}

function linkId(hash: string): string {
  return hash.replace("#", "").slice(0, 7);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const activeFilter = filterTabs.find((f) => f.label === activeTab)!;

  /* Count per tab */
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of filterTabs) {
      counts[tab.label] = orders.filter(tab.match).length;
    }
    return counts;
  }, []);

  /* Filtered + searched */
  const filtered = useMemo(() => {
    let list = orders.filter(activeFilter.match);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.hash.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTab, search, activeFilter]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(page * rowsPerPage, filtered.length);

  return (
    <div className="section-stack">
      {/* -------- Filter tabs -------- */}
      <div
        className="flex gap-2"
        style={{
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.filter-tabs::-webkit-scrollbar { display: none; }`}</style>
        <div className="filter-tabs flex gap-2" style={{ paddingRight: 8 }}>
          {filterTabs.map((tab) => {
            const isActive = tab.label === activeTab;
            const count = tabCounts[tab.label];
            return (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  setPage(1);
                }}
                className={`pill ${isActive ? "pill-brown" : ""}`}
                style={{
                  cursor: "pointer",
                  border: isActive ? undefined : "1px solid rgba(51,31,46,0.1)",
                  background: isActive ? undefined : "#fff",
                  minHeight: 40,
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
                {count > 0 && tab.label !== "All" && (
                  <span
                    className="inline-flex items-center justify-center"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-cream-sunken)",
                      color: isActive ? "var(--color-cream)" : "var(--color-brown-soft)",
                      fontSize: 10,
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9999,
                      padding: "0 5px",
                      marginLeft: 2,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* -------- Search bar -------- */}
      <div style={{ position: "relative" }}>
        <Search
          size={18}
          strokeWidth={1.8}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-brown-soft-2)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search by order ID, customer, or dish..."
          className="input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* -------- Order cards -------- */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-brown)",
                marginBottom: 6,
              }}
            >
              No orders found
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--color-brown-soft)",
                marginBottom: 20,
              }}
            >
              Try a different filter or search
            </div>
            <Link href="/dashboard" className="btn btn-ghost" style={{ display: "inline-flex" }}>
              Back to Dashboard
            </Link>
          </div>
        ) : (
          paginated.map((order) => {
            const label = actionLabel(order.status);
            const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
            const itemNames = order.items.map((i) => i.name).join(", ");

            return (
              <Link
                key={order.hash}
                href={`/orders/${linkId(order.hash)}`}
                className="block"
                style={{
                  opacity:
                    order.status === "cancelled" || order.status === "rejected" ? 0.6 : 1,
                }}
              >
                <div
                  className="bg-white rounded-2xl shadow-card card-hover"
                  style={{ padding: 16 }}
                >
                  {/* Row 1: hash, method pill, customer + date */}
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                    <span
                      className="mono"
                      style={{ fontSize: 13, color: "var(--color-brown-soft-2)" }}
                    >
                      {order.hash}
                    </span>
                    <span className="pill pill-sage" style={{ fontSize: 11, gap: 4 }}>
                      {order.method === "delivery" ? (
                        <Truck size={12} strokeWidth={2} />
                      ) : (
                        <ShoppingBag size={12} strokeWidth={2} />
                      )}
                      {order.method === "delivery" ? "Delivery" : "Pickup"}
                    </span>
                    <span className="flex-1" />
                    <span style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                      {order.customer}
                      {order.date && (
                        <span style={{ color: "var(--color-brown-soft-2)", marginLeft: 6 }}>
                          {order.date}
                          {order.time ? ` ${order.time}` : ""}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Row 2: status pill + prices */}
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                    <span className={`pill ${statusPillClass(order.status)}`} style={{ gap: 5 }}>
                      <span className={`dot ${statusDotClass(order.status)}`} style={{ width: 6, height: 6 }} />
                      {statusLabel(order.status)}
                      {order.cancelNote && (
                        <span style={{ fontWeight: 400, fontStyle: "italic" }}>
                          ({order.cancelNote})
                        </span>
                      )}
                    </span>
                    <span className="flex-1" />
                    <span
                      className="tnum"
                      style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)" }}
                    >
                      {order.price}
                    </span>
                    {order.payout && (
                      <span
                        className="tnum"
                        style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}
                      >
                        {order.payout}
                      </span>
                    )}
                  </div>

                  {/* Row 3: ready-by pill (if applicable) */}
                  {order.readyBy && (
                    <div style={{ marginBottom: 8 }}>
                      <span
                        className="pill"
                        style={{
                          background: "var(--color-orange-soft)",
                          color: "var(--color-orange-text)",
                          gap: 5,
                        }}
                      >
                        <Clock size={12} strokeWidth={2} />
                        {order.readyBy}
                      </span>
                    </div>
                  )}

                  {/* Row 4: items */}
                  <div className="flex items-start gap-2" style={{ marginBottom: label ? 10 : 0 }}>
                    <span
                      className="inline-flex items-center justify-center"
                      style={{
                        background: "var(--color-orange-soft)",
                        color: "var(--color-orange-text)",
                        fontSize: 11,
                        fontWeight: 700,
                        minWidth: 24,
                        height: 24,
                        borderRadius: 9999,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {totalQty}&times;
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, color: "var(--color-brown)" }}>
                        {itemNames}
                      </span>
                      {order.modifiers &&
                        order.modifiers.map((m) => (
                          <div
                            key={m.label}
                            style={{
                              fontSize: 12,
                              color: "var(--color-brown-soft-2)",
                              marginTop: 2,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{m.label}:</span> {m.value}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action button */}
                  {label && (
                    <div className="flex justify-end">
                      <button
                        className={`btn btn-sm ${actionBtnClass(order.status)}`}
                        style={actionBtnStyle(order.status)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast(actionToastMsg(order.hash, order.status));
                        }}
                      >
                        {label}
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* -------- Pagination -------- */}
      {filtered.length > 0 && (
        <div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
        >
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              className="select"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              style={{
                width: "auto",
                padding: "4px 8px",
                fontSize: 13,
                minHeight: 32,
                borderRadius: 6,
              }}
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          <span className="tnum">
            Showing {showingStart}-{showingEnd} of {filtered.length}
          </span>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`pill ${p === page ? "pill-brown" : ""}`}
                style={{
                  cursor: "pointer",
                  minWidth: 32,
                  minHeight: 32,
                  justifyContent: "center",
                  border: p === page ? undefined : "1px solid rgba(51,31,46,0.1)",
                  background: p === page ? undefined : "#fff",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
