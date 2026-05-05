import { useQuery } from "@tanstack/react-query";
import { dishTemplatesService } from "@/services/dish-templates.service";
import type { DishTemplateListItem } from "@/services/dish-templates.service";

/**
 * Hook to fetch list of dish templates for dropdown/search
 * @param enabled - Whether to enable the query (default: true)
 * @param search - Optional search query to filter templates on the server
 */
export function useDishTemplates(enabled: boolean = true, search?: string) {
  return useQuery({
    queryKey: ["dish-templates", search],
    queryFn: async () => {
      const response = await dishTemplatesService.getDishTemplates(search);
      // Ensure we return an array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      // Handle case where API might return data wrapped in an object (defensive check)
      if (data && typeof data === "object" && data !== null && !Array.isArray(data)) {
        const dataObj = data as Record<string, unknown>;
        if ("templates" in dataObj && Array.isArray(dataObj.templates)) {
          return dataObj.templates as DishTemplateListItem[];
        }
        if ("data" in dataObj && Array.isArray(dataObj.data)) {
          return dataObj.data as DishTemplateListItem[];
        }
      }
      // Default to empty array
      return [];
    },
    enabled,
  });
}

/**
 * Hook to fetch a single dish template by ID
 */
export function useDishTemplate(id: string | null | undefined) {
  return useQuery({
    queryKey: ["dish-template", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await dishTemplatesService.getDishTemplateById(id);
      return response.data || null;
    },
    enabled: !!id,
  });
}

