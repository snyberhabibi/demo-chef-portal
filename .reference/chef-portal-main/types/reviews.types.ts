export interface ReviewImage {
  id: string;
  url: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: ReviewImage[];
  customerUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface ReviewsApiResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReviewsQueryParams {
  targetType: "dish" | "bundle" | "chef";
  targetId: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "highest" | "lowest";
}
