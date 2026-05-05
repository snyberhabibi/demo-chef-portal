import { describe, it, expect } from "vitest";
import type { CreateDishPayload } from "@/services/dishes.service";

/**
 * Tests for dish payload construction logic used in create/edit pages.
 * These test the specific conditions that map DishFormData -> CreateDishPayload.
 */

// Minimal form data matching the DishFormData interface shape
function makeFormData(overrides: Record<string, unknown> = {}) {
  return {
    chefUserId: "chef-1",
    name: "Test Dish",
    description: "A test dish",
    cuisineId: "cuisine-1",
    categoryId: "category-1",
    status: "draft" as const,
    leadTime: 30,
    spiceLevels: [] as string[],
    portionSizes: [{ portionLabelId: "pl-1", size: "Regular", price: 10 }],
    ingredientIds: [] as string[],
    allergenIds: [] as string[],
    dietaryLabelIds: [] as string[],
    maxQuantityPerDay: null as number | null,
    availability: [] as string[],
    customizationGroups: [] as Array<{
      modifierGroupId: string;
      required: boolean;
      selectionType: "single" | "multiple";
      modifiers: Array<{
        name: string;
        priceAdjustment: number;
        description?: string;
      }>;
    }>,
    mediaData: [] as Array<{
      publicUrl: string;
      alt: string;
      isPrimary?: boolean;
      dishMediaId?: string;
    }>,
    ...overrides,
  };
}

/**
 * Replicates the payload construction logic from the create/edit pages.
 * This is the exact same logic used in:
 *   - app/dashboard/dishes/new/page.tsx (handleSubmit)
 *   - app/dashboard/dishes/[id]/edit/page.tsx (handleSubmit)
 */
function buildDishPayload(
  formData: ReturnType<typeof makeFormData>
): CreateDishPayload {
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
  };

  if (formData.ingredientIds.length > 0) {
    dishData.ingredients = formData.ingredientIds;
  }
  if (formData.allergenIds.length > 0) {
    dishData.allergens = formData.allergenIds;
  }
  if (formData.dietaryLabelIds.length > 0) {
    dishData.dietaryLabels = formData.dietaryLabelIds;
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

  return dishData;
}

describe("Dish Payload Construction", () => {
  describe("maxQuantityPerDay", () => {
    it("sends null when maxQuantityPerDay is cleared (empty field)", () => {
      const formData = makeFormData({ maxQuantityPerDay: null });
      const payload = buildDishPayload(formData);

      expect(payload.maxQuantityPerDay).toBeNull();
      expect("maxQuantityPerDay" in payload).toBe(true);
    });

    it("sends the number when maxQuantityPerDay has a value", () => {
      const formData = makeFormData({ maxQuantityPerDay: 50 });
      const payload = buildDishPayload(formData);

      expect(payload.maxQuantityPerDay).toBe(50);
    });

    it("sends null even after previously having a value (simulates clearing)", () => {
      // First set a value
      const formDataWithValue = makeFormData({ maxQuantityPerDay: 25 });
      const payloadWithValue = buildDishPayload(formDataWithValue);
      expect(payloadWithValue.maxQuantityPerDay).toBe(25);

      // Then clear it
      const formDataCleared = makeFormData({ maxQuantityPerDay: null });
      const payloadCleared = buildDishPayload(formDataCleared);
      expect(payloadCleared.maxQuantityPerDay).toBeNull();
      expect("maxQuantityPerDay" in payloadCleared).toBe(true);
    });
  });

  describe("customizationGroups", () => {
    const sampleGroup = {
      modifierGroupId: "mg-1",
      required: true,
      selectionType: "single" as const,
      modifiers: [
        { name: "Extra Cheese", priceAdjustment: 2.5, description: "More cheese" },
      ],
    };

    it("sends empty array when all customization groups are deleted", () => {
      const formData = makeFormData({ customizationGroups: [] });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups).toEqual([]);
      expect("customizationGroups" in payload).toBe(true);
    });

    it("sends the mapped array when customization groups exist", () => {
      const formData = makeFormData({
        customizationGroups: [sampleGroup],
      });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups).toEqual([
        {
          modifierGroup: "mg-1",
          required: true,
          selectionType: "single",
          modifiers: [
            {
              name: "Extra Cheese",
              priceAdjustment: 2.5,
              description: "More cheese",
            },
          ],
        },
      ]);
    });

    it("sends empty array when the only customization group is removed", () => {
      // Simulates: had 1 group, user deleted it -> empty array -> payload sends []
      const formData = makeFormData({ customizationGroups: [] });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups).toEqual([]);
    });

    it("sends remaining groups when one of multiple groups is deleted", () => {
      const group1 = { ...sampleGroup, modifierGroupId: "mg-1" };
      const group2 = {
        modifierGroupId: "mg-2",
        required: false,
        selectionType: "multiple" as const,
        modifiers: [
          { name: "Spicy", priceAdjustment: 0, description: "" },
        ],
      };

      // Simulate deleting group1, keeping group2
      const formData = makeFormData({ customizationGroups: [group2] });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups).not.toEqual([]);
      expect(payload.customizationGroups).toHaveLength(1);
      expect(payload.customizationGroups![0].modifierGroup).toBe("mg-2");
    });

    it("renames modifierGroupId to modifierGroup in payload", () => {
      const formData = makeFormData({
        customizationGroups: [sampleGroup],
      });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups![0]).toHaveProperty("modifierGroup");
      expect(payload.customizationGroups![0]).not.toHaveProperty("modifierGroupId");
    });

    it("trims modifier names and descriptions", () => {
      const groupWithSpaces = {
        ...sampleGroup,
        modifiers: [
          { name: "  Extra Cheese  ", priceAdjustment: 1, description: "  Yum  " },
        ],
      };
      const formData = makeFormData({ customizationGroups: [groupWithSpaces] });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups![0].modifiers[0].name).toBe("Extra Cheese");
      expect(payload.customizationGroups![0].modifiers[0].description).toBe("Yum");
    });

    it("omits description when empty after trimming", () => {
      const groupWithEmptyDesc = {
        ...sampleGroup,
        modifiers: [
          { name: "No Onions", priceAdjustment: 0, description: "   " },
        ],
      };
      const formData = makeFormData({ customizationGroups: [groupWithEmptyDesc] });
      const payload = buildDishPayload(formData);

      expect(payload.customizationGroups![0].modifiers[0].description).toBeUndefined();
    });
  });
});
