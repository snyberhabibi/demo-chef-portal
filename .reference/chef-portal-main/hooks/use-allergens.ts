import { useQuery } from "@tanstack/react-query";
import { allergensService } from "@/services/allergens.service";

export function useAllergens() {
  return useQuery({
    queryKey: ["allergens"],
    queryFn: async () => {
      const response = await allergensService.getAllergens();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

