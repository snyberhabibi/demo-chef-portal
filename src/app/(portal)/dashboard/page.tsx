/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Star,
  ArrowUpRight,
  Clock,
  Upload,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */
const chefAvatar =
  "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop";
const customer1 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop";

/* Unified onboarding — 3 phases, 9 steps */
type Phase = { label: string; eyebrow: string; steps: Step[] };
type Step = { id: number; label: string; detail: string; done: boolean; current?: boolean; href: string };

const onboardingPhases: Phase[] = [
  {
    label: "Get Approved",
    eyebrow: "PHASE 1",
    steps: [
      { id: 1, label: "Upload Food Handler certificate", detail: "Required by your state — takes 2 min", done: true, href: "/profile" },
      { id: 2, label: "Review & sign proposal", detail: "Your terms, commission, and how payouts work", done: true, href: "/profile" },
      { id: 3, label: "Upload insurance docs", detail: "Liability coverage for your kitchen", done: true, href: "/profile" },
    ],
  },
  {
    label: "Set Up Your Kitchen",
    eyebrow: "PHASE 2",
    steps: [
      { id: 4, label: "Complete your profile", detail: "Business name, bio, cuisine — most is pre-filled", done: true, href: "/profile" },
      { id: 5, label: "Add your first dish", detail: "Photos, pricing, portions — about 3 min", done: false, current: true, href: "/menu/new" },
      { id: 6, label: "Set your hours", detail: "When can customers order from you?", done: false, href: "/operations" },
      { id: 7, label: "Connect your bank", detail: "Stripe setup — 5 min, you'll need your bank details", done: false, href: "/payments" },
    ],
  },
  {
    label: "Go Live",
    eyebrow: "PHASE 3",
    steps: [
      { id: 8, label: "Quick intro call", detail: "15 min — we review your store together and answer questions", done: false, href: "/help" },
      { id: 9, label: "Go live!", detail: "Flip the switch and start receiving orders", done: false, href: "/operations" },
    ],
  },
];

const setupSteps = onboardingPhases.flatMap((p) => p.steps);

const urgentCards = [
  {
    border: "var(--color-red)",
    text: "2 orders need confirmation",
    pillClass: "pill-red",
    pillText: "Urgent",
    href: "/orders",
  },
  {
    border: "var(--color-orange)",
    text: "New review from Sarah K.",
    pillClass: "pill-orange",
    pillText: "New",
    href: "/reviews",
  },
  {
    border: "var(--color-sage)",
    text: "Store is live and getting views",
    pillClass: "pill-sage",
    pillText: "Live",
    href: "/operations",
  },
];

const stats = [
  {
    label: "Orders this month",
    value: "47",
    delta: "+12% vs last month",
    positive: true,
  },
  {
    label: "Revenue this month",
    value: "$2,184",
    delta: "+8%",
    positive: true,
  },
  { label: "Active dishes", value: "12", delta: "3 drafts", positive: null },
  { label: "Average rating", value: "4.8", delta: "stars", positive: null },
];

