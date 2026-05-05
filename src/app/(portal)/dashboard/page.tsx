/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ArrowUpRight,
  Upload,
  Search,
  Truck,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */

/* Unified onboarding — 3 phases, 9 steps */
type Phase = { label: string; eyebrow: string; color: string; steps: Step[] };
type Step = {
  id: number;
  label: string;
  detail: string;
  done: boolean;
  current?: boolean;
  href: string;
};

const onboardingPhases: Phase[] = [
  {
    label: "Get Approved",
    eyebrow: "PHASE 1",
    color: "var(--color-orange)",
    steps: [
      {
        id: 1,
        label: "Upload Food Handler certificate",
        detail: "Required by your state — takes 2 min",
        done: true,
        href: "/profile",
      },
      {
        id: 2,
        label: "Review & sign proposal",
        detail: "Your terms, commission, and how payouts work",
        done: true,
        href: "/profile",
      },
      {
        id: 3,
        label: "Upload insurance docs",
        detail: "Liability coverage for your kitchen",
        done: true,
        href: "/profile",
      },
    ],
  },
  {
    label: "Build Your Kitchen",
    eyebrow: "PHASE 2",
    color: "var(--color-sage)",
    steps: [
      {
        id: 4,
        label: "Complete your profile",
        detail: "Business name, bio, cuisine — most is pre-filled",
        done: true,
        href: "/profile",
      },
      {
        id: 5,
        label: "Add your first dish",
        detail: "Photos, pricing, portions — about 3 min",
        done: false,
        current: true,
        href: "/menu/new",
      },
      {
        id: 6,
        label: "Set your availability",
        detail: "When can customers order from you?",
        done: false,
        href: "/operations",
      },
      {
        id: 7,
        label: "Connect your bank",
        detail: "Stripe setup — 5 min, you'll need your bank details",
        done: false,
        href: "/payments",
      },
    ],
  },
  {
    label: "Launch",
    eyebrow: "PHASE 3",
    color: "var(--color-red)",
    steps: [
      {
        id: 8,
        label: "Create your first flash sale",
        detail: "Set up a drop — the fastest way to start selling",
        done: false,
        href: "/flash-sales",
      },
      {
        id: 9,
        label: "Quick intro call",
        detail:
          "15 min — we review your store together and answer questions",
        done: false,
        href: "/help",
      },
      {
        id: 10,
        label: "Go live!",
        detail: "Flip the switch and start receiving orders",
        done: false,
        href: "/operations",
      },
    ],
  },
];

const stats = [
  {
    label: "Orders This Month",
    value: "47",
    delta: "\u219112% vs last month",
    positive: true,
  },
  {
    label: "Revenue This Month",
    value: "$2,184",
    delta: "\u21918% vs last month",
    positive: true,
  },
  {
    label: "Active Dishes",
    value: "12",
    delta: "3 drafts",
    positive: null,
  },
  {
    label: "Avg Rating",
    value: "4.8",
    delta: "from 4 reviews",
    positive: null,
  },
];

