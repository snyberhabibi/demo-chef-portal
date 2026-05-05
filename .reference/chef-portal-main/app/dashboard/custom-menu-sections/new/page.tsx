"use client";

/**
 * Create Custom Menu Section Page
 *
 * Stacked layout: details section, then full-width dish picker,
 * all within a single card separated by dividers.
 */

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { PlusIcon } from "@shopify/polaris-icons";
import { BundleDishPickerCard } from "@/components/features/bundles/bundle-dish-picker-card";
import {
  Breadcrumb,
  Button,
  Card,
  CardDivider,
  Input,
  Textarea,
  Label,
  HelpText,
  Switch,
  Spinner,
  SearchBar,
  EmptyState,
  SkeletonCard,
} from "@/components/polaris";
import { useDishes } from "@/hooks/use-dishes";
import { useCreateCustomMenuSection } from "@/hooks/use-custom-menu-sections";
import { FieldError } from "@/components/shared/field-error";

const customMenuSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.union([z.string().max(350, "Description must be 350 characters or less"), z.literal("")]).optional(),
  dishes: z.array(z.string()).min(1, "Select at least one dish"),
  sortOrder: z.coerce
    .number()
    .positive({ message: "Sort order must be a number greater than 0" })
    .default(1),
  isActive: z.boolean().default(false),
});

type CustomMenuSectionFormValues = z.infer<typeof customMenuSectionSchema>;

export default function CreateCustomMenuSectionPage() {
  const router = useRouter();
  const createMutation = useCreateCustomMenuSection();
  const [dishSearch, setDishSearch] = useState("");

  const { data: dishesData, isLoading: dishesLoading } = useDishes({
    page: 1,
    limit: 100,
    status: "published",
  });

  const form = useForm<CustomMenuSectionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customMenuSectionSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      dishes: [],
      sortOrder: 1,
      isActive: false,
    },
  });

  const selectedDishIds = useWatch({
    control: form.control,
    name: "dishes",
    defaultValue: [],
  });
  const allDishes = dishesData?.data || [];
  const filteredDishes = dishSearch
    ? allDishes.filter((d) => d.name.toLowerCase().includes(dishSearch.toLowerCase()))
    : allDishes;

  const handleToggleDish = (dishId: string) => {
    const currentIds = form.getValues("dishes");
    const newIds = currentIds.includes(dishId)
      ? currentIds.filter((id) => id !== dishId)
      : [...currentIds, dishId];
    form.setValue("dishes", newIds);
  };

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors, { title: "Section title", dishes: "Dishes" });
    showValidationToast(messages, toast);
  };

  const onSubmit = async (values: CustomMenuSectionFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.title,
        description: values.description || null,
        dishes: values.dishes,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
      });
      toast.success("Custom menu section created successfully!");
      router.push("/dashboard/custom-menu-sections");
    } catch (error) {
      console.error("Create custom menu section error:", error);
      const mapped = mapServerError(error);
      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof CustomMenuSectionFormValues, { type: "server", message });
        });
      }
      showValidationToast(
        mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to create custom menu section"],
        toast
      );
    }
  };

  const isBusy = createMutation.isPending;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Custom Menu Sections", onClick: () => router.push("/dashboard/custom-menu-sections") },
          { label: "Create" },
        ]} />
      </div>

      {/* Single card */}
      <Card className="!rounded-t-none">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--p-space-300)] mb-[var(--p-space-500)]">
            <div>
              <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
                Create Custom Menu Section
              </h1>
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                Organize your dishes into a custom section
              </p>
            </div>
            <div className="flex items-center gap-[var(--p-space-200)]">
              <Button type="button" variant="tertiary" onClick={() => router.push("/dashboard/custom-menu-sections")}>
                Discard
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit, onInvalid)()}
                disabled={isBusy}
              >
                {isBusy ? <Spinner size="small" /> : <PlusIcon className="size-4 fill-current" />}
                {isBusy ? "Creating..." : "Create Section"}
              </Button>
            </div>
          </header>

          {/* Section Details */}
          <section>
            <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] mb-[var(--p-space-400)]">
              Section Details
            </h3>
            <div className="grid gap-[var(--p-space-400)] sm:grid-cols-2 max-w-2xl">
              <div className="space-y-[var(--p-space-150)]">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Popular Dishes, Healthy Options"
                  {...form.register("title")}
                />
                <FieldError message={form.formState.errors.title?.message} />
              </div>

              <div className="space-y-[var(--p-space-150)]">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="1.0"
                  {...form.register("sortOrder")}
                />
                <HelpText>Lower numbers appear first</HelpText>
                <FieldError message={form.formState.errors.sortOrder?.message} />
              </div>

              <div className="sm:col-span-2 space-y-[var(--p-space-150)]">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this section contains..."
                  className="resize-y min-h-[100px]"
                  maxLength={350}
                  {...form.register("description")}
                />
                <div className="flex items-center justify-between">
                  <FieldError message={form.formState.errors.description?.message} />
                  <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)] tabular-nums ml-auto">
                    {(form.watch("description") || "").length}/350
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center justify-between rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] p-[var(--p-space-400)]">
                <div>
                  <Label>Publish Section</Label>
                  <HelpText>When active, this section is visible on your store-front</HelpText>
                </div>
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) => form.setValue("isActive", checked)}
                />
              </div>
            </div>
          </section>

          <CardDivider className="my-[var(--p-space-500)]" />

          {/* Dish Selection */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--p-space-300)] mb-[var(--p-space-400)]">
              <div>
                <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  Select Dishes
                  <span className="text-[var(--p-color-text-secondary)] font-[var(--p-font-weight-regular)] ml-[var(--p-space-100)]">
                    ({selectedDishIds.length} selected)
                  </span>
                </h3>
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                  Click cards to select or deselect
                </p>
                <FieldError message={form.formState.errors.dishes?.message} />
              </div>
              {allDishes.length > 0 && (
                <div className="w-full sm:max-w-xs">
                  <SearchBar
                    value={dishSearch}
                    onChange={setDishSearch}
                    placeholder="Search dishes..."
                  />
                </div>
              )}
            </div>

            {dishesLoading ? (
              <div className="@container">
                <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 @[70rem]:grid-cols-5 gap-[var(--p-space-400)]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            ) : allDishes.length === 0 ? (
              <EmptyState
                heading="No Published Dishes"
                description="Publish your dishes first before adding them to a section."
                primaryAction={{
                  label: "Go to Dishes",
                  onClick: () => router.push("/dashboard/dishes"),
                }}
              />
            ) : filteredDishes.length === 0 ? (
              <div className="py-[var(--p-space-800)] text-center">
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                  No dishes matching &ldquo;{dishSearch}&rdquo;
                </p>
                <Button type="button" variant="tertiary" className="mt-[var(--p-space-200)]" onClick={() => setDishSearch("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="@container">
                <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 @[70rem]:grid-cols-5 gap-[var(--p-space-400)]">
                  {filteredDishes.map((dish) => (
                    <BundleDishPickerCard
                      key={dish.id}
                      dish={dish}
                      isSelected={selectedDishIds.includes(dish.id)}
                      onToggle={() => handleToggleDish(dish.id)}
                      showQuantity={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </form>
      </Card>
    </div>
  );
}
