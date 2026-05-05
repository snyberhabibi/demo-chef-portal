"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, BookOpen, Play, ExternalLink, Clock, ChevronRight, X } from "lucide-react";

const TUTORIALS = [
  { title: "Setting up your kitchen profile", time: "3 min read", category: "Getting Started" },
  { title: "Adding your first dish", time: "5 min read", category: "Menu" },
  { title: "Creating bundles that sell", time: "4 min read", category: "Bundles" },
  { title: "Setting your hours & availability", time: "2 min read", category: "Operations" },
  { title: "Understanding your payouts", time: "3 min read", category: "Payments" },
  { title: "Responding to reviews effectively", time: "4 min read", category: "Reviews" },
  { title: "Food photography tips", time: "6 min read", category: "Growth" },
];

const VIDEOS = [
  { title: "Chef Portal Walkthrough", duration: "4:32", thumbnail: "var(--color-cream-sunken)" },
  { title: "Packaging Your Food Like a Pro", duration: "6:15", thumbnail: "var(--color-terracotta-soft)" },
  { title: "How to Price Your Menu", duration: "5:48", thumbnail: "var(--color-sage-soft)" },
  { title: "Growing Your Customer Base", duration: "7:22", thumbnail: "var(--color-orange-soft)" },
];

export default function HelpPage() {
  const [tab, setTab] = useState<"tutorials" | "videos">("tutorials");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="section-stack" style={{ maxWidth: 720 }}>
      {/* Quick Start banner */}
      {!bannerDismissed && (
        <div className="card-cream" style={{ padding: 24, position: "relative", transition: "all 0.2s ease" }}>
          <button
            onClick={() => setBannerDismissed(true)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-brown-soft-2)",
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              transition: "color 0.15s ease",
            }}
          >
            <X size={18} />
          </button>
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "var(--color-red-soft)",
                flexShrink: 0,
              }}
            >
              <Rocket size={24} style={{ color: "var(--color-red)" }} />
            </div>
            <div>
              <div className="fraunces" style={{ fontSize: 20, marginBottom: 4 }}>
                Quick Start Guide
              </div>
              <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "0 0 12px" }}>
                New to Yalla Bites? Follow our step-by-step guide to set up your kitchen, add your menu, and start receiving orders in under 30 minutes.
              </p>
              <Link
                href="/help"
                className="btn btn-red btn-sm"
                style={{ minHeight: 44, transition: "all 0.15s ease" }}
              >
                Get Started
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1" style={{ borderBottom: "1px solid var(--color-cream-sunken)", paddingBottom: 0 }}>
        <button
          onClick={() => setTab("tutorials")}
          className="flex items-center gap-1.5"
          style={{
            padding: "10px 16px",
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: tab === "tutorials" ? 600 : 500,
            color: tab === "tutorials" ? "var(--color-red)" : "var(--color-brown-soft)",
            borderBottom: tab === "tutorials" ? "2px solid var(--color-red)" : "2px solid transparent",
            marginBottom: -1,
            cursor: "pointer",
            minHeight: 44,
            transition: "color 0.15s ease",
          }}
        >
          <BookOpen size={16} />
          Tutorials
        </button>
        <button
          onClick={() => setTab("videos")}
          className="flex items-center gap-1.5"
          style={{
            padding: "10px 16px",
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: tab === "videos" ? 600 : 500,
            color: tab === "videos" ? "var(--color-red)" : "var(--color-brown-soft)",
            borderBottom: tab === "videos" ? "2px solid var(--color-red)" : "2px solid transparent",
            marginBottom: -1,
            cursor: "pointer",
            minHeight: 44,
            transition: "color 0.15s ease",
          }}
        >
          <Play size={16} />
          Videos
        </button>
      </div>

      {/* Tutorial grid */}
      {tab === "tutorials" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {TUTORIALS.map((t, i) => (
            <Link
              key={i}
              href="/help"
              className="card"
              style={{
                padding: 16,
                textAlign: "left",
                cursor: "pointer",
                border: "1px solid transparent",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "box-shadow 0.2s ease, border-color 0.15s ease",
                minHeight: 44,
              }}
            >
              <span className="pill pill-mute" style={{ fontSize: 10, marginBottom: 10, display: "inline-block" }}>
                {t.category}
              </span>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>
                {t.title}
              </div>
              <div className="flex items-center gap-1" style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>
                <Clock size={12} />
                {t.time}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Video grid */}
      {tab === "videos" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {VIDEOS.map((v, i) => (
            <Link
              key={i}
              href="/help"
              className="card"
              style={{
                padding: 0,
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid transparent",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "box-shadow 0.2s ease, border-color 0.15s ease",
              }}
            >
              {/* Video placeholder with play overlay */}
              <div
                className="flex items-center justify-center"
                style={{
                  height: 140,
                  background: v.thumbnail,
                  position: "relative",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.92)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <Play size={20} fill="var(--color-brown)" style={{ color: "var(--color-brown)", marginLeft: 2 }} />
                </div>
                {/* Duration badge */}
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background: "rgba(51,31,46,0.75)",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {v.duration}
                </span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v.title}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Support link */}
      <Link
        href="/help"
        className="card flex items-center justify-between"
        style={{
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          transition: "box-shadow 0.2s ease",
          minHeight: 56,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Need more help?</div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
            Contact our support team
          </div>
        </div>
        <ExternalLink size={18} style={{ color: "var(--color-brown-soft-2)" }} />
      </Link>
    </div>
  );
}
