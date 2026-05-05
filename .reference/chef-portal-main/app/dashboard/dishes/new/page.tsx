"use client";

/**
 * Create Dish Page
 * Multi-section form with tab navigation
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useLoading } from "@/contexts/loading-context";
import { useCreateDish, useUpdateDish } from "@/hooks/use-dishes";
import { useDishTemplate } from "@/hooks/use-dish-templates";
import { useCategories } from "@/hooks/use-categories";
import { useCuisines } from "@/hooks/use-cuisines";
import type { CreateDishPayload } from "@/services/dishes.service";
import { toast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import Link from "next/link";
import {
  Button,
  Card,
  Banner,
  Badge,
  Breadcrumb,
  Spinner,
  FormWizard,
  FormWizardSkeleton,
} from "@/components/polaris";
import type { WizardStep } from "@/components/polaris";
import { DishPreviewCard } from "@/components/features/dishes/dish-preview-card";
import { DishDetailsSection } from "@/components/features/dishes/dish-details-section";
import { MediaUploadSection } from "@/components/shared/media-upload-section";
import { DishSpecsSection } from "@/components/features/dishes/dish-specs-section";
import { DishAvailabilitySection } from "@/components/features/dishes/dish-availability-section";
import { DishCustomizationsSection } from "@/components/features/dishes/dish-customizations-section";
// TODO: Re-enable when shipping feature is ready
// import { DishShippingSection } from "@/components/features/dishes/dish-shipping-section";
// TODO: Re-enable when shipping feature is ready
// import { buildShippingPayload } from "@/lib/shipping.utils";
import { mapServerError, getFieldSection, formatZodErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { z } from "zod";
// TODO: Re-enable when shipping feature is ready
// import type { DishShipping } from "@/types/dishes.types";

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

// Zod schema for dish form validation (exported for reuse in edit page)
export const dishFormSchema = z.object({
  chefUserId: z.string().min(1, "Chef user ID is required"),
  name: z.string().min(1, "Dish name is required"),
  description: z.string().min(1, "Description is required"), // Backend requires non-empty description
  cuisineId: z.string().min(1, "Cuisine is required"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published", "archived"]),
  leadTime: z.number().min(0, "Lead time is required"),
  imageIds: z.array(z.string()).default([]),
  mediaData: z
    .array(
      z.object({
        publicUrl: z.string(),
        alt: z.string(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
  spiceLevels: z
    .array(z.enum(["none", "mild", "medium", "hot", "extra-hot"]))
    .refine(
      (val) => val.length === 0 || val.length >= 3,
      "If spice levels are selected, at least 3 must be chosen"
    )
    .default([]),
  portionSizes: z
    .array(
      z.object({
        portionLabelId: z.string().min(1, "Portion label is required"),
        size: z.union([z.string(), z.number()]).refine(
          (val) => {
            // Convert to string and ensure non-empty
            const strVal = String(val);
            return strVal.trim().length > 0;
          },
          { message: "Size is required" }
        ),
        price: z.number().min(0, "Price must be 0 or greater"),
      })
    )
    .min(1, "At least one portion size is required"),
  ingredientIds: z.array(z.string()).default([]),
  allergenIds: z.array(z.string()).default([]),
  dietaryLabelIds: z.array(z.string()).default([]),
  maxQuantityPerDay: z
    .union([z.number().min(1, "Maximum quantity must be at least 1"), z.null()])
    .optional(),
  availability: z.array(z.string()).default([]),
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
  // TODO: Re-enable when shipping feature is ready
  // shipping: z
  //   .object({
  //     shippable: z.boolean(),
  //     weight: z.number(),
  //     dimensions: z.object({
  //       length: z.number(),
  //       width: z.number(),
  //       height: z.number(),
  //     }),
  //     dryIce: z.object({
  //       required: z.boolean(),
  //       weight: z.number(),
  //     }),
  //   })
  //   .optional(),
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
    message: "Please add at least one image to publish this dish. Images help customers discover and choose your dishes.",
    path: ["imageIds"],
  }
);
// TODO: Re-enable shipping refinement when shipping feature is ready
// .refine(
//   (data) => {
//     if (data.shipping?.shippable) {
//       const { length, width, height } = data.shipping.dimensions;
//       return length > 0 && width > 0 && height > 0;
//     }
//     return true;
//   },
//   {
//     message: "Package dimensions (length, width, height) are required when shipping is enabled.",
//     path: ["shipping.dimensions"],
//   }
// );

export interface DishFormData {
  // Dish Details
  chefUserId: string;
  name: string;
  description: string;
  cuisineId: string;
  categoryId: string;
  status: "draft" | "published" | "archived";
  leadTime: number;

  // Dish Media
  imageIds: string[]; // Temporary: publicUrls of uploaded images
  mediaData?: Array<{
    publicUrl: string;
    alt: string;
    isPrimary?: boolean;
    dishMediaId?: string; // dish-media ID for existing images (used in edit mode)
  }>; // Full media data for dish media creation

  // Dish Specs
  spiceLevels: Array<"none" | "mild" | "medium" | "hot" | "extra-hot">;
  portionSizes: Array<{
    portionLabelId: string;
    size: string | number;
    price: number;
  }>;
  ingredientIds: string[];
  allergenIds: string[];
  dietaryLabelIds: string[];

  // Dish Availability
  maxQuantityPerDay: number | null;
  availability: string[]; // Weekdays

  // Dish Customizations
  customizationGroups: Array<{
    modifierGroupId: string;
    title?: string;
    required: boolean;
    requiredDescription?: string;
    selectionType: "single" | "multiple";
    modifiers: Array<{
      name: string;
      priceAdjustment: number;
      description: string;
    }>;
  }>;

  // TODO: Re-enable when shipping feature is ready
  // shipping?: DishShipping;
}

export default function CreateDishPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const { user } = useAuth();
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { data: categories } = useCategories();
  const { data: cuisines } = useCuisines();
  const createDishMutation = useCreateDish();
  const updateDishMutation = useUpdateDish();
  const [activeTab, setActiveTab] = useState("details");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageCreatingMedia, setIsImageCreatingMedia] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isScrollingRef = useRef(isScrolling);
  const hasPushedDummyStateRef = useRef(false);

  // Use loading overlay state to prevent duplicate submissions
  const isSaving =
    isLoading || createDishMutation.isPending || updateDishMutation.isPending;

  // Fetch template data if templateId is present
  const {
    data: template,
    isLoading: isLoadingTemplate,
    isError: isTemplateError,
  } = useDishTemplate(templateId);

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
  const [hasPrefilledTemplate, setHasPrefilledTemplate] = useState(false);
  const [originalTemplateData, setOriginalTemplateData] =
    useState<DishFormData | null>(null);
  
  // Navigation protection state
  const [showLeaveConfirmDialog, setShowLeaveConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Transform template response to form data format
  const transformTemplateToFormData = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template: any
    ): Partial<DishFormData> => {
      // Helper function to extract plain text from Lexical editor format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractTextFromLexical = (lexicalData: any): string => {
        if (typeof lexicalData === "string") {
          return lexicalData;
        }
        if (!lexicalData || typeof lexicalData !== "object") {
          return "";
        }

        // Handle Lexical editor format
        if (lexicalData.root && lexicalData.root.children) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const extractText = (node: any): string => {
            if (node.type === "text" && node.text) {
              return node.text;
            }
            if (node.children && Array.isArray(node.children)) {
              return node.children.map(extractText).join("");
            }
            return "";
          };

          return lexicalData.root.children.map(extractText).join("\n");
        }

        return "";
      };

      // Extract description from Lexical format or use as-is if string
      const description =
        typeof template.description === "string"
          ? template.description
          : extractTextFromLexical(template.description);

      // Transform spiceLevels array - convert "extraHot" to "extra-hot" for form
      const spiceLevels = (template.spiceLevels || []).map((level: string) =>
        level === "extraHot" ? "extra-hot" : level
      ) as Array<"none" | "mild" | "medium" | "hot" | "extra-hot">;

      // Transform cuisine - handle both ID string and object
      const cuisineId =
        typeof template.cuisine === "string"
          ? template.cuisine
          : template.cuisine?.id || template.cuisineId || "";

      // Transform category - handle both ID string and object
      const categoryId =
        typeof template.category === "string"
          ? template.category
          : template.category?.id || template.categoryId || "";

      // Transform portionSizes
      const portionSizes = (template.portionSizes || []).map(
        (ps: {
          portionLabel: string | { id: string };
          size: string | number;
          price: number;
        }) => ({
          portionLabelId:
            typeof ps.portionLabel === "string"
              ? ps.portionLabel
              : ps.portionLabel?.id || "",
          size: ps.size,
          price: ps.price,
        })
      );

      // Transform ingredients to IDs array - ensure all are strings and filter out invalid values
      const ingredientIds = (template.ingredients || [])
        .map((ing: string | { id: string }) => {
          if (typeof ing === "string") return ing;
          if (ing && typeof ing === "object" && ing.id) return String(ing.id);
          return null;
        })
        .filter(
          (id: string | null | undefined): id is string =>
            id !== null && id !== undefined
        );

      // Transform allergens to IDs array - ensure all are strings and filter out invalid values
      const allergenIds = (template.allergens || [])
        .map((all: string | { id: string }) => {
          if (typeof all === "string") return all;
          if (all && typeof all === "object" && all.id) return String(all.id);
          return null;
        })
        .filter(
          (id: string | null | undefined): id is string =>
            id !== null && id !== undefined
        );

      // Transform dietaryLabels to IDs array - ensure all are strings and filter out invalid values
      const dietaryLabelIds = (template.dietaryLabels || [])
        .map((label: string | { id: string }) => {
          if (typeof label === "string") return label;
          if (label && typeof label === "object" && label.id)
            return String(label.id);
          return null;
        })
        .filter(
          (id: string | null | undefined): id is string =>
            id !== null && id !== undefined
        );

      // Transform images to mediaData format
      const mediaData =
        template.images && template.images.length > 0
          ? template.images.map(
              (
                img: string | { url: string; isPrimary?: boolean },
                index: number
              ) => ({
                publicUrl: typeof img === "string" ? img : img.url,
                alt: template.name || `Template image ${index + 1}`,
                isPrimary:
                  typeof img === "object"
                    ? img.isPrimary || index === 0
                    : index === 0,
              })
            )
          : undefined;

      const imageIds =
        mediaData?.map((m: { publicUrl: string }): string => m.publicUrl) || [];

      return {
        chefUserId: user?.id || "",
        name: template.name || "",
        description,
        cuisineId,
        categoryId,
        status:
          (template.status as "draft" | "published" | "archived") || "draft",
        leadTime: template.leadTime || 0,
        spiceLevels,
        portionSizes: portionSizes || [],
        ingredientIds: ingredientIds || [],
        allergenIds: allergenIds || [],
        dietaryLabelIds: dietaryLabelIds || [],
        maxQuantityPerDay: template.maxQuantityPerDay || null,
        availability: template.availability || [],
        customizationGroups: template.customizationGroups || [],
        mediaData,
        imageIds: imageIds || [],
      };
    },
    [user?.id]
  );

  // Prefill form data from template when template is loaded
  useEffect(() => {
    if (template && !hasPrefilledTemplate && user?.id) {
      // Use setTimeout to defer state update and avoid setState in effect warning
      const timeoutId = setTimeout(() => {
        const prefilledData = transformTemplateToFormData(template);

        // Debug: Log the transformed data
        console.log(
          "Template transformation - ingredientIds:",
          prefilledData.ingredientIds
        );
        console.log(
          "Template transformation - allergenIds:",
          prefilledData.allergenIds
        );
        console.log(
          "Template transformation - dietaryLabelIds:",
          prefilledData.dietaryLabelIds
        );

        // Store original template data for comparison
        const templateFormData: DishFormData = {
          chefUserId: user.id,
          name: prefilledData.name || "",
          description: prefilledData.description || "",
          cuisineId: prefilledData.cuisineId || "",
          categoryId: prefilledData.categoryId || "",
          status: prefilledData.status || "draft",
          leadTime: prefilledData.leadTime || 0,
          imageIds: prefilledData.imageIds || [],
          mediaData: prefilledData.mediaData,
          spiceLevels: prefilledData.spiceLevels || [],
          portionSizes: prefilledData.portionSizes || [],
          ingredientIds: prefilledData.ingredientIds || [],
          allergenIds: prefilledData.allergenIds || [],
          dietaryLabelIds: prefilledData.dietaryLabelIds || [],
          maxQuantityPerDay: prefilledData.maxQuantityPerDay || null,
          availability: prefilledData.availability || [],
          customizationGroups: prefilledData.customizationGroups || [],
        };
        setOriginalTemplateData(templateFormData);

        setFormData((prev) => ({
          ...prev,
          ...prefilledData,
        }));

        setHasPrefilledTemplate(true);
        toast.success("Template data loaded successfully");
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [template, hasPrefilledTemplate, user?.id, transformTemplateToFormData]);

  // Show error if template failed to load
  useEffect(() => {
    if (templateId && isTemplateError) {
      toast.error("Failed to load template. Creating dish from scratch.");
    }
  }, [templateId, isTemplateError]);

  // Cleanup: Hide loading overlay when component unmounts (e.g., during navigation)
  // This ensures loading state doesn't persist if navigation doesn't complete
  useEffect(() => {
    return () => {
      hideLoading();
    };
  }, [hideLoading]);

  // Update chefUserId when user loads
  useEffect(() => {
    if (user?.id) {
      // Use setTimeout to defer state update and avoid setState in effect warning
      const timeoutId = setTimeout(() => {
        setFormData((prev) => {
          if (prev.chefUserId === user.id) {
            return prev; // No change needed
          }
          return { ...prev, chefUserId: user.id };
        });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id]);

  // Compare current formData with original template data to detect changes
  const hasChangesFromTemplate = useMemo(() => {
    if (!originalTemplateData || !template) {
      return true; // No template loaded, allow saving
    }

    // Deep comparison function for arrays
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arraysEqual = (a: any[], b: any[]): boolean => {
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
    const customizationGroupsEqual = (
      a: DishFormData["customizationGroups"],
      b: DishFormData["customizationGroups"]
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

    // Compare media data (by URLs)
    const mediaDataEqual = (
      a?: DishFormData["mediaData"],
      b?: DishFormData["mediaData"]
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      const urlsA = a.map((m) => m.publicUrl).sort();
      const urlsB = b.map((m) => m.publicUrl).sort();
      return urlsA.every((url, idx) => url === urlsB[idx]);
    };

    // Compare all fields
    return (
      formData.name !== originalTemplateData.name ||
      formData.description !== originalTemplateData.description ||
      formData.cuisineId !== originalTemplateData.cuisineId ||
      formData.categoryId !== originalTemplateData.categoryId ||
      formData.status !== originalTemplateData.status ||
      formData.leadTime !== originalTemplateData.leadTime ||
      !arraysEqual(formData.spiceLevels, originalTemplateData.spiceLevels) ||
      formData.maxQuantityPerDay !== originalTemplateData.maxQuantityPerDay ||
      !arraysEqual(
        formData.ingredientIds,
        originalTemplateData.ingredientIds
      ) ||
      !arraysEqual(formData.allergenIds, originalTemplateData.allergenIds) ||
      !arraysEqual(
        formData.dietaryLabelIds,
        originalTemplateData.dietaryLabelIds
      ) ||
      !arraysEqual(formData.availability, originalTemplateData.availability) ||
      !portionSizesEqual(
        formData.portionSizes,
        originalTemplateData.portionSizes
      ) ||
      !customizationGroupsEqual(
        formData.customizationGroups,
        originalTemplateData.customizationGroups
      ) ||
      !mediaDataEqual(formData.mediaData, originalTemplateData.mediaData)
    );
  }, [formData, originalTemplateData, template]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (template && originalTemplateData) {
      // Use the existing hasChangesFromTemplate logic
      return hasChangesFromTemplate;
    }
    // Check if form has any data entered
    return !!(
      formData.name?.trim() ||
      formData.description?.trim() ||
      formData.cuisineId ||
      formData.categoryId ||
      formData.portionSizes.length > 0 ||
      formData.imageIds.length > 0 ||
      (formData.mediaData && formData.mediaData.length > 0) ||
      formData.ingredientIds.length > 0 ||
      formData.allergenIds.length > 0 ||
      formData.dietaryLabelIds.length > 0 ||
      formData.availability.length > 0 ||
      formData.customizationGroups.length > 0 ||
      formData.leadTime > 0
    );
  }, [formData, template, originalTemplateData, hasChangesFromTemplate]);

  // No need to create draft dish - dish media can be created without dishId

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

    // Wait for DOM to be ready
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

      // Store refs
      sectionElements.forEach(({ id, element }) => {
        sectionsMap.set(id, element);
      });

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in upper portion of viewport
        threshold: 0,
      };

      observer = new IntersectionObserver((entries) => {
        // Only update if not manually scrolling via tab click
        if (isScrollingRef.current) return;

        // Find the entry with the highest intersection ratio in the viewport
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio, then by position (top to bottom)
          visibleEntries.sort((a, b) => {
            const ratioDiff = b.intersectionRatio - a.intersectionRatio;
            if (Math.abs(ratioDiff) > 0.1) return ratioDiff;
            // If ratios are similar, prefer the one higher on the page
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

          const topEntry = visibleEntries[0];
          const sectionId = topEntry.target.id.replace("section-", "");
          if (sectionId && sections.includes(sectionId)) {
            setActiveTab(sectionId);
          }
        }
      }, observerOptions);

      // Observe all sections
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
  }, []); // Only run once on mount

  // Update ref when isScrolling changes (for the check inside observer callback)
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we can still trigger the dialog
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, isSaving]);

  // Handle browser history navigation (back/forward, including Mac trackpad swipes)
  useEffect(() => {
    if (!hasUnsavedChanges || isSaving) {
      // Reset the ref when there are no unsaved changes
      hasPushedDummyStateRef.current = false;
      return;
    }

    // Push a dummy state to detect when user tries to navigate back/forward
    // This allows us to intercept the navigation before it completes
    const pushDummyState = () => {
      if (!hasPushedDummyStateRef.current) {
        window.history.pushState(
          { preventBack: true, hasUnsavedChanges: true },
          "",
          window.location.href
        );
        hasPushedDummyStateRef.current = true;
      }
    };

    // Push dummy state when unsaved changes are detected
    pushDummyState();

    const handlePopState = () => {
      // Only intercept if we have unsaved changes
      if (!hasUnsavedChanges || isSaving) {
        return;
      }

      // Prevent the navigation by pushing the state back
      window.history.pushState(
        { preventBack: true, hasUnsavedChanges: true },
        "",
        window.location.href
      );
      hasPushedDummyStateRef.current = true;

      // Show confirmation dialog
      setPendingNavigation(null); // We'll use router.back() if confirmed
      setShowLeaveConfirmDialog(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, isSaving]);

  // Intercept Link clicks to show confirmation dialog
  useEffect(() => {
    if (!hasUnsavedChanges || isSaving) {
      return;
    }

    const shouldInterceptNavigation = (href: string, linkElement: HTMLAnchorElement): boolean => {
      // Don't intercept external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }
      
      // Don't intercept anchor links (same page navigation)
      if (href.startsWith('#')) {
        return false;
      }
      
      // Don't intercept if link is inside a button (like BackButton)
      if (linkElement.closest('button')) {
        return false;
      }
      
      // Don't intercept if the link has a data attribute for custom handling
      if (linkElement.hasAttribute('data-skip-navigation-guard')) {
        return false;
      }
      
      // Normalize paths for comparison
      const currentPath = window.location.pathname;
      const normalizedHref = href.startsWith('/') ? href : new URL(href, window.location.origin).pathname;
      
      // Don't intercept if it's the current page
      if (normalizedHref === currentPath || normalizedHref === pathname) {
        return false;
      }
      
      return true;
    };

    const handleLinkClick = (e: MouseEvent) => {
      // Find the clicked anchor element
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (!linkElement) return;
      
      const href = linkElement.getAttribute('href');
      if (!href) return;
      
      if (!shouldInterceptNavigation(href, linkElement)) {
        return;
      }
      
      // CRITICAL: Prevent the navigation immediately
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // Show confirmation dialog
      setPendingNavigation(href);
      setShowLeaveConfirmDialog(true);
    };

    // Use mousedown to catch Next.js Links before they process the click
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (!linkElement) return;
      
      const href = linkElement.getAttribute('href');
      if (!href) return;
      
      if (!shouldInterceptNavigation(href, linkElement)) {
        return;
      }
      
      // Prevent navigation
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      setPendingNavigation(href);
      setShowLeaveConfirmDialog(true);
    };

    // Use capture phase with highest priority to intercept before Next.js
    // Also use window level to catch events before they bubble
    const options = { capture: true, passive: false };
    
    // Add listeners at window level for maximum priority
    window.addEventListener('click', handleLinkClick, options);
    window.addEventListener('mousedown', handleMouseDown, options);
    
    // Also add at document level as backup
    document.addEventListener('click', handleLinkClick, options);
    document.addEventListener('mousedown', handleMouseDown, options);
    
    return () => {
      window.removeEventListener('click', handleLinkClick, options);
      window.removeEventListener('mousedown', handleMouseDown, options);
      document.removeEventListener('click', handleLinkClick, options);
      document.removeEventListener('mousedown', handleMouseDown, options);
    };
  }, [hasUnsavedChanges, isSaving, pathname]);

  // Handle confirmation to leave page
  const handleConfirmLeave = () => {
    setShowLeaveConfirmDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    } else {
      // If no specific navigation target, go back (for browser history navigation)
      router.back();
    }
  };

  // Handle navigation attempt (for Cancel button and other navigation)
  const handleNavigationAttempt = (url: string) => {
    if (hasUnsavedChanges && !isSaving) {
      setPendingNavigation(url);
      setShowLeaveConfirmDialog(true);
    } else {
      router.push(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSaving) {
      return;
    }

    // Show loading overlay immediately to prevent multiple submissions
    showLoading();

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

      // Hide loading overlay if validation fails
      hideLoading();
      return;
    }

    // Clear errors on successful validation
    setFieldErrors({});

    try {
      // Step 1: Transform formData to match backend API format
      const dishData: CreateDishPayload = {
        // Required fields
        name: formData.name.trim(),
        description: formData.description.trim(),
        cuisine: formData.cuisineId, // Backend expects 'cuisine' not 'cuisineId'
        category: formData.categoryId, // Backend expects 'category' not 'categoryId'
        leadTime: formData.leadTime,
        portionSizes: formData.portionSizes.map((ps) => ({
          portionLabel: ps.portionLabelId, // Backend expects 'portionLabel' not 'portionLabelId'
          size: String(ps.size).trim(), // Backend expects string, ensure it's trimmed
          price: ps.price,
        })),
        // Optional fields
        status: formData.status,
        spiceLevels: sortSpiceLevels(formData.spiceLevels)
          .map((level) => (level === "extra-hot" ? "extraHot" : level))
          .map((level) => level as "none" | "mild" | "medium" | "hot" | "extraHot"), // Backend expects array and 'extraHot' not 'extra-hot', sorted in order
      };

      // Add optional arrays only if they have values
      if (formData.ingredientIds.length > 0) {
        dishData.ingredients = formData.ingredientIds; // Backend expects 'ingredients' not 'ingredientIds'
      }
      if (formData.allergenIds.length > 0) {
        dishData.allergens = formData.allergenIds; // Backend expects 'allergens' not 'allergenIds'
      }
      if (formData.dietaryLabelIds.length > 0) {
        dishData.dietaryLabels = formData.dietaryLabelIds; // Backend expects 'dietaryLabels' not 'dietaryLabelIds'
      }
      // Always send maxQuantityPerDay (null clears the limit on the backend)
      dishData.maxQuantityPerDay = formData.maxQuantityPerDay;
      if (formData.availability.length > 0) {
        dishData.availability = formData.availability;
      }
      // Always send customizationGroups so backend can clear them when all are removed
      dishData.customizationGroups =
        formData.customizationGroups.length > 0
          ? formData.customizationGroups.map((group) => ({
              modifierGroup: group.modifierGroupId, // Backend expects 'modifierGroup' not 'modifierGroupId'
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

      // Add images if we have dish-media IDs
      if (formData.mediaData && formData.mediaData.length > 0) {
        const dishMediaIds = formData.mediaData
          .map((m) => m.dishMediaId)
          .filter((id): id is string => !!id);

        if (dishMediaIds.length > 0) {
          dishData.images = formData.mediaData
            .filter((m) => m.dishMediaId)
            .map((media, index) => ({
              image: media.dishMediaId!,
              isPrimary: media.isPrimary || index === 0,
            }));
        }
      }

      // Create dish with all data including images
      await createDishMutation.mutateAsync(dishData);

      // Don't hide loading overlay - keep it visible until redirect completes
      // This prevents users from clicking save again during slow network navigation
      toast.success("Dish created successfully");
      router.push("/dashboard/dishes");
      // Loading overlay will remain visible until component unmounts during navigation
    } catch (error) {
      // Hide loading overlay on error
      hideLoading();

      console.error("Failed to create dish:", error);

      // Map server errors to field-level errors
      const mapped = mapServerError(error);

      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        // Set field-level errors so fields show red borders and inline messages
        setFieldErrors(mapped.fieldErrors);

        // Show specific validation messages in toast
        showValidationToast(
          mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to create dish. Please try again."],
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
        const message = mapped.toastMessages[0] || "Failed to create dish. Please try again.";
        toast.error(message);
      }

      // Don't redirect on error - let user see the error and fix the form
      return;
    }
  };

  const updateFormData = useCallback((updates: Partial<DishFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    if (updatedFields.length > 0) {
      setFieldErrors((prevErrors) => {
        if (Object.keys(prevErrors).length === 0) return prevErrors;
        const newErrors = { ...prevErrors };
        updatedFields.forEach((field) => {
          // Remove error for this field and any nested fields
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

  // Count errors per section (memoized for performance)
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
        // Match exact field or nested field (e.g., portionSizes.0.price)
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

  // Scroll to section when tab changes
  const handleTabChange = (value: string) => {
    setIsScrolling(true);
    setActiveTab(value);
    const section = document.getElementById(`section-${value}`);
    if (section) {
      // Account for sticky header offset
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset scrolling flag after scroll completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    } else {
      setIsScrolling(false);
    }
  };

  const isBusy = isSaving || isLoadingTemplate || isImageUploading || isImageCreatingMedia;
  const isTemplateUnchanged = !!(template && originalTemplateData && !hasChangesFromTemplate);

  // Wizard steps — no useMemo; React Compiler handles optimization
  const wizardSteps: WizardStep[] = [
    { id: "details", title: "Dish Details", description: "Name, description, category & cuisine", isComplete: !!(formData.name && formData.description && formData.cuisineId && formData.categoryId), errorCount: getSectionErrorCount("details") },
    { id: "media", title: "Media", description: "Photos & gallery", isComplete: (formData.imageIds?.length || 0) > 0 || (formData.mediaData?.length || 0) > 0, errorCount: getSectionErrorCount("media") },
    { id: "specs", title: "Specs & Portions", description: "Sizes, dietary & allergens", isComplete: (formData.portionSizes?.length || 0) > 0, errorCount: getSectionErrorCount("specs") },
    { id: "availability", title: "Availability", description: "Schedule & stock limits", isComplete: true, errorCount: getSectionErrorCount("availability") },
    { id: "customizations", title: "Customizations", description: "Modifiers & add-ons", isComplete: true, errorCount: getSectionErrorCount("customizations") },
  ];

  // Active step index (convert tab id to index)
  const stepIndex = wizardSteps.findIndex((s) => s.id === activeTab);
  const activeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const handleStepChange = (index: number) => {
    const step = wizardSteps[index];
    if (step) handleTabChange(step.id);
  };

  // Progress: percentage of required fields filled
  const progress = useMemo(() => {
    let filled = 0;
    let total = 5; // name, description, cuisineId, categoryId, portionSizes
    if (formData.name) filled++;
    if (formData.description) filled++;
    if (formData.cuisineId) filled++;
    if (formData.categoryId) filled++;
    if ((formData.portionSizes?.length || 0) > 0) filled++;
    if ((formData.imageIds?.length || 0) > 0 || (formData.mediaData?.length || 0) > 0) { filled++; total++; }
    else { total++; } // image counts but not filled
    return Math.round((filled / total) * 100);
  }, [formData]);

  // Show loading state when template is being loaded
  if (templateId && isLoadingTemplate) {
    return (
      <div className="space-y-[var(--p-space-500)] w-full">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Dishes", onClick: () => router.push("/dashboard/dishes") },
          { label: "Create" },
        ]} />
        <FormWizardSkeleton stepCount={5} />
      </div>
    );
  }

  // Tips per step
  const stepTips: Record<string, string> = {
    details: "Dishes with clear, descriptive names and detailed descriptions get 40% more orders.",
    media: "Dishes with at least 3 high-quality photos receive 2.4x more orders on average.",
    specs: "Offering multiple portion sizes gives customers flexibility and increases average order value.",
    availability: "Setting a daily limit helps manage your workload and ingredient stock.",
    customizations: "Dishes with modifier options (toppings, extras) generate 30% higher revenue per order.",
  };

  // First image URL for preview
  const previewImage = formData.mediaData?.[0]?.publicUrl || null;
  // First portion price for preview
  const previewPrice = formData.portionSizes?.[0]?.price;

  return (
    <div className="sm:rounded-[var(--p-border-radius-400)] sm:overflow-hidden">
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => handleNavigationAttempt("/dashboard") },
          { label: "Dishes", onClick: () => handleNavigationAttempt("/dashboard/dishes") },
          { label: "Create" },
        ]} />
      </div>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <FormWizard
          steps={wizardSteps}
          activeStep={activeStepIndex}
          onStepChange={handleStepChange}
          pageTitle={template ? "Create Dish (from template)" : "Create New Dish"}
          progress={progress}
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
              <Button type="button" variant="tertiary" onClick={() => handleNavigationAttempt("/dashboard/dishes")}>
                Discard
              </Button>
              <Button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isBusy || isTemplateUnchanged}
              >
                {isBusy && <Spinner size="small" />}
                {isSaving ? "Saving..." : isBusy ? "Uploading..." : "Save Dish"}
              </Button>
            </>
          }
          onComplete={() => formRef.current?.requestSubmit()}
        >
          {/* All sections always mounted — show/hide with CSS to preserve hook ordering */}
          <div style={{ display: activeTab === "details" ? "block" : "none" }}>
            <DishDetailsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "media" ? "block" : "none" }}>
            <MediaUploadSection
              mediaType="dish"
              title="Dish Media"
              description="Upload high-quality images of your dish (up to 4). The first image is the primary image."
              maxFiles={4}
              maxFileSize={25 * 1024 * 1024}
              tips={[
                "Use high-quality, well-lit images from the best angle",
                "First image becomes the primary/featured image",
                "Supported: PNG, JPG, GIF (max 25MB each)",
              ]}
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
              onUploadStateChange={(isUploading, isCreatingMedia) => {
                setIsImageUploading(isUploading);
                setIsImageCreatingMedia(isCreatingMedia);
              }}
            />
          </div>

          <div style={{ display: activeTab === "specs" ? "block" : "none" }}>
            <DishSpecsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "availability" ? "block" : "none" }}>
            <DishAvailabilitySection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>

          <div style={{ display: activeTab === "customizations" ? "block" : "none" }}>
            <DishCustomizationsSection
              formData={formData}
              onUpdate={updateFormData}
              errors={fieldErrors}
            />
          </div>
        </FormWizard>
      </form>

      {/* Template warning */}
      {isTemplateUnchanged && (
        <Banner tone="warning" title="">
          <p>Please modify at least one field before saving.</p>
        </Banner>
      )}

      {/* Navigation Confirmation Dialog */}
      <ConfirmationDialog
        open={showLeaveConfirmDialog}
        onOpenChange={setShowLeaveConfirmDialog}
        type="custom"
        title="Leave Page?"
        description="You have unsaved changes on this page. If you leave now, all your changes will be lost."
        confirmLabel="Leave Page"
        cancelLabel="Stay on Page"
        onConfirm={handleConfirmLeave}
        variant="default"
        warning="This action cannot be undone. All unsaved changes will be discarded."
      />
    </div>
  );
}
