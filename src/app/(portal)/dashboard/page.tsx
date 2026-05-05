/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
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
  AlertCircle,
  MessageSquare,
  Radio,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */
const CHEF_AVATAR =
  "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop";

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
    urgencyClass: "urgency-red",
    icon: AlertCircle,
    text: "2 orders need confirmation",
    pillClass: "pill-red",
    pillText: "Urgent",
    href: "/orders",
  },
  {
    urgencyClass: "urgency-amber",
    icon: MessageSquare,
    text: "New review from Sarah K.",
    pillClass: "pill-orange",
    pillText: "New",
    href: "/reviews",
  },
  {
    urgencyClass: "urgency-sage",
    icon: Radio,
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
    delta: "\u219112% vs last month",
    positive: true,
    sparkline: "0,28 15,24 30,26 45,18 60,20 75,10 90,6 120,4",
  },
  {
    label: "Revenue This Month",
    value: "$2,184",
    delta: "\u21918% vs last month",
    positive: true,
    sparkline: "0,26 15,22 30,24 45,16 60,14 75,8 90,6 120,5",
  },
  {
    label: "Active Dishes",
    value: "12",
    delta: "3 drafts",
    positive: null,
    sparkline: "0,20 15,20 30,18 45,16 60,16 75,14 90,13 120,12",
  },
  {
    label: "Avg Rating",
    value: "4.8",
    delta: "stars",
    positive: null,
    sparkline: "0,12 15,10 30,10 45,8 60,6 75,6 90,5 120,4",
  },
];

const recentOrders = [
  {
    hashId: "#1042",
    customer: "Sarah K.",
    items: "Kibbeh x2, Fattoush",
    status: "Paid",
    statusColor: "var(--color-sage)",
    price: "$49.00",
  },
  {
    hashId: "#1041",
    customer: "Marcus T.",
    items: "Shawarma Plate",
    status: "Preparing",
    statusColor: "var(--color-orange)",
    price: "$26.50",
  },
  {
    hashId: "#1040",
    customer: "Priya R.",
    items: "Hummus Bowl",
    status: "Ready",
    statusColor: "var(--color-sage)",
    price: "$18.00",
  },
];

