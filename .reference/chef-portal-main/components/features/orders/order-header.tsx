"use client";

import type { Order } from "@/types/orders.types";

interface OrderHeaderProps {
  order: Order;
}

function formatReadableDate(dateString: string): { date: string; time: string; relative?: string } {
  const d = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  let relative: string | undefined;
  if (diffDays === 0) relative = "Today";
  else if (diffDays === 1) relative = "Tomorrow";
  else if (diffDays === -1) relative = "Yesterday";
  else if (diffDays > 1 && diffDays <= 6) {
    relative = d.toLocaleDateString("en-US", { weekday: "long" });
  }

  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const time = `${h}:${m} ${ampm}`;

  return { date, time, relative };
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const isShipping = order.fulfillmentMethod === "shipping";
  const isPickup = order.fulfillmentMethod === "chefPickup" || order.fulfillmentMethod === "yallaSpot";
  const readyByDateString = isShipping
    ? order.deliveryDate
    : order.advertisedPickupEta || order.deliveryDate;

  const created = formatReadableDate(order.createdAt);
  const readyBy = readyByDateString ? formatReadableDate(readyByDateString) : null;

  return (
    <div data-testid="order-header">
      <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
        Order Dates
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-[var(--p-space-400)] gap-y-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-200)] p-[var(--p-space-300)]">
        {/* Ready by / Ship by */}
        {readyBy && (
          <div data-testid="order-delivery-date">
            <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
              {isShipping ? "Ship By" : isPickup ? "Pickup Time" : "Have It Ready By"}
            </p>
            <span className="inline-flex items-center bg-[rgba(255,230,0,1)] text-[rgba(51,46,0,1)] rounded-[var(--p-border-radius-150)] px-[var(--p-space-200)] py-[var(--p-space-050)] text-[0.75rem] font-[var(--p-font-weight-bold)]">
              {readyBy.date}{!isShipping && <> · {readyBy.time}</>}
            </span>
          </div>
        )}

        {/* Order placed */}
        <div data-testid="order-created-at">
          <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
            Order Placed
          </p>
          <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
            {created.relative || created.date} · {created.time}
          </p>
        </div>

        {/* Tracking number (shipping only) */}
        {isShipping && order.shippingLabel?.trackingNumber && (
          <div>
            <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
              Tracking
            </p>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] font-[var(--p-font-family-mono)] text-[var(--p-color-text)]">
              {order.shippingLabel.trackingNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
