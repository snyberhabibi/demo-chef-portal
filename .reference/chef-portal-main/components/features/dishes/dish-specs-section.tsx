"use client";

import { useState, useRef, useEffect } from "react";
import { Label, Input, HelpText } from "@/components/polaris";
import { Card, CardDivider } from "@/components/polaris";
import { Button, Badge, Spinner } from "@/components/polaris";
import { SearchableSelect } from "@/components/polaris/searchable-select";
import { XSmallIcon, PlusIcon } from "@shopify/polaris-icons";
import { usePortionLabels } from "@/hooks/use-portion-labels";
import { useIngredients } from "@/hooks/use-ingredients";
import { useAllergens } from "@/hooks/use-allergens";
import { useDietaryLabels } from "@/hooks/use-dietary-labels";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
// NOTE: Popover/Command/Checkbox still use shadcn - no Polaris equivalent for this combo search pattern
import { OptimizedImage } from "@/components/shared/image";
import { FieldError } from "@/components/shared/field-error";
import type { DishFormData } from "@/app/dashboard/dishes/new/page";
import { HumanReadablePortionSizeDisplay } from "@/lib/dish-utils";
import type { PortionSize } from "@/types/dishes.types";

interface DishSpecsSectionProps {
  formData: DishFormData;
  onUpdate: (updates: Partial<DishFormData>) => void;
  errors?: Record<string, string>;
}

const SPICE_LEVELS = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "hot", label: "Hot" },
  { value: "extra-hot", label: "Extra Hot" },
] as const;