/* ------------------------------------------------------------------ */
/*  SVG Progress Ring — 96px, stroke 6, sage, fraunces pct             */
/* ------------------------------------------------------------------ */
function ProgressRing({ pct }: { pct: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={96} height={96} viewBox="0 0 96 96" style={{ flexShrink: 0 }}>
      <circle
        cx={48}
        cy={48}
        r={r}
        fill="none"
        stroke="var(--color-cream-sunken)"
        strokeWidth={6}
      />
      <circle
        cx={48}
        cy={48}
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
        x={48}
        y={48}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 22,
          fontWeight: 800,
          fill: "var(--color-brown)",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.03em",
        }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Sparkline — 120x32, sage, 1.5px stroke                       */
/* ------------------------------------------------------------------ */
function Sparkline({ points }: { points: string }) {
  return (
    <svg
      width={120}
      height={32}
      viewBox="0 0 120 32"
      style={{ display: "block", marginTop: 8 }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

  return (
    <div className="section-stack">
      {/* Mode toggle — Linear-style tab buttons with active underline */}
      <div
        className="flex items-center gap-0"
        style={{
          borderBottom: "1px solid rgba(51,31,46,0.08)",
          marginBottom: 4,
        }}
      >
        <button
          onClick={() => setMode("A")}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: mode === "A" ? "2px solid var(--color-red)" : "2px solid transparent",
            color: mode === "A" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            transition: "color var(--t-fast), border-color var(--t-fast)",
            cursor: "pointer",
            marginBottom: -1,
          }}
        >
          Onboarding
        </button>
        <button
          onClick={() => setMode("B")}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: mode === "B" ? "2px solid var(--color-red)" : "2px solid transparent",
            color: mode === "B" ? "var(--color-brown)" : "var(--color-brown-soft-2)",
            transition: "color var(--t-fast), border-color var(--t-fast)",
            cursor: "pointer",
            marginBottom: -1,
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
      {/* Header */}
      <div className="flex items-center gap-5">
        <ProgressRing pct={pct} />
        <div>
          <h1 className="heading-lg" style={{ marginBottom: 4 }}>
            Welcome back, Amira
          </h1>
          <p className="body-sm">
            {remaining} {remaining === 1 ? "step" : "steps"} remaining to go
            live &mdash; you&apos;re almost there.
          </p>
        </div>
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
              borderLeft: `4px solid ${borderColor}`,
            }}
          >
            {/* Phase header inside card */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(51,31,46,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="eyebrow">{phase.eyebrow}</span>
                <span className="heading-sm">{phase.label}</span>
                {phaseAllDone && (
                  <span
                    className="pill pill-sage"
                    style={{ marginLeft: "auto" }}
                  >
                    <Check size={12} strokeWidth={3} /> Complete
                  </span>
                )}
              </div>
              <span className="accent-line-sm" />
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
                  {/* Divider between steps */}
                  {si > 0 && <div className="divider" style={{ marginLeft: 20, marginRight: 20 }} />}

                  {/* Step row — 48px height */}
                  {isStep5 && !isDone ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!step5Done) setStep5Expanded(!step5Expanded);
                      }}
                      className="flex items-center gap-3 w-full text-left"
                      style={{
                        padding: "0 20px",
                        height: 48,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {/* Indicator */}
                      {isCurrent && !isExpanded ? (
                        <span
                          className="pulse-soft"
                          style={{
                            width: 8,
                            height: 8,
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
                            <Check size={16} strokeWidth={2.5} style={{ color: "var(--color-sage)" }} />
                          ) : (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-brown-soft-2)",
                              }}
                            >
                              {step.id}
                            </span>
                          )}
                        </span>
                      )}

                      <span
                        className="flex-1 min-w-0"
                        style={{
                          fontSize: 14,
                          fontWeight: isCurrent ? 700 : 500,
                          color: isDone
                            ? "var(--color-brown-soft-2)"
                            : "var(--color-brown)",
                          textDecoration: isDone ? "line-through" : undefined,
                        }}
                      >
                        {step.label}
                      </span>

                      {isCurrent && !isExpanded && (
                        <span className="btn btn-gradient btn-sm shrink-0">
                          Continue <ChevronRight size={14} />
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={step.href}
                      className="flex items-center gap-3"
                      style={{
                        padding: "0 20px",
                        height: 48,
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                      }}
                    >
                      {/* Indicator */}
                      {isCurrent ? (
                        <span
                          className="pulse-soft"
                          style={{
                            width: 8,
                            height: 8,
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
                            <Check size={16} strokeWidth={2.5} style={{ color: "var(--color-sage)" }} />
                          ) : (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-brown-soft-2)",
                              }}
                            >
                              {step.id}
                            </span>
                          )}
                        </span>
                      )}

                      <span
                        className="flex-1 min-w-0"
                        style={{
                          fontSize: 14,
                          fontWeight: isCurrent ? 700 : 500,
                          color: isDone
                            ? "var(--color-brown-soft-2)"
                            : "var(--color-brown)",
                          textDecoration: isDone ? "line-through" : undefined,
                        }}
                      >
                        {step.label}
                      </span>

                      {isCurrent && (
                        <span className="btn btn-gradient btn-sm shrink-0">
                          Continue <ChevronRight size={14} />
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Inline quick-add form for step 5 */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 20px 20px",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--color-cream)",
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <div style={{ marginBottom: 12 }}>
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

                        <div style={{ marginBottom: 12 }}>
                          <label className="field-label">Photo</label>
                          <button
                            type="button"
                            className="flex flex-col items-center justify-center w-full rounded-xl"
                            style={{
                              height: 88,
                              border: "2px dashed rgba(51,31,46,0.12)",
                              background: "var(--color-cream-deep)",
                              cursor: "pointer",
                            }}
                          >
                            <Upload
                              size={18}
                              strokeWidth={1.8}
                              style={{ color: "var(--color-brown-soft-2)" }}
                            />
                            <span className="caption" style={{ marginTop: 4 }}>
                              Tap to upload
                            </span>
                          </button>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <label className="field-label">
                            Size &amp; Price
                          </label>
                          <div className="flex items-center gap-3">
                            <span
                              className="pill pill-mute"
                              style={{ minHeight: 40, fontSize: 13, fontWeight: 600 }}
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

                        <div style={{ textAlign: "center", marginTop: 10 }}>
                          <Link
                            href="/menu/new"
                            className="caption"
                            style={{ fontWeight: 600, color: "var(--color-red)" }}
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

      {/* Motivational sticker */}
      <div
        className="card-sticker"
        style={{ transform: "rotate(-1deg)", maxWidth: 340 }}
      >
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          A LITTLE WIND IN YOUR SAILS
        </div>
        <div
          className="fraunces"
          style={{ fontSize: 64, lineHeight: 1 }}
        >
          12
        </div>
        <p className="body-sm" style={{ marginTop: 6, lineHeight: 1.4 }}>
          chefs went live this week in Dallas.{" "}
          <strong style={{ color: "var(--color-brown)" }}>
            Yours is next.
          </strong>
        </p>
      </div>

      {/* Need help? — simple text link */}
      <Link
        href="/tutorials"
        className="body-sm"
        style={{
          color: "var(--color-red)",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
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

  return (
    <div className="content-wide section-stack line-reveal">
      {/* Greeting */}
      <h1 className="heading-lg">
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

      {/* Stat cards — 4 across, Stripe-dense */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium">
            <div className="stat-accent" />
            <div className="stat-body">
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {stat.label}
              </div>
              <div
                className="fraunces tnum"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <Sparkline points={stat.sparkline} />
              {stat.delta === "stars" ? (
                <div className="flex items-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= Math.round(parseFloat(stat.value)) ? "var(--color-sage)" : "none"}
                      color="var(--color-sage)"
                      strokeWidth={s <= Math.round(parseFloat(stat.value)) ? 0 : 1.5}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-2">
                  {stat.positive !== null && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: stat.positive
                          ? "var(--color-sage)"
                          : "var(--color-red)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span className="caption">{stat.delta}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Urgent strip — horizontal scroll */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ margin: "0 -16px", padding: "0 16px" }}
      >
        {urgentCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              href={card.href}
              className={`shrink-0 card card-hover ${card.urgencyClass}`}
              style={{
                padding: "12px 16px",
                minWidth: 220,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--color-cream-sunken)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2} style={{ color: "var(--color-brown-soft)" }} />
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={`pill ${card.pillClass}`}
                  style={{ marginBottom: 4, display: "inline-flex" }}
                >
                  {card.pillText}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)" }}>
                  {card.text}
                </p>
              </div>
              <ArrowUpRight
                size={14}
                style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }}
              />
            </Link>
          );
        })}
      </div>

      {/* Quick actions — 3 cards in a row, 72px height */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/menu/new"
          className="btn btn-gradient card-hover flex items-center gap-3"
          style={{
            height: 72,
            textDecoration: "none",
            padding: "0 20px",
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Create Dish</span>
        </Link>
        <Link
          href="/store-preview"
          className="card card-hover flex items-center gap-3"
          style={{
            height: 72,
            textDecoration: "none",
            color: "var(--color-brown)",
            padding: "0 20px",
          }}
        >
          <Eye size={20} strokeWidth={1.8} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>View My Store</span>
        </Link>
        <Link
          href="/operations"
          className="card card-hover flex items-center gap-3"
          style={{
            height: 72,
            textDecoration: "none",
            color: "var(--color-brown)",
            padding: "0 20px",
          }}
        >
          <Clock size={20} strokeWidth={1.8} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manage Hours</span>
        </Link>
      </div>

      {/* Recent orders — Stripe transactions style */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div>
            <span className="eyebrow">RECENT ORDERS</span>
          </div>
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

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {recentOrders.map((order, i) => (
            <Link
              key={order.hashId}
              href={`/orders/${order.hashId.replace("#", "")}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 20px",
                textDecoration: "none",
                color: "inherit",
                borderBottom:
                  i < recentOrders.length - 1
                    ? "1px solid rgba(51,31,46,0.06)"
                    : undefined,
                transition: "background var(--t-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-cream)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Hash */}
              <span
                className="mono hidden sm:inline"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-brown-soft-2)",
                  width: 52,
                  flexShrink: 0,
                }}
              >
                {order.hashId}
              </span>

              {/* Customer */}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-brown)",
                  width: 90,
                  flexShrink: 0,
                }}
              >
                {order.customer}
              </span>

              {/* Items */}
              <span
                className="flex-1 min-w-0"
                style={{
                  fontSize: 13,
                  color: "var(--color-brown-soft-2)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {order.items}
              </span>

              {/* Status pill */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: order.statusColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: order.statusColor,
                  }}
                />
                {order.status}
              </span>

              {/* Price */}
              <span
                className="tnum"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-brown)",
                  width: 64,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {order.price}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Today summary — subtle cream banner */}
      <div
        style={{
          background: "var(--color-cream-deep)",
          borderRadius: 12,
          padding: "14px 20px",
          textAlign: "center",
        }}
      >
        <span className="body-sm" style={{ fontWeight: 600, color: "var(--color-brown)" }}>
          Today: 4 orders &middot; $186 revenue &middot; 2 pending
        </span>
      </div>
    </div>
  );
}
