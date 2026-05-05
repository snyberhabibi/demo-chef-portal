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
  Plus,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */
const customer1 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop";
const customer2 =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop";

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
    label: "Set Up Your Kitchen",
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
        label: "Set your hours",
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
    label: "Go Live",
    eyebrow: "PHASE 3",
    color: "var(--color-red)",
    steps: [
      {
        id: 8,
        label: "Quick intro call",
        detail:
          "15 min — we review your store together and answer questions",
        done: false,
        href: "/help",
      },
      {
        id: 9,
        label: "Go live!",
        detail: "Flip the switch and start receiving orders",
        done: false,
        href: "/operations",
      },
    ],
  },
];

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
    text: "Store is live \u2014 47 views today",
    pillClass: "pill-sage",
    pillText: "Live",
    href: "/store-preview",
  },
];

const stats = [
  {
    label: "Orders This Month",
    value: "47",
    delta: "+12% vs last month",
    positive: true,
    sparkline: "0,28 15,24 30,26 45,18 60,20 75,10 100,4",
  },
  {
    label: "Revenue This Month",
    value: "$2,184",
    delta: "+8% vs last month",
    positive: true,
    sparkline: "0,26 15,22 30,24 45,16 60,14 75,8 100,5",
  },
  {
    label: "Active Dishes",
    value: "12",
    delta: "3 drafts",
    positive: null,
    sparkline: "0,20 15,20 30,18 45,16 60,16 75,14 100,12",
  },
  {
    label: "Avg Rating",
    value: "4.8",
    delta: "stars",
    positive: null,
    sparkline: "0,12 15,10 30,10 45,8 60,6 75,6 100,4",
  },
];

const recentOrders = [
  {
    hashId: "#a8f2c1",
    numericId: "1042",
    customer: "Sarah K.",
    avatar: customer1,
    type: "Delivery",
    time: "Today 2:30 PM",
    status: "Paid",
    statusDot: "dot-sage",
    price: "$49.00",
    payout: "$45.20 payout",
    action: "Confirm",
    actionClass: "btn-red",
  },
  {
    hashId: "#b3d4e7",
    numericId: "1042",
    customer: "Marcus T.",
    avatar: customer2,
    type: "Pickup",
    time: "Today 3:15 PM",
    status: "Preparing",
    statusDot: "dot-sage",
    price: "$26.50",
    payout: "$22.10 payout",
    action: "Mark Ready",
    actionClass: "btn-sage",
  },
  {
    hashId: "#c9e1f3",
    numericId: "1042",
    customer: "Priya R.",
    avatar: customer1,
    type: "Delivery",
    time: "Today 1:55 PM",
    status: "Ready",
    statusDot: "dot-sage",
    price: "$18.00",
    payout: "$16.50 payout",
    action: "Hand Off",
    actionClass: "btn-terracotta-fill",
  },
];

/* ------------------------------------------------------------------ */
/*  SVG Progress Ring                                                  */
/* ------------------------------------------------------------------ */
function ProgressRing({ pct }: { pct: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <circle
        cx={40}
        cy={40}
        r={r}
        fill="none"
        stroke="var(--color-cream-sunken)"
        strokeWidth={6}
      />
      <circle
        cx={40}
        cy={40}
        r={r}
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
          transition: "stroke-dashoffset 0.6s ease",
        }}
      />
      <text
        x={40}
        y={40}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 16,
          fontWeight: 700,
          fill: "var(--color-brown)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Sparkline                                                     */