const recentOrders = [
  {
    hashId: "#1042",
    customer: "Sarah K.",
    itemCount: 3,
    method: "delivery" as const,
    status: "Paid",
    statusColor: "var(--color-orange)",
    price: "$49.00",
    date: "Today, 2:14 PM",
    readyBy: "6:30 PM",
  },
  {
    hashId: "#1041",
    customer: "Marcus T.",
    itemCount: 1,
    method: "delivery" as const,
    status: "Preparing",
    statusColor: "#e8a832",
    price: "$26.50",
    date: "Today, 1:30 PM",
    readyBy: "7:00 PM",
  },
  {
    hashId: "#1040",
    customer: "Priya R.",
    itemCount: 1,
    method: "pickup" as const,
    status: "Ready",
    statusColor: "var(--color-sage)",
    price: "$18.00",
    date: "Yesterday",
    readyBy: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Time-appropriate greeting                                          */
/* ------------------------------------------------------------------ */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [mode, setMode] = useState<"A" | "B">("B");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  if (!loaded) {
    return (
      <div className="section-stack">
        {/* Skeleton: stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
          ))}
        </div>
        {/* Skeleton: order rows */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 60, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="section-stack">
      {/* Mode toggle — subtle segmented control */}
      <div
        style={{
          display: "inline-flex",
          background: "var(--color-cream-sunken)",
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}
      >
        <button
          onClick={() => setMode("A")}
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            border: "none",
            background: mode === "A" ? "#fff" : "transparent",
            color: mode === "A" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            cursor: "pointer",
            boxShadow: mode === "A" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
            transition: "all var(--t-fast) var(--ease-spring)",
          }}
        >
          Setup
        </button>
        <button
          onClick={() => setMode("B")}
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            border: "none",
            background: mode === "B" ? "#fff" : "transparent",
            color: mode === "B" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            cursor: "pointer",
            boxShadow: mode === "B" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
            transition: "all var(--t-fast) var(--ease-spring)",
          }}
        >
          Dashboard
        </button>
      </div>

      {mode === "A" ? <ModeA /> : <ModeB />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode A — Unified onboarding (3 phases, 9 steps)                   */
/* ------------------------------------------------------------------ */
function ModeA() {
  const { toast } = useToast();
  const [step5Expanded, setStep5Expanded] = useState(false);
  const [step5Done, setStep5Done] = useState(false);
  const [quickDishName, setQuickDishName] = useState("");
  const [quickDishPrice, setQuickDishPrice] = useState("");

  const allSteps = onboardingPhases.flatMap((p) => p.steps);
  const doneCount =
    allSteps.filter((s) => s.done).length + (step5Done ? 1 : 0);
  const totalSteps = allSteps.length;
  const pct = (doneCount / totalSteps) * 100;
  const remaining = totalSteps - doneCount;

  const handlePublishDish = () => {
    if (!quickDishName.trim()) return;
    setStep5Done(true);
    setStep5Expanded(false);
    toast(`"${quickDishName}" published to your menu`);
  };

  return (
    <div className="section-stack line-reveal">
      {/* Header with progress bar */}
      <div>
        <h1 className="heading-lg" style={{ marginBottom: 6 }}>
          Welcome back, Amira
        </h1>
        <p className="body-sm" style={{ marginBottom: 12 }}>
          {remaining} {remaining === 1 ? "step" : "steps"} remaining to go
          live &mdash; you&apos;re almost there.
        </p>
        {/* Thin progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: "var(--color-cream-sunken)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: "var(--color-sage)",
              width: `${pct}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div className="caption tnum" style={{ marginTop: 4 }}>{Math.round(pct)}% complete</div>
      </div>

      {/* Phased checklist — each phase in its own card */}
      {onboardingPhases.map((phase) => {
        const phaseAllDone = phase.steps.every((s) =>
          s.id === 5 ? step5Done || s.done : s.done
        );
        const borderColor =
          phase.eyebrow === "PHASE 1"
            ? "var(--color-orange)"
            : phase.eyebrow === "PHASE 2"
            ? "var(--color-sage)"
            : "var(--color-red)";

        return (
          <div
            key={phase.label}
            className="card"
            style={{
              padding: 0,
              overflow: "hidden",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            {/* Phase header inside card */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(51,31,46,0.06)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="eyebrow">{phase.eyebrow}</span>
                <span className="heading-sm" style={{ fontSize: 14 }}>{phase.label}</span>
                {phaseAllDone && (
                  <span
                    className="pill pill-sage"
                    style={{ marginLeft: "auto", fontSize: 11 }}
                  >
                    <Check size={11} strokeWidth={3} /> Complete
                  </span>
                )}
              </div>
            </div>

            {/* Step rows */}
            {phase.steps.map((step, si) => {
              const isStep5 = step.id === 5;
              const isDone = isStep5 ? step5Done : step.done;
              const isCurrent = isStep5
                ? !step5Done && step.current
                : step.current;
              const isExpanded = isStep5 && step5Expanded && !step5Done;

              return (
                <div key={step.id}>
                  {si > 0 && <div className="divider" style={{ marginLeft: 16, marginRight: 16 }} />}

                  {isStep5 && !isDone ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!step5Done) setStep5Expanded(!step5Expanded);
                      }}
                      className="flex items-center gap-3 w-full text-left"
                      style={{
                        padding: "0 16px",
                        height: 44,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {isCurrent && !isExpanded ? (
                        <span
                          className="pulse-soft"
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--color-red)",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-brown-soft-2)" }}>
                            {step.id}
                          </span>
                        </span>
                      )}
                      <span
                        className="flex-1 min-w-0"
                        style={{
                          fontSize: 13,
                          fontWeight: isCurrent ? 600 : 500,
                          color: "var(--color-brown)",
                        }}
                      >
                        {step.label}
                      </span>
                      {isCurrent && !isExpanded && (
                        <span className="btn btn-gradient btn-sm shrink-0" style={{ fontSize: 12 }}>
                          Continue <ChevronRight size={12} />
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={step.href}
                      className="flex items-center gap-3"
                      style={{
                        padding: "0 16px",
                        height: 44,
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                      }}
                    >
                      {isCurrent ? (
                        <span
                          className="pulse-soft"
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--color-red)",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isDone ? (
                            <Check size={14} strokeWidth={2.5} style={{ color: "var(--color-sage)" }} />
                          ) : (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-brown-soft-2)" }}>
                              {step.id}
                            </span>
                          )}
                        </span>
                      )}
                      <span
                        className="flex-1 min-w-0"
                        style={{
                          fontSize: 13,
                          fontWeight: isCurrent ? 600 : 500,
                          color: isDone ? "var(--color-brown-soft-2)" : "var(--color-brown)",
                          textDecoration: isDone ? "line-through" : undefined,
                        }}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="btn btn-gradient btn-sm shrink-0" style={{ fontSize: 12 }}>
                          Continue <ChevronRight size={12} />
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Inline quick-add form for step 5 */}
                  {isExpanded && (
                    <div style={{ padding: "0 16px 16px" }}>
                      <div
                        style={{
                          background: "var(--color-cream)",
                          borderRadius: 10,
                          padding: 14,
                        }}
                      >
                        <div style={{ marginBottom: 10 }}>
                          <label className="field-label">Dish name</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g. Grandma's Kibbeh"
                            value={quickDishName}
                            onChange={(e) => setQuickDishName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <label className="field-label">Photo</label>
                          <button
                            type="button"
                            className="flex flex-col items-center justify-center w-full rounded-xl"
                            style={{
                              height: 72,
                              border: "2px dashed rgba(51,31,46,0.12)",
                              background: "var(--color-cream-deep)",
                              cursor: "pointer",
                            }}
                          >
                            <Upload size={16} strokeWidth={1.8} style={{ color: "var(--color-brown-soft-2)" }} />
                            <span className="caption" style={{ marginTop: 4, fontSize: 11 }}>Tap to upload</span>
                          </button>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                          <label className="field-label">Price</label>
                          <div className="relative" style={{ maxWidth: 120 }}>
                            <span
                              className="absolute"
                              style={{
                                left: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: 14,
                                color: "var(--color-brown-soft-2)",
                              }}
                            >
                              $
                            </span>
                            <input
                              type="text"
                              className="input tnum"
                              placeholder="0.00"
                              value={quickDishPrice}
                              onChange={(e) => setQuickDishPrice(e.target.value)}
                              style={{ paddingLeft: 24 }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-red btn-block"
                          onClick={handlePublishDish}
                          disabled={!quickDishName.trim()}
                          style={{
                            opacity: quickDishName.trim() ? 1 : 0.5,
                            cursor: quickDishName.trim() ? "pointer" : "not-allowed",
                          }}
                        >
                          Publish Dish
                        </button>

                        <div style={{ textAlign: "center", marginTop: 8 }}>
                          <Link
                            href="/menu/new"
                            className="caption"
                            style={{ fontWeight: 600, color: "var(--color-red)", fontSize: 11 }}
                          >
                            Or use the full editor &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Need help? — simple caption link */}
      <Link
        href="/settings"
        className="caption"
        style={{
          color: "var(--color-brown-soft-2)",
          fontWeight: 500,
        }}
      >
        Need help? Talk to a real human &rarr;
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode B — Fully set up (Active Dashboard)                          */
/* ------------------------------------------------------------------ */
function ModeB() {
  const greeting = useMemo(() => getGreeting(), []);
  const [dashSearch, setDashSearch] = useState("");

  const filteredOrders = useMemo(() => {
    const q = dashSearch.trim().toLowerCase();
    if (!q) return recentOrders;
    return recentOrders.filter(
      (order) =>
        order.customer.toLowerCase().includes(q) ||
        order.hashId.toLowerCase().includes(q)
    );
  }, [dashSearch]);

  return (
    <div className="content-wide section-stack line-reveal">
      <style>{`
        @media (max-width: 640px) {
          .mode-toggle-wrap { width: 100%; }
          .mode-toggle-wrap button { flex: 1; }
        }
      `}</style>

      {/* Greeting */}
      <h1 className="heading-lg" style={{ margin: "0 0 8px 0" }}>
        {greeting}, Amira{" "}
        <span
          role="img"
          aria-label="wave"
          className="animate-wave"
          style={{ display: "inline-block" }}
        >
          👋
        </span>
      </h1>

      {/* Search bar */}
      <div style={{ position: "relative", width: "100%" }}>
        <Search
          size={16}
          strokeWidth={2}
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
          placeholder="Search recent orders..."
          value={dashSearch}
          onChange={(e) => setDashSearch(e.target.value)}
          style={{
            width: "100%",
            height: 44,
            paddingLeft: 40,
            paddingRight: 14,
            borderRadius: 10,
            border: "1px solid rgba(51,31,46,0.1)",
            background: "#fff",
            fontSize: 14,
            color: "var(--color-brown)",
          }}
        />
      </div>

      {/* Stat cards — clean 2x2 / 4-across grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: "20px" }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              {stat.label}
            </div>
            <div
              className="fraunces tnum"
              style={{ fontSize: "clamp(24px, 5vw, 32px)", lineHeight: 1 }}
            >
              {stat.value}
            </div>
            <div className="caption" style={{ marginTop: 8, color: stat.positive ? "var(--color-sage-deep)" : "var(--color-brown-soft-2)" }}>
              {stat.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Flash Sales section */}
      <div>
        <style>{`
          @keyframes dashPulseDot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .dash-pulse-dot {
            animation: dashPulseDot 2s ease-in-out infinite;
          }
        `}</style>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span className="eyebrow">FLASH SALES</span>
          <Link
            href="/flash-sales"
            className="caption"
            style={{
              color: "var(--color-red)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            Create Flash Sale <ArrowUpRight size={12} />
          </Link>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 2 }}>
          {/* Live sale card */}
          <Link
            href="/flash-sales"
            className="card card-hover"
            style={{
              display: "block",
              textDecoration: "none",
              padding: "14px 16px",
              minWidth: 280,
              flex: "0 0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                className="dash-pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-sage)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flex: 1 }}>
                Weekend Special
              </span>
              <Zap size={14} style={{ color: "var(--color-orange)", flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)" }}>23 orders</span>
              <span className="caption">&middot;</span>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)" }}>$847</span>
            </div>
            <span className="caption tnum" style={{ color: "var(--color-red)", fontWeight: 600 }}>
              Orders close in 6h 32m
            </span>
          </Link>

          {/* Upcoming sale card */}
          <Link
            href="/flash-sales"
            className="card card-hover"
            style={{
              display: "block",
              textDecoration: "none",
              padding: "14px 16px",
              minWidth: 280,
              flex: "0 0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-orange)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flex: 1 }}>
                Meal Prep Monday
              </span>
            </div>
            <div className="caption" style={{ marginBottom: 4 }}>
              Opens Sun 6 PM &rarr; Closes Mon 11 PM
            </div>
            <span className="caption tnum" style={{ color: "var(--color-orange)", fontWeight: 600 }}>
              Opens in 2d 4h
            </span>
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span className="eyebrow">RECENT ORDERS</span>
          <Link
            href="/orders"
            className="caption"
            style={{
              color: "var(--color-red)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            View all <ArrowUpRight size={12} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredOrders.map((order) => (
            <Link
              key={order.hashId}
              href={`/orders/${order.hashId.replace("#", "")}`}
              className="card card-hover"
              style={{
                display: "block",
                textDecoration: "none",
                padding: "14px 16px",
              }}
            >
              {/* Row 1: dot + name + ready-by/date + price + chevron */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: order.statusColor, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {order.customer}
                </span>
                <span className="caption tnum" style={{ flexShrink: 0 }}>
                  {order.readyBy ? `Ready ${order.readyBy}` : order.date}
                </span>
                <span className="tnum" style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flexShrink: 0 }}>
                  {order.price}
                </span>
                <ChevronRight size={14} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }} />
              </div>

              {/* Row 2: method + items */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span className="caption" style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  {order.method === "delivery" ? <Truck size={14} /> : <ShoppingBag size={14} />}
                  {order.method === "delivery" ? "Delivery" : "Pickup"}
                </span>
                <span className="caption" style={{ flexShrink: 0 }}>&middot;</span>
                <span className="caption" style={{ flexShrink: 0 }}>
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </span>
                <span className="caption" style={{ flexShrink: 0 }}>&middot;</span>
                <span className="caption" style={{ flexShrink: 0 }}>{order.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
