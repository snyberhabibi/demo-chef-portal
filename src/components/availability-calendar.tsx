/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";

/**
 * Calendly-inspired weekly availability calendar.
 * Chefs click/toggle time slots to set when they're available for orders.
 * Visual grid: 7 columns (days) × time slots (rows).
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 30-minute slots from 6 AM to 10 PM
const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 21; h++) {
  const hour = h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "PM" : "AM";
  TIME_SLOTS.push(`${hour}:00 ${ampm}`);
  TIME_SLOTS.push(`${hour}:30 ${ampm}`);
}

// Default availability: Mon-Fri 10 AM - 6 PM
function getDefaultSlots(): Record<string, Set<number>> {
  const slots: Record<string, Set<number>> = {};
  DAYS.forEach((day, di) => {
    slots[day] = new Set();
    if (di < 5) {
      // Mon-Fri: 10 AM (index 8) to 6 PM (index 24)
      for (let i = 8; i < 24; i++) slots[day].add(i);
    }
  });
  return slots;
}

export function AvailabilityCalendar() {
  const [slots, setSlots] = useState(getDefaultSlots);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const toggleSlot = (day: string, slotIdx: number) => {
    setSlots((prev) => {
      const next = { ...prev };
      next[day] = new Set(prev[day]);
      if (next[day].has(slotIdx)) {
        next[day].delete(slotIdx);
      } else {
        next[day].add(slotIdx);
      }
      return next;
    });
  };

  const handleMouseDown = (day: string, slotIdx: number) => {
    setIsDragging(true);
    const isActive = slots[day].has(slotIdx);
    setDragMode(isActive ? "remove" : "add");
    toggleSlot(day, slotIdx);
  };

  const handleMouseEnter = (day: string, slotIdx: number) => {
    setHoveredSlot(`${day}-${slotIdx}`);
    if (isDragging) {
      setSlots((prev) => {
        const next = { ...prev };
        next[day] = new Set(prev[day]);
        if (dragMode === "add") next[day].add(slotIdx);
        else next[day].delete(slotIdx);
        return next;
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const copyToAll = () => {
    const monSlots = new Set(slots["Mon"]);
    setSlots((prev) => {
      const next = { ...prev };
      DAYS.forEach((day) => { next[day] = new Set(monSlots); });
      return next;
    });
  };

  const clearDay = (day: string) => {
    setSlots((prev) => ({ ...prev, [day]: new Set() }));
  };

  const getDayRange = (day: string): string => {
    const s = slots[day];
    if (s.size === 0) return "Closed";
    const sorted = Array.from(s).sort((a, b) => a - b);
    const start = TIME_SLOTS[sorted[0]];
    const end = TIME_SLOTS[Math.min(sorted[sorted.length - 1] + 1, TIME_SLOTS.length - 1)];
    return `${start} – ${end}`;
  };

  // Show only major time labels (every 2 hours)
  const majorSlots = TIME_SLOTS.filter((_, i) => i % 4 === 0);

  return (
    <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ userSelect: "none" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="heading-sm">Weekly Availability</div>
          <div className="caption" style={{ marginTop: 2 }}>Click and drag to set your hours. Customers can only order during green slots.</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={copyToAll} style={{ gap: 6 }}>
          <Copy size={14} /> Copy Mon to all
        </button>
      </div>

      {/* Day summaries */}
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 2, marginBottom: 12 }}>
        <div />
        {DAYS.map((day, di) => (
          <div key={day} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-brown)", marginBottom: 2 }}>{day}</div>
            <div className="caption" style={{ fontSize: 10 }}>{getDayRange(day)}</div>
            {slots[day].size > 0 && (
              <button
                onClick={() => clearDay(day)}
                style={{ fontSize: 10, color: "var(--color-brown-soft-2)", background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 1fr)",
          gap: 1,
          background: "rgba(51,31,46,0.04)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(51,31,46,0.06)",
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        {/* Time labels + slots */}
        {TIME_SLOTS.map((time, si) => (
          <div key={`row-${si}`} style={{ display: "contents" }}>
            {/* Time label */}
            <div
              style={{
                fontSize: 10,
                color: "var(--color-brown-soft-2)",
                padding: "0 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                background: "var(--color-cream)",
                height: 20,
                borderBottom: si % 4 === 3 ? "1px solid rgba(51,31,46,0.08)" : undefined,
              }}
            >
              {si % 2 === 0 ? time.replace(":00 ", " ") : ""}
            </div>

            {/* Day cells */}
            {DAYS.map((day) => {
              const isActive = slots[day].has(si);
              const isHovered = hoveredSlot === `${day}-${si}`;
              return (
                <div
                  key={`${day}-${si}`}
                  onMouseDown={() => handleMouseDown(day, si)}
                  onMouseEnter={() => handleMouseEnter(day, si)}
                  style={{
                    height: 20,
                    background: isActive
                      ? "var(--color-sage)"
                      : isHovered
                      ? "rgba(121,173,99,0.15)"
                      : "#fff",
                    cursor: "pointer",
                    transition: "background 0.08s",
                    borderBottom: si % 4 === 3 ? "1px solid rgba(51,31,46,0.06)" : undefined,
                    borderRight: "1px solid rgba(51,31,46,0.03)",
                    opacity: isActive ? 0.85 : 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--color-sage)" }} />
          <span className="caption">Available</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#fff", border: "1px solid rgba(51,31,46,0.1)" }} />
          <span className="caption">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
