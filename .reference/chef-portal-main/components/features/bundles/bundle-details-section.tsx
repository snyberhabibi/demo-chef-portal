"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardDivider,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  HelpText,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import type { BundleFormData } from "@/app/dashboard/bundles/new/page";

interface BundleDetailsSectionProps {
  formData: BundleFormData;
  onUpdate: (updates: Partial<BundleFormData>) => void;
  errors?: Record<string, string>;
}

export function BundleDetailsSection({
  formData,
  onUpdate,
  errors = {},
}: BundleDetailsSectionProps) {
  // Lead time unit state (hours or days)
  const [leadTimeUnit, setLeadTimeUnit] = useState<"hours" | "days">("hours");
  const [inputValue, setInputValue] = useState<string>("");
  const previousUnitRef = useRef(leadTimeUnit);
  const previousLeadTimeRef = useRef<number | null | undefined>(undefined);
  const isUserInputRef = useRef(false);
  const isInitializedRef = useRef(false);

  const leadTimeHours = formData.leadTime ?? 0;

  // Display value based on selected unit
  const displayLeadTime =
    leadTimeUnit === "days" ? leadTimeHours / 24 : leadTimeHours;

  const derivedInputValue =
    formData.leadTime === null ? "" : displayLeadTime.toString();

  // Sync inputValue when formData.leadTime changes externally or unit changes
  useEffect(() => {
    if (isUserInputRef.current) {
      isUserInputRef.current = false;
      previousLeadTimeRef.current = formData.leadTime;
      return;
    }

    const leadTimeChanged = previousLeadTimeRef.current !== formData.leadTime;
    const unitChanged = previousUnitRef.current !== leadTimeUnit;
    const isInitialLoad = !isInitializedRef.current;

    if (leadTimeChanged || unitChanged || isInitialLoad) {
      const timeoutId = setTimeout(() => {
        setInputValue(derivedInputValue);
      }, 0);

      previousLeadTimeRef.current = formData.leadTime;
      if (unitChanged) {
        previousUnitRef.current = leadTimeUnit;
      }
      isInitializedRef.current = true;

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [formData.leadTime, leadTimeUnit, derivedInputValue]);

  const handleLeadTimeChange = (value: string) => {
    isUserInputRef.current = true;
    setInputValue(value);

    if (value === "" || value === "-") {
      onUpdate({ leadTime: null });
      return;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      onUpdate({ leadTime: null });
      return;
    }
    // Convert to hours before storing
    const hoursValue = leadTimeUnit === "days" ? numValue * 24 : numValue;
    onUpdate({ leadTime: hoursValue });
  };

  const handleUnitChange = (newUnit: "hours" | "days") => {
    setLeadTimeUnit(newUnit);
    if (formData.leadTime === null) {
      setInputValue("");
      return;
    }
    const displayValue =
      newUnit === "days" ? leadTimeHours / 24 : leadTimeHours;
    setInputValue(displayValue.toString());
  };

  return (
    <Card>
      {/* Name + Description */}
      <div className="space-y-[var(--p-space-400)]">
        <div>
          <Label htmlFor="bundle-name" required>Bundle Name</Label>
          <Input
            id="bundle-name"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Family Feast Bundle"
            error={!!errors.name}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label htmlFor="bundle-description">Description</Label>
          <Textarea
            id="bundle-description"
            value={formData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              const textarea = e.currentTarget;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const newValue =
                formData.description.substring(0, start) +
                text +
                formData.description.substring(end);
              onUpdate({ description: newValue });
              setTimeout(() => {
                textarea.setSelectionRange(start + text.length, start + text.length);
              }, 0);
            }}
            placeholder="Describe what's included in this bundle..."
            rows={4}
            error={!!errors.description}
          />
          <FieldError message={errors.description} />
        </div>
      </div>

      <CardDivider />

      {/* Status + Lead Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
        <div>
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              onUpdate({ status: value as "draft" | "published" | "archived" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="leadTime" required>Lead Time</Label>
          <div className="flex gap-[var(--p-space-200)]">
            <Input
              id="leadTime"
              type="number"
              step="0.01"
              min="0"
              value={inputValue}
              onChange={(e) => handleLeadTimeChange(e.target.value)}
              placeholder={leadTimeUnit === "days" ? "e.g., 1.5" : "e.g., 2.5"}
              error={!!errors.leadTime}
              className="flex-1"
            />
            <Select
              value={leadTimeUnit}
              onValueChange={(v) => handleUnitChange(v as "hours" | "days")}
            >
              <SelectTrigger className="w-[6rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.leadTime ? (
            <FieldError message={errors.leadTime} />
          ) : (
            <HelpText>
              How far in advance customers need to order
              {formData.leadTime !== null &&
                formData.leadTime > 0 &&
                (leadTimeUnit === "days"
                  ? ` (${leadTimeHours}h = ${displayLeadTime.toFixed(2)} days)`
                  : ` (${leadTimeHours} hours)`)}
            </HelpText>
          )}
        </div>
      </div>
    </Card>
  );
}
