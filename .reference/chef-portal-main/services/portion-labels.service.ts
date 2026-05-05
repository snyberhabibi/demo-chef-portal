import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { PortionLabel } from "@/types/dishes.types";

class PortionLabelsService {
  private readonly basePath = "/api/v1/chef-portal/portion-labels";

  async getPortionLabels(): Promise<ApiResponse<PortionLabel[]>> {
    return http.get<PortionLabel[]>(this.basePath);
  }
}

export const portionLabelsService = new PortionLabelsService();

