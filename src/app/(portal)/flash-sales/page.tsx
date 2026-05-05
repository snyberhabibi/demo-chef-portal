/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  ShoppingBag,
  Truck,
  Eye,
  X,
  ChevronRight,
  Trash2,
  Copy,
  Pencil,
  Ban,
  BarChart3,
} from "lucide-react";
import {
  flashSales,
  flashSaleAvailableDishes as availableDishes,
  type FlashSale,
  type SaleStatus,
} from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Tab config                                                         */
/* ------------------------------------------------------------------ */
const tabs: { key: SaleStatus; label: string }[] = [
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "draft", label: "Drafts" },
  { key: "past", label: "Past" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function statusDotColor(s: SaleStatus): string {
  switch (s) {
    case "live":
      return "var(--color-sage)";
    case "upcoming":
      return "var(--color-orange)";
    case "draft":
      return "var(--color-brown-soft-2)";
    case "past":
      return "var(--color-brown-soft-2)";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function FlashSalesPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState<SaleStatus>("live");
  const [showCreate, setShowCreate] = useState(false);

  const counts = useMemo(() => {
    const c: Record<SaleStatus, number> = { live: 0, upcoming: 0, draft: 0, past: 0 };
    for (const sale of flashSales) c[sale.status]++;
    return c;
  }, []);

  const filtered = useMemo(
    () => flashSales.filter((s) => s.status === activeTab),
    [activeTab]
  );

  if (!loaded) {
    return (
      <div className="content-default section-stack">
        <div className="skeleton" style={{ height: 36, width: 200, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-default section-stack">
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .flash-pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }
      `}</style>

      {/* -------- Header -------- */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="heading-lg">Flash Sales</h1>
        <button
          className="btn btn-dark btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          onClick={() => setShowCreate(!showCreate)}
        >
          <Plus size={14} strokeWidth={2.5} />
          Create Flash Sale
        </button>
      </div>

      {/* -------- Create flow (inline panel) -------- */}
      {showCreate && (
        <CreateFlashSalePanel onClose={() => setShowCreate(false)} />
      )}

      {/* -------- Tabs -------- */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid rgba(51,31,46,0.08)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderBottom: isActive
                  ? "2px solid var(--color-red)"
                  : "2px solid transparent",
                background: "transparent",
                color: isActive
                  ? "var(--color-red)"
                  : "var(--color-brown-soft-2)",
                cursor: "pointer",
                transition: "all var(--t-fast) var(--ease-spring)",
              }}
            >
              {tab.label}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 18,
                  height: 18,
                  padding: "0 5px",
                  borderRadius: 9999,
                  fontSize: 10,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  background: isActive
                    ? "var(--color-red)"
                    : "var(--color-cream-sunken)",
                  color: isActive
                    ? "#fff"
                    : "var(--color-brown-soft-2)",
                }}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------- Sale cards -------- */}
      {filtered.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <Clock
            size={40}
            strokeWidth={1.2}
            style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 12px" }}
          />
          <div className="heading-md" style={{ marginBottom: 4 }}>
            No {activeTab} sales
          </div>
          <div className="body-sm" style={{ marginBottom: 20 }}>
            {activeTab === "draft"
              ? "Create a flash sale and save it as a draft."
              : activeTab === "upcoming"
              ? "Schedule a sale to see it here."
              : activeTab === "live"
              ? "No active sales right now."
              : "Past sales will appear here once completed."}
          </div>
          {(activeTab === "draft" || activeTab === "upcoming") && (
            <button
              className="btn btn-dark btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => setShowCreate(true)}
            >
              <Plus size={14} strokeWidth={2.5} />
              Create Flash Sale
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((sale) => (
            <FlashSaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Flash Sale Card                                                    */
/* ------------------------------------------------------------------ */
function FlashSaleCard({ sale }: { sale: FlashSale }) {
  const dotColor = statusDotColor(sale.status);
  const isLive = sale.status === "live";
  const isPast = sale.status === "past";
  const isDraft = sale.status === "draft";
  const isUpcoming = sale.status === "upcoming";

  return (
    <div
      className="card"
      style={{
        padding: "16px 18px",
        opacity: isPast ? 0.85 : 1,
      }}
    >
      {/* Row 1: status dot + name + time info */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          className={isLive ? "flash-pulse-dot" : ""}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
          }}
        />
        <span className="heading-sm" style={{ flex: 1 }}>
          {sale.name}
        </span>
        {isLive && sale.countdown && (
          <span
            className="caption tnum"
            style={{ color: "var(--color-red)", fontWeight: 600 }}
          >
            Orders close in {sale.countdown}
          </span>
        )}
        {isUpcoming && sale.countdown && (
          <span
            className="caption tnum"
            style={{ color: "var(--color-orange)", fontWeight: 600 }}
          >
            Opens in {sale.countdown}
          </span>
        )}
        {isDraft && (
          <span className="caption" style={{ fontStyle: "italic" }}>
            Not scheduled
          </span>
        )}
        {isPast && (
          <span className="caption">Completed</span>
        )}
      </div>

      {/* Row 2: stats for live/past */}
      {(isLive || isPast) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
          }}
        >
          <span
            className="tnum"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-brown)",
            }}
          >
            {sale.orderCount} orders
          </span>
          <span className="caption">&middot;</span>
          <span
            className="tnum"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-brown)",
            }}
          >
            ${sale.revenue?.toLocaleString()}
          </span>
          {isPast && sale.soldOutNote && (
            <>
              <span className="caption">&middot;</span>
              <span
                className="caption"
                style={{
                  color: "var(--color-sage-deep)",
                  fontWeight: 600,
                }}
              >
                {sale.soldOutNote}
              </span>
            </>
          )}
        </div>
      )}

      {/* Row 3: items pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 10,
        }}
      >
        {sale.items.map((item) => (
          <span
            key={item}
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              background: "var(--color-cream-sunken)",
              color: "var(--color-brown-soft)",
            }}
          >
            {item}
          </span>
        ))}
        {isDraft && (
          <span
            className="caption"
            style={{ alignSelf: "center", fontStyle: "italic" }}
          >
            {sale.items.length} items added
          </span>
        )}
      </div>

      {/* Row 4: fulfillment info for live/upcoming */}
      {(isLive || isUpcoming) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 10,
          }}
        >
          {isLive && sale.pickupWindow && (
            <span
              className="caption"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--color-cream-deep)",
              }}
            >
              <ShoppingBag size={12} />
              Pickup: {sale.pickupWindow}
            </span>
          )}
          {isLive && sale.deliveryWindow && (
            <span
              className="caption"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--color-cream-deep)",
              }}
            >
              <Truck size={12} />
              Delivery: {sale.deliveryWindow}
            </span>
          )}
          {isUpcoming && sale.fulfillmentLabel && (
            <span
              className="caption"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--color-cream-deep)",
              }}
            >
              <Clock size={12} />
              Fulfillment: {sale.fulfillmentLabel}
            </span>
          )}
          {isUpcoming && (
            <span
              className="caption"
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--color-cream-deep)",
              }}
            >
              Orders: {sale.orderOpen} &rarr; {sale.orderClose}
            </span>
          )}
        </div>
      )}

      {/* Row 5: actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        {isLive && (
          <>
            <Link
              href="/orders"
              className="btn btn-dark btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Eye size={12} />
              View Orders
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Ban size={12} />
              Close Early
            </button>
          </>
        )}
        {isUpcoming && (
          <>
            <button
              className="btn btn-dark btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <X size={12} />
              Cancel
            </button>
          </>
        )}
        {isDraft && (
          <>
            <button
              className="btn btn-dark btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Pencil size={12} />
              Continue Editing
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Trash2 size={12} />
              Delete
            </button>
          </>
        )}
        {isPast && (
          <>
            <button
              className="btn btn-dark btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <BarChart3 size={12} />
              View Summary
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Copy size={12} />
              Duplicate
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Flash Sale Panel                                            */
/* ------------------------------------------------------------------ */
type CreateTab = "details" | "menu" | "launch";

interface AddedItem {
  id: string;
  name: string;
  flashPrice: string;
  quantityLimit: string;
  perCustomerLimit: string;
}

function CreateFlashSalePanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<CreateTab>("details");

  /* Details state */
  const [saleName, setSaleName] = useState("");
  const [description, setDescription] = useState("");
  const [openDate, setOpenDate] = useState("2026-05-09");
  const [openTime, setOpenTime] = useState("18:00");
  const [closeDate, setCloseDate] = useState("2026-05-10");
  const [closeTime, setCloseTime] = useState("20:00");
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupDate, setPickupDate] = useState("2026-05-11");
  const [pickupTimeStart, setPickupTimeStart] = useState("10:00");
  const [pickupTimeEnd, setPickupTimeEnd] = useState("14:00");
  const [pickupLocation, setPickupLocation] = useState("Downtown Kitchen");
  const [deliveryDate, setDeliveryDate] = useState("2026-05-11");
  const [deliveryTimeStart, setDeliveryTimeStart] = useState("16:00");
  const [deliveryTimeEnd, setDeliveryTimeEnd] = useState("20:00");
  const [deliveryNote, setDeliveryNote] = useState("DFW area — 15 mile radius");
  const [visibility, setVisibility] = useState<"public" | "vip" | "private">("public");

  /* Menu state */
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  /* Launch state */
  const [notificationText, setNotificationText] = useState(
    "Yalla Kitchen is dropping a flash sale! Weekend Special — order now before it sells out"
  );
  const [checkoutTimer, setCheckoutTimer] = useState("10");
  const [showInventory, setShowInventory] = useState(true);

  const createTabs: { key: CreateTab; label: string; step: number }[] = [
    { key: "details", label: "Details", step: 1 },
    { key: "menu", label: "Menu", step: 2 },
    { key: "launch", label: "Launch", step: 3 },
  ];

  const addDish = (dish: (typeof availableDishes)[number]) => {
    if (addedItems.find((i) => i.id === dish.id)) return;
    setAddedItems((prev) => [
      ...prev,
      {
        id: dish.id,
        name: dish.name,
        flashPrice: String(dish.basePrice),
        quantityLimit: "",
        perCustomerLimit: "",
      },
    ]);
  };

  const removeDish = (id: string) => {
    setAddedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof AddedItem, value: string) => {
    setAddedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        border: "1px solid rgba(51,31,46,0.08)",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid rgba(51,31,46,0.06)",
        }}
      >
        <span className="heading-sm">Create Flash Sale</span>
        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-brown-soft-2)",
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Step tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid rgba(51,31,46,0.06)",
          padding: "0 18px",
        }}
      >
        {createTabs.map((t) => {
          const isActive = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                borderBottom: isActive
                  ? "2px solid var(--color-brown)"
                  : "2px solid transparent",
                background: "transparent",
                color: isActive
                  ? "var(--color-brown)"
                  : "var(--color-brown-soft-2)",
                cursor: "pointer",
                transition: "all var(--t-fast) var(--ease-spring)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  fontSize: 10,
                  fontWeight: 700,
                  background: isActive
                    ? "var(--color-brown)"
                    : "var(--color-cream-sunken)",
                  color: isActive
                    ? "var(--color-cream)"
                    : "var(--color-brown-soft-2)",
                }}
              >
                {t.step}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: "18px" }}>
        {/* ---- Tab 1: Details ---- */}
        {tab === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="field-label">Sale Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Weekend Special"
                value={saleName}
                onChange={(e) => setSaleName(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea
                className="input"
                placeholder="What makes this sale special?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "vertical", minHeight: 72 }}
              />
            </div>

            {/* Order window */}
            <div>
              <label className="field-label">Order Window</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 4 }}>
                <div>
                  <span className="caption" style={{ fontWeight: 600 }}>
                    Opens
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <input
                      type="date"
                      className="input"
                      value={openDate}
                      onChange={(e) => setOpenDate(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="time"
                      className="input tnum"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      style={{ width: 100 }}
                    />
                  </div>
                </div>
                <div>
                  <span className="caption" style={{ fontWeight: 600 }}>
                    Closes
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <input
                      type="date"
                      className="input"
                      value={closeDate}
                      onChange={(e) => setCloseDate(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="time"
                      className="input tnum"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      style={{ width: 100 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fulfillment windows */}
            <div>
              <label className="field-label" style={{ marginBottom: 8 }}>
                Fulfillment Windows
              </label>

              {/* Pickup toggle */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--color-cream)",
                  marginBottom: 8,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-2"
                    style={{ fontSize: 13, fontWeight: 600 }}
                  >
                    <ShoppingBag size={14} />
                    Pickup
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickupEnabled(!pickupEnabled)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: pickupEnabled
                        ? "var(--color-sage)"
                        : "var(--color-cream-sunken)",
                      position: "relative",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: pickupEnabled ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>
                </div>
                {pickupEnabled && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 10,
                    }}
                  >
                    <input
                      type="date"
                      className="input"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{ flex: "1 1 120px" }}
                    />
                    <input
                      type="time"
                      className="input tnum"
                      value={pickupTimeStart}
                      onChange={(e) => setPickupTimeStart(e.target.value)}
                      style={{ width: 90 }}
                    />
                    <span
                      className="caption"
                      style={{ alignSelf: "center" }}
                    >
                      to
                    </span>
                    <input
                      type="time"
                      className="input tnum"
                      value={pickupTimeEnd}
                      onChange={(e) => setPickupTimeEnd(e.target.value)}
                      style={{ width: 90 }}
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      style={{ flex: "1 1 100%" }}
                    />
                  </div>
                )}
              </div>

              {/* Delivery toggle */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--color-cream)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-2"
                    style={{ fontSize: 13, fontWeight: 600 }}
                  >
                    <Truck size={14} />
                    Delivery
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: deliveryEnabled
                        ? "var(--color-sage)"
                        : "var(--color-cream-sunken)",
                      position: "relative",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: deliveryEnabled ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>
                </div>
                {deliveryEnabled && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 10,
                    }}
                  >
                    <input
                      type="date"
                      className="input"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      style={{ flex: "1 1 120px" }}
                    />
                    <input
                      type="time"
                      className="input tnum"
                      value={deliveryTimeStart}
                      onChange={(e) => setDeliveryTimeStart(e.target.value)}
                      style={{ width: 90 }}
                    />
                    <span
                      className="caption"
                      style={{ alignSelf: "center" }}
                    >
                      to
                    </span>
                    <input
                      type="time"
                      className="input tnum"
                      value={deliveryTimeEnd}
                      onChange={(e) => setDeliveryTimeEnd(e.target.value)}
                      style={{ width: 90 }}
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Delivery zone notes"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      style={{ flex: "1 1 100%" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="field-label">Visibility</label>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {(
                  [
                    { key: "public", label: "Public" },
                    { key: "vip", label: "VIP Only" },
                    { key: "private", label: "Private" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setVisibility(opt.key)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      border:
                        visibility === opt.key
                          ? "none"
                          : "1px solid rgba(51,31,46,0.12)",
                      background:
                        visibility === opt.key
                          ? "var(--color-brown)"
                          : "transparent",
                      color:
                        visibility === opt.key
                          ? "var(--color-cream)"
                          : "var(--color-brown-soft)",
                      cursor: "pointer",
                      transition: "all var(--t-fast)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => setTab("menu")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Next: Menu <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ---- Tab 2: Menu ---- */}
        {tab === "menu" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Available dishes */}
            <div>
              <label className="field-label">
                Add items from your menu
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginTop: 6,
                }}
              >
                {availableDishes.map((dish) => {
                  const isAdded = addedItems.some((i) => i.id === dish.id);
                  return (
                    <div
                      key={dish.id}
                      className="flex items-center justify-between"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: isAdded
                          ? "var(--color-sage-soft)"
                          : "var(--color-cream)",
                        opacity: isAdded ? 0.6 : 1,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-brown)",
                          }}
                        >
                          {dish.name}
                        </span>
                        <span
                          className="caption tnum"
                          style={{ marginLeft: 8 }}
                        >
                          ${dish.basePrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addDish(dish)}
                        disabled={isAdded}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          border: "none",
                          background: isAdded
                            ? "transparent"
                            : "var(--color-brown)",
                          color: isAdded
                            ? "var(--color-brown-soft-2)"
                            : "var(--color-cream)",
                          cursor: isAdded ? "default" : "pointer",
                        }}
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Added items — configurable */}
            {addedItems.length > 0 && (
              <div>
                <label className="field-label">
                  Flash sale items ({addedItems.length})
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  {addedItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: "var(--color-cream)",
                        border: "1px solid rgba(51,31,46,0.06)",
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-brown)",
                          }}
                        >
                          {item.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDish(item.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            color: "var(--color-red)",
                            cursor: "pointer",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                      >
                        <div>
                          <span
                            className="caption"
                            style={{ fontWeight: 600 }}
                          >
                            Flash Price
                          </span>
                          <div className="relative" style={{ marginTop: 3 }}>
                            <span
                              className="absolute"
                              style={{
                                left: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: 12,
                                color: "var(--color-brown-soft-2)",
                              }}
                            >
                              $
                            </span>
                            <input
                              type="text"
                              className="input tnum text-xs sm:text-xs"
                              value={item.flashPrice}
                              onChange={(e) =>
                                updateItem(item.id, "flashPrice", e.target.value)
                              }
                              style={{
                                paddingLeft: 20,
                                height: 32,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <span
                            className="caption"
                            style={{ fontWeight: 600 }}
                          >
                            Qty Limit
                          </span>
                          <input
                            type="text"
                            className="input tnum text-xs sm:text-xs"
                            placeholder="No limit"
                            value={item.quantityLimit}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantityLimit",
                                e.target.value
                              )
                            }
                            style={{
                              marginTop: 3,
                              height: 32,
                            }}
                          />
                        </div>
                        <div>
                          <span
                            className="caption"
                            style={{ fontWeight: 600 }}
                          >
                            Per Customer
                          </span>
                          <input
                            type="text"
                            className="input tnum text-xs sm:text-xs"
                            placeholder="No limit"
                            value={item.perCustomerLimit}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "perCustomerLimit",
                                e.target.value
                              )
                            }
                            style={{
                              marginTop: 3,
                              height: 32,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setTab("details")}
              >
                Back
              </button>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => setTab("launch")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Next: Launch <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ---- Tab 3: Launch ---- */}
        {tab === "launch" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Notification preview */}
            <div>
              <label className="field-label">Notification Preview</label>
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "var(--color-cream)",
                  border: "1px solid rgba(51,31,46,0.06)",
                  marginTop: 4,
                }}
              >
                <div
                  className="caption"
                  style={{
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "var(--color-brown-soft-2)",
                  }}
                >
                  Customers will see:
                </div>
                <textarea
                  className="input"
                  rows={2}
                  value={notificationText}
                  onChange={(e) => setNotificationText(e.target.value)}
                  style={{ resize: "vertical", fontSize: 13 }}
                />
              </div>
            </div>

            {/* Checkout timer */}
            <div>
              <label className="field-label">Checkout Timer</label>
              <div className="caption" style={{ marginBottom: 4 }}>
                How long customers have to complete checkout once they start
              </div>
              <select
                className="input"
                value={checkoutTimer}
                onChange={(e) => setCheckoutTimer(e.target.value)}
                style={{ width: 140, cursor: "pointer" }}
              >
                <option value="3">3 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
              </select>
            </div>

            {/* Show inventory toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown)",
                  }}
                >
                  Show inventory on storefront
                </span>
                <div className="caption">
                  Let customers see how many items are left
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInventory(!showInventory)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: showInventory
                    ? "var(--color-sage)"
                    : "var(--color-cream-sunken)",
                  position: "relative",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: showInventory ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    transition: "left 0.2s ease",
                  }}
                />
              </button>
            </div>

            {/* Timeline summary */}
            <div>
              <label className="field-label">Timeline</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  marginTop: 8,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--color-cream)",
                }}
              >
                {/* Open */}
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--color-sage)",
                      margin: "0 auto 4px",
                    }}
                  />
                  <div
                    className="caption"
                    style={{ fontWeight: 600, fontSize: 10 }}
                  >
                    OPEN
                  </div>
                  <div className="caption tnum" style={{ fontSize: 10 }}>
                    {openDate} {openTime}
                  </div>
                </div>
                {/* Arrow */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background:
                      "linear-gradient(90deg, var(--color-sage), var(--color-orange))",
                    borderRadius: 1,
                  }}
                />
                {/* Close */}
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--color-orange)",
                      margin: "0 auto 4px",
                    }}
                  />
                  <div
                    className="caption"
                    style={{ fontWeight: 600, fontSize: 10 }}
                  >
                    CLOSE
                  </div>
                  <div className="caption tnum" style={{ fontSize: 10 }}>
                    {closeDate} {closeTime}
                  </div>
                </div>
                {/* Arrow */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background:
                      "linear-gradient(90deg, var(--color-orange), var(--color-brown-soft-2))",
                    borderRadius: 1,
                  }}
                />
                {/* Fulfillment */}
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--color-brown-soft-2)",
                      margin: "0 auto 4px",
                    }}
                  />
                  <div
                    className="caption"
                    style={{ fontWeight: 600, fontSize: 10 }}
                  >
                    FULFILL
                  </div>
                  <div className="caption tnum" style={{ fontSize: 10 }}>
                    {pickupEnabled ? pickupDate : deliveryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setTab("menu")}
              >
                Back
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={onClose}
                >
                  Save as Draft
                </button>
                <button
                  className="btn btn-gradient"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                  onClick={onClose}
                >
                  Schedule Flash Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
