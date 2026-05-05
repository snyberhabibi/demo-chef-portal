/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { Star, MessageSquare, ChevronDown } from "lucide-react";

const FILTERS = ["All", "Chef Profile", "Dishes", "Bundles", "Awaiting Reply"];
const SORT_OPTIONS = ["Newest First", "Oldest First", "Highest Rating", "Lowest Rating"];

const breakdownData = [
  { stars: 5, count: 16, pct: 67 },
  { stars: 4, count: 5, pct: 21 },
  { stars: 3, count: 2, pct: 8 },
  { stars: 2, count: 1, pct: 4 },
  { stars: 1, count: 0, pct: 0 },
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    initials: "SH",
    name: "Sarah H.",
    rating: 5,
    date: "2 days ago",
    text: "The mansaf was absolutely incredible. Perfectly seasoned, generous portion. Will be ordering again every week!",
    dish: "Mansaf",
    reply: {
      name: "Yalla Kitchen by Amira",
      text: "Thank you so much Sarah! We're so glad you loved the mansaf. See you next week!",
      edited: true,
    },
    composerOpen: false,
    composerText: "",
  },
  {
    id: 2,
    initials: "MK",
    name: "Mike K.",
    rating: 4,
    date: "5 days ago",
    text: "Great knafeh, but delivery was a bit late. Food quality is always top notch though.",
    dish: "Knafeh",
    reply: null,
    composerOpen: false,
    composerText: "",
  },
  {
    id: 3,
    initials: "LR",
    name: "Lisa R.",
    rating: 5,
    date: "1 week ago",
    text: "Best baklava in Dallas! My family can't get enough. The pistachio filling is so rich and fresh.",
    dish: "Baklava",
    reply: null,
    composerOpen: true,
    composerText: "Thank you Lisa! So happy your family loves the baklava. We use ",
  },
  {
    id: 4,
    initials: "DJ",
    name: "David J.",
    rating: 3,
    date: "2 weeks ago",
    text: "Food was good but packaging could be better. The rice got a little soggy. Flavors were still great though.",
    dish: "Family Bundle",
    reply: null,
    composerOpen: false,
    composerText: "",
  },
];

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

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [sortOpen, setSortOpen] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
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
            edited: false,
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
      {/* Rating summary */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-6" style={{ transition: "box-shadow 0.2s ease" }}>
        <div className="text-center" style={{ minWidth: 100 }}>
          <div className="fraunces" style={{ fontSize: 48, lineHeight: 1, color: "var(--color-brown)" }}>
            4.8
          </div>
          <StarRow rating={5} size={16} />
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 4 }}>
            (24 reviews)
          </div>
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          {breakdownData.map((row) => (
            <div key={row.stars} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <span className="tnum" style={{ fontSize: 13, width: 16, textAlign: "right", color: "var(--color-brown-soft)" }}>
                {row.stars}
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

      {/* Filters + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`pill ${activeFilter === f ? "pill-brown" : ""}`}
            style={{
              cursor: "pointer",
              border: "none",
              minHeight: 44,
              transition: "all 0.15s ease",
            }}
            onClick={() => setActiveFilter(f)}
          >
            {f === "Awaiting Reply" && <MessageSquare size={12} />}
            {f}
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
                minWidth: 180,
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

      {/* Review cards */}
      {reviews.map((review) => (
        <div
          key={review.id}
          className="card"
          style={{
            padding: 0,
            transition: "box-shadow 0.2s ease, transform 0.15s ease",
          }}
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

            {/* Dish pill */}
            <div style={{ marginTop: 10 }}>
              <span className="pill pill-mute">{review.dish}</span>
            </div>
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
              <div className="flex items-center gap-1.5" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{review.reply.name}</span>
                {review.reply.edited && (
                  <span style={{ fontSize: 11, color: "var(--color-brown-soft-2)" }}>(edited)</span>
                )}
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
                  rows={3}
                  placeholder="Write a reply..."
                  style={{ minHeight: 80, transition: "border-color 0.15s ease" }}
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
    </div>
  );
}
