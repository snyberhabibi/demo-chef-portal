/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Truck, ShoppingBag, Clock, Package } from "lucide-react";
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

type Urgency = "overdue" | "due-soon" | null;

interface Order {
  hash: string;
  customer: string;
  items: { qty: number; name: string }[];
  method: "delivery" | "pickup";
  date: string;
  time?: string;
  price: string;
  payout: string;
  status: OrderStatus;
  cancelNote?: string;
  readyBy?: string;
  urgency?: Urgency;
}

/* ------------------------------------------------------------------ */
/*  Mock data — 12 orders                                              */
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
    payout: "$45.20",
    status: "paid",
    readyBy: "6:30 PM",
    urgency: "due-soon",
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
    payout: "$22.10",
    status: "confirmed",
    readyBy: "7:00 PM",
  },
  {
    hash: "#c9e1f3",
    customer: "Priya R.",
    items: [{ qty: 1, name: "Knafeh" }],
    method: "delivery",
    date: "Today",
    time: "1:55 PM",
    price: "$18.00",
    payout: "$16.50",
    status: "preparing",
    readyBy: "5:15 PM",
    urgency: "overdue",
  },
  {
    hash: "#d2f4a8",
    customer: "Jordan L.",
    items: [{ qty: 3, name: "Shawarma" }],
    method: "pickup",
    date: "Today",
    time: "3:02 PM",
    price: "$48.00",
    payout: "$44.10",
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
    payout: "$59.80",
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
    payout: "$25.40",
    status: "pickedUp",
  },
  {
    hash: "#h4k6e7",
    customer: "Omar S.",
    items: [{ qty: 1, name: "Mansaf (Full Tray)" }],
    method: "delivery",
    date: "May 2",
    price: "$100.00",
    payout: "$92.00",
    status: "paid",
    readyBy: "8:00 AM",
  },
  {
    hash: "#i7l9f8",
    customer: "Nadia K.",
    items: [{ qty: 4, name: "Falafel" }],
    method: "pickup",
    date: "May 1",
    price: "$36.00",
    payout: "$33.20",
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
    payout: "$58.80",
    status: "delivered",
  },
  {
    hash: "#k5n7h3",
    customer: "Fatima Z.",
    items: [{ qty: 1, name: "Bundle: Weekly Prep" }],
    method: "delivery",
    date: "Apr 30",
    price: "$75.00",
    payout: "$69.00",
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
    payout: "$39.50",
    status: "delivered",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter tabs                                                        */
/* ------------------------------------------------------------------ */
const filterTabs: { label: string; match: (o: Order) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Paid", match: (o) => o.status === "paid" },
  { label: "Confirmed", match: (o) => o.status === "confirmed" },
  { label: "Preparing", match: (o) => o.status === "preparing" },
  { label: "Ready", match: (o) => o.status === "ready" || o.status === "readyForPickup" },
  { label: "Delivered", match: (o) => o.status === "delivered" || o.status === "pickedUp" },
  { label: "Cancelled", match: (o) => o.status === "cancelled" || o.status === "rejected" },
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

function statusDotColor(s: OrderStatus): string {
  switch (s) {
    case "paid":
      return "var(--color-orange)";
    case "confirmed":
      return "var(--color-orange)";
    case "preparing":
      return "#e8a832";
    case "ready":
    case "readyForPickup":
    case "delivered":
    case "pickedUp":
    case "outForDelivery":
      return "var(--color-sage)";
    case "cancelled":
    case "rejected":
      return "var(--color-red)";
    case "rescheduling":
      return "var(--color-orange)";
    default:
      return "var(--color-brown-soft-2)";
  }
}

function actionLabel(s: OrderStatus): string | null {
  switch (s) {
    case "paid":
      return "Confirm";
    case "confirmed":
      return "Prep";
    case "preparing":
      return "Ready";
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
    case "ready":
    case "readyForPickup":
      return "btn-terracotta";
    default:
      return "";
  }
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

function urgencyBorderColor(u: Urgency): string {
  if (u === "overdue") return "var(--color-red)";
  if (u === "due-soon") return "var(--color-orange)";
  return "transparent";
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
    <div className="content-default section-stack">
      {/* -------- Filter bar + Search -------- */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Scrollable tabs */}
        <div
          className="flex-1 min-w-0"
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: 2,
            }}
          >
            <style>{`
              .order-filter-tabs::-webkit-scrollbar { display: none; }
            `}</style>
            <div className="order-filter-tabs" style={{ display: "flex", gap: 6 }}>
              {filterTabs.map((tab) => {
                const isActive = tab.label === activeTab;
                const count = tabCounts[tab.label];
                return (
                  <button
                    key={tab.label}
                    onClick={() => { setActiveTab(tab.label); setPage(1); }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      height: 32,
                      padding: "0 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      border: "none",
                      cursor: "pointer",
                      transition: "all var(--t-fast) var(--ease-spring)",
                      background: isActive ? "var(--color-brown)" : "transparent",
                      color: isActive ? "var(--color-cream)" : "var(--color-brown-soft-2)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget.style.background = "rgba(51,31,46,0.04)");
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget.style.background = "transparent");
                    }}
                  >
                    {tab.label}
                    {count > 0 && tab.label !== "All" && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 16,
                          height: 16,
                          padding: "0 4px",
                          borderRadius: 9999,
                          fontSize: 10,
                          fontWeight: 700,
                          fontVariantNumeric: "tabular-nums",
                          background: isActive ? "rgba(255,255,255,0.2)" : "var(--color-cream-sunken)",
                          color: isActive ? "var(--color-cream)" : "var(--color-brown-soft-2)",
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
          <span className="accent-line-sm" />
        </div>

        {/* Search — right side on desktop */}
        <div
          className="hidden lg:block"
          style={{ position: "relative", width: 280, flexShrink: 0 }}
        >
          <Search
            size={15}
            strokeWidth={2}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-brown-soft-2)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 36,
              paddingRight: 14,
              borderRadius: 10,
              border: "1px solid rgba(51,31,46,0.1)",
              background: "#fff",
              fontSize: 13,
              color: "var(--color-brown)",
              outline: "none",
              transition: "border-color var(--t-fast), box-shadow var(--t-fast)",
            }}
          />
        </div>
      </div>

      {/* Mobile search — full width */}
      <div
        className="lg:hidden"
        style={{ position: "relative", marginTop: -8 }}
      >
        <Search
          size={15}
          strokeWidth={2}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-brown-soft-2)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search by order ID, customer, or dish..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            width: "100%",
            height: 40,
            paddingLeft: 36,
            paddingRight: 14,
            borderRadius: 10,
            border: "1px solid rgba(51,31,46,0.1)",
            background: "#fff",
            fontSize: 13,
            color: "var(--color-brown)",
            outline: "none",
            transition: "border-color var(--t-fast), box-shadow var(--t-fast)",
          }}
        />
      </div>

      {/* -------- Order list — Stripe table rows -------- */}
      <div
        className="card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        {paginated.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              paddingTop: 120,
              paddingBottom: 120,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Package
              size={48}
              strokeWidth={1.2}
              style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 16px" }}
            />
            <div className="heading-md" style={{ marginBottom: 6 }}>
              No orders found
            </div>
            <div className="body-sm" style={{ marginBottom: 24 }}>
              Try a different filter or search term
            </div>
            <Link
              href="/dashboard"
              className="btn btn-ghost"
              style={{ display: "inline-flex" }}
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            {paginated.map((order, idx) => {
              const label = actionLabel(order.status);
              const itemSummary = order.items
                .map((i) => (i.qty > 1 ? `${i.qty}x ${i.name}` : i.name))
                .join(", ");
              const isStruck =
                order.status === "cancelled" || order.status === "rejected";
              const hasUrgency = order.urgency != null;

              return (
                <Link
                  key={order.hash}
                  href={`/orders/${linkId(order.hash)}`}
                  className="block"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={
                      order.urgency === "overdue"
                        ? "urgency-red"
                        : order.urgency === "due-soon"
                          ? "urgency-amber"
                          : ""
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minHeight: 56,
                      padding: "8px 20px",
                      borderBottom:
                        idx < paginated.length - 1
                          ? "1px solid rgba(51,31,46,0.06)"
                          : "none",
                      ...(!hasUrgency ? { borderLeft: "3px solid transparent" } : {}),
                      opacity: isStruck ? 0.55 : 1,
                      transition:
                        "background var(--t-fast) var(--ease-spring)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(245,241,232,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Left cluster: hash + dot + name + items */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      {/* Hash ID */}
                      <span
                        className="mono"
                        style={{
                          fontSize: 12,
                          color: "var(--color-brown-soft-2)",
                          flexShrink: 0,
                          width: 64,
                        }}
                      >
                        {order.hash}
                      </span>

                      {/* Status dot */}
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: statusDotColor(order.status),
                          flexShrink: 0,
                        }}
                      />

                      {/* Customer + items */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--color-brown)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.customer}
                          </span>
                          {order.urgency === "overdue" && (
                            <span className="pill-red glow-red" style={{
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              padding: "1px 6px",
                              borderRadius: 9999,
                              background: "rgba(229,65,65,0.1)",
                              color: "var(--color-red-deep)",
                            }}>
                              OVERDUE
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--color-brown-soft-2)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                          }}
                        >
                          {itemSummary}
                        </span>
                      </div>
                    </div>

                    {/* Center: method pill + ready-by */}
                    <div
                      className="hidden md:flex"
                      style={{
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        className="pill-mute"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 600,
                          background: "var(--color-cream-sunken)",
                          color: "var(--color-brown-soft-2)",
                        }}
                      >
                        {order.method === "delivery" ? (
                          <Truck size={12} strokeWidth={2} />
                        ) : (
                          <ShoppingBag size={12} strokeWidth={2} />
                        )}
                        {order.method === "delivery" ? "Delivery" : "Pickup"}
                      </span>

                      {order.readyBy && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 12,
                            color: "var(--color-brown-soft-2)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Clock size={12} strokeWidth={2} />
                          {order.readyBy}
                        </span>
                      )}
                    </div>

                    {/* Right: price + payout + action */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div
                          className="tnum"
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-brown)",
                          }}
                        >
                          {order.price}
                        </div>
                        {order.payout && (
                          <div
                            className="caption tnum"
                            style={{ marginTop: -1 }}
                          >
                            {order.payout}
                          </div>
                        )}
                      </div>

                      {label ? (
                        <button
                          className={`btn btn-sm ${actionBtnClass(order.status)}`}
                          style={{ minWidth: 72 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toast(actionToastMsg(order.hash, order.status));
                          }}
                        >
                          {label}
                        </button>
                      ) : (
                        /* Spacer to keep alignment */
                        <div style={{ width: 72 }} />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* -------- Pagination -------- */}
      {filtered.length > 0 && (
        <div
          className="flex items-center justify-between flex-wrap gap-3 caption"
        >
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              style={{
                width: "auto",
                padding: "4px 8px",
                fontSize: 12,
                minHeight: 28,
                borderRadius: 6,
                border: "1px solid rgba(51,31,46,0.1)",
                background: "#fff",
                color: "var(--color-brown-soft)",
                cursor: "pointer",
              }}
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          <span className="tnum">
            {showingStart}–{showingEnd} of {filtered.length}
          </span>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: p === page ? "none" : "1px solid rgba(51,31,46,0.1)",
                  background: p === page ? "var(--color-brown)" : "#fff",
                  color: p === page ? "var(--color-cream)" : "var(--color-brown-soft)",
                  cursor: "pointer",
                  transition: "all var(--t-fast) var(--ease-spring)",
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