const recentOrders = [
  {
    id: "#1047",
    numericId: "1047",
    customer: "Sarah K.",
    avatar: customer1,
    items: "Mansaf, Knafeh x2",
    type: "Delivery",
    time: "12 min ago",
    price: "$64.50",
    status: "New",
    statusClass: "pill-orange",
    action: "Confirm",
    overdue: false,
  },
  {
    id: "#1046",
    numericId: "1046",
    customer: "Mike R.",
    avatar: chefAvatar,
    items: "Shawarma Plate",
    type: "Pickup",
    time: "28 min ago",
    price: "$18.00",
    status: "Preparing",
    statusClass: "pill-sage",
    action: "Ready",
    overdue: false,
  },
  {
    id: "#1044",
    numericId: "1044",
    customer: "Lisa M.",
    avatar: customer1,
    items: "Falafel Bowl, Hummus",
    type: "Delivery",
    time: "1h 45m ago",
    price: "$32.00",
    status: "OVERDUE",
    statusClass: "pill-red",
    action: "Resolve",
    overdue: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [mode, setMode] = useState<"A" | "B">("B");

  return (
    <div className="section-stack">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 rounded-full w-fit" style={{ background: "var(--color-cream-sunken)" }}>
        <button
          onClick={() => setMode("A")}
          className="rounded-full transition-colors"
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 44,
            background: mode === "A" ? "#fff" : "transparent",
            color: mode === "A" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            boxShadow: mode === "A" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
          }}
        >
          Mode A
        </button>
        <button
          onClick={() => setMode("B")}
          className="rounded-full transition-colors"
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 44,
            background: mode === "B" ? "#fff" : "transparent",
            color: mode === "B" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            boxShadow: mode === "B" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
          }}
        >
          Mode B
        </button>
      </div>

      {mode === "A" ? <ModeA /> : <ModeB />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode A — Unified onboarding (3 phases, 9 steps)                   */
/*  Disappears automatically when all steps are done → Mode B shows   */
/* ------------------------------------------------------------------ */
function ModeA() {
  const { toast } = useToast();
  const [step5Expanded, setStep5Expanded] = useState(false);
  const [step5Done, setStep5Done] = useState(false);
  const [quickDishName, setQuickDishName] = useState("");
  const [quickDishPrice, setQuickDishPrice] = useState("");

  const allSteps = onboardingPhases.flatMap((p) => p.steps);
  const doneCount = allSteps.filter((s) => s.done).length + (step5Done ? 1 : 0);
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
      <span className="pill pill-orange">
        <Clock size={12} /> Setup in progress
      </span>

      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          Hi Amira <span role="img" aria-label="wave">👋</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-brown-soft)", marginTop: 4 }}>
          {remaining} {remaining === 1 ? "step" : "steps"} away from your first order. Let&apos;s keep going.
        </p>
      </div>

      {/* Master progress */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span className="tnum" style={{ fontSize: 14, fontWeight: 600 }}>{doneCount} of {totalSteps} complete</span>
          <span className="tnum" style={{ fontSize: 13, color: "var(--color-brown-soft-2)" }}>{Math.round(pct)}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 8, background: "var(--color-cream-sunken)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--color-sage)" }} />
        </div>
      </div>

      {/* Phased checklist */}
      {onboardingPhases.map((phase) => {
        const phaseAllDone = phase.steps.every((s) => s.id === 5 ? step5Done || s.done : s.done);
        return (
          <div key={phase.label}>
            <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
              <span className="eyebrow">{phase.eyebrow}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-brown)" }}>{phase.label}</span>
              {phaseAllDone && (
                <span className="pill pill-sage" style={{ marginLeft: "auto" }}>
                  <Check size={12} strokeWidth={3} /> Complete
                </span>
              )}
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {phase.steps.map((step, si) => {
                const isStep5 = step.id === 5;
                const isDone = isStep5 ? step5Done : step.done;
                const isCurrent = isStep5 ? (!step5Done && step.current) : step.current;
                const isExpanded = isStep5 && step5Expanded && !step5Done;

                return (
                  <div
                    key={step.id}
                    style={{
                      borderBottom: si < phase.steps.length - 1 ? "1px solid var(--color-cream-sunken)" : undefined,
                    }}
                  >
                    {/* Step row */}
                    {isStep5 && !isDone ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!step5Done) setStep5Expanded(!step5Expanded);
                        }}
                        className="flex items-start gap-3 w-full text-left"
                        style={{
                          padding: "14px 16px",
                          minHeight: 44,
                          background: isCurrent ? "var(--color-cream)" : undefined,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          className={`flex items-center justify-center rounded-full shrink-0 ${isCurrent && !isExpanded ? "pulse-soft" : ""}`}
                          style={{
                            width: 30, height: 30, marginTop: 1,
                            background: isDone ? "var(--color-sage)" : isCurrent ? "var(--color-red)" : "var(--color-cream-sunken)",
                            color: isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                            fontSize: 13, fontWeight: 700,
                          }}
                        >
                          {isDone ? <Check size={14} strokeWidth={3} /> : step.id}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span style={{
                            fontSize: 14, fontWeight: isCurrent ? 600 : 500, display: "block",
                            color: isDone ? "var(--color-brown-soft-2)" : "var(--color-brown)",
                            textDecoration: isDone ? "line-through" : undefined,
                          }}>
                            {step.label}
                          </span>
                          {!isDone && !isExpanded && (
                            <span style={{ fontSize: 13, color: "var(--color-brown-soft-2)", marginTop: 2, display: "block" }}>
                              {step.detail}
                            </span>
                          )}
                        </div>

                        {isCurrent && !isExpanded && (
                          <span className="btn btn-red btn-sm shrink-0">
                            Continue <ChevronRight size={14} />
                          </span>
                        )}
                        {isDone && (
                          <Check size={18} style={{ color: "var(--color-sage)", flexShrink: 0, marginTop: 4 }} />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={step.href}
                        className="flex items-start gap-3"
                        style={{
                          padding: "14px 16px",
                          minHeight: 44,
                          background: isCurrent ? "var(--color-cream)" : undefined,
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                        }}
                      >
                        <span
                          className={`flex items-center justify-center rounded-full shrink-0 ${isCurrent ? "pulse-soft" : ""}`}
                          style={{
                            width: 30, height: 30, marginTop: 1,
                            background: isDone ? "var(--color-sage)" : isCurrent ? "var(--color-red)" : "var(--color-cream-sunken)",
                            color: isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                            fontSize: 13, fontWeight: 700,
                          }}
                        >
                          {isDone ? <Check size={14} strokeWidth={3} /> : step.id}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span style={{
                            fontSize: 14, fontWeight: isCurrent ? 600 : 500, display: "block",
                            color: isDone ? "var(--color-brown-soft-2)" : "var(--color-brown)",
                            textDecoration: isDone ? "line-through" : undefined,
                          }}>
                            {step.label}
                          </span>
                          {!isDone && (
                            <span style={{ fontSize: 13, color: "var(--color-brown-soft-2)", marginTop: 2, display: "block" }}>
                              {step.detail}
                            </span>
                          )}
                        </div>

                        {isCurrent && (
                          <span className="btn btn-red btn-sm shrink-0">
                            Continue <ChevronRight size={14} />
                          </span>
                        )}
                        {isDone && (
                          <Check size={18} style={{ color: "var(--color-sage)", flexShrink: 0, marginTop: 4 }} />
                        )}
                      </Link>
                    )}

                    {/* Inline quick-add form for step 5 */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "0 16px 16px",
                          background: "var(--color-cream)",
                        }}
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 16,
                            boxShadow: "0 2px 8px rgba(51,31,46,0.06)",
                          }}
                        >
                          {/* Dish name */}
                          <div style={{ marginBottom: 12 }}>
                            <label
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-brown)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              Dish name
                            </label>
                            <input
                              type="text"
                              className="input"
                              placeholder="e.g. Grandma's Kibbeh"
                              value={quickDishName}
                              onChange={(e) => setQuickDishName(e.target.value)}
                              autoFocus
                            />
                          </div>

                          {/* Photo upload placeholder */}
                          <div style={{ marginBottom: 12 }}>
                            <label
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-brown)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              Photo
                            </label>
                            <button
                              type="button"
                              className="flex flex-col items-center justify-center w-full rounded-xl"
                              style={{
                                height: 100,
                                border: "2px dashed rgba(51,31,46,0.15)",
                                background: "var(--color-cream-deep)",
                                cursor: "pointer",
                              }}
                            >
                              <Upload
                                size={20}
                                strokeWidth={1.8}
                                style={{ color: "var(--color-brown-soft-2)" }}
                              />
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "var(--color-brown-soft-2)",
                                  marginTop: 6,
                                }}
                              >
                                Tap to upload a photo
                              </span>
                            </button>
                          </div>

                          {/* Size + Price */}
                          <div style={{ marginBottom: 16 }}>
                            <label
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-brown)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              Size &amp; Price
                            </label>
                            <div className="flex items-center gap-3">
                              <span
                                className="pill pill-mute"
                                style={{
                                  minHeight: 44,
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                Individual
                              </span>
                              <div className="relative" style={{ flex: 1 }}>
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
                          </div>

                          {/* Publish button */}
                          <button
                            type="button"
                            className="btn btn-red btn-block"
                            onClick={handlePublishDish}
                            disabled={!quickDishName.trim()}
                            style={{
                              minHeight: 44,
                              opacity: quickDishName.trim() ? 1 : 0.5,
                              cursor: quickDishName.trim() ? "pointer" : "not-allowed",
                            }}
                          >
                            Publish Dish
                          </button>

                          {/* Full editor link */}
                          <div style={{ textAlign: "center", marginTop: 10 }}>
                            <Link
                              href="/menu/new"
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-red)",
                              }}
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
          </div>
        );
      })}

      {/* Motivational sticker */}
      <div className="card-sticker" style={{ transform: "rotate(1deg)", maxWidth: 340 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>A LITTLE WIND IN YOUR SAILS</div>
        <div className="fraunces" style={{ fontSize: 56, lineHeight: 1 }}>12</div>
        <p style={{ fontSize: 14, color: "var(--color-brown-soft)", marginTop: 4 }}>
          chefs went live this week in Dallas. Yours is next.
        </p>
      </div>

      <Link href="/help" className="btn btn-ghost btn-block" style={{ minHeight: 44 }}>Need help? Talk to a real human</Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode B — Fully set up                                             */
/* ------------------------------------------------------------------ */
function ModeB() {
  return (
    <div className="section-stack line-reveal">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        Hi Amira <span role="img" aria-label="wave">👋</span>
      </h1>

      {/* Urgent strip */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ margin: "0 -16px", padding: "0 16px" }}
      >
        {urgentCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="shrink-0 rounded-2xl"
            style={{
              background: "#fff",
              padding: 14,
              borderLeft: `4px solid ${card.border}`,
              minWidth: 220,
              minHeight: 44,
              boxShadow: "0 4px 12px rgba(51,31,46,0.05)",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <span className={`pill ${card.pillClass}`} style={{ marginBottom: 6, display: "inline-flex" }}>
              {card.pillText}
            </span>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", marginTop: 6 }}>
              {card.text}
            </p>
          </Link>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              {stat.label}
            </div>
            <div
              className="fraunces tnum"
              style={{ fontSize: 32, lineHeight: 1.1 }}
            >
              {stat.value}
            </div>
            {stat.delta === "stars" ? (
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill="var(--color-sage)"
                    color="var(--color-sage)"
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex items-center gap-1 mt-1"
                style={{ fontSize: 13, color: "var(--color-brown-soft)" }}
              >
                {stat.positive !== null && (
                  <span
                    className={`dot ${stat.positive ? "dot-sage" : "dot-red"}`}
                  />
                )}
                {stat.delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/menu/new" className="btn btn-red" style={{ minHeight: 44 }}>Create Dish</Link>
        <Link href="/store-preview" className="btn btn-ghost" style={{ minHeight: 44 }}>View My Store</Link>
        <Link href="/operations" className="btn btn-ghost" style={{ minHeight: 44 }}>Manage Hours</Link>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow">RECENT ORDERS</span>
          <Link
            href="/orders"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-red)",
              display: "flex",
              alignItems: "center",
              gap: 2,
              minHeight: 44,
            }}
          >
            View All <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.numericId}`}
              className="card flex items-center gap-3"
              style={{
                borderLeft: order.overdue
                  ? "4px solid var(--color-red)"
                  : undefined,
                textDecoration: "none",
                color: "inherit",
                minHeight: 44,
              }}
            >
              {/* Left info */}
              <img
                src={order.avatar}
                alt={order.customer}
                className="rounded-full object-cover shrink-0 hidden sm:block"
                style={{ width: 40, height: 40 }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="mono"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--color-brown-soft-2)",
                    }}
                  >
                    {order.id}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    {order.customer}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-brown-soft)",
                    marginTop: 2,
                  }}
                >
                  {order.items}
                </p>
                <div
                  className="flex items-center gap-2 mt-1"
                  style={{ fontSize: 12 }}
                >
                  <span className="pill pill-mute">{order.type}</span>
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "var(--color-brown-soft-2)" }}
                  >
                    <Clock size={12} /> {order.time}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className="fraunces tnum"
                  style={{ fontSize: 18, fontWeight: 600 }}
                >
                  {order.price}
                </span>
                <span className={`pill ${order.statusClass}`}>
                  {order.status}
                </span>
                <span className="btn btn-sm btn-ghost" style={{ fontSize: 12, minHeight: 44 }}>
                  {order.action} <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
