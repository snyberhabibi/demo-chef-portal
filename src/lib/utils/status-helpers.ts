/* ================================================================== */
/*  Shared Status Helpers — Single source of truth for status colors  */
/*  Used by: dashboard, orders, flash-sales, menu                    */
/* ================================================================== */

import type { OrderStatus, DishStatus, SaleStatus } from "@/lib/mock-data";

/**
 * Returns the CSS color for an order-status dot.
 */
export function statusDotColor(s: OrderStatus): string {
  switch (s) {
    case "paid":
    case "confirmed":
      return "var(--color-orange)";
    case "preparing":
      return "#e8a832";
    case "ready":
    case "readyForPickup":
    case "delivered":
    case "pickedUp":
    case "outForDelivery":
      return "var(--color-sage)";
    case "cancelled":
    case "rejected":
      return "var(--color-red)";
    case "rescheduling":
      return "var(--color-orange)";
    default:
      return "var(--color-brown-soft-2)";
  }
}

/**
 * Returns badge info (dot, background, text color, label) for a dish/bundle status.
 */
export function dishStatusBadge(status: DishStatus): {
  dot: string;
  bg: string;
  color: string;
  label: string;
} {
  switch (status) {
    case "published":
      return {
        dot: "var(--color-sage)",
        bg: "rgba(121,173,99,0.15)",
        color: "var(--color-sage-deep)",
        label: "Published",
      };
    case "draft":
      return {
        dot: "var(--color-orange)",
        bg: "rgba(252,157,53,0.15)",
        color: "var(--color-orange-text)",
        label: "Draft",
      };
    case "archived":
      return {
        dot: "var(--color-brown-soft-2)",
        bg: "rgba(138,120,132,0.15)",
        color: "var(--color-brown-soft)",
        label: "Archived",
      };
  }
}

/**
 * Returns the CSS color for a flash-sale status dot.
 */
export function saleStatusDotColor(s: SaleStatus): string {
  switch (s) {
    case "live":
      return "var(--color-sage)";
    case "upcoming":
      return "var(--color-orange)";
    case "draft":
    case "past":
      return "var(--color-brown-soft-2)";
  }
}
