import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type {
  DishApiResponse,
  DishesApiResponse,
  Dish,
  DishesResponse,
} from "@/types/dishes.types";

export interface DishesQueryParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  search?: string;
  category?: string;
  cuisine?: string;
  sort?: "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt";
}

// Backend API payload format for creating a dish
export interface CreateDishPayload {
  name: string;
  description: string;
  cuisine: string; // Backend expects 'cuisine' not 'cuisineId'
  category: string; // Backend expects 'category' not 'categoryId'
  leadTime: number;
  portionSizes: Array<{
    portionLabel: string; // Backend expects 'portionLabel' not 'portionLabelId'
    size: string;
    price: number;
  }>;
  status?: "draft" | "published" | "archived";
  spiceLevels?: Array<"none" | "mild" | "medium" | "hot" | "extraHot">; // Backend expects array and 'extraHot' not 'extra-hot'
  ingredients?: string[]; // Backend expects 'ingredients' not 'ingredientIds'
  allergens?: string[]; // Backend expects 'allergens' not 'allergenIds'
  dietaryLabels?: string[]; // Backend expects 'dietaryLabels' not 'dietaryLabelIds'
  maxQuantityPerDay?: number | null;
  availability?: string[];
  customizationGroups?: Array<{
    modifierGroup: string; // Backend expects 'modifierGroup' not 'modifierGroupId'
    required: boolean;
    selectionType: "single" | "multiple";
    modifiers: Array<{
      name: string;
      priceAdjustment: number;
      description?: string;
    }>;
  }>;
  images?: Array<{
    image: string; // dish-media ID
    isPrimary?: boolean;
  }>;
  shipping?: {
    shippable: boolean;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    dryIce?: {
      required: boolean;
      weight?: number;
    };
  };
}

class DishesService {
  private readonly basePath = endpoints.dishes.base;

  async getDishes(
    params?: DishesQueryParams
  ): Promise<ApiResponse<DishesApiResponse>> {
    const queryParams: Record<string, string> = {};

    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }
    if (params?.category) {
      queryParams.category = params.category;
    }
    if (params?.cuisine) {
      queryParams.cuisine = params.cuisine;
    }
    if (params?.sort) {
      queryParams.sort = params.sort;
    }

    return http.get<DishesApiResponse>(this.basePath, { params: queryParams });
  }

  /**
   * Transform API dish response to frontend Dish format
   */
  transformDish(apiDish: DishApiResponse): Dish {
    // Get primary image or first image (handle undefined images array)
    // API returns images as Array<{ id, url, isPrimary, alt }> directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const images = ((apiDish.images || []) as any[]).map((img) => ({
      id: img.id || "",
      url: img.url || "",
      isPrimary: !!img.isPrimary,
      alt: img.alt || null,
    }));
    const primaryImage = images.find((img) => img.isPrimary);
    const firstImage = images[0];
    const imageUrl = primaryImage?.url || firstImage?.url || undefined;

    // Get minimum price from portionSizes (handle undefined array)
    const portionSizes = apiDish.portionSizes || [];
    const prices = portionSizes.map((ps) => ps.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    // Preserve status from API: "draft", "published", or "archived"
    const status: "draft" | "published" | "archived" = apiDish.status;

    return {
      id: apiDish.id,
      name: apiDish.name,
      description: apiDish.description,
      price: minPrice,
      image: imageUrl,
      category: apiDish.category?.name || "",
      categoryId: apiDish.category?.id || "",
      status,
      createdAt: apiDish.createdAt,
      images: images,
      portionSizes: portionSizes,
      allergens: apiDish.allergens || [],
      cuisine: apiDish.cuisine,
      shipping: apiDish.shipping || null,
      reviews: apiDish.reviews || undefined,
    };
  }

  /**
   * Transform API dishes response to frontend DishesResponse format
   */
  transformDishesResponse(apiResponse: DishesApiResponse): DishesResponse {
    return {
      data: apiResponse.docs.map((dish) => this.transformDish(dish)),
      total: apiResponse.totalDocs,
      page: apiResponse.page,
      pageSize: apiResponse.limit,
      totalPages: apiResponse.totalPages,
    };
  }

  async getDishById(id: string): Promise<ApiResponse<DishApiResponse>> {
    const response = await http.get<DishApiResponse>(
      endpoints.dishes.getById(id)
    );
    return response;
  }

  async createDish(
    data: CreateDishPayload
  ): Promise<ApiResponse<{ id: string }>> {
    // Backend create endpoint returns minimal response:
    // { id, name, slug, description, status, createdAt }
    // We only need the ID, so we don't need to transform the full response
    const response = await http.post<{ id: string }>(
      endpoints.dishes.create,
      data
    );

    return response;
  }

  async updateDish(
    id: string,
    data: Partial<CreateDishPayload>
  ): Promise<ApiResponse<Dish>> {
    return http.put<Dish>(endpoints.dishes.getById(id), data);
  }

  async deleteDish(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.dishes.getById(id));
  }
}

export const dishesService = new DishesService();
