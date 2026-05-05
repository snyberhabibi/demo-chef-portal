"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { StatusDot } from "./status-dot";
import Image from "next/image";
import {
  PackageFilledIcon,
  DeliveryFilledIcon,
  StoreFilledIcon,
  LocationFilledIcon,
  CartFilledIcon,
} from "@shopify/polaris-icons";
import type { Order, OrderStatus, FulfillmentMethod, OrderItem } from "@/types/orders.types";
import type { PortionSize } from "@/types/dishes.types";
import type { BundlePortionSize } from "@/types/bundles.types";
import { HumanReadablePortionSizeDisplay, getBundlePortionSizeLabel } from "@/lib/dish-utils";

// ── Status Badge ──────────────────────────────────────────────────────

const statusConfig: Record<OrderStatus, { label: string; tone: "success" | "info" | "warning" | "critical" | "neutral"; pulse?: boolean }> = {
  paid: { label: "Paid", tone: "success" },
  confirmed: { label: "Confirmed", tone: "info" },
  preparing: { label: "Preparing", tone: "warning", pulse: true },
  ready: { label: "Ready", tone: "success" },
  readyForPickup: { label: "Ready for Pickup", tone: "success" },
  outForDelivery: { label: "Out for Delivery", tone: "info", pulse: true },
  delivered: { label: "Delivered", tone: "success" },
  pickedUp: { label: "Picked Up", tone: "success" },
  rescheduling: { label: "Rescheduling", tone: "warning", pulse: true },
  cancelled: { label: "Cancelled", tone: "critical" },
  rejected: { label: "Rejected", tone: "critical" },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = statusConfig[status] || { label: status || "Unknown", tone: "neutral" as const };
  return (
    <span data-testid="order-status-badge" data-status={status} className="inline-flex items-center gap-[var(--p-space-150)] bg-[var(--p-color-bg-surface)] px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] border border-[var(--p-color-border-secondary)]">
      <StatusDot tone={c.tone} pulse={c.pulse} size="sm" />
      <span className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">{c.label}</span>
    </span>
  );
}

// ── Fulfillment Badge ─────────────────────────────────────────────────

const fulfillmentConfig: Record<string, { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  shipping: { label: "Shipping", icon: PackageFilledIcon },
  delivery: { label: "Delivery", icon: DeliveryFilledIcon },
  chefPickup: { label: "Chef Pickup", icon: StoreFilledIcon },
  yallaSpot: { label: "Yalla Spot", icon: LocationFilledIcon },
};

const fulfillmentColors: Record<string, { bg: string; text: string; iconColor: string }> = {
  shipping: { bg: "bg-[rgba(243,241,255,1)]", text: "text-[rgba(87,0,209,1)]", iconColor: "fill-[rgba(87,0,209,1)]" },
  delivery: { bg: "bg-[rgba(234,244,255,1)]", text: "text-[rgba(0,58,90,1)]", iconColor: "fill-[rgba(0,58,90,1)]" },
  chefPickup: { bg: "bg-[rgba(255,241,227,1)]", text: "text-[rgba(94,66,0,1)]", iconColor: "fill-[rgba(94,66,0,1)]" },
  yallaSpot: { bg: "bg-[rgba(205,254,212,1)]", text: "text-[rgba(1,75,64,1)]", iconColor: "fill-[rgba(1,75,64,1)]" },
};

function OrderFulfillmentBadge({ method }: { method?: FulfillmentMethod }) {
  if (!method) return null;
  const config = fulfillmentConfig[method] || fulfillmentConfig.delivery;
  const colors = fulfillmentColors[method] || fulfillmentColors.delivery;
  const Icon = config.icon;
  return (
    <span className={cn(
      "inline-flex items-center gap-[var(--p-space-100)]",
      "px-[var(--p-space-200)] py-[var(--p-space-050)]",
      "rounded-[var(--p-border-radius-full)]",
      "text-[0.6875rem] font-[var(--p-font-weight-semibold)]",
      colors.bg, colors.text,
    )}>
      <Icon className={cn("size-[0.875rem]", colors.iconColor)} />
      {config.label}
    </span>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────

function formatDateParts(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  let d: string;
  if (diffDays === 0) d = "Today";
  else if (diffDays === 1) d = "Tomorrow";
  else if (diffDays === -1) d = "Yesterday";
  else d = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return { date: d, time: `${h}:${m} ${ampm}` };
}

function formatCustomerName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length <= 1) return fullName;
  return `${nameParts[0]} ${nameParts[nameParts.length - 1][0]?.toUpperCase() || ""}.`;
}

