import { useQuery } from "@tanstack/react-query";
import { dietaryLabelsService } from "@/services/dietary-labels.service";

export function useDietaryLabels() {
  return useQuery({
    queryKey: ["dietary-labels"],
    queryFn: async () => {
      const response = await dietaryLabelsService.getDietaryLabels();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

