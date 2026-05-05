"use client";

/**
 * Edit Dish Page
 * Multi-section form with tab navigation - prefilled with existing dish data
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useLoading } from "@/contexts/loading-context";
import { useUpdateDish } from "@/hooks/use-dishes";
import { dishesService } from "@/services/dishes.service";
import type { DishFormData } from "@/app/dashboard/dishes/new/page";
import { dishFormSchema } from "@/app/dashboard/dishes/new/page";
import type { DishApiResponse } from "@/types/dishes.types";
import type { CreateDishPayload } from "@/services/dishes.service";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import {
  Button,
  Card,
  Badge,
  Breadcrumb,
  Spinner,
  FormWizard,
  FormWizardSkeleton,
} from "@/components/polaris";
import type { WizardStep } from "@/components/polaris";
import { DishPreviewCard } from "@/components/features/dishes/dish-preview-card";
import { useCategories } from "@/hooks/use-categories";
import { DishDetailsSection } from "@/components/features/dishes/dish-details-section";
import { DishMediaSection } from "@/components/features/dishes/dish-media-section";
import { DishSpecsSection } from "@/components/features/dishes/dish-specs-section";
import { DishAvailabilitySection } from "@/components/features/dishes/dish-availability-section";
import { DishCustomizationsSection } from "@/components/features/dishes/dish-customizations-section";
// TODO: Re-enable when shipping feature is ready
// import { DishShippingSection } from "@/components/features/dishes/dish-shipping-section";
// TODO: Re-enable when shipping feature is ready
// import { parseApiShipping, buildShippingPayload } from "@/lib/shipping.utils";
import { mapServerError, getFieldSection, formatZodErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

// Spice level order for backend (must match this exact order)
const SPICE_LEVEL_ORDER: Array<"none" | "mild" | "medium" | "hot" | "extra-hot"> = [
  "none",
  "mild",
  "medium",
  "hot",
  "extra-hot",
];

// Helper function to sort spice levels in the correct order
function sortSpiceLevels(
  levels: Array<"none" | "mild" | "medium" | "hot" | "extra-hot">
): Array<"none" | "mild" | "medium" | "hot" | "extra-hot"> {
  return [...levels].sort((a, b) => {
    const indexA = SPICE_LEVEL_ORDER.indexOf(a);
    const indexB = SPICE_LEVEL_ORDER.indexOf(b);
    return indexA - indexB;
  });
}

// Schema is imported from create page (dishFormSchema) to keep validation unified

/**
 * Transform DishApiResponse to DishFormData
 */
