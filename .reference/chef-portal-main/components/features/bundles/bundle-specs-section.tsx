"use client";

import {
  Card,
  CardDivider,
  Label,
  Input,
  HelpText,
  Button,
  Badge,
} from "@/components/polaris";
import { SearchableSelect } from "@/components/polaris/searchable-select";
import { XSmallIcon, PlusIcon } from "@shopify/polaris-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldError } from "@/components/shared/field-error";
import { usePortionLabels } from "@/hooks/use-portion-labels";
import { HumanReadablePortionSizeDisplay } from "@/lib/dish-utils";
import type { PortionSize } from "@/types/dishes.types";
import type { BundleFormData } from "@/app/dashboard/bundles/new/page";

const SPICE_LEVELS = [
  { value: "none" as const, label: "None" },
  { value: "mild" as const, label: "Mild" },
  { value: "medium" as const, label: "Medium" },
  { value: "hot" as const, label: "Hot" },
  { value: "extraHot" as const, label: "Extra Hot" },
];

interface BundleSpecsSectionProps {
  formData: BundleFormData;
  onUpdate: (updates: Partial<BundleFormData>) => void;
  errors?: Record<string, string>;
}

export function BundleSpecsSection({
  formData,
  onUpdate,
  errors = {},
}: BundleSpecsSectionProps) {
  const { data: portionLabels, isLoading: portionLabelsLoading } =
    usePortionLabels();

  const addPortionSize = () => {
    onUpdate({
      portionSizes: [
        ...formData.portionSizes,
        { portionLabelId: "", size: "", regularPrice: 0, salePrice: 0 },
      ],
    });
  };

  const updatePortionSize = (
    index: number,
    updates: Partial<BundleFormData["portionSizes"][0]>
  ) => {
    const newSizes = [...formData.portionSizes];
    newSizes[index] = { ...newSizes[index], ...updates };
    onUpdate({ portionSizes: newSizes });
  };

  const removePortionSize = (index: number) => {
    onUpdate({
      portionSizes: formData.portionSizes.filter((_, i) => i !== index),
    });
  };

  const toggleSpiceLevel = (level: (typeof SPICE_LEVELS)[number]["value"]) => {
    const current = formData.spiceLevels || [];
    if (current.includes(level)) {
      onUpdate({
        spiceLevels: current.filter((l) => l !== level),
        hasSpiceLevel: current.length - 1 > 0,
      });
    } else {
      onUpdate({
        spiceLevels: [...current, level],
        hasSpiceLevel: true,
      });
    }
  };

  return (
    <Card>
      {/* Spice Levels — toggle pills */}
      <div>
        <Label>Spice Level</Label>
        <HelpText className="mb-[var(--p-space-200)]">
          {formData.spiceLevels.length === 0
            ? "Optional. Select levels if this bundle has varying spice options."
            : `${formData.spiceLevels.length} selected`}
        </HelpText>
        <div className="flex flex-wrap gap-[var(--p-space-150)]">
          {SPICE_LEVELS.map((level) => {
            const isSelected = formData.spiceLevels.includes(level.value);
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => toggleSpiceLevel(level.value)}
                className={`inline-flex items-center px-[var(--p-space-300)] py-[var(--p-space-150)] rounded-[var(--p-border-radius-full)] text-[0.75rem] font-[var(--p-font-weight-medium)] cursor-pointer transition-colors border outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)] ${
                  isSelected
                    ? "bg-[var(--p-color-bg-fill-brand)] text-white border-transparent"
                    : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text)] border-[var(--p-color-border)] hover:bg-[var(--p-color-bg-surface-hover)]"
                }`}
              >
                {level.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.spiceLevels} />
      </div>

      <CardDivider />

      {/* Portion Sizes */}
      <div>
        <div className="flex items-center justify-between mb-[var(--p-space-300)]">
          <div>
            <Label required>Portion Sizes</Label>
            <HelpText>At least one portion size with pricing is required.</HelpText>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addPortionSize}>
            <PlusIcon className="size-4 fill-current" />
            Add
          </Button>
        </div>

        <FieldError message={errors.portionSizes} />

        {formData.portionSizes.length === 0 ? (
          <div className="py-[var(--p-space-600)] text-center border-2 border-dashed border-[var(--p-color-border)] rounded-[var(--p-border-radius-200)]">
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">No portion sizes yet</p>
            <Button type="button" variant="plain" size="sm" onClick={addPortionSize} className="mt-[var(--p-space-200)]">
              Add your first portion size
            </Button>
          </div>
        ) : (
          <div className="space-y-[var(--p-space-200)]">
            {formData.portionSizes.map((ps, index) => {
              // Build storefront preview
              const selectedLabel = portionLabels?.find((l) => l.id === ps.portionLabelId);
              let previewText: string | null = null;
              if (selectedLabel && ps.size) {
                const previewPortionSize: PortionSize = {
                  id: "",
                  portionLabel: selectedLabel,
                  size: String(ps.size),
                  price: ps.regularPrice,
                };
                previewText = HumanReadablePortionSizeDisplay(previewPortionSize);
              }

              const hasDiscount = ps.salePrice > 0 && ps.regularPrice > 0 && ps.salePrice < ps.regularPrice;
              const discountPct = hasDiscount
                ? Math.round(((ps.regularPrice - ps.salePrice) / ps.regularPrice) * 100)
                : 0;

              return (
                <div
                  key={index}
                  className="p-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] space-y-[var(--p-space-300)]"
                >
                  {/* Fields row */}
                  <div className="flex items-start gap-[var(--p-space-200)]">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-[var(--p-space-200)]">
                      {/* Portion Label */}
                      <div>
                        <Label className="text-[0.6875rem]">Label</Label>
                        {portionLabelsLoading ? (
                          <Skeleton className="h-[2.25rem] w-full rounded-[var(--p-border-radius-200)]" />
                        ) : (
                          <SearchableSelect
                            options={portionLabels?.map((l) => ({ value: l.id, label: l.label })) || []}
                            value={ps.portionLabelId}
                            onValueChange={(v) => updatePortionSize(index, { portionLabelId: v })}
                            placeholder="Select"
                            searchPlaceholder="Search..."
                            emptyMessage="None found."
                            error={!!errors[`portionSizes.${index}.portionLabelId`]}
                          />
                        )}
                        <FieldError message={errors[`portionSizes.${index}.portionLabelId`]} />
                      </div>

                      {/* Size */}
                      <div>
                        <Label className="text-[0.6875rem]">Size</Label>
                        <Input
                          value={ps.size}
                          onChange={(e) => updatePortionSize(index, { size: e.target.value })}
                          placeholder="e.g., Large"
                          error={!!errors[`portionSizes.${index}.size`]}
                        />
                        <FieldError message={errors[`portionSizes.${index}.size`]} />
                      </div>

                      {/* Regular Price */}
                      <div>
                        <Label className="text-[0.6875rem]">Regular Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ps.regularPrice === 0 ? "" : ps.regularPrice}
                          onChange={(e) => {
                            const v = e.target.value;
                            updatePortionSize(index, { regularPrice: v === "" ? 0 : parseFloat(v) || 0 });
                          }}
                          onBlur={() => {
                            if (ps.regularPrice > 0 && ps.salePrice === 0) {
                              updatePortionSize(index, { salePrice: ps.regularPrice });
                            }
                          }}
                          placeholder="0.00"
                          error={!!errors[`portionSizes.${index}.regularPrice`]}
                        />
                        <FieldError message={errors[`portionSizes.${index}.regularPrice`]} />
                      </div>

                      {/* Sale Price */}
                      <div>
                        <Label className="text-[0.6875rem]">
                          Sale Price ($)
                          {hasDiscount && (
                            <Badge tone="success" size="sm" className="ml-[var(--p-space-100)]">
                              {discountPct}% off
                            </Badge>
                          )}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ps.salePrice === 0 ? "" : ps.salePrice}
                          onChange={(e) => {
                            const v = e.target.value;
                            updatePortionSize(index, { salePrice: v === "" ? 0 : parseFloat(v) || 0 });
                          }}
                          placeholder="0.00"
                          error={!!errors[`portionSizes.${index}.salePrice`]}
                        />
                        <FieldError message={errors[`portionSizes.${index}.salePrice`]} />
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removePortionSize(index)}
                      className="mt-[1.25rem] shrink-0 size-7 flex items-center justify-center rounded-[var(--p-border-radius-200)] text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon-critical)] hover:bg-[var(--p-color-bg-surface-critical)] cursor-pointer transition-colors"
                      aria-label="Remove portion size"
                    >
                      <XSmallIcon className="size-4 fill-current" />
                    </button>
                  </div>

                  {/* Storefront preview */}
                  {previewText && (
                    <div className="flex items-center gap-[var(--p-space-200)] px-[var(--p-space-200)] py-[var(--p-space-150)] bg-[var(--p-color-bg-surface)] rounded-[var(--p-border-radius-150)] border border-[var(--p-color-border-secondary)]">
                      <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">Preview:</span>
                      <span className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                        {previewText}
                      </span>
                      {hasDiscount && (
                        <span className="text-[0.75rem] text-[var(--p-color-text-secondary)] line-through">
                          ${ps.regularPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
