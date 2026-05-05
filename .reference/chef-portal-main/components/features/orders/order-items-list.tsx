"use client";

import type { Order, OrderBundleItem } from "@/types/orders.types";
import type { PortionSize } from "@/types/dishes.types";
import type { BundlePortionSize } from "@/types/bundles.types";
import { HumanReadablePortionSizeDisplay, getBundlePortionSizeLabel } from "@/lib/dish-utils";
import Image from "next/image";
import { PackageFilledIcon, CartFilledIcon } from "@shopify/polaris-icons";
import { Badge, ExpandableText } from "@/components/polaris";

function formatPortionSize(
  portionSize: PortionSize | BundlePortionSize | string | null,
  isBundle: boolean
): string {
  if (!portionSize) return "";
  if (typeof portionSize === "string") return portionSize;
  if ("regularPrice" in portionSize) return getBundlePortionSizeLabel(portionSize as BundlePortionSize);
  if ("price" in portionSize) return HumanReadablePortionSizeDisplay(portionSize as PortionSize);
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

interface OrderItemsListProps {
  items: Order["items"];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div data-testid="order-items-list">
      <div className="flex justify-between items-center mb-[var(--p-space-200)]">
        <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)]">
          Ordered items
        </h3>
        <Badge tone="default" size="sm" data-testid="order-total-units">
          {totalUnits} {totalUnits === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] overflow-hidden p-[var(--p-space-100)]">
        {items.map((item, index) => {
          const isBundle = item.type === "bundle";

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

          const portionLabel = item.portionSize ? formatPortionSize(item.portionSize, isBundle) : null;
          const subtotal = (item.price ?? 0) * item.quantity;

          const spiceLevel = item.spiceLevel;
          const hasDetails = portionLabel || (spiceLevel && spiceLevel !== "none") || modifierGroups.length > 0;

          return (
            <div
              key={item.id}
              className={`${
                index !== items.length - 1 ? "border-b border-[var(--p-color-border-secondary)]" : ""
              }`}
            >
              {/* Top row: qty + image + name + price */}
              <div className="flex items-center gap-[var(--p-space-300)] px-[var(--p-space-400)] pt-[var(--p-space-300)] pb-[var(--p-space-200)]">
                {/* Quantity */}
                <span className="shrink-0 inline-flex flex-col items-center justify-center bg-[rgba(255,230,0,1)] text-[rgba(51,46,0,1)] rounded-[var(--p-border-radius-150)] size-12 text-[1rem] font-[var(--p-font-weight-bold)] leading-none">
                  {item.quantity}
                  <span className="text-[0.5rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider mt-[1px]">qty</span>
                </span>

                {/* Image */}
                {item.image ? (
                  <div className="relative size-12 rounded-[var(--p-border-radius-200)] overflow-hidden shrink-0 border border-[var(--p-color-border-secondary)]">
                    <Image src={item.image} alt={item.dishName} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="relative size-12 bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-200)] flex items-center justify-center shrink-0 border border-[var(--p-color-border-secondary)]">
                    {isBundle ? (
                      <PackageFilledIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
                    ) : (
                      <CartFilledIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
                    )}
                  </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[var(--p-space-100)]">
                    <h4 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                      {item.dishName}
                    </h4>
                    {isBundle && <Badge tone="info" size="sm">Bundle</Badge>}
                  </div>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right">
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
                    ${subtotal.toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-[0.625rem] text-[var(--p-color-text-secondary)]">
                      ${(item.price ?? 0).toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>

              {/* Details strip: label/value columns in a surface bar */}
              {hasDetails && (
                <div className="px-[var(--p-space-400)] pb-[var(--p-space-300)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-[var(--p-space-400)] gap-y-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-300)]">
                    {portionLabel && (
                      <div>
                        <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                          Portion Size
                        </p>
                        <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                          {portionLabel}
                        </p>
                      </div>
                    )}
                    {spiceLevel && spiceLevel !== "none" && (
                      <div>
                        <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                          Spice Level
                        </p>
                        <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                          {formatSpiceLevel(spiceLevel)}
                        </p>
                      </div>
                    )}
                    {modifierGroups.map((group, gIdx) => (
                      <div key={gIdx}>
                        <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                          {group.groupName}
                        </p>
                        <div className="flex flex-wrap items-center gap-[var(--p-space-050)]">
                          {group.modifiers.map((modifier, mIdx) => (
                            <span
                              key={mIdx}
                              className={`text-[0.75rem] font-[var(--p-font-weight-semibold)] ${
                                modifier.isRemoval
                                  ? "text-[var(--p-color-text-critical)] line-through"
                                  : "text-[var(--p-color-text)]"
                              }`}
                            >
                              {modifier.name}
                              {modifier.price > 0 && (
                                <span className="text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-regular)] text-[0.6875rem]"> +${modifier.price.toFixed(2)}</span>
                              )}
                              {mIdx < group.modifiers.length - 1 && <span className="text-[var(--p-color-text-secondary)]">,</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* Special instructions — separate container */}
              {item.specialInstructions && (
                <div className="px-[var(--p-space-400)] pb-[var(--p-space-300)]">
                  <div className="bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-300)]">
                    <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-050)]">
                      Special Instructions
                    </p>
                    <ExpandableText
                      text={item.specialInstructions}
                      lines={2}
                      expandLabel="Show more"
                      collapseLabel="Show less"
                      fadeColor="var(--p-color-bg-surface-secondary)"
                    />
                  </div>
                </div>
              )}

              {/* Bundle items */}
              {isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                <div className="px-[var(--p-space-400)] pb-[var(--p-space-300)]">
                  <div className="bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-150)] p-[var(--p-space-300)]">
                    <p className="text-[0.5625rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">
                      Includes
                    </p>
                    <div className="space-y-[var(--p-space-050)]">
                      {item.bundleItems.map((bundleItem: OrderBundleItem) => (
                        <div key={bundleItem.id} className="flex items-center gap-[var(--p-space-100)] text-[0.75rem] text-[var(--p-color-text)]">
                          <span className="size-1 shrink-0 rounded-full bg-[var(--p-color-icon-secondary)]" />
                          <span className="font-[var(--p-font-weight-medium)]">
                            {bundleItem.quantity}× {bundleItem.dishName}
                            {bundleItem.modifiers && bundleItem.modifiers.length > 0 && (
                              <span className="text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-regular)]"> — {bundleItem.modifiers.map((m) => m.name).join(", ")}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