/* ------------------------------------------------------------------ */
function Sparkline({ points }: { points: string }) {
  return (
    <svg
      width={100}
      height={30}
      viewBox="0 0 100 30"
      style={{ display: "block", marginTop: 8 }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [mode, setMode] = useState<"A" | "B">("B");

  return (
    <div className="section-stack">
      {/* Mode toggle */}
      <div
        className="flex items-center gap-1 p-1 rounded-full w-fit"
        style={{ background: "var(--color-cream-sunken)" }}
      >
        <button
          onClick={() => setMode("A")}
          className="rounded-full transition-colors"
          style={{
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 44,
            background: mode === "A" ? "#fff" : "transparent",
            color:
              mode === "A"
                ? "var(--color-brown)"
                : "var(--color-brown-soft-2)",
            boxShadow:
              mode === "A" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
          }}
        >
          Onboarding
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
            color:
              mode === "B"
                ? "var(--color-brown)"
                : "var(--color-brown-soft-2)",
            boxShadow:
              mode === "B" ? "0 1px 3px rgba(51,31,46,0.08)" : "none",
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
      <span className="pill pill-orange">
        <Clock size={12} /> Setup in progress
      </span>

      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          Hi Amira{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          {remaining} {remaining === 1 ? "step" : "steps"} away from your first
          order. Let&apos;s keep going.
        </p>
      </div>

      {/* Master progress with animated SVG ring */}
      <div className="card flex items-center gap-5">
        <ProgressRing pct={pct} />
        <div>
          <span
            className="tnum"
            style={{ fontSize: 14, fontWeight: 600, display: "block" }}
          >
            {doneCount} of {totalSteps} complete
          </span>
          <span
            style={{
              fontSize: 13,
              color: "var(--color-brown-soft-2)",
              marginTop: 2,
              display: "block",
            }}
          >
            Almost there — keep it up!
          </span>
        </div>
      </div>

      {/* Phased checklist */}
      {onboardingPhases.map((phase) => {
        const phaseAllDone = phase.steps.every((s) =>
          s.id === 5 ? step5Done || s.done : s.done
        );
        return (
          <div key={phase.label}>
            <div
              className="flex items-center gap-3"
              style={{
                marginBottom: 10,
                paddingLeft: 12,
                borderLeft: `3px solid ${phase.color}`,
              }}
            >
              <span className="eyebrow">{phase.eyebrow}</span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-brown)",
                }}
              >
                {phase.label}
              </span>
              {phaseAllDone && (
                <span
                  className="pill pill-sage"
                  style={{ marginLeft: "auto" }}
                >
                  <Check size={12} strokeWidth={3} /> Complete
                </span>
              )}
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {phase.steps.map((step, si) => {
                const isStep5 = step.id === 5;
                const isDone = isStep5 ? step5Done : step.done;
                const isCurrent = isStep5
                  ? !step5Done && step.current
                  : step.current;
                const isExpanded = isStep5 && step5Expanded && !step5Done;

                return (
                  <div
                    key={step.id}
                    style={{
                      borderBottom:
                        si < phase.steps.length - 1
                          ? "1px solid var(--color-cream-sunken)"
                          : undefined,
                    }}
                  >
                    {/* Step row */}
                    {isStep5 && !isDone ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!step5Done)
                            setStep5Expanded(!step5Expanded);
                        }}
                        className="flex items-center gap-3 w-full text-left"
                        style={{
                          padding: "0 16px",
                          height: 56,
                          background: isCurrent
                            ? "var(--color-cream)"
                            : undefined,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          className={`flex items-center justify-center rounded-full shrink-0 ${
                            isCurrent && !isExpanded ? "pulse-soft" : ""
                          }`}
                          style={{
                            width: 30,
                            height: 30,
                            background: isDone
                              ? "var(--color-sage)"
                              : isCurrent
                              ? "var(--color-red)"
                              : "var(--color-cream-sunken)",
                            color:
                              isDone || isCurrent
                                ? "#fff"
                                : "var(--color-brown-soft-2)",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {isDone ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            step.id
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: isCurrent ? 600 : 500,
                              display: "block",
                              color: isDone
                                ? "var(--color-brown-soft-2)"
                                : "var(--color-brown)",
                              textDecoration: isDone
                                ? "line-through"
                                : undefined,
                            }}
                          >
                            {step.label}
                          </span>
                          {!isDone && !isExpanded && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-brown-soft-2)",
                                marginTop: 1,
                                display: "block",
                              }}
                            >
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
                          <Check
                            size={18}
                            style={{
                              color: "var(--color-sage)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={step.href}
                        className="flex items-center gap-3"
                        style={{
                          padding: "0 16px",
                          height: 56,
                          background: isCurrent
                            ? "var(--color-cream)"
                            : undefined,
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                        }}
                      >
                        <span
                          className={`flex items-center justify-center rounded-full shrink-0 ${
                            isCurrent ? "pulse-soft" : ""
                          }`}
                          style={{
                            width: 30,
                            height: 30,
                            background: isDone
                              ? "var(--color-sage)"
                              : isCurrent
                              ? "var(--color-red)"
                              : "var(--color-cream-sunken)",
                            color:
                              isDone || isCurrent
                                ? "#fff"
                                : "var(--color-brown-soft-2)",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {isDone ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            step.id
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: isCurrent ? 600 : 500,
                              display: "block",
                              color: isDone
                                ? "var(--color-brown-soft-2)"
                                : "var(--color-brown)",
                              textDecoration: isDone
                                ? "line-through"
                                : undefined,
                            }}
                          >
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-brown-soft-2)",
                                marginTop: 1,
                                display: "block",
                              }}
                            >
                              {step.detail}
                            </span>
                          )}
                          {!isDone && !isCurrent && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-brown-soft-2)",
                                marginTop: 1,
                                display: "block",
                              }}
                            >
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
                          <Check
                            size={18}
                            style={{
                              color: "var(--color-sage)",
                              flexShrink: 0,
                            }}
                          />
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
                              onChange={(e) =>
                                setQuickDishName(e.target.value)
                              }
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
                                border:
                                  "2px dashed rgba(51,31,46,0.15)",
                                background: "var(--color-cream-deep)",
                                cursor: "pointer",
                              }}
                            >
                              <Upload
                                size={20}
                                strokeWidth={1.8}
                                style={{
                                  color: "var(--color-brown-soft-2)",
                                }}
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
                              <div
                                className="relative"
                                style={{ flex: 1 }}
                              >
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
                                  onChange={(e) =>
                                    setQuickDishPrice(e.target.value)
                                  }
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
                              cursor: quickDishName.trim()
                                ? "pointer"
                                : "not-allowed",
                            }}
                          >
                            Publish Dish
                          </button>

                          {/* Full editor link */}
                          <div
                            style={{
                              textAlign: "center",
                              marginTop: 10,
                            }}
                          >
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
      <div
        className="card-sticker"
        style={{ transform: "rotate(-1.5deg)", maxWidth: 340 }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          A LITTLE WIND IN YOUR SAILS
        </div>
        <div
          className="fraunces"
          style={{ fontSize: 56, lineHeight: 1 }}
        >
          12
        </div>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-brown-soft)",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          chefs went live this week in Dallas.
          <br />
          <strong style={{ color: "var(--color-brown)" }}>
            Yours is next.
          </strong>
        </p>
      </div>

      <Link
        href="/help"
        className="btn btn-ghost btn-block"
        style={{ minHeight: 44 }}
      >
        Need help? Talk to a real human
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode B — Fully set up (Active Dashboard)                          */
/* ------------------------------------------------------------------ */
function ModeB() {
  return (
    <div className="section-stack line-reveal">
      {/* Greeting with wave animation */}
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        Hi Amira{" "}
        <span
          role="img"
          aria-label="wave"
          style={{
            display: "inline-block",
            animation: "wave 2.5s ease-in-out infinite",
            transformOrigin: "70% 70%",
          }}
        >
          👋
        </span>
        <style>{`
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      </h1>

      {/* Stat cards with sparklines — 2x2 mobile, 4 across desktop */}
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
                style={{
                  fontSize: 13,
                  color: "var(--color-brown-soft)",
                }}
              >
                {stat.positive !== null && (
                  <span
                    className={`dot ${
                      stat.positive ? "dot-sage" : "dot-red"
                    }`}
                  />
                )}
                {stat.delta}
              </div>
            )}
            <Sparkline points={stat.sparkline} />
          </div>
        ))}
      </div>

      {/* Urgent strip — horizontal scroll */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ margin: "0 -16px", padding: "0 16px" }}
      >
        {urgentCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="shrink-0 rounded-2xl card-hover"
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
            <span
              className={`pill ${card.pillClass}`}
              style={{ marginBottom: 6, display: "inline-flex" }}
            >
              {card.pillText}
            </span>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-brown)",
                marginTop: 6,
              }}
            >
              {card.text}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions — 3 cards in a row */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/menu/new"
          className="card card-hover flex flex-col items-center justify-center gap-2 text-center"
          style={{
            height: 80,
            background: "var(--color-red)",
            color: "#fff8f3",
            textDecoration: "none",
            padding: 12,
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Create Dish
          </span>
        </Link>
        <Link
          href="/store-preview"
          className="card card-hover flex flex-col items-center justify-center gap-2 text-center"
          style={{
            height: 80,
            textDecoration: "none",
            color: "var(--color-brown)",
            padding: 12,
          }}
        >
          <Eye size={20} strokeWidth={1.8} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            View My Store
          </span>
        </Link>
        <Link
          href="/operations"
          className="card card-hover flex flex-col items-center justify-center gap-2 text-center"
          style={{
            height: 80,
            textDecoration: "none",
            color: "var(--color-brown)",
            padding: 12,
          }}
        >
          <Clock size={20} strokeWidth={1.8} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Manage Hours
          </span>
        </Link>
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
              key={order.hashId}
              href={`/orders/${order.numericId}`}
              className="card card-hover"
              style={{
                textDecoration: "none",
                color: "inherit",
                padding: 16,
              }}
            >
              {/* Top row: hash + delivery type pill */}
              <div
                className="flex items-center gap-2 flex-wrap"
                style={{ marginBottom: 8 }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-brown-soft-2)",
                  }}
                >
                  {order.hashId}
                </span>
                <span className="pill pill-mute">{order.type}</span>
              </div>

              {/* Middle row: customer, time, status */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 8 }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    {order.customer}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown-soft-2)",
                      marginLeft: 8,
                    }}
                  >
                    {order.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`dot ${order.statusDot}`} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-brown-soft)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Bottom row: price + payout + action */}
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className="fraunces tnum"
                    style={{ fontSize: 18 }}
                  >
                    {order.price}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--color-brown-soft-2)",
                      marginLeft: 8,
                    }}
                  >
                    {order.payout}
                  </span>
                </div>
                <span
                  className={`btn btn-sm ${
                    order.actionClass === "btn-terracotta-fill"
                      ? ""
                      : order.actionClass
                  }`}
                  style={
                    order.actionClass === "btn-terracotta-fill"
                      ? {
                          background: "var(--color-terracotta)",
                          color: "#fff",
                          borderColor: "var(--color-terracotta)",
                        }
                      : undefined
                  }
                >
                  {order.action} <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today summary card */}
      <div
        className="card"
        style={{
          background: "var(--color-cream-deep)",
          textAlign: "center",
          padding: "16px 20px",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--color-brown)",
          }}
        >
          Today: 4 orders &middot; $186 revenue &middot; 2 pending
        </span>
      </div>
    </div>
  );
}
