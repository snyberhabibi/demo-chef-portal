import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

export interface DietaryLabel {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  updatedAt: string;
  createdAt: string;
}

class DietaryLabelsService {
  private readonly basePath = "/api/v1/chef-portal/dietary-labels";

  async getDietaryLabels(): Promise<ApiResponse<DietaryLabel[]>> {
    return http.get<DietaryLabel[]>(this.basePath);
  }
}

export const dietaryLabelsService = new DietaryLabelsService();

