"use client";

import { useState } from "react";
import { Play, FileText, BookOpen, Video, Download } from "lucide-react";

const TABS = ["Video Tutorials", "Chef Playbook"] as const;
type Tab = (typeof TABS)[number];

export default function PortalGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Video Tutorials");

  return (
    <div className="content-default section-stack">
      {/* Underline tabs */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
        {TABS.map((t) => {
          const Icon = t === "Video Tutorials" ? Video : BookOpen;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex items-center gap-1.5"
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: activeTab === t ? 600 : 400,
                color: activeTab === t ? "var(--color-red)" : "var(--color-brown-soft)",
                borderBottom: activeTab === t ? "2px solid var(--color-red)" : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                transition: `color var(--t-fast) var(--ease-spring)`,
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
            <h2 className="heading-lg">How-To Videos</h2>
            <p className="body-sm" style={{ marginTop: 4 }}>
              Watch step-by-step guides to get the most out of your chef portal.
            </p>
          </div>

          {/* Video placeholder - 16:9, dark bg, centered play button */}
          <div
            className="card flex flex-col items-center justify-center"
            style={{
              aspectRatio: "16/9",
              background: "var(--color-brown)",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              padding: 0,
            }}
          >
            {/* Play button - 48px white circle with red triangle */}
            <div
              className="flex items-center justify-center glow-red"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <Play
                size={22}
                fill="var(--color-red)"
                style={{ color: "var(--color-red)", marginLeft: 2 }}
              />
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div className="heading-sm" style={{ color: "var(--color-cream)" }}>
                Yalla Bites Chef Success Playbook
              </div>
              <div className="caption" style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
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
            <h2 className="heading-lg">Chef Success Playbook</h2>
            <p className="body-sm" style={{ marginTop: 4 }}>
              Everything you need to grow your kitchen on Yalla Bites.
            </p>
          </div>

          {/* Playbook card */}
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-cream-deep)" }}
              >
                <FileText size={24} style={{ color: "var(--color-brown-soft)" }} />
              </div>
              <div>
                <div className="heading-sm">Chef Success Playbook</div>
                <div className="caption" style={{ marginTop: 2 }}>18 pages</div>
              </div>
            </div>
            <button className="btn btn-gradient btn-sm">
              <Download size={14} />
              View Full Playbook PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
