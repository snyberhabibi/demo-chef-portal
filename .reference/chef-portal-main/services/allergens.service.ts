import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { Allergen } from "@/types/dishes.types";

class AllergensService {
  private readonly basePath = "/api/v1/chef-portal/allergens";

  async getAllergens(): Promise<ApiResponse<Allergen[]>> {
    return http.get<Allergen[]>(this.basePath);
  }
}

export const allergensService = new AllergensService();

