// API Response Types (matches backend structure)

import type { DishImage, ChefUser, DishShipping } from "./dishes.types";

// Spice level enum used by bundles
export type BundleSpiceLevel = "none" | "mild" | "medium" | "hot" | "extraHot";

// Bundle item - a dish within a bundle with quantity
export interface BundleItem {
  id?: string;
  dish: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    primaryImageUrl?: string | null;
  } | string; // string when creating (just dish ID), object when reading from API
  quantity: number;
}

// Bundle portion size (different from dish - has regularPrice and salePrice)
export interface BundlePortionSize {
  id?: string;
  portionLabel: {
    id: string;
    label: string;
    slug?: string;
    singularName?: string;
    pluralName?: string;
  } | string; // string when creating (just ID), object when reading from API
  size: string;
  regularPrice: number;
  salePrice?: number;
  savings?: number; // computed by backend
  savingsPercentage?: number; // computed by backend
}

// Bundle customization group
export interface BundleCustomizationGroup {
  id?: string;
  modifierGroup: string | { id: string; name: string; slug?: string };
  required: boolean;
  selectionType: "single" | "multiple";
  modifiers: Array<{
    name: string;
    priceAdjustment: number;
    description?: string;
  }>;
}

// Raw API Bundle response for GET /bundles/:id (detail)
export interface BundleApiResponse {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  status: "published" | "draft" | "archived";
  isFeatured?: boolean;
  items: BundleItem[];
  spiceLevels: BundleSpiceLevel[];
  portionSizes: BundlePortionSize[];
  customizationGroups: BundleCustomizationGroup[];
  images: DishImage[];
  availability: string[];
  maxQuantityPerDay: number | null;
  leadTime?: number | null;
  shipping?: DishShipping | null;
  primaryImageUrl?: string | null;
  itemCount?: number;
  chef?: ChefUser | string;
  reviews?: { rating: number; total: number };
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}

// Paginated API Response
export interface BundlesApiResponse {
  docs: BundleApiResponse[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Frontend Bundle type (simplified for UI card display)
export interface Bundle {
  id: string;
  name: string;
  description?: string;
  price: number; // Minimum regularPrice from portionSizes
  image?: string; // primaryImageUrl or first image
  status: "draft" | "published" | "archived";
  itemCount: number; // Number of items in bundle
  createdAt: string;
  images?: DishImage[];
  portionSizes?: BundlePortionSize[];
  items?: BundleItem[];
  reviews?: { rating: number; total: number };
}

// Frontend Bundles Response (transformed from API)
export interface BundlesResponse {
  data: Bundle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
