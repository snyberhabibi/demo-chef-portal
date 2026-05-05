import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesService.getCategories();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  });
}

