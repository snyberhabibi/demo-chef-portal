"use client";

import { useState, useEffect, useMemo } from "react";
import { useDishes } from "@/hooks/use-dishes";
import { OptimizedImage } from "@/components/shared/image";
import { BundleDishPickerCard } from "@/components/features/bundles/bundle-dish-picker-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MinusIcon,
  PlusIcon,
  XSmallIcon,
  PackageIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import {
  Card,
  CardDivider,
  Label,
  Badge,
  SearchBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  HelpText,
  Banner,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import type { BundleFormData } from "@/app/dashboard/bundles/new/page";

interface BundleDishesSectionProps {
  formData: BundleFormData;
  onUpdate: (updates: Partial<BundleFormData>) => void;
  errors?: Record<string, string>;
}

export function BundleDishesSection({
  formData,
  onUpdate,
  errors = {},
}: BundleDishesSectionProps) {
  const [dishSearchQuery, setDishSearchQuery] = useState("");
  const [debouncedDishSearch, setDebouncedDishSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDishSearch(dishSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [dishSearchQuery]);

  const [dishStatusFilter, setDishStatusFilter] = useState<"all" | "published" | "draft">("all");
  const { data: dishesData, isLoading: isDishesLoading } = useDishes({
    limit: 100,
    status: dishStatusFilter === "all" ? undefined : dishStatusFilter,
  });

  const dishes = useMemo(() => {
    let filtered = (dishesData?.data || []).filter((d) => d.status !== "archived");
    if (debouncedDishSearch) {
      const q = debouncedDishSearch.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [dishesData, debouncedDishSearch]);

  const selectedDishIds = useMemo(
    () => new Set(formData.items.map((item) => item.dishId)),
    [formData.items]
  );

  const quantityMap = useMemo(
    () => new Map(formData.items.map((item) => [item.dishId, item.quantity])),
    [formData.items]
  );

  const handleDishToggle = (dish: { id: string; name: string; image?: string }) => {
    if (selectedDishIds.has(dish.id)) {
      onUpdate({
        items: formData.items.filter((item) => item.dishId !== dish.id),
      });
    } else {
      onUpdate({
        items: [
          ...formData.items,
          {
            dishId: dish.id,
            dishName: dish.name,
            dishImage: dish.image,
            quantity: 1,
          },
        ],
      });
    }
  };

  const handleQuantityChange = (dishId: string, quantity: number) => {
    if (quantity < 1) return;
    onUpdate({
      items: formData.items.map((item) =>
        item.dishId === dishId ? { ...item, quantity } : item
      ),
    });
  };

  const handleRemoveItem = (dishId: string) => {
    onUpdate({
      items: formData.items.filter((item) => item.dishId !== dishId),
    });
  };

  const totalQuantity = formData.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      {/* Selected items list */}
      <div className="space-y-[var(--p-space-300)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[var(--p-space-200)]">
            <Label>Selected Items</Label>
            {formData.items.length > 0 && (
              <Badge tone="info" size="sm">
                {formData.items.length} {formData.items.length === 1 ? "dish" : "dishes"} &middot; {totalQuantity} total
              </Badge>
            )}
          </div>
        </div>

        {formData.items.length > 0 ? (
          <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] overflow-hidden">
            {formData.items.map((item, index) => (
              <div
                key={item.dishId}
                className={`flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-200)] bg-[var(--p-color-bg-surface)] hover:bg-[var(--p-color-bg-surface-hover)] transition-colors ${
                  index > 0 ? "border-t border-[var(--p-color-border-secondary)]" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="relative size-10 rounded-[var(--p-border-radius-150)] overflow-hidden shrink-0 bg-[var(--p-color-bg-surface-secondary)]">
                  {item.dishImage ? (
                    <OptimizedImage
                      src={item.dishImage}
                      alt={item.dishName}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] truncate">
                    {item.dishName}
                  </p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.dishId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex items-center justify-center size-7 bg-[var(--p-color-bg-surface)] hover:bg-[var(--p-color-bg-surface-hover)] active:bg-[var(--p-color-bg-surface-active)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <MinusIcon className="size-3.5 fill-[var(--p-color-icon)]" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) handleQuantityChange(item.dishId, val);
                    }}
                    className="w-8 h-7 text-center text-[0.75rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] bg-[var(--p-color-bg-surface-secondary)] border-x border-[var(--p-color-border)] outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.dishId, item.quantity + 1)}
                    className="flex items-center justify-center size-7 bg-[var(--p-color-bg-surface)] hover:bg-[var(--p-color-bg-surface-hover)] active:bg-[var(--p-color-bg-surface-active)] transition-colors cursor-pointer"
                  >
                    <PlusIcon className="size-3.5 fill-[var(--p-color-icon)]" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.dishId)}
                  className="flex items-center justify-center size-7 rounded-[var(--p-border-radius-150)] text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon-critical)] hover:bg-[var(--p-color-bg-surface-critical-hover)] transition-colors shrink-0 cursor-pointer"
                >
                  <XSmallIcon className="size-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--p-border-radius-200)] border border-dashed border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-600)] flex flex-col items-center gap-[var(--p-space-200)]">
            <PackageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] text-center">
              No items selected yet. Browse dishes below to start building your bundle.
            </p>
          </div>
        )}

        {formData.items.length > 0 && formData.items.length < 2 && (
          <Banner tone="warning" title="">
            <p>At least 2 items are required for a bundle. Add {2 - formData.items.length} more.</p>
          </Banner>
        )}

        <FieldError message={errors.items} />
      </div>

      <CardDivider />

      {/* Dish browser */}
      <div className="space-y-[var(--p-space-300)]">
        <Label>Browse Dishes</Label>
        <div className="flex flex-col sm:flex-row gap-[var(--p-space-200)]">
          <div className="flex-1">
            <SearchBar
              value={dishSearchQuery}
              onChange={setDishSearchQuery}
              placeholder="Search dishes by name..."
            />
          </div>
          <Select value={dishStatusFilter} onValueChange={(v) => setDishStatusFilter(v as "all" | "published" | "draft")}>
            <SelectTrigger className="w-full sm:w-[9rem]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dishes</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isDishesLoading ? (
          <div className="grid gap-[var(--p-space-300)] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="w-full aspect-[4/3] rounded-[var(--p-border-radius-300)]" />
                <div className="mt-[var(--p-space-200)] space-y-[var(--p-space-100)]">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <div className="rounded-[var(--p-border-radius-200)] border border-dashed border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-600)] text-center">
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
              {dishSearchQuery
                ? "No dishes found matching your search."
                : "No dishes available. Create dishes first to add them to bundles."}
            </p>
          </div>
        ) : (
          <div className="grid gap-[var(--p-space-300)] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dishes.map((dish) => (
              <BundleDishPickerCard
                key={dish.id}
                dish={dish}
                isSelected={selectedDishIds.has(dish.id)}
                quantity={quantityMap.get(dish.id) || 0}
                onToggle={(d) =>
                  handleDishToggle({
                    id: d.id,
                    name: d.name,
                    image: d.image,
                  })
                }
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}

        {!isDishesLoading && dishes.length > 0 && (
          <HelpText>Click a dish to add or remove it. Use the stepper on selected dishes to adjust quantity.</HelpText>
        )}
      </div>
    </Card>
  );
}
