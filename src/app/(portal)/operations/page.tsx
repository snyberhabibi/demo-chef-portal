/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, AlertTriangle, CheckCircle, XCircle, Plus, X, Trash2, Calendar, Copy, Ban } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

type StoreState = "pending" | "approved-off" | "live" | "rejected";

/* ------------------------------------------------------------------ */
/*  Time helpers                                                       */
/* ------------------------------------------------------------------ */
function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const mins = m.toString().padStart(2, "0");
      options.push(`${hour12}:${mins} ${ampm}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

interface TimeWindow {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  windows: TimeWindow[];
}

type WeekSchedule = Record<string, DaySchedule>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getDefaultSchedule(): WeekSchedule {
  const schedule: WeekSchedule = {};
  DAYS.forEach((day) => {
    if (day === "Saturday" || day === "Sunday") {
      schedule[day] = { enabled: false, windows: [] };
    } else if (day === "Wednesday") {
      schedule[day] = {
        enabled: true,
        windows: [
          { id: "wed-1", start: "10:00 AM", end: "2:00 PM" },
          { id: "wed-2", start: "4:00 PM", end: "8:00 PM" },
        ],
      };
    } else {
      schedule[day] = {
        enabled: true,
        windows: [{ id: `${day}-1`, start: "10:00 AM", end: "6:00 PM" }],
      };
    }
  });
  return schedule;
}

/* ------------------------------------------------------------------ */
/*  Time Off & Overrides data                                          */
/* ------------------------------------------------------------------ */
interface TimeOffEntry {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  note: string;
  autoPause: boolean;
}

interface DateOverride {
  id: string;
  date: string;
  monthAbbr: string;
  dayNum: string;
  windows: string[];
  note: string;
}

const INITIAL_TIME_OFF: TimeOffEntry[] = [
  { id: "1", startDate: "Dec 22, 2025", endDate: "Dec 28, 2025", days: 7, note: "Family in Amman", autoPause: true },
];

const INITIAL_OVERRIDES: DateOverride[] = [
  { id: "1", date: "November 27, 2025", monthAbbr: "NOV", dayNum: "27", windows: ["4:00 PM \u2013 8:00 PM"], note: "Thanksgiving \u2014 dinner only" },
  { id: "2", date: "December 31, 2025", monthAbbr: "DEC", dayNum: "31", windows: ["6:00 PM \u2013 11:00 PM"], note: "New Year\u2019s Eve special menu" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OperationsPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const { toast } = useToast();
  const [state, setState] = useState<StoreState>("live");
  const [storeToggle, setStoreToggle] = useState(state === "live");
  const [autoAccept, setAutoAccept] = useState(true);
  const [timezone, setTimezone] = useState("America/Chicago");
  const [showTurnOffConfirm, setShowTurnOffConfirm] = useState(false);
  const [schedule, setSchedule] = useState<WeekSchedule>(getDefaultSchedule);
  const [timeOff, setTimeOff] = useState<TimeOffEntry[]>(INITIAL_TIME_OFF);
  const [overrides, setOverrides] = useState<DateOverride[]>(INITIAL_OVERRIDES);
  const [activeSubTab, setActiveSubTab] = useState<"timeoff" | "overrides">("timeoff");

  let nextId = 100;
  const genId = () => `window-${nextId++}-${Date.now()}`;

  const stateButtons: { key: StoreState; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved-off", label: "Approved-OFF" },
    { key: "live", label: "Live" },
    { key: "rejected", label: "Rejected" },
  ];

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        windows: !prev[day].enabled && prev[day].windows.length === 0
          ? [{ id: genId(), start: "10:00 AM", end: "6:00 PM" }]
          : prev[day].windows,
      },
    }));
  };

  const addWindow = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: true,
        windows: [...prev[day].windows, { id: genId(), start: "10:00 AM", end: "6:00 PM" }],
      },
    }));
  };

  const removeWindow = (day: string, windowId: string) => {
    setSchedule((prev) => {
      const newWindows = prev[day].windows.filter((w) => w.id !== windowId);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          windows: newWindows,
          enabled: newWindows.length > 0 ? prev[day].enabled : false,
        },
      };
    });
  };

  const updateWindow = (day: string, windowId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        windows: prev[day].windows.map((w) =>
          w.id === windowId ? { ...w, [field]: value } : w
        ),
      },
    }));
  };

  const copyMondayToWeekdays = () => {
    setSchedule((prev) => {
      const monSchedule = prev["Monday"];
      const next = { ...prev };
      ["Tuesday", "Wednesday", "Thursday", "Friday"].forEach((day) => {
        next[day] = {
          enabled: monSchedule.enabled,
          windows: monSchedule.windows.map((w) => ({ ...w, id: genId() })),
        };
      });
      return next;
    });
  };

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 60, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 50, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack">
      {/* State toggle for demo */}
      <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        <span className="caption" style={{ fontWeight: 600, marginRight: 4 }}>Demo:</span>
        {stateButtons.map((s) => (
          <button
            key={s.key}
            className={`btn btn-sm ${state === s.key ? "btn-dark" : "btn-ghost"}`}
            style={{ fontSize: 12 }}
            onClick={() => {
              setState(s.key);
              setStoreToggle(s.key === "live");
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ═══ SECTION A: Store Status ═══ */}
      {state === "pending" && (
        <div
          className="flex items-start gap-3"
          style={{
            borderLeft: "3px solid var(--color-orange)",
            borderRadius: 8,
            padding: "14px 16px",
          }}
        >
          <Clock size={18} style={{ color: "var(--color-orange)", marginTop: 1, flexShrink: 0 }} />
          <div>
            <div className="heading-sm" style={{ fontSize: 14, color: "var(--color-orange-text)" }}>Under review</div>
            <div className="body-sm" style={{ marginTop: 2 }}>
              Your application is being reviewed. This usually takes 1-2 business days.
            </div>
          </div>
        </div>
      )}

      {state === "approved-off" && (
        <div
          className="flex items-center justify-between gap-4"
          style={{
            borderLeft: "3px solid var(--color-brown-soft-2)",
            borderRadius: 8,
            padding: "14px 16px",
          }}
        >
          <div className="flex items-center gap-3">
            <Clock size={18} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }} />
            <div>
              <div className="heading-sm" style={{ fontSize: 14 }}>Store is OFF</div>
              <div className="body-sm" style={{ marginTop: 2 }}>Toggle on to start accepting orders</div>
            </div>
          </div>
          <button
            className={`toggle toggle-lg ${storeToggle ? "is-on toggle-glow" : ""}`}
            role="switch"
            aria-checked={storeToggle}
            aria-label="Toggle store on or off"
            onClick={() => setStoreToggle(!storeToggle)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      )}

      {state === "live" && (
        <>
          <div
            className="flex items-center justify-between gap-4 glow-sage"
            style={{
              borderLeft: "3px solid var(--color-sage)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} style={{ color: "var(--color-sage-deep)", flexShrink: 0 }} />
              <div>
                <div className="heading-sm" style={{ fontSize: 14, color: "var(--color-sage-deep)" }}>Your store is live</div>
                <div className="body-sm" style={{ marginTop: 2 }}>Customers can see your menu and place orders</div>
              </div>
            </div>
            <button
              className="toggle toggle-lg is-on toggle-glow glow-sage"
              role="switch"
              aria-checked={true}
              aria-label="Store is live, toggle to turn off"
              onClick={() => setShowTurnOffConfirm(true)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          {showTurnOffConfirm && (
            <div
              style={{
                borderLeft: "3px solid var(--color-orange)",
                borderRadius: 8,
                padding: "14px 16px",
                background: "rgba(252,157,53,0.05)",
              }}
            >
              <div className="body-sm" style={{ marginBottom: 12, fontWeight: 500 }}>
                Turn off your store? You won&apos;t receive new orders.
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowTurnOffConfirm(false)}>
                  Keep Live
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: "var(--color-red-deep)", color: "#fff", border: "none" }}
                  onClick={() => {
                    setStoreToggle(false);
                    setState("approved-off");
                    setShowTurnOffConfirm(false);
                  }}
                >
                  Turn Off
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {state === "rejected" && (
        <div
          style={{
            borderLeft: "3px solid var(--color-red)",
            borderRadius: 8,
            padding: "14px 16px",
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <XCircle size={18} style={{ color: "var(--color-red-deep)" }} />
            <span className="heading-sm" style={{ fontSize: 14, color: "var(--color-red-deep)" }}>
              Application needs changes
            </span>
          </div>
          <div className="body-sm" style={{ marginBottom: 12 }}>
            Please fix the following items before resubmitting:
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Profile photo does not meet quality requirements",
              "Kitchen description is too short (min 50 characters)",
              "Food safety certification expired",
            ].map((item, i) => (
              <li key={i}>
                {i > 0 && <div className="divider" style={{ margin: "8px 0" }} />}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} style={{ color: "var(--color-red-deep)", marginTop: 3, flexShrink: 0 }} />
                    <span className="body-sm" style={{ color: "var(--color-red-deep)" }}>{item}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="caption"
                    style={{ color: "var(--color-red-deep)", fontWeight: 600, whiteSpace: "nowrap", textDecoration: "underline", textUnderlineOffset: 2 }}
                  >
                    Fix this &rarr;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 16, opacity: 0.5, cursor: "not-allowed" }} disabled>
            Resubmit for Review
          </button>
        </div>
      )}

      {/* ═══ SECTION B: Weekly Hours ═══ */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
          <div className="heading-sm">Weekly Hours</div>
          <button
            onClick={() => {
              const today = new Date();
              const formatted = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              setTimeOff((prev) => [...prev, { id: String(Date.now()), startDate: formatted, endDate: formatted, days: 1, note: "Blocked today", autoPause: true }]);
              toast("Today blocked \u2014 no new orders", "warning");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: "rgba(229,65,65,0.08)",
              color: "var(--color-red-deep)",
              transition: "background var(--t-fast)",
            }}
          >
            <Ban size={14} /> Block Today
          </button>
        </div>

        {DAYS.map((day, di) => {
          const daySchedule = schedule[day];
          return (
            <div key={day}>
              {di > 0 && <div className="divider" style={{ margin: "0 20px" }} />}
              <div style={{ padding: "12px 20px", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "8px 12px" }}>
                {/* Day name + toggle + add button row */}
                <span style={{ width: 80, flexShrink: 0, fontSize: 14, fontWeight: 600, paddingTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  {day}
                  {day === "Monday" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); copyMondayToWeekdays(); toast("Monday hours copied to weekdays"); }}
                      title="Copy Monday to all weekdays"
                      aria-label="Copy Monday hours to all weekdays"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        border: "none",
                        background: "var(--color-cream-sunken)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--color-brown-soft-2)",
                        flexShrink: 0,
                      }}
                    >
                      <Copy size={12} />
                    </button>
                  )}
                </span>

                {/* Toggle */}
                <button
                  className={`toggle ${daySchedule.enabled ? "is-on" : ""}`}
                  role="switch"
                  aria-checked={daySchedule.enabled}
                  aria-label={`${day} availability`}
                  onClick={() => toggleDay(day)}
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  <span className="toggle-thumb" />
                </button>

                {/* Add window button - on same row as day name */}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => addWindow(day)}
                  style={{ fontSize: 12, flexShrink: 0, gap: 4, marginLeft: "auto" }}
                >
                  <Plus size={12} /> Add
                </button>

                {/* Time windows or Closed - wraps to next row on mobile */}
                <div style={{ flex: "1 1 100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, minHeight: daySchedule.enabled ? 32 : 0 }}>
                  {!daySchedule.enabled ? (
                    <span className="body-sm" style={{ color: "var(--color-brown-soft-2)", fontStyle: "italic" }}>Closed</span>
                  ) : (
                    <>
                      {daySchedule.windows.map((w) => (
                        <span
                          key={w.id}
                          className="flex items-center gap-1"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 8,
                            background: "var(--color-cream-deep)",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--color-brown)",
                          }}
                        >
                          <select
                            value={w.start}
                            onChange={(e) => updateWindow(day, w.id, "start", e.target.value)}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--color-brown)",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <span style={{ color: "var(--color-brown-soft-2)" }}>&ndash;</span>
                          <select
                            value={w.end}
                            onChange={(e) => updateWindow(day, w.id, "end", e.target.value)}
                            style={{
                              background: "none",
                              border: "none",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--color-brown)",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeWindow(day, w.id)}
                            aria-label={`Remove time window from ${day}`}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 2,
                              color: "var(--color-brown-soft-2)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-accept */}
      <div className="flex items-center justify-between gap-4" style={{ padding: "4px 0" }}>
        <div>
          <div className="heading-sm" style={{ fontSize: 14 }}>Auto-accept orders</div>
          <div className="body-sm" style={{ marginTop: 2 }}>Incoming orders are automatically confirmed</div>
        </div>
        <button className={`toggle ${autoAccept ? "is-on" : ""}`} role="switch" aria-checked={autoAccept} aria-label="Auto-accept orders" onClick={() => setAutoAccept(!autoAccept)}>
          <span className="toggle-thumb" />
        </button>
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

      {/* ═══ SECTION C: Time Off & Date Overrides ═══ */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Sub-tabs */}
        <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
          <button
            onClick={() => setActiveSubTab("timeoff")}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: activeSubTab === "timeoff" ? 600 : 400,
              color: activeSubTab === "timeoff" ? "var(--color-red)" : "var(--color-brown-soft)",
              borderBottom: activeSubTab === "timeoff" ? "2px solid var(--color-red)" : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
              transition: "color var(--t-fast) var(--ease-spring)",
            }}
          >
            Time off
          </button>
          <button
            onClick={() => setActiveSubTab("overrides")}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: activeSubTab === "overrides" ? 600 : 400,
              color: activeSubTab === "overrides" ? "var(--color-red)" : "var(--color-brown-soft)",
              borderBottom: activeSubTab === "overrides" ? "2px solid var(--color-red)" : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
              transition: "color var(--t-fast) var(--ease-spring)",
            }}
          >
            Date overrides
          </button>
        </div>

        {/* Time off tab */}
        {activeSubTab === "timeoff" && (
          <div style={{ padding: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div>
                <div className="heading-sm" style={{ fontSize: 14 }}>Block dates when you won&apos;t be cooking</div>
              </div>
              <button className="btn btn-dark btn-sm" onClick={() => { setTimeOff((prev) => [...prev, { id: String(Date.now()), startDate: "Jan 10, 2026", endDate: "Jan 12, 2026", days: 3, note: "Personal day", autoPause: true }]); toast("Time off added"); }}>
                <Plus size={14} /> Add time off
              </button>
            </div>

            {timeOff.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 20px" }}>
                <Calendar size={24} style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 12px" }} />
                <p className="body-sm" style={{ color: "var(--color-brown-soft-2)" }}>
                  No time off scheduled. You&apos;re available based on your weekly hours.
                </p>
              </div>
            ) : (
              <div className="section-stack" style={{ gap: 10 }}>
                {timeOff.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "var(--color-cream-deep)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)" }}>
                        {entry.startDate} &rarr; {entry.endDate}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 6 }}>
                        <span className="pill pill-mute" style={{ fontSize: 11 }}>{entry.days} days</span>
                        {entry.autoPause && (
                          <span className="pill pill-sage" style={{ fontSize: 11 }}>Auto-pause on</span>
                        )}
                      </div>
                      {entry.note && (
                        <div className="body-sm" style={{ marginTop: 6, color: "var(--color-brown-soft)" }}>
                          {entry.note}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setTimeOff((prev) => prev.filter((t) => t.id !== entry.id))}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-brown-soft-2)",
                        padding: 6,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date overrides tab */}
        {activeSubTab === "overrides" && (
          <div style={{ padding: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div>
                <div className="heading-sm" style={{ fontSize: 14 }}>Different hours for a specific date</div>
              </div>
              <button className="btn btn-dark btn-sm" onClick={() => { setOverrides((prev) => [...prev, { id: String(Date.now()), date: "January 15, 2026", monthAbbr: "JAN", dayNum: "15", windows: ["10:00 AM \u2013 2:00 PM"], note: "Special hours" }]); toast("Override added"); }}>
                <Plus size={14} /> Add override
              </button>
            </div>

            {overrides.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 20px" }}>
                <Calendar size={24} style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 12px" }} />
                <p className="body-sm" style={{ color: "var(--color-brown-soft-2)" }}>
                  No date overrides. Use this for split shifts or one-off changes.
                </p>
              </div>
            ) : (
              <div className="section-stack" style={{ gap: 10 }}>
                {overrides.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "var(--color-cream-deep)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    {/* Date stamp */}
                    <div
                      style={{
                        width: 48,
                        height: 52,
                        borderRadius: 10,
                        background: "var(--color-cream-sunken)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-brown-soft-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {entry.monthAbbr}
                      </span>
                      <span className="fraunces" style={{ fontSize: 20, lineHeight: 1, color: "var(--color-brown)" }}>
                        {entry.dayNum}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)" }}>
                        {entry.date}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 6 }}>
                        {entry.windows.map((w, wi) => (
                          <span key={wi} className="pill pill-sage" style={{ fontSize: 11 }}>{w}</span>
                        ))}
                      </div>
                      {entry.note && (
                        <div className="body-sm" style={{ marginTop: 6, color: "var(--color-brown-soft)" }}>
                          {entry.note}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => setOverrides((prev) => prev.filter((o) => o.id !== entry.id))}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-brown-soft-2)",
                          padding: 6,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
