"use client";

/**
 * Edit Bundle Page
 * FormWizard layout with sidebar navigation — prefilled with existing bundle data
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLoading } from "@/contexts/loading-context";
import { useUpdateBundle } from "@/hooks/use-bundles";
import { bundlesService } from "@/services/bundles.service";
import type { BundleFormData } from "@/app/dashboard/bundles/new/page";
import type { BundleApiResponse } from "@/types/bundles.types";
import type { CreateBundlePayload } from "@/services/bundles.service";
import { toast } from "@/components/ui/toast";
import {
  Button,
  Card,
  Badge,
  Banner,
  Breadcrumb,
  Spinner,
  FormWizard,
  FormWizardSkeleton,
} from "@/components/polaris";
import type { WizardStep } from "@/components/polaris";
import { BundleDetailsSection } from "@/components/features/bundles/bundle-details-section";
import { MediaUploadSection } from "@/components/shared/media-upload-section";
import { BundleDishesSection } from "@/components/features/bundles/bundle-dishes-section";
import { BundleSpecsSection } from "@/components/features/bundles/bundle-specs-section";
import { BundleCustomizationsSection } from "@/components/features/bundles/bundle-customizations-section";
import { BundleAvailabilitySection } from "@/components/features/bundles/bundle-availability-section";
import { BundlePreviewCard } from "@/components/features/bundles/bundle-preview-card";
import { mapServerError, getFieldSection, formatZodErrors, showValidationToast } from "@/lib/validation-error-mapper";

import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

const bundleFormSchema = z.object({
  name: z.string().min(1, "Bundle name is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  items: z
    .array(
      z.object({
        dishId: z.string(),
        dishName: z.string(),
        dishImage: z.string().optional(),
        quantity: z.number().min(1),
      })
    )
    .min(2, "At least 2 items are required for a bundle"),
  spiceLevels: z
    .array(z.enum(["none", "mild", "medium", "hot", "extraHot"]))
    .default([]),
  portionSizes: z
    .array(
      z.object({
        portionLabelId: z.string().min(1, "Portion label is required"),
        size: z.string().min(1, "Size is required"),
        regularPrice: z.number().min(0.01, "Regular price must be greater than 0"),
        salePrice: z.number().min(0, "Sale price must be 0 or greater"),
      }).refine(
        (ps) => ps.salePrice === 0 || ps.salePrice <= ps.regularPrice,
        { message: "Sale price cannot exceed regular price", path: ["salePrice"] }
      )
    )
    .min(1, "At least one portion size is required"),
  customizationGroups: z
    .array(
      z.object({
        modifierGroupId: z.string().min(1, "Modifier group is required"),
        title: z.string().optional(),
        required: z.boolean(),
        requiredDescription: z.string().optional(),
        selectionType: z.enum(["single", "multiple"]),
        modifiers: z.array(
          z.object({
            name: z.string().min(1, "Modifier name is required"),
            priceAdjustment: z.number(),
            description: z.string().optional(),
          })
        ).min(1, "At least one modifier is required"),
      })
    )
    .default([]),
  imageIds: z.array(z.string()).default([]),
  mediaData: z
    .array(
      z.object({
        publicUrl: z.string(),
        alt: z.string(),
        isPrimary: z.boolean().optional(),
        dishMediaId: z.string().optional(),
      })
    )
    .optional(),
  availability: z.array(z.string()).default([]),
  maxQuantityPerDay: z
    .union([z.number().min(1, "Maximum quantity must be at least 1"), z.null()])
    .optional(),
  leadTime: z.number({ error: "Lead time is required" }).min(0, "Lead time must be 0 or greater"),
}).refine(
  (data) => {
    if (data.status === "published") {
      const hasImageIds = data.imageIds && data.imageIds.length > 0;
      const hasMediaData = data.mediaData && data.mediaData.length > 0;
      return hasImageIds || hasMediaData;
    }
    return true;
  },
  {
    message: "Please add at least one image to publish this bundle.",
    path: ["imageIds"],
  }
);

/**
 * Transform BundleApiResponse to BundleFormData
 */