function transformApiDishToFormData(
  apiDish: DishApiResponse,
  chefUserId: string
): DishFormData {
  // Transform spiceLevels array - convert "extraHot" to "extra-hot" for form
  const spiceLevels = ((apiDish.spiceLevels || []) as string[]).map((level) =>
    level === "extraHot" ? "extra-hot" : level
  ) as Array<"none" | "mild" | "medium" | "hot" | "extra-hot">;

  // Transform portionSizes
  const portionSizes = (apiDish.portionSizes || []).map((ps) => ({
    portionLabelId:
      typeof ps.portionLabel === "string"
        ? ps.portionLabel
        : ps.portionLabel?.id || "",
    size: ps.size,
    price: ps.price,
  }));

  console.log("EditDishPage: apiDish", apiDish);
  console.log("EditDishPage: apiDish.images", apiDish.images);

  // Transform images to mediaData format
  // Check if API returns imageIds instead of populated images array
  // If imageIds are present, they might be dish-media IDs or URLs
  const imageIdsProperty =
    "imageIds" in apiDish
      ? (apiDish as Record<string, unknown>).imageIds
      : undefined;
  console.log("EditDishPage: apiDish.imageIds", imageIdsProperty);

  let mediaData: Array<{
    publicUrl: string;
    alt: string;
    isPrimary?: boolean;
  }> = [];

  // Case 1: API returns populated images array
  if (
    apiDish.images &&
    Array.isArray(apiDish.images) &&
    apiDish.images.length > 0
  ) {
    console.log(
      "EditDishPage Transform: Found images array with",
      apiDish.images.length,
      "items"
    );
    mediaData = apiDish.images
      .filter(
        (img) =>
          img.url && typeof img.url === "string" && img.url.trim().length > 0
      )
      .map((img) => ({
        publicUrl: img.url, // API uses 'url', formData uses 'publicUrl'
        alt:
          img.alt ||
          img.url
            .split("/")
            .pop()
            ?.replace(/\.[^/.]+$/, "") ||
          "", // Fallback to filename without extension if no alt
        isPrimary: img.isPrimary || false,
        dishMediaId: img.id, // Store dish-media ID for deletion
      }));
    console.log(
      "EditDishPage Transform: Created mediaData with",
      mediaData.length,
      "items"
    );
    console.log(
      "EditDishPage Transform: mediaData URLs",
      mediaData.map((m) => m.publicUrl)
    );
  } else if (Array.isArray(imageIdsProperty) && imageIdsProperty.length > 0) {
    // Case 2: API returns imageIds array (only if images array wasn't found)
    // If imageIds contain URLs (starting with http/https), use them directly
    // Otherwise, they're likely dish-media IDs and we'd need to fetch media details
    const firstId = imageIdsProperty[0];
    // Check if imageIds are URLs (start with http/https)
    if (
      typeof firstId === "string" &&
      (firstId.startsWith("http://") || firstId.startsWith("https://"))
    ) {
      // Treat as URLs directly
      mediaData = imageIdsProperty
        .filter(
          (id): id is string => typeof id === "string" && id.trim().length > 0
        )
        .map((url, index) => ({
          publicUrl: url,
          alt:
            url
              .split("/")
              .pop()
              ?.replace(/\.[^/.]+$/, "") || `Image ${index + 1}`,
          isPrimary: index === 0,
        }));
    } else {
      // They're IDs - would need to fetch media details
      // For now, log warning and leave empty
      console.warn(
        "EditDishPage: API returned imageIds (IDs) instead of images array. Need endpoint to fetch media details by IDs."
      );
      mediaData = [];
    }
  }

  // Transform arrays - handle both ID strings and objects with id property
  const ingredientIds = (apiDish.ingredients || []).map((ing) =>
    typeof ing === "string" ? ing : (ing as { id: string }).id
  );

  const allergenIds = (apiDish.allergens || []).map((allergen) =>
    typeof allergen === "string" ? allergen : allergen.id
  );

  const dietaryLabelIds = (apiDish.dietaryLabels || []).map((label) =>
    typeof label === "string" ? label : (label as { id: string }).id
  );

  // Transform availability (assuming it's an array of strings/objects)
  const availability = (apiDish.availability || []).map((avail) =>
    typeof avail === "string" ? avail : (avail as { weekday: string }).weekday
  );

  // Transform customizationGroups
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

  interface ApiModifier {
    name?: string;
    priceAdjustment?: number;
    description?: string;
  }

  const customizationGroups = (apiDish.customizationGroups || []).map(
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
        modifiers: (apiGroup.modifiers || []).map((mod: ApiModifier) => ({
          name: (mod.name || "").trim(),
          priceAdjustment: mod.priceAdjustment ?? 0,
          description: (mod.description || "").trim(),
        })),
      };
    }
  );

  // TODO: Re-enable when shipping feature is ready
  // const shipping = parseApiShipping(apiDish.shipping);

  const result = {
    chefUserId,
    name: apiDish.name,
    description: apiDish.description,
    cuisineId:
      typeof apiDish.cuisine === "string"
        ? apiDish.cuisine
        : apiDish.cuisine?.id || "",
    categoryId:
      typeof apiDish.category === "string"
        ? apiDish.category
        : apiDish.category?.id || "",
    status: apiDish.status,
    leadTime: apiDish.leadTime,
    imageIds: [],
    mediaData: mediaData.length > 0 ? mediaData : undefined,
    spiceLevels,
    portionSizes,
    ingredientIds,
    allergenIds,
    dietaryLabelIds,
    maxQuantityPerDay: apiDish.maxQuantityPerDay,
    availability,
    customizationGroups,
    // shipping, // TODO: Re-enable when shipping feature is ready
  };

  console.log(
    "EditDishPage Transform: Returning result with mediaData",
    result.mediaData
  );
  console.log(
    "EditDishPage Transform: mediaData length in result",
    result.mediaData?.length
  );
  return result;
}

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  const dishId = params.id as string;
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const updateDishMutation = useUpdateDish();
  const [activeTab, setActiveTab] = useState("details");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageCreatingMedia, setIsImageCreatingMedia] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isScrollingRef = useRef(isScrolling);

  // Fetch dish data
  const {
    data: dishResponse,
    isLoading: isLoadingDish,
    isError: isErrorLoadingDish,
    error: dishError,
  } = useQuery({
    queryKey: ["dish", dishId, "edit"],
    queryFn: async () => {
      const response = await dishesService.getDishById(dishId);
      return response.data;
    },
    enabled: !!dishId,
    staleTime: 0, // Always consider stale to ensure fresh data on edit page
    refetchOnMount: true, // Refetch when component mounts to get latest data
  });

  const [formData, setFormData] = useState<DishFormData>({
    chefUserId: user?.id || "",
    name: "",
    description: "",
    cuisineId: "",
    categoryId: "",
    status: "draft",
    leadTime: 0,
    imageIds: [],
    spiceLevels: [],
    portionSizes: [],
    ingredientIds: [],
    allergenIds: [],
    dietaryLabelIds: [],
    maxQuantityPerDay: null,
    availability: [],
    customizationGroups: [],
  });

  // Track validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [originalDishData, setOriginalDishData] = useState<DishFormData | null>(
    null
  );

  // Prefill form when dish data loads
  useEffect(() => {
    if (dishResponse && user?.id) {
      console.log("EditDishPage: API Response", dishResponse);
      console.log("EditDishPage: API Images", dishResponse.images);
      console.log(
        "EditDishPage: API Images length",
        dishResponse.images?.length
      );

      const transformedData = transformApiDishToFormData(dishResponse, user.id);
      console.log("EditDishPage: Transformed Data", transformedData);
      console.log(
        "EditDishPage: Transformed MediaData",
        transformedData.mediaData
      );
      console.log(
        "EditDishPage: Transformed MediaData length",
        transformedData.mediaData?.length
      );

      // Ensure mediaData URLs are valid strings
      if (transformedData.mediaData && transformedData.mediaData.length > 0) {
        const filteredMediaData = transformedData.mediaData.filter(
          (m) =>
            m.publicUrl &&
            typeof m.publicUrl === "string" &&
            m.publicUrl.trim().length > 0
        );
        console.log("EditDishPage: Filtered MediaData", filteredMediaData);
        console.log(
          "EditDishPage: Filtered MediaData length",
          filteredMediaData.length
        );

        // Only update if we have valid mediaData
        if (filteredMediaData.length > 0) {
          transformedData.mediaData = filteredMediaData;
        } else {
          transformedData.mediaData = undefined;
        }
      }

      console.log(
        "EditDishPage: Final MediaData before setFormData",
        transformedData.mediaData
      );

      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        // Create a deep copy for originalDishData to avoid reference issues
        // Use structuredClone if available, otherwise fall back to JSON method
        const originalDataCopy =
          typeof structuredClone !== "undefined"
            ? structuredClone(transformedData)
            : JSON.parse(JSON.stringify(transformedData));
        // Store original dish data for comparison
        setOriginalDishData(originalDataCopy);
        setFormData(transformedData);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [dishResponse, user?.id]);

  // Update chefUserId when user loads (only if not already set)
  // Use setTimeout to defer state update and avoid setState in effect warning
  useEffect(() => {
    if (user?.id) {
      const timeoutId = setTimeout(() => {
        setFormData((prev) => {
          if (prev.chefUserId && prev.chefUserId === user.id) {
            return prev; // No change needed
          }
          return { ...prev, chefUserId: user.id };
        });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id]);

  // Set up Intersection Observer to detect active section
  useEffect(() => {
    const sections = [
      "details",
      "media",
      "specs",
      // "shipping", // TODO: Re-enable when shipping feature is ready
      "availability",
      "customizations",
    ];
    let observer: IntersectionObserver | null = null;

    // Capture ref value at effect level for cleanup
    const sectionsMap = sectionsRef.current;

    const timer = setTimeout(() => {
      const sectionElements = sections
        .map((id) => ({
          id,
          element: document.getElementById(`section-${id}`),
        }))
        .filter((item) => item.element !== null) as Array<{
        id: string;
        element: HTMLElement;
      }>;

      if (sectionElements.length === 0) return;

      sectionElements.forEach(({ id, element }) => {
        sectionsMap.set(id, element);
      });

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      };

      observer = new IntersectionObserver((entries) => {
        if (isScrollingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => {
            const ratioDiff = b.intersectionRatio - a.intersectionRatio;
            if (Math.abs(ratioDiff) > 0.1) return ratioDiff;
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

          const topEntry = visibleEntries[0];
          const sectionId = topEntry.target.id.replace("section-", "");
          if (sectionId && sections.includes(sectionId)) {
            setActiveTab(sectionId);
          }
        }
      }, observerOptions);

      sectionElements.forEach(({ element }) => {
        observer?.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
      sectionsMap.clear();
    };
  }, []);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  // Handle image deletion
  const handleRemoveImage = async (imageIndex: number) => {
    if (!formData.mediaData || imageIndex >= formData.mediaData.length) {
      return;
    }

    const imageToRemove = formData.mediaData[imageIndex];

    // If it's an existing image with dishMediaId, we need to update the dish
    if (imageToRemove.dishMediaId) {
      try {
        // Get current dish to get all image IDs
        const currentDish = await dishesService.getDishById(dishId);

        if (!currentDish.data?.images) {
          throw new Error("Failed to get current dish images");
        }

        // Filter out the image being removed
        const remainingImages = currentDish.data.images
          .filter((img) => img.id !== imageToRemove.dishMediaId)
          .map((img) => ({
            image: img.id,
            isPrimary: img.isPrimary,
          }));

        // Update dish with remaining images
        await updateDishMutation.mutateAsync({
          id: dishId,
          data: {
            images: remainingImages,
          },
        });

        // Update local formData
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
      // For newly uploaded images (not yet saved), just remove from formData
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

    // Validate form data using Zod
    const validationResult = dishFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const { fieldErrors: newFieldErrors, messages } = formatZodErrors(
        validationResult.error.issues,
        { name: "Dish name" }
      );

      // Store errors in state for field-level display (red borders + inline messages)
      setFieldErrors(newFieldErrors);
      showValidationToast(messages, toast);

      // Scroll to first error section
      const firstErrorPath = validationResult.error.issues[0]?.path;
      if (firstErrorPath && firstErrorPath.length > 0) {
        const firstFieldPath = firstErrorPath.map(String).join(".");
        const sectionId = getFieldSection(firstFieldPath);
        const section = document.getElementById(`section-${sectionId}`);
        if (section) {
          const headerOffset = 100;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          setActiveTab(sectionId);
        }
      }

      return;
    }

    setFieldErrors({});
    showLoading();

    try {
      // Transform formData to match backend API format for update
      const dishData: CreateDishPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        cuisine: formData.cuisineId,
        category: formData.categoryId,
        leadTime: formData.leadTime,
        portionSizes: formData.portionSizes.map((ps) => ({
          portionLabel: ps.portionLabelId,
          size: String(ps.size).trim(),
          price: ps.price,
        })),
        status: formData.status,
        spiceLevels: sortSpiceLevels(formData.spiceLevels)
          .map((level) => (level === "extra-hot" ? "extraHot" : level))
          .map((level) => level as "none" | "mild" | "medium" | "hot" | "extraHot"), // Backend expects array and 'extraHot' not 'extra-hot', sorted in order
      };

      // Add optional arrays only if they have values
      if (formData.ingredientIds.length > 0) {
        dishData.ingredients = formData.ingredientIds;
      }
      if (formData.allergenIds.length > 0) {
        dishData.allergens = formData.allergenIds;
      }
      if (formData.dietaryLabelIds.length > 0) {
        dishData.dietaryLabels = formData.dietaryLabelIds;
      }
      // Send maxQuantityPerDay as null when cleared so backend removes the limit
      dishData.maxQuantityPerDay = formData.maxQuantityPerDay;
      if (formData.availability.length > 0) {
        dishData.availability = formData.availability;
      }
      // Always send customizationGroups so backend can clear them when all are removed
      dishData.customizationGroups =
        formData.customizationGroups.length > 0
          ? formData.customizationGroups.map((group) => ({
              modifierGroup: group.modifierGroupId,
              required: group.required,
              selectionType: group.selectionType,
              modifiers: group.modifiers.map((mod) => ({
                name: mod.name.trim(),
                priceAdjustment: mod.priceAdjustment,
                description: mod.description?.trim() || undefined,
              })),
            }))
          : [];

      // TODO: Re-enable when shipping feature is ready
      // const shippingPayload = buildShippingPayload(formData.shipping);
      // if (shippingPayload) {
      //   dishData.shipping = shippingPayload;
      // }

      // Handle images - use dish-media IDs if available
      const updatedMediaData = formData.mediaData || [];

      if (updatedMediaData.length > 0) {
        // Warn if any items don't have dish media IDs (they should from the upload hook)
        const mediaWithoutIds = updatedMediaData.filter((m) => !m.dishMediaId);
        if (mediaWithoutIds.length > 0) {
          console.warn(
            `${mediaWithoutIds.length} image(s) missing dish media IDs - they will not be saved.`
          );
          toast.warning(
            `${mediaWithoutIds.length} image(s) are still processing. Please wait for uploads to finish.`
          );
        }

        // Associate all dish-media IDs with the dish
        const mediaWithIds = updatedMediaData.filter((m) => m.dishMediaId);

        if (mediaWithIds.length > 0) {
          dishData.images = mediaWithIds.map((media, index) => ({
            image: media.dishMediaId!,
            isPrimary: media.isPrimary || index === 0,
          }));
        }
      } else {
        // If no media data, ensure images array is empty or not included
        // If user removed all images, we should send empty array to clear images
        dishData.images = [];
      }

      // Update dish with all data including images
      await updateDishMutation.mutateAsync({
        id: dishId,
        data: dishData,
      });

      hideLoading();
      toast.success("Dish updated successfully");
      router.push("/dashboard/dishes");
    } catch (error) {
      hideLoading();

      console.error("Failed to update dish:", error);

      // Map server errors to field-level errors
      const mapped = mapServerError(error);

      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        // Set field-level errors so fields show red borders and inline messages
        setFieldErrors(mapped.fieldErrors);

        // Show specific validation messages in toast
        showValidationToast(
          mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to update dish. Please try again."],
          toast
        );

        // Scroll to first errored section
        const firstField = Object.keys(mapped.fieldErrors)[0];
        if (firstField) {
          const sectionId = getFieldSection(firstField);
          const section = document.getElementById(`section-${sectionId}`);
          if (section) {
            const headerOffset = 100;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
            setActiveTab(sectionId);
          }
        }
      } else {
        // Non-validation error - show toast with the message
        const message = mapped.toastMessages[0] || "Failed to update dish. Please try again.";
        toast.error(message);
      }
    }
  };

  const updateFormData = (updates: Partial<DishFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    const updatedFields = Object.keys(updates);
    if (updatedFields.length > 0 && Object.keys(fieldErrors).length > 0) {
      setFieldErrors((prevErrors) => {
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
  };

  // Compare current formData with original dish data to detect changes
  const hasChangesFromOriginal = useMemo(() => {
    if (!originalDishData || !dishResponse) {
      return false; // No original data loaded yet, don't disable
    }

    // Deep comparison function for arrays
    const arraysEqual = (a: unknown[], b: unknown[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    // Compare portion sizes
    const portionSizesEqual = (
      a: DishFormData["portionSizes"],
      b: DishFormData["portionSizes"]
    ): boolean => {
      if (a.length !== b.length) return false;
      return a.every((psA, idx) => {
        const psB = b[idx];
        return (
          psA.portionLabelId === psB.portionLabelId &&
          String(psA.size) === String(psB.size) &&
          psA.price === psB.price
        );
      });
    };

    // Compare customization groups
    // Sort by modifierGroupId for consistent comparison
    const customizationGroupsEqual = (
      a: DishFormData["customizationGroups"],
      b: DishFormData["customizationGroups"]
    ): boolean => {
      if (a.length !== b.length) return false;

      // Sort both arrays by modifierGroupId for comparison
      const sortedA = [...a].sort((x, y) =>
        x.modifierGroupId.localeCompare(y.modifierGroupId)
      );
      const sortedB = [...b].sort((x, y) =>
        x.modifierGroupId.localeCompare(y.modifierGroupId)
      );

      return sortedA.every((groupA, idx) => {
        const groupB = sortedB[idx];
        // Normalize empty strings and undefined for requiredDescription
        const reqDescA = groupA.requiredDescription || "";
        const reqDescB = groupB.requiredDescription || "";
        if (
          groupA.modifierGroupId !== groupB.modifierGroupId ||
          groupA.required !== groupB.required ||
          groupA.selectionType !== groupB.selectionType ||
          reqDescA !== reqDescB ||
          groupA.modifiers.length !== groupB.modifiers.length
        ) {
          return false;
        }
        // Sort modifiers by name for consistent comparison
        const sortedModsA = [...groupA.modifiers].sort((x, y) => {
          const nameCompare = x.name.localeCompare(y.name);
          if (nameCompare !== 0) return nameCompare;
          // If names are equal, sort by priceAdjustment for stability
          return x.priceAdjustment - y.priceAdjustment;
        });
        const sortedModsB = [...groupB.modifiers].sort((x, y) => {
          const nameCompare = x.name.localeCompare(y.name);
          if (nameCompare !== 0) return nameCompare;
          // If names are equal, sort by priceAdjustment for stability
          return x.priceAdjustment - y.priceAdjustment;
        });
        if (sortedModsA.length !== sortedModsB.length) {
          return false;
        }
        return sortedModsA.every((modA, modIdx) => {
          const modB = sortedModsB[modIdx];
          // Normalize empty strings and undefined for description
          const descA = (modA.description || "").trim();
          const descB = (modB.description || "").trim();
          // Normalize names (trim whitespace)
          const nameA = (modA.name || "").trim();
          const nameB = (modB.name || "").trim();
          // Compare priceAdjustment with tolerance for floating point precision
          const priceA = modA.priceAdjustment ?? 0;
          const priceB = modB.priceAdjustment ?? 0;
          return (
            nameA === nameB &&
            Math.abs(priceA - priceB) < 0.01 && // Allow small floating point differences
            descA === descB
          );
        });
      });
    };

    // Compare media data (by URLs and dishMediaIds)
    const mediaDataEqual = (
      a?: DishFormData["mediaData"],
      b?: DishFormData["mediaData"]
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      // Sort by publicUrl for comparison
      const sortedA = [...a].sort((x, y) =>
        (x.publicUrl || "").localeCompare(y.publicUrl || "")
      );
      const sortedB = [...b].sort((x, y) =>
        (x.publicUrl || "").localeCompare(y.publicUrl || "")
      );
      return sortedA.every((mediaA, idx) => {
        const mediaB = sortedB[idx];
        return (
          mediaA.publicUrl === mediaB.publicUrl &&
          mediaA.dishMediaId === mediaB.dishMediaId &&
          mediaA.isPrimary === mediaB.isPrimary
        );
      });
    };

    // Compare all fields
    return (
      formData.name !== originalDishData.name ||
      formData.description !== originalDishData.description ||
      formData.cuisineId !== originalDishData.cuisineId ||
      formData.categoryId !== originalDishData.categoryId ||
      formData.status !== originalDishData.status ||
      formData.leadTime !== originalDishData.leadTime ||
      !arraysEqual(formData.spiceLevels, originalDishData.spiceLevels) ||
      formData.maxQuantityPerDay !== originalDishData.maxQuantityPerDay ||
      !arraysEqual(formData.ingredientIds, originalDishData.ingredientIds) ||
      !arraysEqual(formData.allergenIds, originalDishData.allergenIds) ||
      !arraysEqual(
        formData.dietaryLabelIds,
        originalDishData.dietaryLabelIds
      ) ||
      !arraysEqual(formData.availability, originalDishData.availability) ||
      !portionSizesEqual(
        formData.portionSizes,
        originalDishData.portionSizes
      ) ||
      !customizationGroupsEqual(
        formData.customizationGroups,
        originalDishData.customizationGroups
      ) ||
      !mediaDataEqual(formData.mediaData, originalDishData.mediaData)
      // TODO: Re-enable when shipping feature is ready
      // || JSON.stringify(formData.shipping) !== JSON.stringify(originalDishData.shipping)
    );
  }, [formData, originalDishData, dishResponse]);

  const sectionErrorCounts = useMemo(() => {
    const sectionFieldMap: Record<string, string[]> = {
      details: ["name", "cuisineId", "categoryId", "leadTime", "chefUserId"],
      media: ["imageIds"], // Media section has image validation for published dishes
      specs: ["spiceLevels", "portionSizes"],
      // shipping: ["shipping"], // TODO: Re-enable when shipping feature is ready
      availability: ["maxQuantityPerDay"],
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

  const handleTabChange = (value: string) => {
    setIsScrolling(true);
    setActiveTab(value);
    const section = document.getElementById(`section-${value}`);
    if (section) {
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    } else {
      setIsScrolling(false);
    }
  };

  // Hooks must be above early returns
  const { data: categories } = useCategories();

  const wizardSteps: WizardStep[] = useMemo(() => [
    { id: "details", title: "Dish Details", description: "Name, description, category & cuisine", isComplete: !!(formData.name && formData.description && formData.cuisineId && formData.categoryId), errorCount: getSectionErrorCount("details") },
    { id: "media", title: "Media", description: "Photos & gallery", isComplete: (formData.imageIds?.length || 0) > 0 || (formData.mediaData?.length || 0) > 0, errorCount: getSectionErrorCount("media") },
    { id: "specs", title: "Specs & Portions", description: "Sizes, dietary & allergens", isComplete: (formData.portionSizes?.length || 0) > 0, errorCount: getSectionErrorCount("specs") },
    { id: "availability", title: "Availability", description: "Schedule & stock limits", isComplete: true, errorCount: getSectionErrorCount("availability") },
    { id: "customizations", title: "Customizations", description: "Modifiers & add-ons", isComplete: true, errorCount: getSectionErrorCount("customizations") },
  ], [formData, fieldErrors]);

  const stepIndex = wizardSteps.findIndex((s) => s.id === activeTab);
  const activeStepIndex = stepIndex >= 0 ? stepIndex : 0;
  const handleStepChange = (index: number) => {
    const step = wizardSteps[index];
    if (step) handleTabChange(step.id);
  };

  const previewImage = formData.mediaData?.[0]?.publicUrl || null;
  const previewPrice = formData.portionSizes?.[0]?.price;

  const stepTips: Record<string, string> = {
    details: "Dishes with clear names and detailed descriptions get 40% more orders.",
    media: "Dishes with at least 3 high-quality photos receive 2.4x more orders.",
    specs: "Offering multiple portion sizes increases average order value.",
    availability: "Setting a daily limit helps manage your workload.",
    customizations: "Dishes with modifier options generate 30% higher revenue per order.",
  };

  const isBusy = updateDishMutation.isPending || isLoadingDish || isImageUploading || isImageCreatingMedia;
  const isUnchanged = !!(originalDishData && !hasChangesFromOriginal);

  // Loading state
  if (isLoadingDish) {
    return (
      <div className="space-y-[var(--p-space-500)] w-full">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Dishes", onClick: () => router.push("/dashboard/dishes") },
          { label: "Edit" },
        ]} />
        <FormWizardSkeleton stepCount={5} />
      </div>
    );
  }

  // Error state
  if (isErrorLoadingDish) {
    return (
      <div className="space-y-[var(--p-space-400)] w-full">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Dishes", onClick: () => router.push("/dashboard/dishes") },
          { label: "Edit" },
        ]} />
        <h2 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Edit Dish</h2>
        <Card>
          <div className="text-center py-[var(--p-space-1200)]">
            <p className="text-[0.8125rem] text-[var(--p-color-text-critical)]">
              {dishError instanceof Error ? dishError.message : "Failed to load dish. Please try again."}
            </p>
            <Button variant="secondary" className="mt-[var(--p-space-400)]" onClick={() => router.push("/dashboard/dishes")}>
              Back to Dishes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="sm:rounded-[var(--p-border-radius-400)] sm:overflow-hidden">
    <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)]">
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Dishes", onClick: () => router.push("/dashboard/dishes") },
        { label: formData.name || "Edit" },
      ]} />
    </div>
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <FormWizard
        steps={wizardSteps}
        activeStep={activeStepIndex}
        onStepChange={handleStepChange}
        pageTitle="Edit Dish"
        tip={stepTips[activeTab]}
        statusBadge={<Badge tone={formData.status === "published" ? "success" : "warning"} size="sm">{formData.status === "published" ? "Published" : "Draft"}</Badge>}
        preview={
          <DishPreviewCard
            name={formData.name}
            category={categories?.find((c) => c.id === formData.categoryId)?.name}
            price={previewPrice}
            image={previewImage}
            status={formData.status}
            leadTime={formData.leadTime}
          />
        }
        headerActions={
          <>
            <Button type="button" variant="tertiary" onClick={() => router.push("/dashboard/dishes")}>
              Discard
            </Button>
            <Button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isBusy || isUnchanged}
            >
              {isBusy && <Spinner size="small" />}
              {updateDishMutation.isPending ? "Saving..." : isBusy ? "Uploading..." : isUnchanged ? "No changes" : "Save"}
            </Button>
          </>
        }
        onComplete={() => formRef.current?.requestSubmit()}
      >
        {/* All sections always mounted — display:none preserves hook ordering */}
        <div style={{ display: activeTab === "details" ? "block" : "none" }}>
          <DishDetailsSection formData={formData} onUpdate={updateFormData} errors={fieldErrors} />
        </div>
        <div style={{ display: activeTab === "media" ? "block" : "none" }}>
          <DishMediaSection
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
        <div style={{ display: activeTab === "specs" ? "block" : "none" }}>
          <DishSpecsSection formData={formData} onUpdate={updateFormData} errors={fieldErrors} />
        </div>
        <div style={{ display: activeTab === "availability" ? "block" : "none" }}>
          <DishAvailabilitySection formData={formData} onUpdate={updateFormData} errors={fieldErrors} />
        </div>
        <div style={{ display: activeTab === "customizations" ? "block" : "none" }}>
          <DishCustomizationsSection formData={formData} onUpdate={updateFormData} errors={fieldErrors} />
        </div>
      </FormWizard>
    </form>
    </div>
  );
}
