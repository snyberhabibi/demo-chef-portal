"use client";

/**
 * Edit Pickup Address Page
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAddress,
  useCreateAddress,
  useUpdateAddress,
} from "@/hooks/use-addresses";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { useLoading } from "@/contexts/loading-context";
import { LocationIcon } from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Textarea,
  Label,
  HelpText,
  Checkbox,
  Spinner,
  AddressAutocomplete,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import type {
  AddressSearchResult,
  CreateAddressData,
} from "@/types/addresses.types";

const addressFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(1, "Street address is required"),
  apartment: z.union([z.string(), z.literal("")]).optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  fullAddress: z.string().min(1, "Full address is required"),
  pickupInstructions: z
    .string()
    .max(350, "Pickup instructions must be 350 characters or less")
    .optional(),
  isDefault: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  googlePlaceId: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function EditAddressPage() {
  const router = useRouter();
  const { data: address, isLoading: isLoadingAddress } = useAddress();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const { showLoading, hideLoading } = useLoading();

  const [selectedAddress, setSelectedAddress] =
    useState<AddressSearchResult | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: "My Kitchen",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      fullAddress: "",
      pickupInstructions: "",
      isDefault: true,
      latitude: undefined,
      longitude: undefined,
      googlePlaceId: undefined,
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        label: address.label,
        street: address.street,
        apartment: address.apartment || "",
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        fullAddress: address.fullAddress,
        pickupInstructions: address.pickupInstructions || "",
        isDefault: address.isDefault,
        latitude: address.latitude || undefined,
        longitude: address.longitude || undefined,
      });
      setSelectedAddress({
        placeId: address.id,
        description: address.fullAddress,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        latitude: address.latitude || undefined,
        longitude: address.longitude || undefined,
      });
    }
  }, [address, form]);

  const handleAddressSelect = (result: AddressSearchResult) => {
    setSelectedAddress(result);
    form.setValue("street", result.street);
    form.setValue("city", result.city);
    form.setValue("state", result.state);
    form.setValue("zipCode", result.zipCode);
    form.setValue("country", result.country);
    form.setValue("fullAddress", result.description);
    if (result.latitude !== undefined) form.setValue("latitude", result.latitude);
    if (result.longitude !== undefined) form.setValue("longitude", result.longitude);
    if (result.placeId) form.setValue("googlePlaceId", result.placeId);
  };

  const handleAddressClear = () => {
    setSelectedAddress(null);
    form.setValue("street", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.setValue("zipCode", "");
    form.setValue("country", "US");
    form.setValue("fullAddress", "");
    form.setValue("apartment", "");
    form.setValue("latitude", undefined);
    form.setValue("longitude", undefined);
    form.setValue("googlePlaceId", undefined);
  };

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors);
    showValidationToast(messages, toast);
  };

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      showLoading();
      if (address) {
        await updateMutation.mutateAsync({ id: address.id, ...values });
        toast.success("Pickup address updated successfully");
      } else {
        await createMutation.mutateAsync(values as CreateAddressData);
        toast.success("Pickup address added successfully");
      }
      router.push("/dashboard/addresses");
    } catch (error) {
      console.error("Failed to save address:", error);
      const mapped = mapServerError(error);
      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          const fieldName = field.toLowerCase() as keyof AddressFormValues;
          if (fieldName in values) {
            form.setError(fieldName, { type: "server", message });
          }
        });
      }
      const fallback = address ? "Failed to update pickup address" : "Failed to add pickup address";
      showValidationToast(
        mapped.toastMessages.length > 0 ? mapped.toastMessages : [fallback],
        toast
      );
    } finally {
      hideLoading();
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;
  const watchedValues = useWatch({ control: form.control });
  const pickupLength = watchedValues.pickupInstructions?.length || 0;

  // Loading state
  if (isLoadingAddress) {
    return (
      <div>
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
          <Breadcrumb items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Pickup Address", onClick: () => router.push("/dashboard/addresses") },
            { label: "Edit" },
          ]} />
        </div>
        <Card className="!rounded-t-none space-y-[var(--p-space-500)]">
          <div className="space-y-[var(--p-space-200)]">
            <div className="h-6 w-48 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            <div className="h-4 w-64 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          </div>
          <div className="space-y-[var(--p-space-400)] max-w-2xl">
            <div className="space-y-[var(--p-space-150)]">
              <div className="h-3 w-24 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
              <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
            <div className="space-y-[var(--p-space-150)]">
              <div className="h-3 w-32 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
              <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
            <div className="space-y-[var(--p-space-150)]">
              <div className="h-3 w-36 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
              <div className="h-24 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
            <div className="h-14 w-full rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Pickup Address", onClick: () => router.push("/dashboard/addresses") },
          { label: address ? "Edit" : "Add" },
        ]} />
      </div>

      <Card className="!rounded-t-none">
        <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)}>
          {/* Header */}
          <header className="mb-[var(--p-space-500)]">
            <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
              {address ? "Edit Pickup Address" : "Add Pickup Address"}
            </h1>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
              {address ? "Update your pickup address information" : "Set your pickup address for order collection"}
            </p>
          </header>

          {/* Form fields */}
          <div className="space-y-[var(--p-space-400)] max-w-2xl">
            {/* Address Search */}
            <div className="space-y-[var(--p-space-150)]">
              <Label>Search Address</Label>
              <AddressAutocomplete
                value={watchedValues.fullAddress || ""}
                onChange={(value) => {
                  form.setValue("fullAddress", value);
                  if (!value) handleAddressClear();
                }}
                onSelect={handleAddressSelect}
                onClear={handleAddressClear}
              />
              <FieldError message={form.formState.errors.fullAddress?.message} />
            </div>

            {/* Apartment */}
            <div className="space-y-[var(--p-space-150)]">
              <Label htmlFor="apartment">Apartment / Suite (Optional)</Label>
              <Input
                id="apartment"
                placeholder="Suite 200, Apt 5B"
                {...form.register("apartment")}
              />
            </div>

            {/* Pickup Instructions */}
            <div className="space-y-[var(--p-space-150)]">
              <Label htmlFor="pickupInstructions">Pickup Instructions (Optional)</Label>
              <Textarea
                id="pickupInstructions"
                placeholder="Enter any special instructions for delivery companies picking up orders..."
                className="resize-none"
                rows={4}
                maxLength={350}
                {...form.register("pickupInstructions")}
              />
              <div className="flex items-center justify-between">
                <FieldError message={form.formState.errors.pickupInstructions?.message} />
                <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)] tabular-nums ml-auto">
                  {pickupLength}/350
                </span>
              </div>
            </div>

            {/* Hidden fields for form state */}
            <input type="hidden" {...form.register("label")} />
            <input type="hidden" {...form.register("street")} />
            <input type="hidden" {...form.register("city")} />
            <input type="hidden" {...form.register("state")} />
            <input type="hidden" {...form.register("zipCode")} />
            <input type="hidden" {...form.register("country")} />

            {/* Default Address */}
            <div className="flex items-start gap-[var(--p-space-300)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] p-[var(--p-space-400)]">
              <Checkbox
                checked={watchedValues.isDefault}
                onCheckedChange={(checked) => form.setValue("isDefault", !!checked)}
              />
              <div>
                <Label className="cursor-pointer" onClick={() => form.setValue("isDefault", !watchedValues.isDefault)}>
                  Set as primary pickup address
                </Label>
                <HelpText>This address will be used for order pickups</HelpText>
              </div>
            </div>

            {/* Selected Address Preview */}
            {selectedAddress && watchedValues.fullAddress && (
              <div className="rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-surface-secondary)] p-[var(--p-space-400)]">
                <p className="text-[0.75rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
                  Your full address is:
                </p>
                <div className="flex items-start gap-[var(--p-space-200)]">
                  <LocationIcon className="size-5 fill-[var(--p-color-icon)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[0.875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                      {watchedValues.street}
                    </p>
                    {watchedValues.apartment && (
                      <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                        {watchedValues.apartment}
                      </p>
                    )}
                    <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                      {watchedValues.city}, {watchedValues.state} {watchedValues.zipCode}
                    </p>
                    <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                      {watchedValues.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[var(--p-space-200)] pt-[var(--p-space-500)] mt-[var(--p-space-500)] border-t border-[var(--p-color-border-secondary)]">
            <Button type="button" variant="tertiary" onClick={() => router.push("/dashboard/addresses")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Spinner size="small" />}
              {isBusy ? "Saving..." : address ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