function transformApiBundleToFormData(
  apiBundle: BundleApiResponse
): BundleFormData {
  const spiceLevels = ((apiBundle.spiceLevels || []) as string[]).map(
    (level) => level as "none" | "mild" | "medium" | "hot" | "extraHot"
  );

  const items = (apiBundle.items || []).map((item) => ({
    dishId: typeof item.dish === "string" ? item.dish : item.dish?.id || "",
    dishName:
      typeof item.dish === "string"
        ? ""
        : item.dish?.name || "Unknown Dish",
    dishImage:
      typeof item.dish === "string"
        ? undefined
        : item.dish?.primaryImageUrl || undefined,
    quantity: item.quantity,
  }));

  const portionSizes = (apiBundle.portionSizes || []).map((ps) => ({
    portionLabelId:
      typeof ps.portionLabel === "string"
        ? ps.portionLabel
        : ps.portionLabel?.id || "",
    size: ps.size,
    regularPrice: ps.regularPrice,
    salePrice: ps.salePrice ?? ps.regularPrice,
  }));

  let mediaData: Array<{
    publicUrl: string;
    alt: string;
    isPrimary?: boolean;
    dishMediaId?: string;
  }> = [];

  if (
    apiBundle.images &&
    Array.isArray(apiBundle.images) &&
    apiBundle.images.length > 0
  ) {
    mediaData = apiBundle.images
      .filter(
        (img) =>
          img.url && typeof img.url === "string" && img.url.trim().length > 0
      )
      .map((img) => ({
        publicUrl: img.url,
        alt:
          img.alt ||
          img.url
            .split("/")
            .pop()
            ?.replace(/\.[^/.]+$/, "") ||
          "",
        isPrimary: img.isPrimary || false,
        dishMediaId: img.id,
      }));
  }

  const availability = (apiBundle.availability || []).map((avail) =>
    typeof avail === "string" ? avail : (avail as { weekday: string }).weekday
  );

  interface ApiCustomizationGroup {
    modifierGroup: string | { id: string } | undefined;
    title?: string;
    required?: boolean;
    requiredDescription?: string;
    selectionType?: "single" | "multiple";
    modifiers?: Array<{
      name?: string;
      priceAdjustment?: number;
      description?: string;
    }>;
  }

  const customizationGroups = (apiBundle.customizationGroups || []).map(
    (group: unknown) => {
      const apiGroup = group as ApiCustomizationGroup;
      return {
        modifierGroupId:
          typeof apiGroup.modifierGroup === "string"
            ? apiGroup.modifierGroup
            : apiGroup.modifierGroup?.id || "",
        title: apiGroup.title || "",
        required: apiGroup.required || false,
        requiredDescription: apiGroup.requiredDescription || "",
        selectionType: apiGroup.selectionType || "single",
        modifiers: (apiGroup.modifiers || []).map((mod) => ({
          name: (mod.name || "").trim(),
          priceAdjustment: mod.priceAdjustment ?? 0,
          description: (mod.description || "").trim(),
        })),
      };
    }
  );

  return {
    name: apiBundle.name,
    description: apiBundle.description || "",
    status: apiBundle.status,
    leadTime: apiBundle.leadTime ?? null,
    items,
    hasSpiceLevel: spiceLevels.length > 0,
    spiceLevels,
    portionSizes,
    customizationGroups,
    imageIds: [],
    mediaData: mediaData.length > 0 ? mediaData : undefined,
    availability,
    maxQuantityPerDay: apiBundle.maxQuantityPerDay || null,
  };
}

