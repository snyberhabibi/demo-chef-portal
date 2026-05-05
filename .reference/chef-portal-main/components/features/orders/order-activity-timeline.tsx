"use client";

import { Timeline } from "@/components/polaris";
import type { TimelineItem } from "@/components/polaris";
import type { Order } from "@/types/orders.types";

interface OrderActivityTimelineProps {
  order: Order;
}

export function OrderActivityTimeline({ order }: OrderActivityTimelineProps) {
  const formatStatusLabel = (status: string): string => {
    const camelCaseMatch = status.match(/^[a-z]+([A-Z][a-z]+)*$/);
    if (camelCaseMatch) {
      return status.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTimestamp = (changedAt: string, changedBy?: string | null): string => {
    const d = new Date(changedAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

    let dateLabel: string;
    if (diffDays === 0) dateLabel = "Today";
    else if (diffDays === 1) dateLabel = "Yesterday";
    else if (diffDays <= 6) dateLabel = d.toLocaleDateString("en-US", { weekday: "long" });
    else dateLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const time = `${h}:${m} ${ampm}`;

    const by = changedBy || "System";
    return `${dateLabel} at ${time} · ${by}`;
  };

  const getTimelineItems = (): TimelineItem[] => {
    if (!order.statusHistory || order.statusHistory.length === 0) return [];

    const sortedHistory = [...order.statusHistory].sort(
      (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );

    const currentStatusLower = order.status.toLowerCase();
    const activeHistoryIndex = sortedHistory.findIndex(
      (h) => h.status.toLowerCase() === currentStatusLower && h.status.toLowerCase() !== "pending"
    );

    return sortedHistory.map((history, index) => {
      const isActive = index === activeHistoryIndex && activeHistoryIndex !== -1;

      const reason = history.reason && history.status.toLowerCase() !== "pending" ? history.reason : null;
      const timestamp = formatTimestamp(history.changedAt, history.changedBy?.name);
      const description = reason ? `${timestamp}\n${reason}` : timestamp;

      return {
        id: `${history.status}-${index}`,
        title: formatStatusLabel(history.status),
        description,
        status: isActive ? "active" as const : "completed" as const,
      };
    });
  };

  const timelineItems = getTimelineItems();

  return (
    <div data-testid="order-activity-timeline">
      <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
        Order activity
      </h3>
      <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-400)]">
        {timelineItems.length > 0 ? (
          <Timeline items={timelineItems} reversed={false} />
        ) : (
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">No activity history available</p>
        )}
      </div>
    </div>
  );
}
