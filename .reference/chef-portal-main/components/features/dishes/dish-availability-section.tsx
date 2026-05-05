"use client";

import { XSmallIcon } from "@shopify/polaris-icons";
import {
  Card,
  CardDivider,
  Input,
  Label,
  Badge,
  HelpText,
  Checkbox,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import type { DishFormData } from "@/app/dashboard/dishes/new/page";

interface DishAvailabilitySectionProps {
  formData: DishFormData;
  onUpdate: (updates: Partial<DishFormData>) => void;
  errors?: Record<string, string>;
}

const WEEKDAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
] as const;

export function DishAvailabilitySection({
  formData,
  onUpdate,
  errors = {},
}: DishAvailabilitySectionProps) {
  const toggleWeekday = (weekday: string) => {
    const newAvailability = formData.availability.includes(weekday)
      ? formData.availability.filter((w) => w !== weekday)
      : [...formData.availability, weekday];
    onUpdate({ availability: newAvailability });
  };

  return (
    <Card>
      {/* Max Quantity */}
      <div className="max-w-sm">
        <Label htmlFor="maxQuantityPerDay">Maximum Quantity Per Day</Label>
        <Input
          id="maxQuantityPerDay"
          type="number"
          min="1"
          value={formData.maxQuantityPerDay || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              onUpdate({ maxQuantityPerDay: null });
            } else {
              const numValue = parseInt(value);
              onUpdate({ maxQuantityPerDay: isNaN(numValue) ? null : numValue });
            }
          }}
          placeholder="Leave empty for unlimited"
          error={!!errors.maxQuantityPerDay}
        />
        <FieldError message={errors.maxQuantityPerDay} />
        {!errors.maxQuantityPerDay && (
          <HelpText>Limit daily orders to manage stock. Leave empty for no limit.</HelpText>
        )}
      </div>

      <CardDivider />

      {/* Availability Days — toggleable pills */}
      <div>
        <Label>Available Days</Label>
        <HelpText className="mb-[var(--p-space-300)]">
          Select which days this dish is available. Leave all unchecked for every day.
        </HelpText>
        <div className="flex flex-wrap gap-[var(--p-space-150)]">
          {WEEKDAYS.map((day) => {
            const isSelected = formData.availability.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleWeekday(day.value)}
                className={`inline-flex items-center px-[var(--p-space-300)] py-[var(--p-space-150)] rounded-[var(--p-border-radius-full)] text-[0.75rem] font-[var(--p-font-weight-medium)] cursor-pointer transition-colors border outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)] ${
                  isSelected
                    ? "bg-[var(--p-color-bg-fill-brand)] text-white border-transparent"
                    : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text)] border-[var(--p-color-border)] hover:bg-[var(--p-color-bg-surface-hover)]"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {formData.availability.length > 0 && (
          <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">
            {formData.availability.length} day{formData.availability.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </Card>
  );
}
