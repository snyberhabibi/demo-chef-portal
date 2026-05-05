import { useQuery } from "@tanstack/react-query";
import { cuisinesService } from "@/services/cuisines.service";

export function useCuisines() {
  return useQuery({
    queryKey: ["cuisines"],
    queryFn: async () => {
      const response = await cuisinesService.getCuisines();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - cuisines don't change often
  });
}
