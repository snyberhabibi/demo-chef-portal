import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type {
  BundleApiResponse,
  BundlesApiResponse,
  Bundle,
  BundlesResponse,
} from "@/types/bundles.types";

export interface BundlesQueryParams {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
}

// Backend API payload format for creating a bundle
export interface CreateBundlePayload {
  name: string;
  description?: string;
  items: Array<{
    dish: string; // dish ID
    quantity: number;
  }>;
  portionSizes: Array<{
    portionLabel: string; // portion label ID
    size: string;
    regularPrice: number;
    salePrice: number;
  }>;
  spiceLevels?: Array<"none" | "mild" | "medium" | "hot" | "extraHot">;
  status?: "draft" | "published" | "archived";
  customizationGroups?: Array<{
    modifierGroup: string; // modifier group ID
    required: boolean;
    selectionType: "single" | "multiple";
    modifiers: Array<{
      name: string;
      priceAdjustment: number;
      description?: string;
    }>;
  }>;
  images?: Array<{
    image: string; // media ID
    isPrimary?: boolean;
  }>;
  availability?: string[];
  maxQuantityPerDay?: number | null;
  leadTime?: number | null;
  shipping?: {
    shippable: boolean;
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
    dryIce?: { required: boolean; weight?: number };
  };
}

class BundlesService {
  async getBundles(
    params?: BundlesQueryParams
  ): Promise<ApiResponse<BundlesApiResponse>> {
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

    return http.get<BundlesApiResponse>(endpoints.bundles.list, { params: queryParams });
  }

  /**
   * Transform API bundle response to frontend Bundle format
   */
  transformBundle(apiBundle: BundleApiResponse): Bundle {
    // Get primary image URL
    const imageUrl =
      apiBundle.primaryImageUrl ||
      apiBundle.images?.find((img) => img.isPrimary)?.url ||
      apiBundle.images?.[0]?.url ||
      undefined;

    // Get minimum regularPrice from portionSizes
    const portionSizes = apiBundle.portionSizes || [];
    const prices = portionSizes.map((ps) =>
      typeof ps.regularPrice === "number" ? ps.regularPrice : 0
    );
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      id: apiBundle.id,
      name: apiBundle.name,
      description: apiBundle.description,
      price: minPrice,
      image: imageUrl ?? undefined,
      status: apiBundle.status,
      itemCount: apiBundle.itemCount ?? apiBundle.items?.length ?? 0,
      createdAt: apiBundle.createdAt,
      images: apiBundle.images,
      portionSizes: apiBundle.portionSizes,
      items: apiBundle.items,
      reviews: apiBundle.reviews || undefined,
    };
  }

  /**
   * Transform API bundles response to frontend BundlesResponse format
   */
  transformBundlesResponse(apiResponse: BundlesApiResponse): BundlesResponse {
    return {
      data: apiResponse.docs.map((bundle) => this.transformBundle(bundle)),
      total: apiResponse.totalDocs,
      page: apiResponse.page,
      pageSize: apiResponse.limit,
      totalPages: apiResponse.totalPages,
    };
  }

  async getBundleById(id: string): Promise<ApiResponse<BundleApiResponse>> {
    return http.get<BundleApiResponse>(endpoints.bundles.getById(id));
  }

  async createBundle(
    data: CreateBundlePayload
  ): Promise<ApiResponse<{ id: string }>> {
    return http.post<{ id: string }>(endpoints.bundles.create, data);
  }

  async updateBundle(
    id: string,
    data: Partial<CreateBundlePayload>
  ): Promise<ApiResponse<BundleApiResponse>> {
    return http.put<BundleApiResponse>(endpoints.bundles.update(id), data);
  }

  async deleteBundle(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.bundles.delete(id));
  }
}

export const bundlesService = new BundlesService();
