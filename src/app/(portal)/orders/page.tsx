/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, Clock, Truck, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

const filters = [
  { label: "Needs Action", badge: 2 },
  { label: "Today" },
  { label: "Preparing" },
  { label: "Ready" },
  { label: "Completed" },
  { label: "All" },
] as const;

type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

interface Order {
  id: string;
  number: number;
  customer: string;
  items: string;
  method: "delivery" | "pickup";
  time: string;
  price: string;
  status: OrderStatus;
  overdue?: boolean;
  dueSoon?: boolean;
  cancelNote?: string;
}

const orders: Order[] = [
  {
    id: "1042",
    number: 1042,
    customer: "Sarah K.",
    items: "2\u00d7 Mansaf, 1\u00d7 Baklava",
    method: "delivery",
    time: "6:30 PM",
    price: "$49.00",
    status: "preparing",
    overdue: true,
  },
  {
    id: "1041",
    number: 1041,
    customer: "Marcus T.",
    items: "1\u00d7 Falafel, 1\u00d7 Hummus",
    method: "delivery",
    time: "7:00 PM",
    price: "$26.50",
    status: "confirmed",
    dueSoon: true,
  },
  {
    id: "1040",
    number: 1040,
    customer: "Priya R.",
    items: "1\u00d7 Knafeh",
    method: "delivery",
    time: "7:15 PM",
    price: "$18.00",
    status: "ready",
  },
  {
    id: "1039",
    number: 1039,
    customer: "Jordan L.",
    items: "3\u00d7 Shawarma",
    method: "pickup",
    time: "7:30 PM",
    price: "$48.00",
    status: "new",
  },
  {
    id: "1038",
    number: 1038,
    customer: "Layla M.",
    items: "1\u00d7 Mandi, 1\u00d7 Tabouleh",
    method: "delivery",
    time: "6:45 PM",
    price: "$33.00",
    status: "cancelled",
    cancelNote: "by customer",
  },
  {
    id: "1037",
    number: 1037,
    customer: "Daniel B.",
    items: "1\u00d7 Family Dinner Bundle",
    method: "pickup",
    time: "8:00 PM",
    price: "$65.00",
    status: "completed",
  },
];

function statusPill(status: OrderStatus) {
  switch (status) {
    case "new":
      return <span className="pill pill-red">New</span>;
    case "confirmed":
      return <span className="pill pill-orange">Confirmed</span>;
    case "preparing":
      return <span className="pill pill-orange">Preparing</span>;
    case "ready":
      return <span className="pill pill-sage">Ready</span>;
    case "completed":
      return <span className="pill pill-sage">Completed</span>;
    case "cancelled":
      return (
        <span className="pill pill-mute">Cancelled</span>
      );
  }
}

function ActionButton({ order, onAction }: { order: Order; onAction: (msg: string) => void }) {
  const handleClick = (e: React.MouseEvent, msg: string) => {
    e.stopPropagation();
    e.preventDefault();
    onAction(msg);
  };

  switch (order.status) {
    case "new":
      return (
        <button className="btn btn-red btn-sm" onClick={(e) => handleClick(e, `Order #${order.id} confirmed`)}>
          Confirm
        </button>
      );
    case "confirmed":
      return (
        <button className="btn btn-amber btn-sm" onClick={(e) => handleClick(e, `Started prep for #${order.id}`)}>
          Start Prep
        </button>
      );
    case "preparing":
      return (
        <button className="btn btn-sage btn-sm" onClick={(e) => handleClick(e, `Order #${order.id} marked ready`)}>
          Mark Ready
        </button>
      );
    case "ready":
      return (
        <button
          className="btn btn-sm"
          onClick={(e) => handleClick(e, `Order #${order.id} handed off`)}
          style={{
            background: "var(--color-terracotta)",
            color: "#fff",
            borderColor: "var(--color-terracotta)",
          }}
        >
          Hand Off
        </button>
      );
    case "cancelled":
      return (
        <span
          style={{
            fontSize: 12,
            color: "var(--color-brown-soft-2)",
            fontStyle: "italic",
          }}
        >
          {order.cancelNote}
        </span>
      );
    case "completed":
      return null;
  }
}

function borderColor(order: Order) {
  if (order.overdue) return "var(--color-red)";
  if (order.dueSoon) return "var(--color-orange)";
  return "transparent";
}

