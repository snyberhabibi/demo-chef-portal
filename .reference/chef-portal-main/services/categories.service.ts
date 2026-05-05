import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { Category } from "@/types/dishes.types";

class CategoriesService {
  private readonly basePath = endpoints.categories.base;

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return http.get<Category[]>(this.basePath);
  }
}

export const categoriesService = new CategoriesService();

