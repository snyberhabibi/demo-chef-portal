import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

export interface DishTemplateListItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  cuisine?: {
    name: string;
    imageUrl?: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface DishTemplate extends DishTemplateListItem {
  // Extended template data when fetched by ID
  [key: string]: unknown;
}

class DishTemplatesService {
  private readonly basePath = endpoints.dishTemplates.base;

  /**
   * Get list of dish templates for dropdown/search
   * Returns: Array of { id, name, description, image }
   * @param search - Optional search query to filter templates
   */
  async getDishTemplates(search?: string): Promise<ApiResponse<DishTemplateListItem[]>> {
    const params: Record<string, string> = {};
    if (search?.trim()) {
      params.search = search.trim();
    }
    return http.get<DishTemplateListItem[]>(this.basePath, { params });
  }

  /**
   * Get dish template by ID with full data
   * Returns: Full template data
   */
  async getDishTemplateById(id: string): Promise<ApiResponse<DishTemplate>> {
    return http.get<DishTemplate>(endpoints.dishTemplates.getById(id));
  }
}

export const dishTemplatesService = new DishTemplatesService();

