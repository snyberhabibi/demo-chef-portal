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
    <div className="section-stack" style={{ maxWidth: 640 }}>
      {/* State toggle for demo */}
      <div className="flex flex-wrap gap-2 mb-2">
        {stateButtons.map((s) => (
          <button
            key={s.key}
            className={`btn btn-sm ${state === s.key ? "btn-red" : "btn-ghost"}`}
            style={{ minHeight: 44, transition: "all 0.15s ease" }}
            onClick={() => {
              setState(s.key);
              setStoreToggle(s.key === "live");
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Status banner */}
      {state === "pending" && (
        <div
          className="flex items-start gap-3"
          style={{
            background: "var(--color-orange-soft)",
            borderRadius: 12,
            padding: 16,
            transition: "all 0.2s ease",
          }}
        >
          <Clock size={20} style={{ color: "var(--color-orange-text)", marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: "var(--color-orange-text)" }}>Under review</div>
            <div style={{ fontSize: 14, color: "var(--color-orange-text)", opacity: 0.85, marginTop: 2 }}>
              Your application is being reviewed by our team. This usually takes 1-2 business days.
            </div>
          </div>
        </div>
      )}

      {state === "approved-off" && (
        <div className="card flex items-center justify-between gap-4" style={{ transition: "box-shadow 0.2s ease" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--color-cream-sunken)",
              }}
            >
              <Clock size={20} style={{ color: "var(--color-brown-soft-2)" }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Store is OFF</div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                Toggle on to start accepting orders
              </div>
            </div>
          </div>
          <button
            className={`toggle toggle-lg ${storeToggle ? "is-on toggle-glow" : ""}`}
            onClick={() => setStoreToggle(!storeToggle)}
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      )}

      {state === "live" && (
        <div
          className="flex items-center justify-between gap-4"
          style={{
            background: "var(--color-sage-soft)",
            borderRadius: 12,
            padding: 16,
            transition: "all 0.2s ease",
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle size={20} style={{ color: "var(--color-sage-deep)" }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--color-sage-deep)" }}>Your store is live</div>
              <div style={{ fontSize: 13, color: "var(--color-sage-deep)", opacity: 0.85 }}>
                Customers can see your menu and place orders
              </div>
            </div>
          </div>
          <button
            className="toggle toggle-lg is-on toggle-glow"
            onClick={() => {
              setStoreToggle(false);
              setState("approved-off");
            }}
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      )}

      {state === "rejected" && (
        <div
          style={{
            background: "var(--color-red-soft)",
            borderRadius: 12,
            padding: 16,
            transition: "all 0.2s ease",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={20} style={{ color: "var(--color-red-deep)" }} />
            <span style={{ fontWeight: 600, color: "var(--color-red-deep)" }}>
              Application needs changes
            </span>
          </div>
          <div style={{ fontSize: 14, color: "var(--color-red-deep)", marginBottom: 12 }}>
            Please fix the following items before resubmitting:
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Profile photo does not meet quality requirements",
              "Kitchen description is too short (min 50 characters)",
              "Food safety certification expired",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3"
                style={{
                  padding: "10px 0",
                  borderTop: i > 0 ? "1px solid rgba(201,50,50,0.15)" : undefined,
                }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} style={{ color: "var(--color-red-deep)", marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--color-red-deep)" }}>{item}</span>
                </div>
                <Link
                  href="/profile"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-red-deep)",
                    whiteSpace: "nowrap",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Fix this &rarr;
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-ghost btn-block"
            style={{ marginTop: 16, opacity: 0.5, cursor: "not-allowed", minHeight: 44 }}
            disabled
          >
            Resubmit for Review
          </button>
        </div>
      )}

      {/* Auto-accept */}
      <div className="card flex items-center justify-between gap-4" style={{ transition: "box-shadow 0.2s ease" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Auto-accept orders</div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
            Incoming orders are automatically confirmed
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

      {/* Timezone */}
      <div className="card" style={{ transition: "box-shadow 0.2s ease" }}>
        <label className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
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

      {/* Weekly schedule */}
      <div className="card" style={{ padding: 0, transition: "box-shadow 0.2s ease" }}>
        <div className="flex items-center justify-between" style={{ padding: "16px 20px 12px" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Weekly Schedule</div>
            <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 2 }}>
              Set your available hours for each day
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ minHeight: 44, transition: "all 0.15s ease" }}
            onClick={handleCopyToWeekdays}
          >
            {copyFeedback ? (
              <>
                <Check size={14} style={{ color: "var(--color-sage)" }} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy to all weekdays
              </>
            )}
          </button>
        </div>
        {schedule.map((row, i) => (
          <div
            key={row.day}
            style={{
              borderTop: "1px solid var(--color-cream-sunken)",
              transition: "background 0.15s ease",
            }}
          >
            <div
              className="flex items-center gap-3"
              style={{ padding: "12px 20px", cursor: "pointer", minHeight: 52 }}
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
                style={{ minWidth: 44, minHeight: 28 }}
              >
                <span className="toggle-thumb" />
              </button>
              <span
                style={{
                  flex: 1,
                  fontWeight: 500,
                  color: row.enabled ? "var(--color-brown)" : "var(--color-brown-soft-2)",
                }}
              >
                {row.day}
              </span>
              {row.enabled && (
                <span className="tnum" style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                  {row.open} &ndash; {row.close}
                </span>
              )}
              {!row.enabled && (
                <span style={{ fontSize: 13, color: "var(--color-brown-soft-2)" }}>Closed</span>
              )}
              {expandedDay === i ? (
                <ChevronUp size={16} style={{ color: "var(--color-brown-soft-2)", transition: "transform 0.2s ease" }} />
              ) : (
                <ChevronDown size={16} style={{ color: "var(--color-brown-soft-2)", transition: "transform 0.2s ease" }} />
              )}
            </div>

            {expandedDay === i && row.enabled && (
              <div
                className="flex items-center gap-3"
                style={{
                  padding: "0 20px 16px 68px",
                }}
              >
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>
                    Open
                  </label>
                  <select
                    className="select"
                    style={{ width: 130, minHeight: 44 }}
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
                  <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>
                    Close
                  </label>
                  <select
                    className="select"
                    style={{ width: 130, minHeight: 44 }}
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
