/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Star, MessageSquare } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TABS = ["Chef Profile", "Dishes", "Bundles"] as const;
type Tab = (typeof TABS)[number];

const SORT_OPTIONS = ["Newest", "Oldest", "Highest", "Lowest"];

const breakdownData = [
  { stars: 5, count: 4, pct: 100 },
  { stars: 4, count: 0, pct: 0 },
  { stars: 3, count: 0, pct: 0 },
  { stars: 2, count: 0, pct: 0 },
  { stars: 1, count: 0, pct: 0 },
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
    composerOpen: false,
    composerText: "",
  },
  {
    id: 4,
    initials: "JL",
    name: "Jordan L.",
    rating: 5,
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
  const sortRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState(PROFILE_REVIEWS);
  const [expandedDish, setExpandedDish] = useState<number | null>(null);
  const [expandedBundle, setExpandedBundle] = useState<number | null>(null);
  const maxChars = 500;

  /* Click-outside to close sort dropdown */
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [sortOpen]);

  /* Sorted reviews */
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    switch (sortBy) {
      case "Oldest":
        return list.reverse();
      case "Highest":
        return list.sort((a, b) => b.rating - a.rating);
      case "Lowest":
        return list.sort((a, b) => a.rating - b.rating);
      default: // "Newest" — original order
        return list;
    }
  }, [reviews, sortBy]);

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
    <div className="content-default section-stack">
      {/* Header row: tabs + sort */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        {/* Underline tabs */}
        <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
          {TABS.map((t) => (
            <button
              key={t}
              className="body text-[12px] sm:text-[13px]"
              style={{
                padding: "10px 14px",
                background: "none",
                border: "none",
                fontWeight: activeTab === t ? 600 : 400,
                color: activeTab === t ? "var(--color-red)" : "var(--color-brown-soft)",
                borderBottom: activeTab === t ? "2px solid var(--color-red)" : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                transition: `color var(--t-fast) var(--ease-spring)`,
              }}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div ref={sortRef} style={{ position: "relative" }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSortOpen(!sortOpen)}
          >
            {sortBy}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: `transform var(--t-fast) var(--ease-spring)` }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {sortOpen && (
            <div
              className="shadow-sticker"
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(51,31,46,0.06)",
                overflow: "hidden",
                zIndex: 20,
                minWidth: 150,
                animation: "fadeUp 0.15s var(--ease-out) both",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className="body"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: opt === sortBy ? "var(--color-cream-sunken)" : "none",
                    border: "none",
                    fontWeight: opt === sortBy ? 600 : 400,
                    color: "var(--color-brown)",
                    cursor: "pointer",
                    transition: `background var(--t-fast)`,
                  }}
                  onClick={() => { setSortBy(opt); setSortOpen(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="accent-line" />

      {/* Chef Profile tab */}
      {activeTab === "Chef Profile" && (
        <>
          {/* Rating summary card */}
          <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="text-center" style={{ minWidth: 100 }}>
              <div className="fraunces" style={{ fontSize: "clamp(32px, 8vw, 48px)", lineHeight: 1 }}>
                5.0
              </div>
              <div style={{ marginTop: 8 }}>
                <StarRow rating={5} size={18} />
              </div>
              <div className="caption" style={{ marginTop: 6 }}>4 ratings</div>
            </div>

            {/* Distribution bars */}
            <div style={{ flex: 1, width: "100%" }}>
              {breakdownData.map((row) => (
                <div key={row.stars} className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span className="tnum caption" style={{ width: 20, textAlign: "right" }}>
                    {row.stars}
                  </span>
                  <Star size={12} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--color-cream-sunken)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${row.pct}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: "var(--color-sage)",
                        transition: `width 0.3s var(--ease-spring)`,
                      }}
                    />
                  </div>
                  <span className="tnum caption" style={{ width: 16 }}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review list - single card with dividers */}
          <div className="card" style={{ padding: 0 }}>
            {sortedReviews.map((review, idx) => (
              <div key={review.id}>
                {idx > 0 && <div className="divider" />}
                <div className="p-3.5 sm:p-6">
                  {/* Header row */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--color-cream-sunken)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-brown-soft)",
                        flexShrink: 0,
                      }}
                    >
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="heading-sm" style={{ fontSize: 14 }}>{review.name}</span>
                        <span className="caption">{review.date}</span>
                      </div>
                      <div style={{ marginTop: 2 }}>
                        <StarRow rating={review.rating} />
                      </div>
                    </div>
                  </div>

                  {/* Body text */}
                  <p className="body-sm text-[13px] sm:text-[14px]" style={{ margin: "12px 0 0" }}>{review.text}</p>

                  {/* Posted reply */}
                  {review.reply && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: 14,
                        borderRadius: 10,
                        background: "var(--color-cream-deep)",
                        borderLeft: "3px solid var(--color-sage)",
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                        <span className="body" style={{ fontWeight: 600 }}>{review.reply.name}</span>
                        <span className="caption">{review.reply.time}</span>
                      </div>
                      <p className="body-sm" style={{ margin: 0 }}>{review.reply.text}</p>
                    </div>
                  )}

                  {/* Reply composer */}
                  {review.composerOpen && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ position: "relative" }}>
                        <textarea
                          className="textarea review-composer-textarea"
                          value={review.composerText}
                          onChange={(e) => updateComposerText(review.id, e.target.value)}
                          placeholder="Write a reply..."
                          style={{ minHeight: 64, fontSize: 14, transition: `border-color var(--t-fast)` }}
                        />
                        <span
                          className="tnum caption"
                          style={{
                            position: "absolute",
                            bottom: 10,
                            right: 12,
                            color: review.composerText.length > maxChars * 0.9 ? "var(--color-red)" : undefined,
                          }}
                        >
                          {review.composerText.length}/{maxChars}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2" style={{ marginTop: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => cancelReply(review.id)}>
                          Cancel
                        </button>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => postReply(review.id)}
                          disabled={review.composerText.trim().length === 0}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reply button */}
                  {!review.reply && !review.composerOpen && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: 12, gap: 6 }}
                      onClick={() => toggleComposer(review.id)}
                    >
                      <MessageSquare size={14} />
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dishes tab */}
      {activeTab === "Dishes" && (
        <div className="card" style={{ padding: 0 }}>
          {DISH_REVIEWS.map((dish, idx) => (
            <div key={idx}>
              {idx > 0 && <div className="divider" />}
              <button
                className="flex items-center gap-3 w-full text-left"
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedDish(expandedDish === idx ? null : idx)}
              >
                <div className="flex-1">
                  <span className="heading-sm" style={{ fontSize: 14 }}>{dish.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <span className="tnum body" style={{ fontWeight: 600 }}>{dish.rating.toFixed(1)}</span>
                </div>
                <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>{dish.count} reviews</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  style={{
                    color: "var(--color-brown-soft-2)",
                    transform: expandedDish === idx ? "rotate(90deg)" : "none",
                    transition: `transform var(--t-fast) var(--ease-spring)`,
                  }}
                >
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {expandedDish === idx && (
                <div>
                  {dish.reviews.map((r, ri) => (
                    <div key={ri}>
                      <div className="divider" />
                      <div style={{ padding: "14px 24px 14px 44px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                              width: 28,
                              height: 28,
                              background: "var(--color-cream-sunken)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--color-brown-soft)",
                              flexShrink: 0,
                            }}
                          >
                            {r.initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="body" style={{ fontWeight: 600 }}>{r.name}</span>
                              <span className="caption">{r.date}</span>
                            </div>
                            <StarRow rating={r.rating} size={12} />
                          </div>
                        </div>
                        <p className="body-sm" style={{ margin: "8px 0 0 40px" }}>{r.text}</p>
                      </div>
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
        <div className="card" style={{ padding: 0 }}>
          {BUNDLE_REVIEWS.map((bundle, idx) => (
            <div key={idx}>
              {idx > 0 && <div className="divider" />}
              <button
                className="flex items-center gap-3 w-full text-left"
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedBundle(expandedBundle === idx ? null : idx)}
              >
                <div className="flex-1">
                  <span className="heading-sm" style={{ fontSize: 14 }}>{bundle.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} fill="var(--color-sage)" stroke="var(--color-sage)" />
                  <span className="tnum body" style={{ fontWeight: 600 }}>{bundle.rating.toFixed(1)}</span>
                </div>
                <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>{bundle.count} reviews</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  style={{
                    color: "var(--color-brown-soft-2)",
                    transform: expandedBundle === idx ? "rotate(90deg)" : "none",
                    transition: `transform var(--t-fast) var(--ease-spring)`,
                  }}
                >
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {expandedBundle === idx && (
                <div>
                  {bundle.reviews.map((r, ri) => (
                    <div key={ri}>
                      <div className="divider" />
                      <div style={{ padding: "14px 24px 14px 44px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                              width: 28,
                              height: 28,
                              background: "var(--color-cream-sunken)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--color-brown-soft)",
                              flexShrink: 0,
                            }}
                          >
                            {r.initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="body" style={{ fontWeight: 600 }}>{r.name}</span>
                              <span className="caption">{r.date}</span>
                            </div>
                            <StarRow rating={r.rating} size={12} />
                          </div>
                        </div>
                        <p className="body-sm" style={{ margin: "8px 0 0 40px" }}>{r.text}</p>
                      </div>
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
