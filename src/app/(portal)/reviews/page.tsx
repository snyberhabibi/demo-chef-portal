/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { Star, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TABS = ["Chef Profile", "Dishes", "Bundles"] as const;
type Tab = (typeof TABS)[number];

const SORT_OPTIONS = ["Newest", "Oldest", "Highest", "Lowest"];

const breakdownData = [
  { stars: 5, count: 3, pct: 75 },
  { stars: 4, count: 0, pct: 0 },
  { stars: 3, count: 0, pct: 0 },
  { stars: 2, count: 0, pct: 0 },
  { stars: 1, count: 1, pct: 25 },
];

const PROFILE_REVIEWS = [
  {
    id: 1,
    initials: "SK",
    name: "Sarah K.",
    rating: 5,
    date: "3 days ago",
    text: "Amira's mansaf is the best I've had outside of Jordan. The jameed sauce is perfectly tangy and the lamb falls right off the bone. Already planning my next order!",
    reply: null,
    composerOpen: false,
    composerText: "",
  },
  {
    id: 2,
    initials: "MT",
    name: "Marcus T.",
    rating: 5,
    date: "1 week ago",
    text: "First time trying knafeh and now I'm hooked. The cheese pull was incredible, and that syrup was just the right amount of sweet. Outstanding.",
    reply: null,
    composerOpen: false,
    composerText: "",
  },
  {
    id: 3,
    initials: "PR",
    name: "Priya R.",
    rating: 5,
    date: "2 weeks ago",
    text: "Loved everything but baklava was a bit dry compared to last time. Still delicious overall. Will keep ordering!",
    reply: null,
    composerOpen: true,
    composerText: "",
  },
  {
    id: 4,
    initials: "JL",
    name: "Jordan L.",
    rating: 1,
    date: "3 weeks ago",
    text: "Picked up for family dinner, everyone went back for seconds. The hummus and shawarma were a huge hit. Thank you Amira!",
    reply: {
      name: "Yalla Kitchen by Amira",
      text: "So glad your family enjoyed it!",
      time: "2 weeks ago",
    },
    composerOpen: false,
    composerText: "",
  },
];

interface DishReviewItem {
  name: string;
  rating: number;
  count: number;
  reviews: { initials: string; name: string; rating: number; text: string; date: string }[];
}

const DISH_REVIEWS: DishReviewItem[] = [
  {
    name: "Grandma's Mansaf",
    rating: 5.0,
    count: 8,
    reviews: [
      { initials: "SK", name: "Sarah K.", rating: 5, text: "Best mansaf I've had outside of Jordan.", date: "3 days ago" },
      { initials: "AW", name: "Alex W.", rating: 5, text: "Incredible lamb and the rice was perfectly spiced.", date: "1 week ago" },
    ],
  },
  {
    name: "Knafeh",
    rating: 4.8,
    count: 5,
    reviews: [
      { initials: "MT", name: "Marcus T.", rating: 5, text: "The cheese pull was incredible.", date: "1 week ago" },
    ],
  },
  {
    name: "Baklava Box",
    rating: 4.2,
    count: 4,
    reviews: [
      { initials: "PR", name: "Priya R.", rating: 4, text: "Loved everything but a bit dry this time.", date: "2 weeks ago" },
    ],
  },
];

interface BundleReviewItem {
  name: string;
  rating: number;
  count: number;
  reviews: { initials: string; name: string; rating: number; text: string; date: string }[];
}

const BUNDLE_REVIEWS: BundleReviewItem[] = [
  {
    name: "Family Feast Bundle",
    rating: 4.9,
    count: 6,
    reviews: [
      { initials: "JL", name: "Jordan L.", rating: 5, text: "Everyone went back for seconds.", date: "3 weeks ago" },
    ],
  },
  {
    name: "Date Night Bundle",
    rating: 4.7,
    count: 3,
    reviews: [
      { initials: "LM", name: "Lisa M.", rating: 5, text: "Perfect portion for two. Romantic dinner sorted!", date: "1 week ago" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Star row                                                           */
/* ------------------------------------------------------------------ */
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "var(--color-sage)" : "none"}
          stroke={s <= rating ? "var(--color-sage)" : "var(--color-brown-soft-2)"}
          strokeWidth={1.8}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Chef Profile");
  const [sortBy, setSortBy] = useState("Newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [reviews, setReviews] = useState(PROFILE_REVIEWS);
  const [expandedDish, setExpandedDish] = useState<number | null>(null);
  const [expandedBundle, setExpandedBundle] = useState<number | null>(null);
  const maxChars = 500;

  const toggleComposer = useCallback((id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, composerOpen: !r.composerOpen } : r
      )
    );
  }, []);

  const updateComposerText = useCallback((id: number, text: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, composerText: text.slice(0, maxChars) } : r
      )
    );
  }, []);

  const postReply = useCallback((id: number) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          reply: {
            name: "Yalla Kitchen by Amira",
            text: r.composerText,
            time: "Just now",
          },
          composerOpen: false,
          composerText: "",
        };
      })
    );
  }, []);

  const cancelReply = useCallback((id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, composerOpen: false, composerText: "" } : r
      )
    );
  }, []);

  return (
    <div className="section-stack" style={{ maxWidth: 680 }}>
      {/* Tabs + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            className={`pill ${activeTab === t ? "pill-brown" : ""}`}
            style={{
              cursor: "pointer",
              border: "none",
              minHeight: 44,
              padding: "8px 16px",
              fontSize: 13,
              transition: "all 0.15s ease",
            }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ minHeight: 44, gap: 4, transition: "all 0.15s ease" }}
            onClick={() => setSortOpen(!sortOpen)}
          >
            {sortBy}
            <ChevronDown
              size={14}
              style={{
                transform: sortOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
          {sortOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 8px 32px rgba(51,31,46,0.12)",
                border: "1px solid var(--color-cream-sunken)",
                overflow: "hidden",
                zIndex: 20,
                minWidth: 160,
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    background: opt === sortBy ? "var(--color-cream-sunken)" : "none",
                    border: "none",
                    fontSize: 14,
                    fontWeight: opt === sortBy ? 600 : 400,
                    color: "var(--color-brown)",
                    cursor: "pointer",
                    minHeight: 44,
                    transition: "background 0.1s ease",
                  }}
                  onClick={() => {
                    setSortBy(opt);
                    setSortOpen(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chef Profile tab */}
      {activeTab === "Chef Profile" && (
        <>
          {/* Rating summary */}
          <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center" style={{ minWidth: 100 }}>
              <div className="fraunces" style={{ fontSize: 48, lineHeight: 1, color: "var(--color-brown)" }}>
                4.0
              </div>
              <div style={{ marginTop: 6 }}>
                <StarRow rating={4} size={16} />
              </div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 4 }}>
                4 ratings
              </div>
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              {breakdownData.map((row) => (
                <div key={row.stars} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                  <span className="tnum" style={{ fontSize: 13, width: 24, textAlign: "right", color: "var(--color-brown-soft)" }}>
                    {row.stars}.0
                  </span>
                  <Star size={12} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      background: "var(--color-cream-sunken)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${row.pct}%`,
                        height: "100%",
                        borderRadius: 4,
                        background: "var(--color-sage)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span className="tnum" style={{ fontSize: 12, width: 20, color: "var(--color-brown-soft-2)" }}>
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="card"
              style={{ padding: 0 }}
            >
              <div style={{ padding: 20 }}>
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      background: "var(--color-cream-sunken)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-brown-soft)",
                      flexShrink: 0,
                    }}
                  >
                    {review.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{review.name}</span>
                      <span style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>{review.date}</span>
                    </div>
                    <StarRow rating={review.rating} />
                  </div>
                </div>

                {/* Body */}
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-brown-soft)", margin: "12px 0 0" }}>
                  {review.text}
                </p>
              </div>

              {/* Posted reply */}
              {review.reply && (
                <div
                  style={{
                    margin: "0 20px 20px",
                    padding: 14,
                    borderRadius: 10,
                    background: "var(--color-cream-deep)",
                    borderLeft: "3px solid var(--color-sage)",
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{review.reply.name}</span>
                    <span style={{ fontSize: 11, color: "var(--color-brown-soft-2)" }}>{review.reply.time}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-brown-soft)", margin: 0 }}>
                    {review.reply.text}
                  </p>
                </div>
              )}

              {/* Reply composer */}
              {review.composerOpen && (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ position: "relative" }}>
                    <textarea
                      className="textarea"
                      value={review.composerText}
                      onChange={(e) => updateComposerText(review.id, e.target.value)}
                      rows={4}
                      placeholder="Write a reply..."
                      style={{ fontSize: 13, minHeight: 120, transition: "border-color 0.15s ease" }}
                    />
                    <span
                      className="tnum"
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 12,
                        fontSize: 11,
                        color: review.composerText.length > maxChars * 0.9 ? "var(--color-red)" : "var(--color-brown-soft-2)",
                      }}
                    >
                      {review.composerText.length}/{maxChars}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2" style={{ marginTop: 10 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ minHeight: 44, transition: "all 0.15s ease" }}
                      onClick={() => cancelReply(review.id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-red btn-sm"
                      style={{ minHeight: 44, transition: "all 0.15s ease" }}
                      onClick={() => postReply(review.id)}
                      disabled={review.composerText.trim().length === 0}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Reply button for cards without reply or composer */}
              {!review.reply && !review.composerOpen && (
                <div style={{ padding: "0 20px 16px" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ gap: 6, minHeight: 44, transition: "all 0.15s ease" }}
                    onClick={() => toggleComposer(review.id)}
                  >
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Dishes tab */}
      {activeTab === "Dishes" && (
        <div className="section-stack">
          {DISH_REVIEWS.map((dish, idx) => (
            <div key={idx} className="card" style={{ padding: 0 }}>
              <button
                className="flex items-center gap-3 w-full text-left"
                style={{
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 56,
                }}
                onClick={() => setExpandedDish(expandedDish === idx ? null : idx)}
              >
                <div className="flex-1">
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{dish.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <span className="tnum" style={{ fontWeight: 600, fontSize: 14 }}>{dish.rating.toFixed(1)}</span>
                </div>
                <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>
                  {dish.count} reviews
                </span>
                <ChevronRight
                  size={16}
                  style={{
                    color: "var(--color-brown-soft-2)",
                    transform: expandedDish === idx ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {expandedDish === idx && (
                <div style={{ borderTop: "1px solid var(--color-cream-sunken)" }}>
                  {dish.reviews.map((r, ri) => (
                    <div
                      key={ri}
                      style={{
                        padding: "14px 20px",
                        borderTop: ri > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 32,
                            height: 32,
                            background: "var(--color-cream-sunken)",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--color-brown-soft)",
                            flexShrink: 0,
                          }}
                        >
                          {r.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                            <span style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>{r.date}</span>
                          </div>
                          <StarRow rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-brown-soft)", margin: "8px 0 0 44px" }}>
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bundles tab */}
      {activeTab === "Bundles" && (
        <div className="section-stack">
          {BUNDLE_REVIEWS.map((bundle, idx) => (
            <div key={idx} className="card" style={{ padding: 0 }}>
              <button
                className="flex items-center gap-3 w-full text-left"
                style={{
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 56,
                }}
                onClick={() => setExpandedBundle(expandedBundle === idx ? null : idx)}
              >
                <div className="flex-1">
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{bundle.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <span className="tnum" style={{ fontWeight: 600, fontSize: 14 }}>{bundle.rating.toFixed(1)}</span>
                </div>
                <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>
                  {bundle.count} reviews
                </span>
                <ChevronRight
                  size={16}
                  style={{
                    color: "var(--color-brown-soft-2)",
                    transform: expandedBundle === idx ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {expandedBundle === idx && (
                <div style={{ borderTop: "1px solid var(--color-cream-sunken)" }}>
                  {bundle.reviews.map((r, ri) => (
                    <div
                      key={ri}
                      style={{
                        padding: "14px 20px",
                        borderTop: ri > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 32,
                            height: 32,
                            background: "var(--color-cream-sunken)",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--color-brown-soft)",
                            flexShrink: 0,
                          }}
                        >
                          {r.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                            <span style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>{r.date}</span>
                          </div>
                          <StarRow rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-brown-soft)", margin: "8px 0 0 44px" }}>
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