function matchesFilter(order: Order, filter: string): boolean {
  switch (filter) {
    case "Needs Action":
      return order.status === "new" || order.status === "confirmed";
    case "Today":
      return true;
    case "Preparing":
      return order.status === "preparing";
    case "Ready":
      return order.status === "ready";
    case "Completed":
      return order.status === "completed";
    case "All":
      return true;
    default:
      return true;
  }
}

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("Needs Action");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const passesFilter = matchesFilter(order, activeFilter);
    if (!searchQuery.trim()) return passesFilter;
    const q = searchQuery.toLowerCase();
    return (
      passesFilter &&
      (order.customer.toLowerCase().includes(q) ||
        order.items.toLowerCase().includes(q) ||
        String(order.number).includes(q))
    );
  });

  return (
    <div className="section-stack">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="fraunces" style={{ fontSize: 24, fontWeight: 700 }}>
          Orders
        </h1>
        <div className="flex-1" />
        <button
          onClick={() => {
            setSearchOpen(!searchOpen);
            if (searchOpen) setSearchQuery("");
          }}
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            color: "var(--color-brown-soft)",
            background: searchOpen ? "rgba(51,31,46,0.06)" : undefined,
          }}
        >
          {searchOpen ? (
            <X size={18} strokeWidth={1.8} />
          ) : (
            <Search size={18} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Search bar -- expandable */}
      {searchOpen && (
        <div style={{ marginTop: -8 }}>
          <input
            type="text"
            placeholder="Search by order #, customer, or dish..."
            className="input"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Filter pills -- horizontal scroll */}
      <div
        className="flex gap-2"
        style={{
          overflowX: "auto",
          paddingBottom: 4,
          marginLeft: -2,
          marginRight: -2,
          paddingLeft: 2,
          paddingRight: 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .filter-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        {filters.map((f) => {
          const isActive = f.label === activeFilter;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`pill ${isActive ? "pill-brown" : ""}`}
              style={{
                cursor: "pointer",
                border: isActive ? undefined : "1px solid rgba(51,31,46,0.1)",
                minHeight: 44,
              }}
            >
              {f.label}
              {"badge" in f && f.badge && (
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    background: isActive
                      ? "var(--color-red)"
                      : "var(--color-red-soft)",
                    color: isActive ? "#fff" : "var(--color-red-deep)",
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 9999,
                    padding: "0 4px",
                    marginLeft: 2,
                  }}
                >
                  {f.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      <div className="flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 12,
              }}
            >
              {searchQuery ? "\uD83D\uDD0D" : "\u2705"}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-brown)",
                marginBottom: 6,
              }}
            >
              {searchQuery ? "No matching orders" : "All caught up!"}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--color-brown-soft)",
                marginBottom: 20,
              }}
            >
              {searchQuery
                ? "Try a different search term or filter."
                : "No orders need action right now."}
            </div>
            <Link
              href="/operations"
              className="btn btn-ghost"
              style={{ display: "inline-flex" }}
            >
              View Operations
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block"
              style={{
                opacity: order.status === "cancelled" ? 0.5 : 1,
              }}
            >
              <div
                className="bg-white rounded-2xl shadow-card"
                style={{
                  padding: 16,
                  borderLeft: `4px solid ${borderColor(order)}`,
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
              >
                <div className="flex gap-3">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="mono"
                        style={{
                          fontSize: 13,
                          color: "var(--color-brown-soft)",
                        }}
                      >
                        #{order.number}
                      </span>
                      {order.overdue && (
                        <span className="pill pill-red" style={{ fontSize: 10 }}>
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        marginTop: 2,
                        color: "var(--color-brown)",
                      }}
                    >
                      {order.customer}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-brown-soft)",
                        marginTop: 2,
                      }}
                    >
                      {order.items}
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ marginTop: 6 }}
                    >
                      <span
                        className="pill pill-mute"
                        style={{
                          fontSize: 11,
                          gap: 4,
                        }}
                      >
                        {order.method === "delivery" ? (
                          <Truck size={12} strokeWidth={2} />
                        ) : (
                          <MapPin size={12} strokeWidth={2} />
                        )}
                        {order.method === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        style={{
                          fontSize: 12,
                          color: "var(--color-brown-soft-2)",
                        }}
                      >
                        <Clock size={12} strokeWidth={1.8} />
                        {order.time}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end justify-between gap-2">
                    <span
                      className="fraunces"
                      style={{ fontSize: 18, fontWeight: 600 }}
                    >
                      {order.price}
                    </span>
                    {statusPill(order.status)}
                    <div style={{ marginTop: 2 }}>
                      <ActionButton order={order} onAction={toast} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