export default function EditBundlePage() {
  const router = useRouter();
  const params = useParams();
  const bundleId = params.id as string;
  const { showLoading, hideLoading } = useLoading();
  const updateBundleMutation = useUpdateBundle();
  const [activeTab, setActiveTab] = useState("details");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageCreatingMedia, setIsImageCreatingMedia] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch bundle data
  const {
    data: bundleResponse,
    isLoading: isLoadingBundle,
    isError: isErrorLoadingBundle,
    error: bundleError,
  } = useQuery({
    queryKey: ["bundle", bundleId, "edit"],
    queryFn: async () => {
      const response = await bundlesService.getBundleById(bundleId);
      return response.data;
    },
    enabled: !!bundleId,
    staleTime: 0,
    refetchOnMount: true,
  });

  const [formData, setFormData] = useState<BundleFormData>({
    name: "",
    description: "",
    status: "draft",
    leadTime: null,
    items: [],
    hasSpiceLevel: false,
    spiceLevels: [],
    portionSizes: [],
    customizationGroups: [],
    imageIds: [],
    availability: [],
    maxQuantityPerDay: null,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [originalBundleData, setOriginalBundleData] =
    useState<BundleFormData | null>(null);

  // Prefill form when bundle data loads
  useEffect(() => {
    if (bundleResponse) {
      const transformedData = transformApiBundleToFormData(bundleResponse);

      if (transformedData.mediaData && transformedData.mediaData.length > 0) {
        const filteredMediaData = transformedData.mediaData.filter(
          (m) =>
            m.publicUrl &&
            typeof m.publicUrl === "string" &&
            m.publicUrl.trim().length > 0
        );

        if (filteredMediaData.length > 0) {
          transformedData.mediaData = filteredMediaData;
        } else {
          transformedData.mediaData = undefined;
        }
      }

      const timeoutId = setTimeout(() => {
        const originalDataCopy =
          typeof structuredClone !== "undefined"
            ? structuredClone(transformedData)
            : JSON.parse(JSON.stringify(transformedData));
        setOriginalBundleData(originalDataCopy);
        setFormData(transformedData);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [bundleResponse]);

  // Handle image deletion
  const handleRemoveImage = async (imageIndex: number) => {
    if (!formData.mediaData || imageIndex >= formData.mediaData.length) {
      return;
    }

    const imageToRemove = formData.mediaData[imageIndex];

    if (imageToRemove.dishMediaId) {
      try {
        const currentBundle = await bundlesService.getBundleById(bundleId);

        if (!currentBundle.data?.images) {
          throw new Error("Failed to get current bundle images");
        }

        const remainingImages = currentBundle.data.images
          .filter((img) => img.id !== imageToRemove.dishMediaId)
          .map((img) => ({
            image: img.id,
            isPrimary: img.isPrimary,
          }));

        await updateBundleMutation.mutateAsync({
          id: bundleId,
          data: {
            images: remainingImages,
          },
        });

        const updatedMediaData = formData.mediaData.filter(
          (_, i) => i !== imageIndex
        );
        updateFormData({
          mediaData: updatedMediaData.length > 0 ? updatedMediaData : undefined,
        });

        toast.success("Image removed successfully");
      } catch (error) {
        console.error("Failed to remove image:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to remove image. Please try again."
        );
        throw error;
      }
    } else {
      const updatedMediaData = formData.mediaData.filter(
        (_, i) => i !== imageIndex
      );
      updateFormData({
        mediaData: updatedMediaData.length > 0 ? updatedMediaData : undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = bundleFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const { fieldErrors: newFieldErrors, messages } = formatZodErrors(
        validationResult.error.issues,
        { name: "Bundle name", items: "Bundle items", regularPrice: "Regular price", salePrice: "Sale price" }
      );

      setFieldErrors(newFieldErrors);
      showValidationToast(messages, toast);

      const firstErrorPath = validationResult.error.issues[0]?.path;
      if (firstErrorPath && firstErrorPath.length > 0) {
        const firstField = firstErrorPath.map(String).join(".");
        const sectionId = getFieldSection(firstField);
        setActiveTab(sectionId);
      }

      return;
    }

    setFieldErrors({});
    showLoading();

    try {
      const bundleData: CreateBundlePayload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status,
        items: formData.items.map((item) => ({
          dish: item.dishId,
          quantity: item.quantity,
        })),
        portionSizes: formData.portionSizes.map((ps) => ({
          portionLabel: ps.portionLabelId,
          size: ps.size.trim(),
          regularPrice: ps.regularPrice,
          salePrice: ps.salePrice != null && ps.salePrice > 0
            ? ps.salePrice
            : ps.regularPrice,
        })),
      };

      if (formData.spiceLevels.length > 0) {
        bundleData.spiceLevels = formData.spiceLevels;
      }
      bundleData.leadTime = formData.leadTime!;
      if (formData.availability.length > 0) {
        bundleData.availability = formData.availability;
      }
      if (formData.maxQuantityPerDay !== null) {
        bundleData.maxQuantityPerDay = formData.maxQuantityPerDay;
      }
      if (formData.customizationGroups.length > 0) {
        bundleData.customizationGroups = formData.customizationGroups.map(
          (group) => ({
            modifierGroup: group.modifierGroupId,
            required: group.required,
            selectionType: group.selectionType,
            modifiers: group.modifiers.map((mod) => ({
              name: mod.name.trim(),
              priceAdjustment: mod.priceAdjustment,
              description: mod.description?.trim() || undefined,
            })),
          })
        );
      }

      if (formData.mediaData && formData.mediaData.length > 0) {
        const mediaWithIds = formData.mediaData.filter((m) => m.dishMediaId);

        if (mediaWithIds.length > 0) {
          bundleData.images = mediaWithIds.map((media, index) => ({
            image: media.dishMediaId!,
            isPrimary: media.isPrimary || index === 0,
          }));
        }
      } else {
        bundleData.images = [];
      }

      await updateBundleMutation.mutateAsync({
        id: bundleId,
        data: bundleData,
      });

      hideLoading();
      toast.success("Bundle updated successfully");
      router.push("/dashboard/bundles");
    } catch (error) {
      hideLoading();
      console.error("Failed to update bundle:", error);

      const mapped = mapServerError(error);

      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        setFieldErrors(mapped.fieldErrors);
        showValidationToast(
          mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to update bundle. Please try again."],
          toast
        );

        const firstField = Object.keys(mapped.fieldErrors)[0];
        if (firstField) {
          const sectionId = getFieldSection(firstField);
          setActiveTab(sectionId);
        }
      } else {
        const message = mapped.toastMessages[0] || "Failed to update bundle. Please try again.";
        toast.error(message);
      }
    }
  };

  const updateFormData = useCallback((updates: Partial<BundleFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    const updatedFields = Object.keys(updates);
    if (updatedFields.length > 0) {
      setFieldErrors((prevErrors) => {
        if (Object.keys(prevErrors).length === 0) return prevErrors;
        const newErrors = { ...prevErrors };
        updatedFields.forEach((field) => {
          Object.keys(newErrors).forEach((errorPath) => {
            if (errorPath === field || errorPath.startsWith(`${field}.`)) {
              delete newErrors[errorPath];
            }
          });
        });
        return newErrors;
      });
    }
  }, []);

  // Compare current formData with original bundle data to detect changes
  const hasChangesFromOriginal = useMemo(() => {
    if (!originalBundleData || !bundleResponse) {
      return false;
    }

    const arraysEqual = (a: unknown[], b: unknown[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    const portionSizesEqual = (
      a: BundleFormData["portionSizes"],
      b: BundleFormData["portionSizes"]
    ): boolean => {
      if (a.length !== b.length) return false;
      return a.every((psA, idx) => {
        const psB = b[idx];
        return (
          psA.portionLabelId === psB.portionLabelId &&
          psA.size === psB.size &&
          psA.regularPrice === psB.regularPrice &&
          psA.salePrice === psB.salePrice
        );
      });
    };

    const itemsEqual = (
      a: BundleFormData["items"],
      b: BundleFormData["items"]
    ): boolean => {
      if (a.length !== b.length) return false;
      return a.every((itemA, idx) => {
        const itemB = b[idx];
        return (
          itemA.dishId === itemB.dishId &&
          itemA.quantity === itemB.quantity
        );
      });
    };

    const customizationGroupsEqual = (
      a: BundleFormData["customizationGroups"],
      b: BundleFormData["customizationGroups"]
    ): boolean => {
      if (a.length !== b.length) return false;
      return a.every((groupA, idx) => {
        const groupB = b[idx];
        if (
          groupA.modifierGroupId !== groupB.modifierGroupId ||
          groupA.required !== groupB.required ||
          groupA.selectionType !== groupB.selectionType ||
          groupA.requiredDescription !== groupB.requiredDescription ||
          groupA.modifiers.length !== groupB.modifiers.length
        ) {
          return false;
        }
        return groupA.modifiers.every((modA, modIdx) => {
          const modB = groupB.modifiers[modIdx];
          return (
            modA.name === modB.name &&
            modA.priceAdjustment === modB.priceAdjustment &&
            modA.description === modB.description
          );
        });
      });
    };

    const mediaDataEqual = (
      a?: BundleFormData["mediaData"],
      b?: BundleFormData["mediaData"]
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      const urlsA = a.map((m) => m.publicUrl).sort();
      const urlsB = b.map((m) => m.publicUrl).sort();
      return urlsA.every((url, idx) => url === urlsB[idx]);
    };

    return (
      formData.name !== originalBundleData.name ||
      formData.description !== originalBundleData.description ||
      formData.status !== originalBundleData.status ||
      formData.leadTime !== originalBundleData.leadTime ||
      !arraysEqual(formData.spiceLevels, originalBundleData.spiceLevels) ||
      formData.maxQuantityPerDay !== originalBundleData.maxQuantityPerDay ||
      !arraysEqual(formData.availability, originalBundleData.availability) ||
      !itemsEqual(formData.items, originalBundleData.items) ||
      !portionSizesEqual(
        formData.portionSizes,
        originalBundleData.portionSizes
      ) ||
      !customizationGroupsEqual(
        formData.customizationGroups,
        originalBundleData.customizationGroups
      ) ||
      !mediaDataEqual(formData.mediaData, originalBundleData.mediaData)
    );
  }, [formData, originalBundleData, bundleResponse]);

  const sectionErrorCounts = useMemo(() => {
    const sectionFieldMap: Record<string, string[]> = {
      details: ["name", "description", "status"],
      media: ["imageIds"],
      items: ["items"],
      specs: ["spiceLevels", "portionSizes"],
      availability: ["availability", "maxQuantityPerDay"],
      customizations: ["customizationGroups"],
    };

    const errorPaths = Object.keys(fieldErrors);
    const counts: Record<string, number> = {};

    Object.keys(sectionFieldMap).forEach((sectionId) => {
      const fields = sectionFieldMap[sectionId];
      counts[sectionId] = errorPaths.filter((errorPath) => {
        const firstPart = errorPath.split(".")[0];
        return (
          fields.includes(firstPart) ||
          fields.some((field) => errorPath.startsWith(field + "."))
        );
      }).length;
    });

    return counts;
  }, [fieldErrors]);

  const getSectionErrorCount = (sectionId: string): number => {
    return sectionErrorCounts[sectionId] || 0;
  };

  const isBusy = updateBundleMutation.isPending || isLoadingBundle || isImageUploading || isImageCreatingMedia;
  const noChanges = !!(originalBundleData && !hasChangesFromOriginal);

  // Loading state
  if (isLoadingBundle) {
    return (
      <div className="space-y-[var(--p-space-500)] w-full">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Bundles", onClick: () => router.push("/dashboard/bundles") },
          { label: "Edit" },
        ]} />
        <FormWizardSkeleton stepCount={6} />
      </div>
    );
  }

  // Error state
  if (isErrorLoadingBundle) {
    return (
      <div className="space-y-[var(--p-space-500)] w-full">
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)]">
          <Breadcrumb items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Bundles", onClick: () => router.push("/dashboard/bundles") },
            { label: "Edit" },
          ]} />
        </div>
        <Banner tone="critical" title="Error loading bundle">
          <p>{bundleError instanceof Error ? bundleError.message : "Failed to load bundle. Please try again."}</p>
        </Banner>
        <Button variant="tertiary" onClick={() => router.push("/dashboard/bundles")}>
          Back to Bundles
        </Button>
      </div>
    );
  }

  // Wizard steps
  const wizardSteps: WizardStep[] = [
    { id: "details", title: "Bundle Details", description: "Name, description, status & lead time", isComplete: !!(formData.name && formData.leadTime !== null), errorCount: getSectionErrorCount("details") },
    { id: "media", title: "Media", description: "Photos & gallery", isComplete: (formData.imageIds?.length || 0) > 0 || (formData.mediaData?.length || 0) > 0, errorCount: getSectionErrorCount("media") },
    { id: "items", title: "Bundle Items", description: "Select dishes & quantities", isComplete: (formData.items?.length || 0) >= 2, errorCount: getSectionErrorCount("items") },
    { id: "specs", title: "Specs & Pricing", description: "Portions, prices & spice levels", isComplete: (formData.portionSizes?.length || 0) > 0, errorCount: getSectionErrorCount("specs") },
    { id: "availability", title: "Availability", description: "Schedule & stock limits", isComplete: true, errorCount: getSectionErrorCount("availability") },
    { id: "customizations", title: "Customizations", description: "Modifiers & add-ons", isComplete: true, errorCount: getSectionErrorCount("customizations") },
  ];

  const stepIndex = wizardSteps.findIndex((s) => s.id === activeTab);
  const activeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const handleStepChange = (index: number) => {
    const step = wizardSteps[index];
    if (step) setActiveTab(step.id);
  };

  // Progress
  const progress = (() => {
    let filled = 0;
    const total = 5;
    if (formData.name) filled++;
    if ((formData.items?.length || 0) >= 2) filled++;
    if ((formData.portionSizes?.length || 0) > 0) filled++;
    if (formData.leadTime !== null) filled++;
    if ((formData.imageIds?.length || 0) > 0 || (formData.mediaData?.length || 0) > 0) filled++;
    return Math.round((filled / total) * 100);
  })();

  const stepTips: Record<string, string> = {
    details: "Use a clear, descriptive name that helps customers understand what's included in the bundle.",
    media: "Bundles with high-quality images that showcase the full package get significantly more orders.",
    items: "A bundle must contain at least 2 items. Mix popular dishes for maximum appeal.",
    specs: "Offering multiple portion sizes gives customers flexibility and increases average order value.",
    availability: "Setting a daily limit helps manage your workload and ingredient stock.",
    customizations: "Add modifier groups for common customizations like add-ons or extras.",
  };

  return (
    <div className="sm:rounded-[var(--p-border-radius-400)] sm:overflow-hidden">
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Bundles", onClick: () => router.push("/dashboard/bundles") },
          { label: formData.name || "Edit" },
        ]} />
      </div>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <FormWizard
          steps={wizardSteps}
          activeStep={activeStepIndex}
          onStepChange={handleStepChange}
          pageTitle={formData.name || "Edit Bundle"}
          progress={progress}
          tip={stepTips[activeTab]}
          statusBadge={<Badge tone={formData.status === "published" ? "success" : formData.status === "archived" ? "critical" : "warning"} size="sm">{formData.status === "published" ? "Published" : formData.status === "archived" ? "Archived" : "Draft"}</Badge>}
          preview={
            <BundlePreviewCard
              name={formData.name}
              itemCount={formData.items?.length || 0}
              price={formData.portionSizes?.[0]?.regularPrice}
              image={formData.mediaData?.[0]?.publicUrl || null}
              status={formData.status}
              leadTime={formData.leadTime}
            />
          }
          headerActions={
            <>
              <Button type="button" variant="tertiary" onClick={() => router.push("/dashboard/bundles")}>
                Discard
              </Button>
              <Button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isBusy || noChanges}
              >
                {isBusy && <Spinner size="small" />}
                {updateBundleMutation.isPending ? "Saving..." : isBusy ? "Uploading..." : noChanges ? "No changes" : "Save Changes"}
              </Button>
            </>
          }
          onComplete={() => formRef.current?.requestSubmit()}
        >
          {/* All sections always mounted — show/hide with CSS to preserve hook ordering */}
          <div style={{ display: activeTab === "details" ? "block" : "none" }}>
            <BundleDetailsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "media" ? "block" : "none" }}>
            <MediaUploadSection
              mediaType="dish"
              title="Bundle Media"
              description="Upload high-quality images of your bundle (up to 4). The first image is the primary image."
              maxFiles={4}
              maxFileSize={25 * 1024 * 1024}
              tips={[
                "Use high-quality images that showcase the bundle value",
                "First image becomes the primary/featured image",
                "Supported: PNG, JPG, GIF (max 25MB each)",
              ]}
              formData={formData}
              onUpdate={updateFormData}
              onRemoveImage={handleRemoveImage}
              isEditMode={true}
              errors={fieldErrors}
              onUploadStateChange={(isUploading, isCreatingMedia) => {
                setIsImageUploading(isUploading);
                setIsImageCreatingMedia(isCreatingMedia);
              }}
            />
          </div>

          <div style={{ display: activeTab === "items" ? "block" : "none" }}>
            <BundleDishesSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "specs" ? "block" : "none" }}>
            <BundleSpecsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "availability" ? "block" : "none" }}>
            <BundleAvailabilitySection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "customizations" ? "block" : "none" }}>
            <BundleCustomizationsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>
        </FormWizard>
      </form>
    </div>
  );
}
