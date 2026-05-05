/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Steps                                                              */
/* ------------------------------------------------------------------ */
const STEPS = [
  { num: 1, label: "Basic Info" },
  { num: 2, label: "About You" },
  { num: 3, label: "Cuisines" },
  { num: 4, label: "Branding" },
  { num: 5, label: "Operations" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ALL_CUISINES = [
  "Palestinian", "Lebanese", "Jordanian", "Iraqi", "Syrian", "Egyptian",
  "Moroccan", "Turkish", "Persian", "Indian", "Mexican", "Italian",
];

const TIPS: Record<number, string> = {
  1: "A great business name is memorable and tells customers what to expect.",
  2: "Share your story! Customers love knowing the person behind the food.",
  3: "Adding more cuisines helps customers find you when searching.",
  4: "A professional banner image can increase your store views by 40%.",
  5: "Setting accurate hours prevents missed orders and unhappy customers.",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const [step, setStep] = useState(1);

  /* Step 1 */
  const [businessName, setBusinessName] = useState("Yalla Kitchen");
  const [yearsExp, setYearsExp] = useState("5");

  /* Step 2 */
  const [bio, setBio] = useState("");
  const [story, setStory] = useState("");
  const [inspires, setInspires] = useState("");

  /* Step 3 */
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "Palestinian", "Lebanese", "Jordanian", "Iraqi",
  ]);

  /* Step 5 */
  const [timezone, setTimezone] = useState("America/Chicago");
  const [available, setAvailable] = useState(true);
  const [autoAccept, setAutoAccept] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState<number | null>(null);
  const [schedule] = useState(
    DAYS.map((day, i) => ({ day, enabled: i < 5, open: "10:00 AM", close: "6:00 PM" }))
  );

  const removeCuisine = (c: string) =>
    setSelectedCuisines((prev) => prev.filter((x) => x !== c));
  const addCuisine = (c: string) => {
    if (!selectedCuisines.includes(c)) setSelectedCuisines((prev) => [...prev, c]);
  };

  const goNext = () => setStep(Math.min(step + 1, 5));
  const goBack = () => setStep(Math.max(step - 1, 1));

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 24 }}>
        <div className="flex items-center gap-3">
          <span className="fraunces" style={{ fontSize: 18 }}>{businessName || "Your Kitchen"}</span>
          <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>Step {step} of 5</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" style={{ minHeight: 44 }}>Discard</button>
          <button className="btn btn-red btn-sm" style={{ minHeight: 44 }}>Save</button>
        </div>
      </div>

      <div className="flex gap-6" style={{ alignItems: "flex-start" }}>
        {/* Left sidebar */}
        <div className="hidden md:block" style={{ width: 220, flexShrink: 0 }}>
          <div className="card" style={{ padding: 16 }}>
            {/* Progress bar */}
            <div style={{ height: 4, borderRadius: 2, background: "var(--color-cream-sunken)", marginBottom: 20 }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: "var(--color-sage)",
                  width: `${progressPct}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {STEPS.map((s, i) => {
              const isCurrent = s.num === step;
              const isDone = s.num < step;
              return (
                <button
                  key={s.num}
                  className="flex items-center gap-3 w-full text-left"
                  style={{
                    padding: "10px 8px",
                    background: isCurrent ? "var(--color-cream-sunken)" : "none",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    minHeight: 44,
                    transition: "background 0.15s ease",
                    marginTop: i > 0 ? 2 : 0,
                  }}
                  onClick={() => setStep(s.num)}
                >
                  <div
                    className="flex items-center justify-center tnum"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isDone
                        ? "var(--color-sage)"
                        : isCurrent
                        ? "var(--color-red)"
                        : "var(--color-cream-sunken)",
                      color: isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {s.num}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? "var(--color-brown)" : "var(--color-brown-soft)",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}

            {/* Tip box */}
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 10,
                background: "var(--color-cream-deep)",
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                <Lightbulb size={14} style={{ color: "var(--color-orange)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-brown-soft)" }}>Tip</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--color-brown-soft)", margin: 0 }}>
                {TIPS[step]}
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card section-stack">
              <div>
                <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>Basic Info</h2>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
                  The essentials about your kitchen
                </p>
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
                  Business Name *
                </label>
                <input
                  className="input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your kitchen name"
                  style={{ minHeight: 44 }}
                />
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
                  Years of Experience
                </label>
                <input
                  className="input"
                  type="number"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  min={0}
                  max={50}
                  style={{ minHeight: 44, maxWidth: 120 }}
                />
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div className="card section-stack">
              <div>
                <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>About You</h2>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
                  Help customers connect with you
                </p>
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Bio</label>
                <textarea
                  className="textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short bio for your profile (2-3 sentences)"
                  rows={3}
                  style={{ minHeight: 96 }}
                />
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Your Story</label>
                <textarea
                  className="textarea"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="How did you start cooking? What's your journey?"
                  rows={4}
                  style={{ minHeight: 120 }}
                />
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>What Inspires You</label>
                <textarea
                  className="textarea"
                  value={inspires}
                  onChange={(e) => setInspires(e.target.value)}
                  placeholder="What inspires your cooking? Family recipes, regional traditions, fusion experiments?"
                  rows={3}
                  style={{ minHeight: 96 }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Cuisines */}
          {step === 3 && (
            <div className="card section-stack">
              <div>
                <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>Cuisines</h2>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
                  Select the cuisines you specialize in
                </p>
              </div>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-2">
                {selectedCuisines.map((c) => (
                  <span
                    key={c}
                    className="pill pill-sage flex items-center gap-1"
                    style={{ padding: "6px 10px", fontSize: 13 }}
                  >
                    {c}
                    <button
                      onClick={() => removeCuisine(c)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--color-sage-deep)",
                        display: "flex",
                        alignItems: "center",
                        minWidth: 20,
                        minHeight: 20,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Available cuisines */}
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
                  Add more cuisines
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CUISINES.filter((c) => !selectedCuisines.includes(c)).map((c) => (
                    <button
                      key={c}
                      className="pill"
                      style={{
                        cursor: "pointer",
                        border: "1px dashed var(--color-brown-soft-2)",
                        background: "transparent",
                        minHeight: 36,
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => addCuisine(c)}
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Branding */}
          {step === 4 && (
            <div className="card section-stack">
              <div>
                <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>Branding</h2>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
                  Upload a banner image for your store page
                </p>
              </div>

              <div
                className="flex flex-col items-center justify-center"
                style={{
                  height: 200,
                  borderRadius: 12,
                  border: "2px dashed var(--color-brown-soft-2)",
                  background: "var(--color-cream-deep)",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease",
                }}
              >
                <Upload size={32} style={{ color: "var(--color-brown-soft-2)", marginBottom: 12 }} />
                <span style={{ fontWeight: 600, fontSize: 15, color: "var(--color-brown)" }}>
                  Upload banner image
                </span>
                <span style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 4 }}>
                  Recommended: 1920 x 600px
                </span>
                <span style={{ fontSize: 12, color: "var(--color-brown-soft-2)", marginTop: 2 }}>
                  PNG, JPG up to 5MB
                </span>
              </div>
            </div>
          )}

          {/* Step 5: Operations */}
          {step === 5 && (
            <div className="card section-stack">
              <div>
                <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>Operations</h2>
                <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
                  Set your availability and preferences
                </p>
              </div>

              {/* Timezone */}
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
                  Timezone
                </label>
                <select
                  className="select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ minHeight: 44 }}
                >
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between" style={{ padding: "8px 0" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Available for orders</div>
                  <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                    Show your store as open to customers
                  </div>
                </div>
                <button
                  className={`toggle ${available ? "is-on" : ""}`}
                  onClick={() => setAvailable(!available)}
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              <div className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid var(--color-cream-sunken)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Auto-accept orders</div>
                  <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                    Automatically confirm incoming orders
                  </div>
                </div>
                <button
                  className={`toggle ${autoAccept ? "is-on" : ""}`}
                  onClick={() => setAutoAccept(!autoAccept)}
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              <div className="flex items-center justify-between" style={{ padding: "8px 0", borderTop: "1px solid var(--color-cream-sunken)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Pickup enabled</div>
                  <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                    Allow customers to pick up orders
                  </div>
                </div>
                <button
                  className={`toggle ${pickup ? "is-on" : ""}`}
                  onClick={() => setPickup(!pickup)}
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              {/* Weekly schedule */}
              <div style={{ borderTop: "1px solid var(--color-cream-sunken)", paddingTop: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Weekly Schedule</div>
                {schedule.map((row, i) => (
                  <div key={row.day}>
                    <button
                      className="flex items-center gap-3 w-full text-left"
                      style={{
                        padding: "10px 0",
                        background: "none",
                        border: "none",
                        borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                      onClick={() => setScheduleOpen(scheduleOpen === i ? null : i)}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontWeight: 500,
                          color: row.enabled ? "var(--color-brown)" : "var(--color-brown-soft-2)",
                        }}
                      >
                        {row.day}
                      </span>
                      {row.enabled ? (
                        <span className="tnum" style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                          {row.open} &ndash; {row.close}
                        </span>
                      ) : (
                        <span style={{ fontSize: 13, color: "var(--color-brown-soft-2)" }}>Closed</span>
                      )}
                      {scheduleOpen === i ? (
                        <ChevronUp size={16} style={{ color: "var(--color-brown-soft-2)" }} />
                      ) : (
                        <ChevronDown size={16} style={{ color: "var(--color-brown-soft-2)" }} />
                      )}
                    </button>
                    {scheduleOpen === i && row.enabled && (
                      <div className="flex items-center gap-3" style={{ padding: "0 0 12px 16px" }}>
                        <div>
                          <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>Open</label>
                          <select className="select" defaultValue={row.open} style={{ width: 130, minHeight: 44 }}>
                            {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <span style={{ marginTop: 20, color: "var(--color-brown-soft-2)" }}>&ndash;</span>
                        <div>
                          <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>Close</label>
                          <select className="select" defaultValue={row.close} style={{ width: 130, minHeight: 44 }}>
                            {["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom navigation */}
          <div className="flex items-center justify-between" style={{ marginTop: 20 }}>
            <button
              className="btn btn-ghost"
              disabled={step <= 1}
              onClick={goBack}
              style={{ opacity: step <= 1 ? 0.4 : 1, minHeight: 44 }}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  style={{
                    width: s.num === step ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: s.num === step ? "var(--color-red)" : s.num < step ? "var(--color-sage)" : "var(--color-cream-sunken)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minWidth: 8,
                    minHeight: 8,
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/store-preview"
                className="flex items-center gap-1"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-red)",
                  textDecoration: "none",
                  minHeight: 44,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <ExternalLink size={13} />
                Preview My Store
              </Link>
              <button
                className="btn btn-red"
                onClick={goNext}
                disabled={step >= 5}
                style={{ minHeight: 44, opacity: step >= 5 ? 0.5 : 1 }}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
