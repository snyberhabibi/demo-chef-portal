// API Response Types (matches backend structure)

export interface ImageAsset {
  id: string;
  alt: string | null;
  caption: string | null;
  prefix: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
}

export interface DishImage {
  id: string;
  url: string;
  isPrimary: boolean;
  alt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null; // Direct URL string
  sortOrder: number;
  updatedAt: string;
  createdAt: string;
}

export interface DishCuisine {
  id: string;
  name: string;
  parent: string | null;
  description: string;
  image: ImageAsset | null;
  sortOrder: number;
  updatedAt: string;
  createdAt: string;
}

export interface PortionLabel {
  id: string;
  label: string;
  singularName: string;
  pluralName: string;
  icon: string | null;
  description: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface PortionSize {
  id: string;
  portionLabel: PortionLabel;
  size: string;
  price: number;
}

export interface Allergen {
  id: string;
  name: string;
  description: string;
  image: ImageAsset | null;
  updatedAt: string;
  createdAt: string;
}

export interface ChefUser {
  id: string;
  avatar: ImageAsset | null;
  name: string;
  role: string;
  status: string;
  phone: string | null;
  addresses: unknown[];
  favorites: unknown[];
  updatedAt: string;
  createdAt: string;
  email: string;
  sessions: Array<{
    id: string;
    createdAt: string;
    expiresAt: string;
  }>;
}

export interface DishShipping {
  shippable: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  dryIce: {
    required: boolean;
    weight: number;
  };
}

// Raw API Dish response (matches backend exactly)
export interface DishApiResponse {
  id: string;
  chefUser: ChefUser;
  name: string;
  description: string;
  cuisine: DishCuisine;
  category: Category;
  status: "published" | "draft" | "archived";
  isFeatured: boolean;
  images: DishImage[];
  leadTime: number;
  spiceLevels: unknown[];
  portionSizes: PortionSize[];
  ingredients: unknown[];
  allergens: Allergen[];
  dietaryLabels: unknown[];
  maxQuantityPerDay: number | null;
  availability: unknown[];
  customizationGroups: unknown[];
  shipping: DishShipping | null;
  reviews?: { rating: number; total: number };
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

// Paginated API Response
export interface DishesApiResponse {
  docs: DishApiResponse[];
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

// Frontend Dish type (simplified for UI)
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number; // Minimum price from portionSizes
  image?: string; // Primary image URL or first image
  category: string; // Category name
  categoryId: string; // Category ID for filtering
  status: "draft" | "published" | "archived"; // Status from API
  createdAt: string;
  // Keep additional fields that might be useful
  images?: DishImage[];
  portionSizes?: PortionSize[];
  allergens?: Allergen[];
  cuisine?: DishCuisine;
  shipping?: DishShipping | null;
  reviews?: { rating: number; total: number };
}

// Frontend Dishes Response (transformed from API)
export interface DishesResponse {
  data: Dish[];
  total: number; // From totalDocs
  page: number;
  pageSize: number; // From limit
  totalPages: number;
}

