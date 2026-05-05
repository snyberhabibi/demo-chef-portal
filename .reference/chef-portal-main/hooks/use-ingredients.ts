import { useQuery } from "@tanstack/react-query";
import { ingredientsService } from "@/services/ingredients.service";

export function useIngredients(searchQuery?: string) {
  return useQuery({
    queryKey: ["ingredients", searchQuery || ""],
    queryFn: async () => {
      const response = await ingredientsService.getIngredients(searchQuery);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always enabled, but will refetch when searchQuery changes
    placeholderData: (previousData) => previousData, // Keep previous data visible while loading new results
  });
}