export function DishSpecsSection({
  formData,
  onUpdate,
  errors = {},
}: DishSpecsSectionProps) {
  const { data: portionLabels, isLoading: portionLabelsLoading } =
    usePortionLabels();
  const { data: allergens, isLoading: allergensLoading } = useAllergens();
  const { data: dietaryLabels, isLoading: dietaryLabelsLoading } =
    useDietaryLabels();

  const [ingredientPopoverOpen, setIngredientPopoverOpen] = useState(false);
  const [allergenPopoverOpen, setAllergenPopoverOpen] = useState(false);
  const [dietaryLabelPopoverOpen, setDietaryLabelPopoverOpen] = useState(false);

  const [ingredientSearch, setIngredientSearch] = useState("");
  const [debouncedIngredientSearch, setDebouncedIngredientSearch] =
    useState("");
  const [allergenSearch, setAllergenSearch] = useState("");
  const [dietaryLabelSearch, setDietaryLabelSearch] = useState("");

  // Cache of selected ingredients to display even when not in search results
  const [selectedIngredientsCache, setSelectedIngredientsCache] = useState<
    Map<string, { id: string; name: string; image: string | null }>
  >(new Map());

  // Track which ingredient IDs have been cached to avoid unnecessary updates
  const cachedIngredientIdsRef = useRef<Set<string>>(new Set());

  // Debounce ingredient search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIngredientSearch(ingredientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [ingredientSearch]);

  // Fetch ingredients with debounced search
  // Pass undefined when search is empty to fetch all ingredients
  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients(
    debouncedIngredientSearch.trim() || undefined
  );

  // Fetch all ingredients once on mount to populate cache for selected ingredients
  const { data: allIngredients } = useIngredients(undefined);

  // Update cache when ingredients are fetched (both search results and all ingredients)
  // Use setTimeout to defer state update and avoid cascading renders
  useEffect(() => {
    const ingredientsToCache = ingredients || allIngredients;
    if (ingredientsToCache && ingredientsToCache.length > 0) {
      // Check if there are any new ingredients to cache
      const newIngredients = ingredientsToCache.filter(
        (ingredient) => !cachedIngredientIdsRef.current.has(ingredient.id)
      );

      if (newIngredients.length > 0) {
        // Defer state update to next tick to avoid cascading renders
        const timeoutId = setTimeout(() => {
          setSelectedIngredientsCache((prev) => {
            const updated = new Map(prev);
            newIngredients.forEach((ingredient) => {
              const imageUrl =
                typeof ingredient.image === "string"
                  ? ingredient.image
                  : ingredient.image?.url || null;
              updated.set(ingredient.id, {
                id: ingredient.id,
                name: ingredient.name,
                image: imageUrl,
              });
              cachedIngredientIdsRef.current.add(ingredient.id);
            });
            return updated;
          });
        }, 0);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [ingredients, allIngredients]);

  const [ingredientPopoverWidth, setIngredientPopoverWidth] = useState<
    number | undefined
  >(undefined);
  const [allergenPopoverWidth, setAllergenPopoverWidth] = useState<
    number | undefined
  >(undefined);
  const [dietaryLabelPopoverWidth, setDietaryLabelPopoverWidth] = useState<
    number | undefined
  >(undefined);

  const ingredientTriggerRef = useRef<HTMLButtonElement>(null);
  const allergenTriggerRef = useRef<HTMLButtonElement>(null);
  const dietaryLabelTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ingredientPopoverOpen && ingredientTriggerRef.current) {
      setIngredientPopoverWidth(ingredientTriggerRef.current.offsetWidth);
    } else if (!ingredientPopoverOpen) {
      setIngredientSearch("");
      setDebouncedIngredientSearch("");
    }
  }, [ingredientPopoverOpen]);

  useEffect(() => {
    if (allergenPopoverOpen && allergenTriggerRef.current) {
      setAllergenPopoverWidth(allergenTriggerRef.current.offsetWidth);
    } else if (!allergenPopoverOpen) {
      setAllergenSearch("");
    }
  }, [allergenPopoverOpen]);

  useEffect(() => {
    if (dietaryLabelPopoverOpen && dietaryLabelTriggerRef.current) {
      setDietaryLabelPopoverWidth(dietaryLabelTriggerRef.current.offsetWidth);
    } else if (!dietaryLabelPopoverOpen) {
      setDietaryLabelSearch("");
    }
  }, [dietaryLabelPopoverOpen]);

  const addPortionSize = () => {
    onUpdate({
      portionSizes: [
        ...formData.portionSizes,
        { portionLabelId: "", size: "", price: 0 },
      ],
    });
  };

  const updatePortionSize = (
    index: number,
    updates: Partial<DishFormData["portionSizes"][0]>
  ) => {
    const newPortionSizes = [...formData.portionSizes];
    newPortionSizes[index] = { ...newPortionSizes[index], ...updates };
    onUpdate({ portionSizes: newPortionSizes });
  };

  const removePortionSize = (index: number) => {
    onUpdate({
      portionSizes: formData.portionSizes.filter((_, i) => i !== index),
    });
  };

  const toggleIngredient = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const isAdding = !formData.ingredientIds.includes(id);
    const newIds = formData.ingredientIds.includes(id)
      ? formData.ingredientIds.filter((i) => i !== id)
      : [...formData.ingredientIds, id];
    onUpdate({ ingredientIds: newIds });

    // Clear search when selecting an ingredient
    if (isAdding) {
      setIngredientSearch("");
    }

    // Update cache when selecting an ingredient
    if (isAdding) {
      const ingredient = ingredients?.find((i) => i.id === id);
      if (ingredient) {
        const imageUrl =
          typeof ingredient.image === "string"
            ? ingredient.image
            : ingredient.image?.url || null;
        setSelectedIngredientsCache((prev) => {
          const updated = new Map(prev);
          updated.set(ingredient.id, {
            id: ingredient.id,
            name: ingredient.name,
            image: imageUrl,
          });
          return updated;
        });
      }
    }
  };

  const toggleAllergen = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const isAdding = !formData.allergenIds.includes(id);
    const newIds = formData.allergenIds.includes(id)
      ? formData.allergenIds.filter((i) => i !== id)
      : [...formData.allergenIds, id];
    onUpdate({ allergenIds: newIds });

    // Clear search when selecting an allergen
    if (isAdding) {
      setAllergenSearch("");
    }
  };

  const toggleDietaryLabel = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const isAdding = !formData.dietaryLabelIds.includes(id);
    const newIds = formData.dietaryLabelIds.includes(id)
      ? formData.dietaryLabelIds.filter((i) => i !== id)
      : [...formData.dietaryLabelIds, id];
    onUpdate({ dietaryLabelIds: newIds });

    // Clear search when selecting a dietary label
    if (isAdding) {
      setDietaryLabelSearch("");
    }
  };

  const clearAllIngredients = () => {
    onUpdate({ ingredientIds: [] });
  };

  const clearAllAllergens = () => {
    onUpdate({ allergenIds: [] });
  };

  const clearAllDietaryLabels = () => {
    onUpdate({ dietaryLabelIds: [] });
  };

  // Use ingredients directly from API (already filtered server-side)
  const filteredIngredients = ingredients || [];

  const filteredAllergens =
    allergens?.filter((allergen) =>
      allergen.name.toLowerCase().includes(allergenSearch.toLowerCase())
    ) || [];

  const filteredDietaryLabels =
    dietaryLabels?.filter((label) =>
      label.name.toLowerCase().includes(dietaryLabelSearch.toLowerCase())
    ) || [];

  return (
    <Card className="space-y-0">
      <div className="space-y-[var(--p-space-500)]">
        {/* Spice Levels — toggle pills */}
        <div>
          <Label>Spice Level</Label>
          <HelpText className="mb-[var(--p-space-200)]">
            {formData.spiceLevels.length === 0
              ? "Optional. If selected, choose at least 3 levels."
              : formData.spiceLevels.length < 3
              ? `Select ${3 - formData.spiceLevels.length} more to meet the minimum`
              : `${formData.spiceLevels.length} selected`}
          </HelpText>
          <div className="flex flex-wrap gap-[var(--p-space-150)]">
            {SPICE_LEVELS.map((level) => {
              const isSelected = formData.spiceLevels.includes(level.value);
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => {
                    const newLevels = isSelected
                      ? formData.spiceLevels.filter((l) => l !== level.value)
                      : [...formData.spiceLevels, level.value];
                    onUpdate({ spiceLevels: newLevels as Array<"none" | "mild" | "medium" | "hot" | "extra-hot"> });
                  }}
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

        {/* Portion Sizes — compact rows */}
        <div>
          <div className="flex items-center justify-between mb-[var(--p-space-300)]">
            <div>
              <Label>Portion Sizes</Label>
              <HelpText>At least one portion size is required.</HelpText>
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
              {formData.portionSizes.map((portionSize, index) => (
                <div key={index} className="flex items-start gap-[var(--p-space-200)] p-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)]">
                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-3 gap-[var(--p-space-200)]">
                    <div>
                      <Label className="text-[0.6875rem]">Label</Label>
                      {portionLabelsLoading ? (
                        <Skeleton className="h-[2.25rem] w-full rounded-[var(--p-border-radius-200)]" />
                      ) : (
                        <SearchableSelect
                          options={portionLabels?.map((l) => ({ value: l.id, label: l.label })) || []}
                          value={portionSize.portionLabelId}
                          onValueChange={(v) => updatePortionSize(index, { portionLabelId: v })}
                          placeholder="Select"
                          searchPlaceholder="Search..."
                          emptyMessage="None found."
                          error={!!errors[`portionSizes.${index}.portionLabelId`]}
                        />
                      )}
                      <FieldError message={errors[`portionSizes.${index}.portionLabelId`]} />
                    </div>
                    <div>
                      <Label className="text-[0.6875rem]">Size</Label>
                      <Input
                        value={String(portionSize.size || "")}
                        onChange={(e) => updatePortionSize(index, { size: e.target.value })}
                        placeholder="e.g., Small"
                        error={!!errors[`portionSizes.${index}.size`]}
                      />
                      <FieldError message={errors[`portionSizes.${index}.size`]} />
                    </div>
                    <div>
                      <Label className="text-[0.6875rem]">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={portionSize.price === 0 ? "" : portionSize.price}
                        onChange={(e) => {
                          const v = e.target.value;
                          updatePortionSize(index, { price: v === "" ? 0 : parseFloat(v) || 0 });
                        }}
                        placeholder="0.00"
                        error={!!errors[`portionSizes.${index}.price`]}
                      />
                      <FieldError message={errors[`portionSizes.${index}.price`]} />
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
              ))}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <Label>Ingredients</Label>
            {formData.ingredientIds.length > 0 && (
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={clearAllIngredients}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          {ingredientsLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Popover
              open={ingredientPopoverOpen}
              onOpenChange={setIngredientPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  ref={ingredientTriggerRef}
                  variant="secondary"
                  className="w-full justify-start min-h-[2.25rem] text-[0.8125rem] font-[var(--p-font-weight-regular)]"
                >
                  {formData.ingredientIds.length === 0
                    ? "Select ingredients"
                    : `${formData.ingredientIds.length} selected`}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={
                  ingredientPopoverWidth
                    ? { width: `${ingredientPopoverWidth}px` }
                    : undefined
                }
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search ingredients..."
                    value={ingredientSearch}
                    onValueChange={setIngredientSearch}
                  />
                  <CommandList>
                    {filteredIngredients.length === 0 && !ingredientsLoading ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No ingredients found.
                      </div>
                    ) : (
                      <CommandGroup>
                        <div className="max-h-60 overflow-y-auto p-2 relative">
                          {ingredientsLoading &&
                            filteredIngredients.length === 0 && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                                <div className="text-center">
                                  <Spinner size="small" />
                                  <p className="text-xs text-muted-foreground">
                                    Searching...
                                  </p>
                                </div>
                              </div>
                            )}
                          {ingredientsLoading &&
                            filteredIngredients.length > 0 && (
                              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-1 mb-1 border-b">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                                  <Spinner size="small" />
                                  <span>Updating results...</span>
                                </div>
                              </div>
                            )}
                          {filteredIngredients.map((ingredient) => {
                            // Handle both ImageAsset and string image types
                            const imageUrl =
                              typeof ingredient.image === "string"
                                ? ingredient.image
                                : ingredient.image?.url || null;
                            const isChecked = formData.ingredientIds.includes(
                              ingredient.id
                            );

                            return (
                              <div
                                key={ingredient.id}
                                className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                                onClick={(e) =>
                                  toggleIngredient(ingredient.id, e)
                                }
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => {
                                    toggleIngredient(ingredient.id);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                />
                                {imageUrl && (
                                  <div className="relative h-8 w-8 rounded overflow-hidden shrink-0">
                                    <OptimizedImage
                                      src={imageUrl}
                                      alt={ingredient.name}
                                      fill
                                      sizes="32px"
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <Label className="flex-1 cursor-pointer pointer-events-none">
                                  {ingredient.name}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {formData.ingredientIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredientIds.map((id) => {
                // Try to get from current ingredients first, then from cache
                const ingredient = ingredients?.find((i) => i.id === id);
                const cachedIngredient = selectedIngredientsCache.get(id);
                const displayIngredient = ingredient || cachedIngredient;

                return displayIngredient ? (
                  <Badge key={id} tone="default" className="gap-1">
                    {displayIngredient.name}
                    <button
                      type="button"
                      onClick={() => toggleIngredient(id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full"
                    >
                      <XSmallIcon className="size-3 fill-current" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Allergens */}
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <Label>Allergens</Label>
            {formData.allergenIds.length > 0 && (
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={clearAllAllergens}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          {allergensLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Popover
              open={allergenPopoverOpen}
              onOpenChange={setAllergenPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  ref={allergenTriggerRef}
                  variant="secondary"
                  className="w-full justify-start min-h-[2.25rem] text-[0.8125rem] font-[var(--p-font-weight-regular)]"
                >
                  {formData.allergenIds.length === 0
                    ? "Select allergens"
                    : `${formData.allergenIds.length} selected`}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={
                  allergenPopoverWidth
                    ? { width: `${allergenPopoverWidth}px` }
                    : undefined
                }
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search allergens..."
                    value={allergenSearch}
                    onValueChange={setAllergenSearch}
                  />
                  <CommandList>
                    {filteredAllergens.length === 0 && (
                      <div className="py-6 text-center text-sm">
                        No allergens found.
                      </div>
                    )}
                    <CommandGroup>
                      <div className="max-h-60 overflow-y-auto p-2">
                        {filteredAllergens.map((allergen) => {
                          const isChecked = formData.allergenIds.includes(
                            allergen.id
                          );

                          return (
                            <div
                              key={allergen.id}
                              className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                              onClick={(e) => toggleAllergen(allergen.id, e)}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => {
                                  toggleAllergen(allergen.id);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                              <Label className="flex-1 cursor-pointer pointer-events-none">
                                {allergen.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {formData.allergenIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.allergenIds.map((id) => {
                const allergen = allergens?.find((a) => a.id === id);
                return allergen ? (
                  <Badge key={id} tone="default" className="gap-1">
                    {allergen.name}
                    <button
                      type="button"
                      onClick={() => toggleAllergen(id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full"
                    >
                      <XSmallIcon className="size-3 fill-current" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Dietary Labels */}
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <Label>Dietary Labels</Label>
            {formData.dietaryLabelIds.length > 0 && (
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={clearAllDietaryLabels}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          {dietaryLabelsLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Popover
              open={dietaryLabelPopoverOpen}
              onOpenChange={setDietaryLabelPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  ref={dietaryLabelTriggerRef}
                  variant="secondary"
                  className="w-full justify-start min-h-[2.25rem] text-[0.8125rem] font-[var(--p-font-weight-regular)]"
                >
                  {formData.dietaryLabelIds.length === 0
                    ? "Select dietary labels"
                    : `${formData.dietaryLabelIds.length} selected`}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={
                  dietaryLabelPopoverWidth
                    ? { width: `${dietaryLabelPopoverWidth}px` }
                    : undefined
                }
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search dietary labels..."
                    value={dietaryLabelSearch}
                    onValueChange={setDietaryLabelSearch}
                  />
                  <CommandList>
                    {filteredDietaryLabels.length === 0 && (
                      <div className="py-6 text-center text-sm">
                        No dietary labels found.
                      </div>
                    )}
                    <CommandGroup>
                      <div className="max-h-60 overflow-y-auto p-2">
                        {filteredDietaryLabels.map((label) => {
                          const isChecked = formData.dietaryLabelIds.includes(
                            label.id
                          );

                          return (
                            <div
                              key={label.id}
                              className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                              onClick={(e) => toggleDietaryLabel(label.id, e)}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => {
                                  toggleDietaryLabel(label.id);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                              <Label className="flex-1 cursor-pointer pointer-events-none">
                                {label.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {formData.dietaryLabelIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.dietaryLabelIds.map((id) => {
                const label = dietaryLabels?.find((l) => l.id === id);
                return label ? (
                  <Badge key={id} tone="default" className="gap-1">
                    {label.name}
                    <button
                      type="button"
                      onClick={() => toggleDietaryLabel(id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full"
                    >
                      <XSmallIcon className="size-3 fill-current" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
