/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
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
    <div className="content-default">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 24 }}>
        <div className="flex items-center gap-3">
          <span className="heading-lg" style={{ fontSize: 20 }}>{businessName || "Your Kitchen"}</span>
          <span className="pill pill-mute tnum" style={{ fontSize: 11 }}>Step {step} of 5</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/store-preview"
            className="caption flex items-center gap-1"
            style={{ color: "var(--color-red)", fontWeight: 500 }}
          >
            <ExternalLink size={12} />
            Preview My Store
          </Link>
          <button className="btn btn-ghost btn-sm">Discard</button>
          <button className="btn btn-dark btn-sm">Save</button>
        </div>
      </div>

      {/* FormWizard layout */}
      <style>{`
        @media (min-width: 1024px) {
          .profile-wizard-layout { grid-template-columns: 260px 1fr !important; }
        }
      `}</style>
      <div className="grid profile-wizard-layout" style={{ gridTemplateColumns: "1fr", gap: 24, alignItems: "start" }}>
        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="card" style={{ padding: 20 }}>
            {/* Progress bar */}
            <div style={{ height: 3, borderRadius: 2, background: "var(--color-cream-sunken)", marginBottom: 20 }}>
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
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: `background var(--t-fast) var(--ease-spring)`,
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
                        ? "var(--color-brown)"
                        : "var(--color-cream-sunken)",
                      color: isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: `all var(--t-base)`,
                    }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <span
                      className="body"
                      style={{
                        fontWeight: isCurrent ? 600 : 400,
                        color: isCurrent ? "var(--color-brown)" : "var(--color-brown-soft)",
                      }}
                    >
                      {s.label}
                    </span>
                    {isCurrent && <div className="accent-line-sm" style={{ marginTop: 4 }} />}
                  </div>
                </button>
              );
            })}

            {/* Tip box */}
            <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "var(--color-cream-deep)" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                <Lightbulb size={14} style={{ color: "var(--color-orange)" }} />
                <span className="caption" style={{ fontWeight: 600 }}>Tip</span>
              </div>
              <p className="caption" style={{ margin: 0, lineHeight: 1.5 }}>{TIPS[step]}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card section-stack">
              <div>
                <h2 className="heading-lg">Basic Info</h2>
                <p className="body-sm" style={{ marginTop: 4 }}>The essentials about your kitchen</p>
              </div>

              <div>
                <label className="field-label">Business Name *</label>
                <input className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your kitchen name" />
                <p className="field-help">This is how customers will find you</p>
              </div>

              <div>
                <label className="field-label">Years of Experience</label>
                <input className="input" type="number" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} min={0} max={50} style={{ maxWidth: 120 }} />
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div className="card section-stack">
              <div>
                <h2 className="heading-lg">About You</h2>
                <p className="body-sm" style={{ marginTop: 4 }}>Help customers connect with you</p>
              </div>

              <div>
                <label className="field-label">Bio</label>
                <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio for your profile (2-3 sentences)" rows={3} />
                <p className="field-help">Appears on your store page</p>
              </div>

              <div>
                <label className="field-label">Your Story</label>
                <textarea className="textarea" value={story} onChange={(e) => setStory(e.target.value)} placeholder="How did you start cooking? What's your journey?" rows={4} />
              </div>

              <div>
                <label className="field-label">What Inspires You</label>
                <textarea className="textarea" value={inspires} onChange={(e) => setInspires(e.target.value)} placeholder="Family recipes, regional traditions, fusion experiments?" rows={3} />
              </div>
            </div>
          )}

          {/* Step 3: Cuisines */}
          {step === 3 && (
            <div className="card section-stack">
              <div>
                <h2 className="heading-lg">Cuisines</h2>
                <p className="body-sm" style={{ marginTop: 4 }}>Select the cuisines you specialize in</p>
              </div>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-2">
                {selectedCuisines.map((c) => (
                  <span
                    key={c}
                    className="pill pill-sage flex items-center gap-1"
                    style={{ padding: "6px 12px", fontSize: 13 }}
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
                      }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Available cuisines */}
              <div>
                <label className="field-label" style={{ marginBottom: 8 }}>Add more cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CUISINES.filter((c) => !selectedCuisines.includes(c)).map((c) => (
                    <button
                      key={c}
                      className="pill"
                      style={{
                        cursor: "pointer",
                        border: "1px dashed var(--color-brown-soft-2)",
                        background: "transparent",
                        transition: `all var(--t-fast) var(--ease-spring)`,
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
                <h2 className="heading-lg">Branding</h2>
                <p className="body-sm" style={{ marginTop: 4 }}>Upload a banner image for your store page</p>
              </div>

              <div
                className="flex flex-col items-center justify-center"
                style={{
                  height: 200,
                  borderRadius: 12,
                  border: "2px dashed var(--color-brown-soft-2)",
                  background: "var(--color-cream-deep)",
                  cursor: "pointer",
                  transition: `border-color var(--t-fast)`,
                }}
              >
                <Upload size={32} style={{ color: "var(--color-brown-soft-2)", marginBottom: 12 }} />
                <span className="heading-sm">Upload banner image</span>
                <span className="body-sm" style={{ marginTop: 4 }}>Recommended: 1920 x 600px</span>
                <span className="caption" style={{ marginTop: 2 }}>PNG, JPG up to 5MB</span>
              </div>
            </div>
          )}

          {/* Step 5: Operations */}
          {step === 5 && (
            <div className="card section-stack">
              <div>
                <h2 className="heading-lg">Operations</h2>
                <p className="body-sm" style={{ marginTop: 4 }}>Set your availability and preferences</p>
              </div>

              {/* Timezone */}
              <div>
                <label className="field-label">Timezone</label>
                <select className="select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>

              {/* Toggles */}
              {[
                { label: "Available for orders", desc: "Show your store as open to customers", value: available, setter: setAvailable },
                { label: "Auto-accept orders", desc: "Automatically confirm incoming orders", value: autoAccept, setter: setAutoAccept },
                { label: "Pickup enabled", desc: "Allow customers to pick up orders", value: pickup, setter: setPickup },
              ].map((toggle, i) => (
                <div key={toggle.label}>
                  {i === 0 && <div className="divider" />}
                  <div className="flex items-center justify-between" style={{ padding: "14px 0" }}>
                    <div>
                      <div className="heading-sm" style={{ fontSize: 14 }}>{toggle.label}</div>
                      <div className="body-sm" style={{ marginTop: 2 }}>{toggle.desc}</div>
                    </div>
                    <button
                      className={`toggle ${toggle.value ? "is-on" : ""}`}
                      onClick={() => toggle.setter(!toggle.value)}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                  <div className="divider" />
                </div>
              ))}

              {/* Weekly schedule */}
              <div style={{ paddingTop: 8 }}>
                <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Weekly Schedule</span>
                <div className="card" style={{ padding: 0 }}>
                  {schedule.map((row, i) => (
                    <div key={row.day}>
                      {i > 0 && <div className="divider" />}
                      <div className="flex items-center gap-3" style={{ padding: "12px 20px" }}>
                        <span
                          className="body"
                          style={{
                            flex: 1,
                            fontWeight: 500,
                            color: row.enabled ? "var(--color-brown)" : "var(--color-brown-soft-2)",
                          }}
                        >
                          {row.day}
                        </span>
                        {row.enabled ? (
                          <span className="tnum body-sm">{row.open} &ndash; {row.close}</span>
                        ) : (
                          <span className="body-sm" style={{ color: "var(--color-brown-soft-2)" }}>Closed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom navigation */}
          <div className="flex items-center justify-between" style={{ marginTop: 20 }}>
            <button
              className="btn btn-ghost"
              disabled={step <= 1}
              onClick={goBack}
              style={{ opacity: step <= 1 ? 0.4 : 1 }}
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
                    background: s.num === step ? "var(--color-brown)" : s.num < step ? "var(--color-sage)" : "var(--color-cream-sunken)",
                    border: "none",
                    cursor: "pointer",
                    transition: `all var(--t-base) var(--ease-spring)`,
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              className="btn btn-gradient"
              onClick={goNext}
              disabled={step >= 5}
              style={{ opacity: step >= 5 ? 0.5 : 1 }}
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
