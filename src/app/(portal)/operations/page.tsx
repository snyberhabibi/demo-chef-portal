/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

type StoreState = "pending" | "approved-off" | "live" | "rejected";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultSchedule = DAYS.map((day, i) => ({
  day,
  enabled: i < 5,
  open: "10:00 AM",
  close: "6:00 PM",
}));

export default function OperationsPage() {
  const [state, setState] = useState<StoreState>("live");
  const [storeToggle, setStoreToggle] = useState(state === "live");
  const [autoAccept, setAutoAccept] = useState(true);
  const [timezone, setTimezone] = useState("America/Chicago");
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showTurnOffConfirm, setShowTurnOffConfirm] = useState(false);

  const stateButtons: { key: StoreState; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved-off", label: "Approved-OFF" },
    { key: "live", label: "Live" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleCopyToWeekdays = () => {
    const monday = schedule[0];
    const next = schedule.map((row, i) => {
      if (i > 0 && i < 5) {
        return { ...row, enabled: monday.enabled, open: monday.open, close: monday.close };
      }
      return row;
    });
    setSchedule(next);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="content-narrow section-stack">
      {/* State toggle for demo — underline tabs */}
      <div style={{ background: "var(--color-cream-sunken)", padding: "8px 12px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span className="caption" style={{ fontWeight: 600 }}>Demo:</span>
        <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
          {stateButtons.map((s) => (
            <button
              key={s.key}
              className="body-sm"
              style={{
                padding: "10px 16px",
                background: "none",
                border: "none",
                fontWeight: state === s.key ? 600 : 400,
                color: state === s.key ? "var(--color-red)" : "var(--color-brown-soft)",
                borderBottom: state === s.key ? "2px solid var(--color-red)" : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                transition: `color var(--t-fast) var(--ease-spring)`,
              }}
              onClick={() => {
                setState(s.key);
                setStoreToggle(s.key === "live");
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status banners — thin left border + icon + text */}
      {state === "pending" && (
        <div
          className="flex items-start gap-3"
          style={{
            borderLeft: "3px solid var(--color-orange)",
            borderRadius: 8,
            padding: "14px 16px",
            background: "transparent",
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

      {/* Auto-accept */}
      <div className="flex items-center justify-between gap-4" style={{ padding: "4px 0" }}>
        <div>
          <div className="heading-sm" style={{ fontSize: 14 }}>Auto-accept orders</div>
          <div className="body-sm" style={{ marginTop: 2 }}>Incoming orders are automatically confirmed</div>
        </div>
        <button className={`toggle ${autoAccept ? "is-on" : ""}`} onClick={() => setAutoAccept(!autoAccept)}>
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

      {/* Weekly schedule */}
      <div className="card" style={{ padding: 0 }}>
        <div className="flex items-center justify-between" style={{ padding: "16px 24px 12px" }}>
          <div>
            <div className="heading-sm">Weekly Schedule</div>
            <div className="body-sm" style={{ marginTop: 2 }}>Set your available hours for each day</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleCopyToWeekdays}>
            {copyFeedback ? (
              <><Check size={14} style={{ color: "var(--color-sage)" }} /> Copied</>
            ) : (
              <><Copy size={14} /> Copy to all weekdays</>
            )}
          </button>
        </div>

        {schedule.map((row, i) => (
          <div key={row.day}>
            <div className="divider" />
            <div
              className="flex items-center gap-3"
              style={{ padding: "12px 24px", cursor: "pointer" }}
              onClick={() => setExpandedDay(expandedDay === i ? null : i)}
            >
              <button
                className={`toggle ${row.enabled ? "is-on" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = [...schedule];
                  next[i] = { ...next[i], enabled: !next[i].enabled };
                  setSchedule(next);
                }}
              >
                <span className="toggle-thumb" />
              </button>
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
              {expandedDay === i ? (
                <ChevronUp size={16} style={{ color: "var(--color-brown-soft-2)", transition: `transform var(--t-fast) var(--ease-spring)` }} />
              ) : (
                <ChevronDown size={16} style={{ color: "var(--color-brown-soft-2)", transition: `transform var(--t-fast) var(--ease-spring)` }} />
              )}
            </div>

            {expandedDay === i && row.enabled && (
              <div className="flex items-center gap-3" style={{ padding: "0 24px 16px 68px" }}>
                <div>
                  <label className="field-label" style={{ fontSize: 12 }}>Open</label>
                  <select
                    className="select"
                    style={{ width: 130 }}
                    value={row.open}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[i] = { ...next[i], open: e.target.value };
                      setSchedule(next);
                    }}
                  >
                    {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <span style={{ marginTop: 20, color: "var(--color-brown-soft-2)" }}>&ndash;</span>
                <div>
                  <label className="field-label" style={{ fontSize: 12 }}>Close</label>
                  <select
                    className="select"
                    style={{ width: 130 }}
                    value={row.close}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[i] = { ...next[i], close: e.target.value };
                      setSchedule(next);
                    }}
                  >
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
  );
}
