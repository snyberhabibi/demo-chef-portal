import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { Cuisine } from "@/types/cuisines.types";

class CuisinesService {
  private readonly basePath = endpoints.cuisines.base;

  async getCuisines(): Promise<ApiResponse<Cuisine[]>> {
    return http.get<Cuisine[]>(this.basePath);
  }
}

export const cuisinesService = new CuisinesService();
