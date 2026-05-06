"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

/**
 * Quantity-based bundle selector — "Pick 7 meals" pattern.
 * From the Claude Design handoff spec.
 *
 * Chef sets: total required, min/max options, per-item max qty.
 * Customer sees: dish cards with +/- steppers, running total, dynamic price.
 */

interface BundleItem {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  priceAdjustment: number; // +$3 or -$2 from base
  maxQty: number;
}

interface QuantityBundleSelectorProps {
  bundleName: string;
  bundleBasePrice: number;
  totalRequired: number;
  minOptions?: number;
  maxOptions?: number;
  items: BundleItem[];
}

export function QuantityBundleSelector({
  bundleName,
  bundleBasePrice,
  totalRequired,
  items,
}: QuantityBundleSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    items.forEach((item) => { init[item.id] = 0; });
    return init;
  });

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);
  const remaining = totalRequired - totalSelected;
  const isComplete = totalSelected >= totalRequired;

  // Calculate dynamic total price
  const totalPrice = items.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.priceAdjustment;
  }, bundleBasePrice);

  const increment = (id: string) => {
    if (totalSelected >= totalRequired) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if ((quantities[id] || 0) >= item.maxQty) return;
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id: string) => {
    if ((quantities[id] || 0) <= 0) return;
    setQuantities((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", maxWidth: 480 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
        <div className="heading-md">{bundleName}</div>
        <div className="body-sm" style={{ marginTop: 4 }}>
          Choose Your Meals · Select {totalRequired} items
        </div>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {items.map((item) => {
          const qty = quantities[item.id] || 0;
          const canIncrement = totalSelected < totalRequired && qty < item.maxQty;
          const canDecrement = qty > 0;

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                borderBottom: "1px solid rgba(51,31,46,0.04)",
                transition: "background 0.1s",
                background: qty > 0 ? "rgba(121,173,99,0.04)" : undefined,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)" }}>
                  {item.name}
                </div>
                {item.priceAdjustment !== 0 && (
                  <div style={{
                    fontSize: 12,
                    color: item.priceAdjustment > 0 ? "var(--color-brown-soft)" : "var(--color-sage-deep)",
                    marginTop: 1,
                  }}>
                    {item.priceAdjustment > 0 ? "+" : ""}${Math.abs(item.priceAdjustment).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Quantity controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
                {canDecrement && (
                  <button
                    onClick={() => decrement(item.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(51,31,46,0.12)",
                      background: "#fff",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      color: "var(--color-brown)",
                    }}
                  >
                    <Minus size={14} />
                  </button>
                )}

                <span
                  className="tnum"
                  style={{
                    width: 36,
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: qty > 0 ? "var(--color-brown)" : "var(--color-brown-soft-2)",
                  }}
                >
                  {qty}
                </span>

                <button
                  onClick={() => increment(item.id)}
                  disabled={!canIncrement}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "none",
                    background: canIncrement ? "var(--color-brown)" : "var(--color-cream-sunken)",
                    display: "grid",
                    placeItems: "center",
                    cursor: canIncrement ? "pointer" : "not-allowed",
                    color: canIncrement ? "#fff" : "var(--color-brown-soft-2)",
                    transition: "background 0.1s",
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — running total + CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(51,31,46,0.06)", background: "var(--color-cream)" }}>
        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: "var(--color-cream-sunken)",
              marginRight: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                background: isComplete ? "var(--color-sage)" : "var(--color-orange)",
                width: `${Math.min((totalSelected / totalRequired) * 100, 100)}%`,
                transition: "width 0.2s ease, background 0.2s",
              }}
            />
          </div>
          <span className="caption tnum" style={{ fontWeight: 600, flexShrink: 0 }}>
            {totalSelected} of {totalRequired}
          </span>
        </div>

        {/* CTA */}
        <button
          disabled={!isComplete}
          className={isComplete ? "btn btn-gradient btn-block" : "btn btn-block"}
          style={{
            minHeight: 48,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 9999,
            ...(isComplete
              ? {}
              : {
                  background: "var(--color-cream-sunken)",
                  color: "var(--color-brown-soft-2)",
                  cursor: "not-allowed",
                  boxShadow: "none",
                  border: "1px solid rgba(51,31,46,0.06)",
                }),
          }}
        >
          {isComplete ? (
            <>
              <ShoppingCart size={16} />
              Add to Cart · ${totalPrice.toFixed(2)}
            </>
          ) : (
            `Select ${remaining} more`
          )}
        </button>
      </div>
    </div>
  );
}

/** Demo with sample data */
export function QuantityBundleDemo() {
  const items: BundleItem[] = [
    { id: "1", name: "Teriyaki & Rice", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", basePrice: 12, priceAdjustment: 0, maxQty: 4 },
    { id: "2", name: "Salmon & Rice", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop", basePrice: 15, priceAdjustment: 3, maxQty: 3 },
    { id: "3", name: "Beef & Rice", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", basePrice: 14, priceAdjustment: 2, maxQty: 4 },
    { id: "4", name: "Veggie & Rice", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop", basePrice: 10, priceAdjustment: -2, maxQty: 4 },
    { id: "5", name: "Chicken Mandi", image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop", basePrice: 13, priceAdjustment: 1, maxQty: 3 },
    { id: "6", name: "Falafel Bowl", image: "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?w=600&h=450&fit=crop", basePrice: 11, priceAdjustment: -1, maxQty: 4 },
  ];

  return (
    <QuantityBundleSelector
      bundleName="7 Meal Weekly Bundle"
      bundleBasePrice={75}
      totalRequired={7}
      items={items}
    />
  );
}
