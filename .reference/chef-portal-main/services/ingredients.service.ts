import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { ImageAsset } from "@/types/dishes.types";

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  image: ImageAsset | string | null;
  updatedAt: string;
  createdAt: string;
}

class IngredientsService {
  private readonly basePath = "/api/v1/chef-portal/ingredients";

  async getIngredients(query?: string): Promise<ApiResponse<Ingredient[]>> {
    const queryParams: Record<string, string> = {};
    if (query) {
      queryParams.q = query;
    }
    return http.get<Ingredient[]>(this.basePath, { params: queryParams });
  }
}

export const ingredientsService = new IngredientsService();
