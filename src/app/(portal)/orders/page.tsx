/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Truck, ShoppingBag, Clock, Package, ChevronRight } from "lucide-react";
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
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>({});

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

  const getEffectiveStatus = (order: Order): OrderStatus => {
    return statusOverrides[order.hash] || order.status;
  };

  const advanceStatus = (hash: string, currentStatus: OrderStatus) => {
    const nextMap: Partial<Record<OrderStatus, OrderStatus>> = {
      paid: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "delivered",
      readyForPickup: "pickedUp",
    };
    const next = nextMap[currentStatus];
    if (next) {
      setStatusOverrides((prev) => ({ ...prev, [hash]: next }));
    }
  };

  if (!loaded) {
    return (
      <div className="content-default section-stack">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-default section-stack">
      <style>{`
        @media (max-width: 640px) {
          .order-filter-tabs button { height: 28px !important; font-size: 11px !important; }
        }
      `}</style>
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
            <div className="order-filter-tabs" style={{ display: "flex", gap: 4 }}>
              {filterTabs.map((tab) => {
                const isActive = tab.label === activeTab;
                const count = tabCounts[tab.label];
                return (
                  <button
                    key={tab.label}
                    onClick={() => { setActiveTab(tab.label); setPage(1); }}
                    className="h-7 sm:h-8 text-[11px] sm:text-[12px]"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "0 10px",
                      borderRadius: 8,
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

      {/* -------- Order cards — separated, scannable -------- */}
      {paginated.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "80px 20px" }}>
          <Package size={48} strokeWidth={1.2} style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 16px" }} />
          <div className="heading-md" style={{ marginBottom: 6 }}>No orders found</div>
          <div className="body-sm" style={{ marginBottom: 24 }}>Try a different filter or search term</div>
          <Link href="/dashboard" className="btn btn-ghost" style={{ display: "inline-flex" }}>Back to Dashboard</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {paginated.map((order) => {
            const effectiveStatus = getEffectiveStatus(order);
            const label = actionLabel(effectiveStatus);
            const itemSummary = order.items.map((i) => (i.qty > 1 ? `${i.qty}x ${i.name}` : i.name)).join(", ");
            const isStruck = effectiveStatus === "cancelled" || effectiveStatus === "rejected";
            const dateTime = order.time ? `${order.date} · ${order.time}` : order.date;

            return (
              <Link
                key={order.hash}
                href={`/orders/${linkId(order.hash)}`}
                className={`card card-hover ${order.urgency === "overdue" ? "urgency-red" : order.urgency === "due-soon" ? "urgency-amber" : ""}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  padding: 0,
                  opacity: isStruck ? 0.6 : 1,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "16px 20px" }}>
                  {/* Row 1: Name + Status + Chevron */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    {/* Status dot */}
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDotColor(effectiveStatus), flexShrink: 0, transition: "background 0.3s ease" }} />
                    {/* Customer name */}
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)", flex: 1 }}>
                      {order.customer}
                    </span>
                    {/* Status pill */}
                    <span className={`pill ${effectiveStatus === "paid" || effectiveStatus === "confirmed" || effectiveStatus === "rescheduling" ? "pill-orange" : effectiveStatus === "cancelled" || effectiveStatus === "rejected" ? "pill-red" : "pill-sage"}`}>
                      {statusLabel(effectiveStatus)}
                    </span>
                    {/* Chevron arrow */}
                    <ChevronRight size={16} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }} />
                  </div>

                  {/* Row 2: Date/time + Method */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, marginLeft: 16 }}>
                    <span className="caption tnum" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> {dateTime}
                    </span>
                    <span className="caption" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      {order.method === "delivery" ? <Truck size={12} /> : <ShoppingBag size={12} />}
                      {order.method === "delivery" ? "Delivery" : "Pickup"}
                    </span>
                    {order.urgency === "overdue" && (
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, padding: "1px 6px", borderRadius: 9999, background: "rgba(229,65,65,0.1)", color: "var(--color-red-deep)" }}>
                        OVERDUE
                      </span>
                    )}
                  </div>

                  {/* Row 3: Items */}
                  <div style={{ marginLeft: 16, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "var(--color-brown-soft)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {itemSummary}
                    </span>
                  </div>

                  {/* Row 4: Price + Action button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginLeft: 16 }}>
                    <div>
                      <span className="fraunces tnum" style={{ fontSize: 18, color: "var(--color-brown)" }}>
                        {order.price}
                      </span>
                      {order.payout && !isStruck && (
                        <span className="caption tnum" style={{ marginLeft: 8 }}>
                          {order.payout} payout
                        </span>
                      )}
                    </div>
                    {label && (
                      <button
                        className={`btn btn-sm ${actionBtnClass(effectiveStatus)}`}
                        style={{ minWidth: 80, transition: "all 0.2s ease" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast(actionToastMsg(order.hash, effectiveStatus));
                          advanceStatus(order.hash, effectiveStatus);
                        }}
                      >
                        {label}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

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
