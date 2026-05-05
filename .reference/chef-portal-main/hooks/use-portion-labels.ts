import { useQuery } from "@tanstack/react-query";
import { portionLabelsService } from "@/services/portion-labels.service";

export function usePortionLabels() {
  return useQuery({
    queryKey: ["portion-labels"],
    queryFn: async () => {
      const response = await portionLabelsService.getPortionLabels();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

