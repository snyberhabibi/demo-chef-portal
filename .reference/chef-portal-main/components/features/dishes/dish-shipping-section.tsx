"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SectionInstructionsButton } from "@/components/shared/section-instructions";
import { FieldError } from "@/components/shared/field-error";
import type { DishShipping } from "@/types/dishes.types";
import {
  toOz,
  toKg,
  fromOz,
  fromKg,
  parseNum,
  type WeightUnit,
} from "@/lib/shipping.utils";

interface ShippingSectionProps {
  shipping?: DishShipping;
  onShippingChange: (shipping: DishShipping) => void;
  errors?: Record<string, string>;
  itemLabel?: string;
}

export function DishShippingSection({
  shipping,
  onShippingChange,
  errors = {},
  itemLabel = "dish",
}: ShippingSectionProps) {
  const defaultWeightUnit: WeightUnit = "oz";
  const defaultDryIceUnit: WeightUnit = "oz";

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(defaultWeightUnit);
  const [dryIceWeightUnit, setDryIceWeightUnit] = useState<WeightUnit>(defaultDryIceUnit);

  // Raw string inputs — initialized from existing shipping data (edit mode)
  // Item weight: BE stores oz, default display oz (1:1)
  const [weightInput, setWeightInput] = useState(() => {
    const w = shipping?.weight ?? 0;
    return w === 0 ? "" : String(fromOz(w, defaultWeightUnit));
  });
  const [lengthInput, setLengthInput] = useState(() => {
    const v = shipping?.dimensions?.length ?? 0;
    return v === 0 ? "" : String(v);
  });
  const [widthInput, setWidthInput] = useState(() => {
    const v = shipping?.dimensions?.width ?? 0;
    return v === 0 ? "" : String(v);
  });
  const [heightInput, setHeightInput] = useState(() => {
    const v = shipping?.dimensions?.height ?? 0;
    return v === 0 ? "" : String(v);
  });
  // Dry ice: BE stores kg, default display oz → convert kg→oz on init
  const [dryIceInput, setDryIceInput] = useState(() => {
    const dw = shipping?.dryIce?.weight ?? 0;
    return dw === 0 ? "" : String(fromKg(dw, defaultDryIceUnit));
  });

  const needsReinit = useRef(false);

  // Skip render-time sync when the shipping prop change came from our own
  // commit() call, preventing the toKg→fromKg round-trip from mangling input.
  const [skipNextSync, setSkipNextSync] = useState(false);

  // Sync local inputs when shipping prop changes externally (API data loads).
  // Uses React's "adjusting state during render" pattern.
  const [prevShipping, setPrevShipping] = useState(shipping);
  if (shipping !== prevShipping) {
    setPrevShipping(shipping);
    if (skipNextSync) {
      setSkipNextSync(false);
    } else if (shipping) {
      const w = shipping.weight ?? 0;
      setWeightInput(w === 0 ? "" : String(fromOz(w, weightUnit)));

      const d = shipping.dimensions ?? { length: 0, width: 0, height: 0 };
      setLengthInput(d.length === 0 ? "" : String(d.length));
      setWidthInput(d.width === 0 ? "" : String(d.width));
      setHeightInput(d.height === 0 ? "" : String(d.height));

      const dw = shipping.dryIce?.weight ?? 0;
      setDryIceInput(dw === 0 ? "" : String(fromKg(dw, dryIceWeightUnit)));
    }
  }

  // Commit current values to parent in backend storage format.
  // Item weight → oz, dry ice → kg, dimensions → inches (no conversion).
  const commit = (overrides?: Partial<{
    weight: string;
    wUnit: WeightUnit;
    length: string;
    width: string;
    height: string;
    dryIceWeight: string;
    diUnit: WeightUnit;
    dryIceRequired: boolean;
  }>) => {
    const wStr = overrides?.weight ?? weightInput;
    const wU = overrides?.wUnit ?? weightUnit;
    const lStr = overrides?.length ?? lengthInput;
    const wdStr = overrides?.width ?? widthInput;
    const hStr = overrides?.height ?? heightInput;
    const diStr = overrides?.dryIceWeight ?? dryIceInput;
    const diU = overrides?.diUnit ?? dryIceWeightUnit;
    const diReq = overrides?.dryIceRequired ?? shipping?.dryIce?.required ?? false;

    setSkipNextSync(true);
    onShippingChange({
      shippable: true,
      weight: toOz(parseNum(wStr), wU),
      dimensions: {
        length: parseNum(lStr),
        width: parseNum(wdStr),
        height: parseNum(hStr),
      },
      dryIce: {
        required: diReq,
        weight: diReq ? toKg(parseNum(diStr), diU) : 0,
      },
    });
  };

  const handleShippableToggle = (checked: boolean) => {
    if (checked && needsReinit.current) {
      const w = shipping?.weight ?? 0;
      setWeightInput(w === 0 ? "" : String(fromOz(w, weightUnit)));
      const d = shipping?.dimensions ?? { length: 0, width: 0, height: 0 };
      setLengthInput(d.length === 0 ? "" : String(d.length));
      setWidthInput(d.width === 0 ? "" : String(d.width));
      setHeightInput(d.height === 0 ? "" : String(d.height));
      const dw = shipping?.dryIce?.weight ?? 0;
      setDryIceInput(dw === 0 ? "" : String(fromKg(dw, dryIceWeightUnit)));
      needsReinit.current = false;
    }
    if (!checked) {
      needsReinit.current = true;
    }
    setSkipNextSync(true);
    onShippingChange({
      shippable: checked,
      weight: checked ? toOz(parseNum(weightInput), weightUnit) : (shipping?.weight ?? 0),
      dimensions: shipping?.dimensions ?? { length: 0, width: 0, height: 0 },
      dryIce: shipping?.dryIce ?? { required: false, weight: 0 },
    });
  };

  // Convert displayed value between oz↔lbs on unit toggle
  const convertDisplayValue = (
    currentInput: string,
    oldUnit: WeightUnit,
    newUnit: WeightUnit,
  ): string => {
    const val = parseNum(currentInput);
    if (val === 0) return "";
    const inOz = toOz(val, oldUnit);
    return String(fromOz(inOz, newUnit));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Shipping</CardTitle>
            <span className="rounded-full bg-[#e54141]/80 px-2.5 py-0.5 text-[11px] font-semibold text-white border border-white/30 shadow-[0_0_16px_rgba(229,65,65,0.35),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-xl">New</span>
          </div>
          <SectionInstructionsButton
            title="Shipping"
            description={`Configure shipping options for this ${itemLabel}. Enable shipping to allow customers to order this ${itemLabel} for delivery via mail carriers.`}
            tips={[
              `Enable shipping if this ${itemLabel} can be safely shipped to customers nationwide`,
              "Enter the total item weight — you can choose ounces or pounds",
              "Dimensions should reflect the final shipping box size in inches",
              `Enable dry ice if the ${itemLabel} requires cold chain shipping`,
            ]}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shippable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="shippable">This {itemLabel} can be shipped</Label>
            <p className="text-sm text-muted-foreground">
              Allow customers to order this {itemLabel} for shipping via mail carriers
            </p>
          </div>
          <Switch
            id="shippable"
            checked={shipping?.shippable ?? false}
            onCheckedChange={handleShippableToggle}
          />
        </div>

        {shipping?.shippable && (
          <>
            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="shipping-weight">
                Item Weight <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="shipping-weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    commit({ weight: e.target.value });
                  }}
                  onBlur={() => {
                    const n = parseNum(weightInput);
                    setWeightInput(n === 0 ? "" : String(n));
                  }}
                  placeholder={weightUnit === "oz" ? "e.g., 40" : "e.g., 2.5"}
                  aria-invalid={!!errors["shipping.weight"]}
                  className={errors["shipping.weight"] ? "border-destructive" : ""}
                />
                <ToggleGroup
                  type="single"
                  value={weightUnit}
                  onValueChange={(value) => {
                    if (!value) return;
                    const newUnit = value as WeightUnit;
                    const converted = convertDisplayValue(weightInput, weightUnit, newUnit);
                    setWeightInput(converted);
                    setWeightUnit(newUnit);
                    commit({ weight: converted, wUnit: newUnit });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <ToggleGroupItem value="oz">oz</ToggleGroupItem>
                  <ToggleGroupItem value="lbs">lbs</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <p className="text-xs text-muted-foreground">
                Total weight of the item with it&apos;s packaging materials.
              </p>
              <FieldError message={errors["shipping.weight"]} />
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <Label>
                Package Dimensions (inches){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="shipping-length" className="text-xs text-muted-foreground">
                    Length
                  </Label>
                  <Input
                    id="shipping-length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={lengthInput}
                    onChange={(e) => {
                      setLengthInput(e.target.value);
                      commit({ length: e.target.value });
                    }}
                    onBlur={() => {
                      const n = parseNum(lengthInput);
                      setLengthInput(n === 0 ? "" : String(n));
                    }}
                    placeholder="0"
                    aria-invalid={!!errors["shipping.dimensions"]}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="shipping-width" className="text-xs text-muted-foreground">
                    Width
                  </Label>
                  <Input
                    id="shipping-width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={widthInput}
                    onChange={(e) => {
                      setWidthInput(e.target.value);
                      commit({ width: e.target.value });
                    }}
                    onBlur={() => {
                      const n = parseNum(widthInput);
                      setWidthInput(n === 0 ? "" : String(n));
                    }}
                    placeholder="0"
                    aria-invalid={!!errors["shipping.dimensions"]}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="shipping-height" className="text-xs text-muted-foreground">
                    Height
                  </Label>
                  <Input
                    id="shipping-height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={heightInput}
                    onChange={(e) => {
                      setHeightInput(e.target.value);
                      commit({ height: e.target.value });
                    }}
                    onBlur={() => {
                      const n = parseNum(heightInput);
                      setHeightInput(n === 0 ? "" : String(n));
                    }}
                    placeholder="0"
                    aria-invalid={!!errors["shipping.dimensions"]}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Dimensions of the item and all packaging materials in inches (L x W x H).
              </p>
              <FieldError message={errors["shipping.dimensions"]} />
            </div>

            {/* Dry Ice */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dry-ice">Requires Dry Ice</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable if this {itemLabel} needs to be packed with dry ice for cold
                    chain shipping
                  </p>
                </div>
                <Switch
                  id="dry-ice"
                  checked={shipping.dryIce.required}
                  onCheckedChange={(checked) => {
                    if (!checked) setDryIceInput("");
                    commit({ dryIceRequired: checked, dryIceWeight: checked ? dryIceInput : "" });
                  }}
                />
              </div>

              {shipping.dryIce.required && (
                <div className="space-y-2">
                  <Label htmlFor="dry-ice-weight">
                    Dry Ice Weight{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="dry-ice-weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={dryIceInput}
                      onChange={(e) => {
                        setDryIceInput(e.target.value);
                        commit({ dryIceWeight: e.target.value });
                      }}
                      onBlur={() => {
                        const n = parseNum(dryIceInput);
                        setDryIceInput(n === 0 ? "" : String(n));
                      }}
                      placeholder={dryIceWeightUnit === "oz" ? "e.g., 16" : "e.g., 1.0"}
                      aria-invalid={!!errors["shipping.dryIce.weight"]}
                      className={
                        errors["shipping.dryIce.weight"]
                          ? "border-destructive"
                          : ""
                      }
                    />
                    <ToggleGroup
                      type="single"
                      value={dryIceWeightUnit}
                      onValueChange={(value) => {
                        if (!value) return;
                        const newUnit = value as WeightUnit;
                        const converted = convertDisplayValue(dryIceInput, dryIceWeightUnit, newUnit);
                        setDryIceInput(converted);
                        setDryIceWeightUnit(newUnit);
                        commit({ dryIceWeight: converted, diUnit: newUnit });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <ToggleGroupItem value="oz">oz</ToggleGroupItem>
                      <ToggleGroupItem value="lbs">lbs</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Amount of dry ice needed to keep the {itemLabel} frozen during
                    transit.
                  </p>
                  <FieldError message={errors["shipping.dryIce.weight"]} />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
