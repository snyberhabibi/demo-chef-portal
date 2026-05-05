import type { DishShipping } from "@/types/dishes.types";

// ---------------------------------------------------------------------------
// Weight unit types
// ---------------------------------------------------------------------------
export type WeightUnit = "oz" | "lbs";

// ---------------------------------------------------------------------------
// Conversion constants
// ---------------------------------------------------------------------------
const OZ_PER_LB = 16;
const OZ_PER_KG = 35.274;
const LBS_PER_KG = 2.20462;

// ---------------------------------------------------------------------------
// FE display → BE storage
//   • Item weight is stored in ounces
//   • Dry-ice weight is stored in kilograms
//   • Dimensions are stored in inches (no conversion needed)
// ---------------------------------------------------------------------------

export function toOz(value: number, unit: WeightUnit): number {
  return unit === "lbs" ? Math.round(value * OZ_PER_LB * 1000) / 1000 : value;
}

export function toKg(value: number, unit: WeightUnit): number {
  if (unit === "lbs") return Math.round((value / LBS_PER_KG) * 1e6) / 1e6;
  return Math.round((value / OZ_PER_KG) * 1e6) / 1e6;
}

// ---------------------------------------------------------------------------
// BE storage → FE display
// ---------------------------------------------------------------------------

export function fromOz(oz: number, unit: WeightUnit): number {
  return unit === "lbs" ? Math.round((oz / OZ_PER_LB) * 1000) / 1000 : oz;
}

export function fromKg(kg: number, unit: WeightUnit): number {
  if (unit === "lbs") return Math.round(kg * LBS_PER_KG * 100) / 100;
  return Math.round(kg * OZ_PER_KG * 100) / 100;
}

// ---------------------------------------------------------------------------
// Input parsing helper
// ---------------------------------------------------------------------------

export function parseNum(value: string): number {
  if (value === "" || value === ".") return 0;
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

// ---------------------------------------------------------------------------
// BE API response → FE form data (DishShipping)
//
// The API may return nulls for unfilled fields. This normalises the response
// into a fully-populated DishShipping the form components can use directly.
// ---------------------------------------------------------------------------

export function parseApiShipping(
  apiShipping: Partial<DishShipping> | null | undefined,
): DishShipping | undefined {
  if (!apiShipping) return undefined;
  return {
    shippable: apiShipping.shippable ?? false,
    weight: apiShipping.weight ?? 0,
    dimensions: {
      length: apiShipping.dimensions?.length ?? 0,
      width: apiShipping.dimensions?.width ?? 0,
      height: apiShipping.dimensions?.height ?? 0,
    },
    dryIce: {
      required: apiShipping.dryIce?.required ?? false,
      weight: apiShipping.dryIce?.weight ?? 0,
    },
  };
}

// ---------------------------------------------------------------------------
// FE form data → BE API payload
//
// The backend uses strict Zod validation with min(0.1) on numeric fields.
// We omit optional sub-objects (like dryIce) when they aren't active so we
// don't send values like { weight: 0 } that would fail validation.
// ---------------------------------------------------------------------------

export function buildShippingPayload(shipping: DishShipping | undefined) {
  if (!shipping) return undefined;

  if (shipping.shippable) {
    return {
      shippable: true as const,
      weight: shipping.weight,
      dimensions: shipping.dimensions,
      ...(shipping.dryIce.required && shipping.dryIce.weight > 0
        ? { dryIce: { required: true, weight: shipping.dryIce.weight } }
        : {}),
    };
  }

  return { shippable: false as const };
}
