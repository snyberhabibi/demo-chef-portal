import { http } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { ReviewsQueryParams, ReviewsResponse, ReviewsApiResponse } from "@/types/reviews.types";

class ReviewsService {
  async getReviews(params: ReviewsQueryParams): Promise<ReviewsResponse> {
    const queryParams: Record<string, string | number | boolean> = {
      targetType: params.targetType,
      targetId: params.targetId,
    };
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.sort) queryParams.sort = params.sort;

    const response = await http.get<ReviewsApiResponse>(
      endpoints.reviews.list,
      { params: queryParams }
    );

    const apiData = response.data;
    return {
      data: apiData?.reviews || [],
      total: apiData?.total || 0,
      page: apiData?.page || 1,
      totalPages: apiData?.totalPages || 0,
    };
  }
}

export const reviewsService = new ReviewsService();
