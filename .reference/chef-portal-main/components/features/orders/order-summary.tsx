"use client";

import { Badge } from "@/components/polaris";
import type { Order } from "@/types/orders.types";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const subtotal = order.pricing?.subtotal ?? order.items.reduce((sum, item) => sum + item.subtotal, 0);
  const payout = order.pricing?.chefPayout ?? 0;
  const orderTotalInDollars = order.total ?? subtotal;
  const orderTotalInCents = Math.round(orderTotalInDollars * 100);

  const isFullyRefunded =
    order.refund &&
    order.refund.refundStatus === "refunded" &&
    order.refund.refundAmount !== null &&
    order.refund.refundAmount !== undefined &&
    orderTotalInCents > 0 &&
    Math.abs(order.refund.refundAmount - orderTotalInCents) < 1;

  const isPartiallyRefunded =
    order.refund &&
    order.refund.refundStatus === "refunded" &&
    order.refund.refundAmount !== null &&
    order.refund.refundAmount !== undefined &&
    orderTotalInCents > 0 &&
    !isFullyRefunded &&
    order.refund.refundAmount > 0;

  return (
    <div data-testid="order-summary">
      <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
        Order Summary
      </h3>

      <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-400)]">
        {/* Chef payout */}
        {payout > 0 && (
          <div className="mb-[var(--p-space-300)]">
            <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
              Your Payout
            </p>
            <span className="relative inline-block text-[1.5rem] leading-[2rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] px-[var(--p-space-400)] py-[var(--p-space-200)]">
              ${payout.toFixed(2)}
              <svg
                className="absolute pointer-events-none overflow-visible"
                style={{ top: "-30%", left: "-12%", width: "124%", height: "160%", transform: "rotate(-3deg)" }}
                viewBox="0 0 260 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Single hand-drawn path with filled shape that tapers — thin start, thick end */}
                <path
                  d={[
                    // Thin wispy start at top-right — pen just touching
                    "M 192 18",
                    "Q 208 14, 220 17",
                    "Q 238 22, 244 35",
                    // Right side — curving down, path starts widening
                    "Q 250 50, 238 63",
                    "Q 228 72, 200 76",
                    // Bottom — full sweep, widest part
                    "Q 165 82, 125 83",
                    "Q 85 82, 50 76",
                    // Left side — still thick
                    "Q 18 70, 6 55",
                    "Q -4 40, 4 26",
                    // Top-left — curving back up
                    "Q 12 12, 40 8",
                    "Q 70 3, 110 4",
                    // Top — tapering toward close
                    "Q 148 5, 180 10",
                    "Q 190 13, 194 16",
                  ].join(" ")}
                  stroke="rgba(4,123,93,0.45)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Thick filled shape that follows the bottom-left arc only */}
                <path
                  d={[
                    // Outer edge of thick stroke
                    "M 200 79",
                    "Q 160 86, 120 87",
                    "Q 75 86, 42 80",
                    "Q 12 73, -1 58",
                    "Q -8 42, 0 26",
                    "Q 8 12, 35 6",
                    "Q 60 1, 100 1",
                    "Q 140 2, 175 8",
                    // Inner edge — coming back
                    "Q 145 7, 108 7",
                    "Q 68 6, 42 11",
                    "Q 16 17, 8 30",
                    "Q 2 42, 8 54",
                    "Q 18 67, 48 73",
                    "Q 80 79, 125 80",
                    "Q 165 80, 200 76",
                    "Z",
                  ].join(" ")}
                  fill="rgba(4,123,93,0.12)"
                  stroke="none"
                />
                {/* Top wispy thin stroke for the light start */}
                <path
                  d="M 175 10 Q 185 9, 194 12 Q 210 15, 222 20 Q 240 28, 244 40"
                  stroke="rgba(4,123,93,0.2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </div>
        )}

        {/* Subtotal — secondary */}
        <div>
          <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)]">
            Order Subtotal
          </p>
          <p className="text-[1rem] leading-[1.5rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)]" data-testid="order-total">
            ${subtotal.toFixed(2)}
          </p>
        </div>

        {/* Refund status */}
        {order.refund && order.refund.refundStatus === "refunded" && (
          <div className="mt-[var(--p-space-300)]">
            <Badge tone={isFullyRefunded ? "critical" : "warning"} size="sm">
              {isFullyRefunded ? "Fully Refunded" : isPartiallyRefunded ? "Partially Refunded" : "Refunded"}
            </Badge>
            {order.refund.refundDate && (
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                Refunded on {new Date(order.refund.refundDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
