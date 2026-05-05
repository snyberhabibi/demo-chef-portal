"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Layers,
  Package,
  Tag,
  List,
  User,
  Settings,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const TUTORIALS = [
  {
    icon: ClipboardList,
    title: "Managing Orders",
    desc: "Learn how to accept, prepare, and complete customer orders efficiently.",
    steps: 14,
    completed: false,
  },
  {
    icon: Layers,
    title: "Creating Dishes",
    desc: "Add dishes with photos, descriptions, pricing, and modifiers.",
    steps: 12,
    completed: false,
  },
  {
    icon: Package,
    title: "Creating Bundles",
    desc: "Combine dishes into bundles with special pricing for families and groups.",
    steps: 10,
    completed: true,
  },
  {
    icon: Tag,
    title: "Modifier Groups",
    desc: "Set up spice levels, sizes, add-ons, and other customization options.",
    steps: 6,
    completed: false,
  },
  {
    icon: List,
    title: "Custom Menu Sections",
    desc: "Organize your menu with custom categories and featured sections.",
    steps: 7,
    completed: false,
  },
  {
    icon: User,
    title: "Chef Profile",
    desc: "Set up your profile, bio, cuisines, and branding to attract customers.",
    steps: 10,
    completed: false,
  },
  {
    icon: Settings,
    title: "Account Settings",
    desc: "Manage notifications, security, co-pilot access, and account preferences.",
    steps: 7,
    completed: false,
  },
  {
    icon: MapPin,
    title: "Address Management",
    desc: "Set your pickup address, instructions, and operating zone.",
    steps: 6,
    completed: false,
  },
];

export default function TutorialsPage() {
  const [tutorials] = useState(TUTORIALS);
  const completedCount = tutorials.filter((t) => t.completed).length;
  const totalCount = tutorials.length;
  const progressPct = (completedCount / totalCount) * 100;

  return (
    <div className="section-stack" style={{ maxWidth: 800 }}>
      {/* Progress card */}
      <div className="card flex items-center gap-4">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            Your progress: {completedCount} of {totalCount} completed
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "var(--color-cream-sunken)",
              marginTop: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background: "var(--color-sage)",
                width: `${progressPct}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 6 }}>
            Complete all tutorials to become a Yalla Bites pro!
          </div>
        </div>
      </div>

      {/* Tutorial grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: 16,
        }}
      >
        {tutorials.map((t, i) => {
          const Icon = t.icon;
          return (
            <div
              key={i}
              className="card card-hover"
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Icon circle */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "var(--color-cream-deep)",
                }}
              >
                <Icon size={24} style={{ color: "var(--color-brown-soft)" }} />
              </div>

              {/* Title */}
              <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>
                {t.title}
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-brown-soft)", margin: 0, flex: 1 }}>
                {t.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                {t.completed ? (
                  <span className="pill pill-sage flex items-center gap-1" style={{ fontSize: 12 }}>
                    <CheckCircle size={12} />
                    Completed
                  </span>
                ) : (
                  <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>
                    {t.steps} steps
                  </span>
                )}

                <Link
                  href="#"
                  className="flex items-center gap-1"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-red)",
                    textDecoration: "none",
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {t.completed ? "Run again" : "Start tutorial"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
