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
    <div className="content-default section-stack">
      {/* Progress bar - slim 3px at top */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span className="body" style={{ fontWeight: 600 }}>Your progress</span>
          <span className="tnum caption">{completedCount} / {totalCount}</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "var(--color-cream-sunken)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: "var(--color-sage)",
              width: `${progressPct}%`,
              transition: `width 0.3s var(--ease-spring)`,
            }}
          />
        </div>
      </div>

      {/* Tutorial grid - 3 cols */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {tutorials.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link
              key={i}
              href="#"
              className="card card-hover"
              style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* Icon in cream-deep circle */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--color-cream-deep)",
                }}
              >
                <Icon size={20} style={{ color: "var(--color-brown-soft)" }} />
              </div>

              {/* Title */}
              <div className="heading-sm">{t.title}</div>

              {/* Description */}
              <p className="body-sm" style={{ margin: 0, flex: 1 }}>{t.desc}</p>

              {/* Footer */}
              <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                {t.completed ? (
                  <span className="pill pill-sage flex items-center gap-1" style={{ fontSize: 11 }}>
                    <CheckCircle size={12} />
                    Completed
                  </span>
                ) : (
                  <span className="pill pill-sage tnum" style={{ fontSize: 11 }}>
                    {t.steps} steps
                  </span>
                )}

                <span
                  className="caption flex items-center gap-1"
                  style={{ fontWeight: 600, color: "var(--color-red)" }}
                >
                  {t.completed ? "Run again" : "Start"}
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
