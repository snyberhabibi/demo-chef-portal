import { useQuery } from "@tanstack/react-query";
import { reviewsService } from "@/services/reviews.service";
import type { ReviewsQueryParams } from "@/types/reviews.types";

export function useReviews(params: ReviewsQueryParams) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => reviewsService.getReviews(params),
    enabled: !!params.targetId,
    staleTime: 30 * 1000,
  });
}
