"use client";

import { useState } from "react";
import { Play, FileText, BookOpen, Video } from "lucide-react";

const TABS = ["Video Tutorials", "Chef Playbook"] as const;
type Tab = (typeof TABS)[number];

export default function PortalGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Video Tutorials");

  return (
    <div className="section-stack" style={{ maxWidth: 720 }}>
      {/* Tabs */}
      <div className="flex gap-1" style={{ borderBottom: "1px solid var(--color-cream-sunken)", paddingBottom: 0 }}>
        {TABS.map((t) => {
          const Icon = t === "Video Tutorials" ? Video : BookOpen;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex items-center gap-1.5"
              style={{
                padding: "10px 16px",
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: activeTab === t ? 600 : 500,
                color: activeTab === t ? "var(--color-red)" : "var(--color-brown-soft)",
                borderBottom: activeTab === t ? "2px solid var(--color-red)" : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                minHeight: 44,
                transition: "color 0.15s ease",
              }}
            >
              <Icon size={16} />
              {t}
            </button>
          );
        })}
      </div>

      {/* Video Tutorials tab */}
      {activeTab === "Video Tutorials" && (
        <div className="section-stack">
          <div>
            <h2 className="fraunces" style={{ fontSize: 22, margin: "0 0 4px" }}>How-To Videos</h2>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: 0 }}>
              Watch step-by-step guides to get the most out of your chef portal.
            </p>
          </div>

          {/* YouTube embed placeholder */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              aspectRatio: "16/9",
              borderRadius: 16,
              background: "var(--color-cream-deep)",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {/* Play button */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              <Play
                size={32}
                fill="var(--color-red)"
                style={{ color: "var(--color-red)", marginLeft: 4 }}
              />
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: "var(--color-brown)" }}>
                Yalla Bites Chef Success Playbook
              </div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 4 }}>
                Click to play video
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chef Playbook tab */}
      {activeTab === "Chef Playbook" && (
        <div className="section-stack">
          <div>
            <h2 className="fraunces" style={{ fontSize: 22, margin: "0 0 4px" }}>Chef Success Playbook</h2>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: 0 }}>
              Everything you need to grow your kitchen on Yalla Bites.
            </p>
          </div>

          {/* PDF viewer placeholder */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              minHeight: 400,
              borderRadius: 16,
              background: "var(--color-cream-deep)",
              padding: 40,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--color-cream-sunken)",
                marginBottom: 20,
              }}
            >
              <FileText size={32} style={{ color: "var(--color-brown-soft)" }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: "var(--color-brown)", marginBottom: 6 }}>
              Chef Success Playbook
            </div>
            <div className="pill pill-mute tnum" style={{ marginBottom: 20 }}>
              18 pages
            </div>
            <button className="btn btn-red" style={{ minHeight: 48 }}>
              <FileText size={16} />
              View Full Playbook PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
