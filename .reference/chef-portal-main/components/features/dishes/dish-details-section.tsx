"use client";

import { useState, useEffect, useRef } from "react";
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
  InlineError,
} from "@/components/polaris";
import { SearchableSelect } from "@/components/polaris/searchable-select";
import { FieldError } from "@/components/shared/field-error";
import { Skeleton } from "@/components/ui/skeleton"; // TODO: replace with Polaris skeleton
import { useCuisines } from "@/hooks/use-cuisines";
import { useCategories } from "@/hooks/use-categories";
import { OptimizedImage } from "@/components/shared/image";
import type { DishFormData } from "@/app/dashboard/dishes/new/page";

interface DishDetailsSectionProps {
  formData: DishFormData;
  onUpdate: (updates: Partial<DishFormData>) => void;
  errors?: Record<string, string>;
}

export function DishDetailsSection({
  formData,
  onUpdate,
  errors = {},
}: DishDetailsSectionProps) {
  const { data: cuisines, isLoading: cuisinesLoading } = useCuisines();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [leadTimeUnit, setLeadTimeUnit] = useState<"hours" | "days">("hours");
  const [inputValue, setInputValue] = useState<string>("");
  const previousUnitRef = useRef(leadTimeUnit);
  const previousLeadTimeRef = useRef<number | undefined>(undefined);
  const previousDishNameRef = useRef<string>("");
  const isUserInputRef = useRef(false);
  const isInitializedRef = useRef(false);

  const displayLeadTime = leadTimeUnit === "days" ? formData.leadTime / 24 : formData.leadTime;
  const derivedInputValue = displayLeadTime.toString();

  useEffect(() => {
    const dishChanged = previousDishNameRef.current !== "" && formData.name !== "" && previousDishNameRef.current !== formData.name;
    if (dishChanged) {
      previousLeadTimeRef.current = undefined;
      previousUnitRef.current = leadTimeUnit;
      isInitializedRef.current = false;
    }
    if (formData.name) previousDishNameRef.current = formData.name;
    if (isUserInputRef.current) {
      isUserInputRef.current = false;
      previousLeadTimeRef.current = formData.leadTime;
      return;
    }
    const leadTimeChanged = previousLeadTimeRef.current !== formData.leadTime;
    const unitChanged = previousUnitRef.current !== leadTimeUnit;
    const isInitialLoad = !isInitializedRef.current;
    if (leadTimeChanged || unitChanged || isInitialLoad) {
      const timeoutId = setTimeout(() => setInputValue(derivedInputValue), 0);
      previousLeadTimeRef.current = formData.leadTime;
      if (unitChanged) previousUnitRef.current = leadTimeUnit;
      isInitializedRef.current = true;
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [formData.leadTime, formData.name, leadTimeUnit, derivedInputValue]);

  const handleLeadTimeChange = (value: string) => {
    isUserInputRef.current = true;
    setInputValue(value);
    if (value === "" || value === "-") { onUpdate({ leadTime: 0 }); return; }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) { onUpdate({ leadTime: 0 }); return; }
    onUpdate({ leadTime: leadTimeUnit === "days" ? numValue * 24 : numValue });
  };

  const handleUnitChange = (newUnit: "hours" | "days") => {
    setLeadTimeUnit(newUnit);
    const displayValue = newUnit === "days" ? formData.leadTime / 24 : formData.leadTime;
    setInputValue(displayValue.toString());
  };

  return (
    <Card>
      {/* Name + Description */}
      <div className="space-y-[var(--p-space-400)]">
        <div>
          <Label htmlFor="name" required>Dish Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Traditional Shawarma Plate"
            error={!!errors.name}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label htmlFor="description" required>Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              const textarea = e.currentTarget;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const newValue = formData.description.substring(0, start) + text + formData.description.substring(end);
              onUpdate({ description: newValue });
              setTimeout(() => textarea.setSelectionRange(start + text.length, start + text.length), 0);
            }}
            placeholder="Describe the ingredients and flavors..."
            rows={4}
            error={!!errors.description}
          />
          <FieldError message={errors.description} />
        </div>
      </div>

      <CardDivider />

      {/* Cuisine, Category, Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-400)]">
        <div>
          <Label required>Cuisine</Label>
          {cuisinesLoading ? (
            <Skeleton className="h-[2.25rem] w-full rounded-[var(--p-border-radius-200)]" />
          ) : (
            <>
              <SearchableSelect
                options={cuisines?.map((c) => ({ value: c.id, label: c.name, image: c.image })) || []}
                value={formData.cuisineId}
                onValueChange={(value) => onUpdate({ cuisineId: value })}
                placeholder="Select cuisine"
                searchPlaceholder="Search cuisines..."
                emptyMessage="No cuisines found."
                error={!!errors.cuisineId}
                renderOption={(option) => (
                  <div className="flex items-center gap-2">
                    {(option.image as string) && (
                      <div className="relative h-5 w-5 rounded overflow-hidden shrink-0">
                        <OptimizedImage src={option.image as string} alt={option.label} fill className="object-cover" />
                      </div>
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
              />
              <FieldError message={errors.cuisineId} />
            </>
          )}
        </div>

        <div>
          <Label required>Category</Label>
          {categoriesLoading ? (
            <Skeleton className="h-[2.25rem] w-full rounded-[var(--p-border-radius-200)]" />
          ) : (
            <>
              <SearchableSelect
                options={categories?.map((c) => ({ value: c.id, label: c.name, image: c.image })) || []}
                value={formData.categoryId}
                onValueChange={(value) => onUpdate({ categoryId: value })}
                placeholder="Select category"
                searchPlaceholder="Search categories..."
                emptyMessage="No categories found."
                error={!!errors.categoryId}
                renderOption={(option) => (
                  <div className="flex items-center gap-2">
                    {(option.image as string) && (
                      <div className="relative h-5 w-5 rounded overflow-hidden shrink-0">
                        <OptimizedImage src={option.image as string} alt={option.label} fill className="object-cover" />
                      </div>
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
              />
              <FieldError message={errors.categoryId} />
            </>
          )}
        </div>

        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => onUpdate({ status: value as "draft" | "published" | "archived" })}>
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
      </div>

      <CardDivider />

      {/* Lead Time */}
      <div className="max-w-md">
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
          <Select value={leadTimeUnit} onValueChange={(v) => handleUnitChange(v as "hours" | "days")}>
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
            {formData.leadTime > 0 && (leadTimeUnit === "days"
              ? ` (${formData.leadTime}h = ${displayLeadTime.toFixed(2)} days)`
              : ` (${formData.leadTime} hours)`)}
          </HelpText>
        )}
      </div>

      <input type="hidden" name="chefUserId" value={formData.chefUserId} />
    </Card>
  );
}