function formatPortionSize(
  portionSize: PortionSize | BundlePortionSize | string | null,
  isBundle: boolean
): string {
  if (!portionSize) return "";
  if (typeof portionSize === "string") return portionSize;
  // Check for bundle portion size (has regularPrice) regardless of isBundle flag
  if ("regularPrice" in portionSize) return getBundlePortionSizeLabel(portionSize as BundlePortionSize);
  if ("price" in portionSize) return HumanReadablePortionSizeDisplay(portionSize as PortionSize);
  // Fallback: try to extract label + size manually
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ps = portionSize as any;
  if (ps.portionLabel && ps.size) {
    const label = typeof ps.portionLabel === "string" ? ps.portionLabel : ps.portionLabel?.label || "";
    return label ? `${label} - ${ps.size}` : String(ps.size);
  }
  return "";
}

function formatSpiceLevel(level: string): string {
  if (level === "extraHot") return "Extra Hot";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ── Order Card ────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  className?: string;
  "data-testid"?: string;
}

function OrderCard({ order, onClick, className, "data-testid": dataTestId }: OrderCardProps) {
  const items = order.items || [];
  const subtotal = order.pricing?.subtotal ?? items.reduce((sum, item) => sum + item.subtotal, 0);
  const payout = order?.pricing?.chefPayout ?? 0;
  const isShipping = order.fulfillmentMethod === "shipping";
  const isDelivery = order.fulfillmentMethod === "delivery";
  const isPickup = order.fulfillmentMethod === "chefPickup" || order.fulfillmentMethod === "yallaSpot";
  const readyByDate = isDelivery
    ? (order.advertisedPickupEta || order.deliveryDate)
    : order.deliveryDate;

  const placed = formatDateParts(order.createdAt);
  const showReadyBy = readyByDate && order.status !== "delivered" && order.status !== "pickedUp";
  const readyBy = showReadyBy ? formatDateParts(readyByDate) : null;

  return (
    <div
      className={cn(
        "rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)]",
        "cursor-pointer hover:bg-[var(--p-color-bg-surface-hover)] transition-colors overflow-hidden",
        "p-[var(--p-space-300)]",
        className
      )}
      data-testid={dataTestId}
      onClick={() => onClick?.(order)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[var(--p-space-300)]">
        <div>
          <div className="flex items-center gap-[var(--p-space-200)] flex-wrap">
            <span className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] font-[var(--p-font-family-mono)]">
              #{order.orderNumber}
            </span>
            <OrderFulfillmentBadge method={order.fulfillmentMethod} />
          </div>
          <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            {formatCustomerName(order.customerName)} · {placed.date} · {placed.time}
          </p>
        </div>
        <div className="text-right shrink-0">
          <OrderStatusBadge status={order.status} />
          <p className="text-[0.875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] mt-[var(--p-space-100)]">
            ${subtotal.toFixed(2)}
          </p>
          {payout > 0 && (
            <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
              ${payout.toFixed(2)} payout
            </p>
          )}
        </div>
      </div>

      {/* Ready by */}
      {readyBy && (
        <div className="mt-[var(--p-space-150)]">
          <span className="inline-flex items-center gap-[var(--p-space-100)] bg-[rgba(255,230,0,1)] text-[rgba(51,46,0,1)] px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-150)] text-[0.6875rem] font-[var(--p-font-weight-semibold)]">
            {isShipping ? "Ship by" : isPickup ? "Pickup" : "Ready by"} {readyBy.date} · {readyBy.time}
          </span>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <div className="mt-[var(--p-space-300)] space-y-[var(--p-space-200)]">
          {items.map((item, index) => {
            const isBundle = item.type === "bundle";
            const portionLabel = item.portionSize ? formatPortionSize(item.portionSize, isBundle) : null;
            const spiceLevel = item.spiceLevel;
            const itemSubtotal = (item.price ?? 0) * item.quantity;

            const modifierGroups: Array<{
              groupName: string;
              modifiers: Array<{ name: string; price: number; isRemoval?: boolean }>;
            }> = [];
            if (item.customizations && item.customizations.length > 0) {
              item.customizations.forEach((custom) => {
                const groupModifiers = custom.modifiers.map((m) => ({
                  name: m.name,
                  price: m.price,
                  isRemoval: m.name.toLowerCase().includes("no ") || m.name.toLowerCase().startsWith("remove"),
                }));
                if (groupModifiers.length > 0) {
                  modifierGroups.push({ groupName: custom.groupName, modifiers: groupModifiers });
                }
              });
            }

            const hasDetails = portionLabel || (spiceLevel && spiceLevel !== "none") || modifierGroups.length > 0;

            return (
              <div
                key={index}
                className="bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-200)]"
              >
                {/* Item row: qty + image + name + price */}
                <div className="flex items-center gap-[var(--p-space-200)]">
                  <span className="shrink-0 inline-flex items-center justify-center bg-[rgba(255,230,0,1)] text-[rgba(51,46,0,1)] rounded-[var(--p-border-radius-100)] size-7 text-[0.75rem] font-[var(--p-font-weight-bold)]">
                    {item.quantity}×
                  </span>

                  {item.image ? (
                    <div className="relative size-8 rounded-[var(--p-border-radius-100)] overflow-hidden shrink-0 border border-[var(--p-color-border-secondary)]">
                      <Image src={item.image} alt={item.dishName} fill className="object-cover" sizes="32px" />
                    </div>
                  ) : (
                    <div className="relative size-8 bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-100)] flex items-center justify-center shrink-0 border border-[var(--p-color-border-secondary)]">
                      {isBundle ? (
                        <PackageFilledIcon className="size-3.5 fill-[var(--p-color-icon-secondary)]" />
                      ) : (
                        <CartFilledIcon className="size-3.5 fill-[var(--p-color-icon-secondary)]" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[var(--p-space-100)]">
                      <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                        {item.dishName}
                      </p>
                      {isBundle && <Badge tone="info" size="sm">Bundle</Badge>}
                    </div>
                  </div>

                </div>

                {/* Details grid strip */}
                {hasDetails && (
                  <div className="mt-[var(--p-space-150)]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-[var(--p-space-300)] gap-y-[var(--p-space-200)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-200)]">
                      {portionLabel && (
                        <div>
                          <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                            Portion
                          </p>
                          <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                            {portionLabel}
                          </p>
                        </div>
                      )}
                      {spiceLevel && spiceLevel !== "none" && (
                        <div>
                          <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                            Spice
                          </p>
                          <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                            {formatSpiceLevel(spiceLevel)}
                          </p>
                        </div>
                      )}
                      {modifierGroups.map((group, gIdx) => (
                        <div key={gIdx}>
                          <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                            {group.groupName}
                          </p>
                          <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                            {group.modifiers.map((m, mIdx) => (
                              <span key={mIdx} className={m.isRemoval ? "text-[var(--p-color-text-critical)] line-through" : ""}>
                                {m.name}
                                {m.price > 0 && <span className="text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-regular)] text-[0.625rem]"> +${m.price.toFixed(2)}</span>}
                                {mIdx < group.modifiers.length - 1 && <span className="text-[var(--p-color-text-secondary)]">, </span>}
                              </span>
                            ))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special instructions */}
                {item.specialInstructions && (
                  <div className="mt-[var(--p-space-150)]">
                    <div className="bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-200)]">
                      <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                        Note
                      </p>
                      <p className="text-[0.6875rem] text-[var(--p-color-text)] line-clamp-2">
                        {item.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bundle sub-items */}
                {isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                  <div className="mt-[var(--p-space-150)]">
                    <div className="bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-200)] space-y-[var(--p-space-025)]">
                      <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">
                        Includes
                      </p>
                      {item.bundleItems.map((bi) => (
                        <p key={bi.id} className="text-[0.6875rem] text-[var(--p-color-text)]">
                          <span className="font-[var(--p-font-weight-semibold)]">{bi.quantity}× {bi.dishName}</span>
                          {bi.modifiers && bi.modifiers.length > 0 && (
                            <span className="text-[var(--p-color-text-secondary)]"> — {bi.modifiers.map((m) => m.name).join(", ")}</span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Order Card Skeleton ──────────────────────────────────────────────

function OrderCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)]",
        "p-[var(--p-space-300)] animate-pulse",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[var(--p-space-300)]">
        <div>
          <div className="flex items-center gap-[var(--p-space-200)]">
            <div className="h-4 w-16 rounded bg-[var(--p-color-bg-fill-secondary)]" />
            <div className="h-5 w-16 rounded-full bg-[var(--p-color-bg-fill-secondary)]" />
          </div>
          <div className="h-3 w-36 rounded bg-[var(--p-color-bg-fill-secondary)] mt-[var(--p-space-100)]" />
        </div>
        <div className="text-right">
          <div className="h-5 w-20 rounded-full bg-[var(--p-color-bg-fill-secondary)]" />
          <div className="h-4 w-14 rounded bg-[var(--p-color-bg-fill-secondary)] mt-[var(--p-space-100)] ml-auto" />
        </div>
      </div>
      {/* Ready by pill */}
      <div className="h-5 w-40 rounded-[var(--p-border-radius-150)] bg-[var(--p-color-bg-fill-secondary)] mt-[var(--p-space-150)]" />
      {/* Items */}
      <div className="mt-[var(--p-space-300)] space-y-[var(--p-space-200)]">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-[var(--p-space-200)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-200)]">
            <div className="size-7 rounded-[var(--p-border-radius-100)] bg-[var(--p-color-bg-fill-secondary)]" />
            <div className="size-8 rounded-[var(--p-border-radius-100)] bg-[var(--p-color-bg-fill-secondary)]" />
            <div className="flex-1">
              <div className="h-3 w-28 rounded bg-[var(--p-color-bg-fill-secondary)]" />
            </div>
            <div className="h-3 w-12 rounded bg-[var(--p-color-bg-fill-secondary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { OrderCard, OrderStatusBadge, OrderFulfillmentBadge, OrderCardSkeleton };
export type { OrderCardProps };
