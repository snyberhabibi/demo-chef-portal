"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReviews } from "@/hooks/use-reviews";
import { useChefProfile } from "@/hooks/use-chef-profile";
import { useDishes } from "@/hooks/use-dishes";
import { useBundles } from "@/hooks/use-bundles";
import { StarFilledIcon, StarIcon, ChevronDownIcon, ImageIcon } from "@shopify/polaris-icons";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  Card,
  Banner,
  Avatar,
  Spinner,
  EmptyState,
  FilterPills,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
} from "@/components/polaris";
import type { FilterPill } from "@/components/polaris";
import type { Review } from "@/types/reviews.types";
import type { ReviewsQueryParams } from "@/types/reviews.types";

const tabs: FilterPill[] = [
  { id: "chef", label: "Chef Profile" },
  { id: "dish", label: "Dishes" },
  { id: "bundle", label: "Bundles" },
];

/* ------------------------------------------------------------------ */
/*  Shared Components                                                 */
/* ------------------------------------------------------------------ */

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "size-5" : "size-4";
  return (
    <div className="flex items-center gap-[var(--p-space-025)]">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= Math.round(rating) ? (
          <StarFilledIcon key={star} className={cn(iconClass, "fill-[rgba(255,196,0,1)]")} />
        ) : (
          <StarIcon key={star} className={cn(iconClass, "fill-[var(--p-color-icon-secondary)]")} />
        )
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-[var(--p-space-400)]">
      {/* Header: avatar + name + time + rating */}
      <div className="flex items-center gap-[var(--p-space-300)]">
        <Avatar
          source={review.customerUser.avatar}
          name={review.customerUser.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[var(--p-space-200)]">
            <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
              {review.customerUser.name}
            </span>
            <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[var(--p-space-100)] shrink-0">
          <span className="text-[0.875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {review.rating.toFixed(1)}
          </span>
          <StarFilledIcon className="size-4 fill-[rgba(255,196,0,1)]" />
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-[0.8125rem] text-[var(--p-color-text)] mt-[var(--p-space-300)] leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-[var(--p-space-200)] mt-[var(--p-space-300)]">
          {review.images.map((img) => (
            <div key={img.id} className="relative size-16 rounded-[var(--p-border-radius-200)] overflow-hidden border border-[var(--p-color-border-secondary)]">
              <img src={img.url} alt="Review" className="size-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rating Distribution Bar                                           */
/* ------------------------------------------------------------------ */

function RatingDistribution({
  reviews,
  totalReviews,
}: {
  reviews: Review[];
  totalReviews: number;
}) {
  // Count per star level
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const rounded = Math.round(r.rating);
    if (rounded >= 1 && rounded <= 5) counts[rounded]++;
  }

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-[var(--p-space-150)]">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star];
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-[var(--p-space-200)]">
            <span className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] w-5 text-right shrink-0">
              {star}.0
            </span>
            <div className="flex-1 h-2 rounded-full bg-[var(--p-color-bg-fill-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[rgba(255,196,0,1)] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)] w-16 shrink-0">
              {count} {count === 1 ? "review" : "reviews"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rating Summary Header (for chef tab)                              */
/* ------------------------------------------------------------------ */

function RatingSummary({
  reviews,
  totalReviews,
}: {
  reviews: Review[];
  totalReviews: number;
}) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div data-testid="reviews-rating-summary" className="flex flex-col sm:flex-row gap-[var(--p-space-500)] pb-[var(--p-space-500)] border-b border-[var(--p-color-border-secondary)]">
      {/* Overall score */}
      <div className="flex flex-col items-center sm:items-start gap-[var(--p-space-100)] shrink-0">
        <span className="text-[2.5rem] leading-none font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {avgRating > 0 ? avgRating.toFixed(1) : "—"}
        </span>
        <StarRating rating={avgRating} size="md" />
        <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
          {totalReviews} {totalReviews === 1 ? "rating" : "ratings"}
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex-1">
        <RatingDistribution reviews={reviews} totalReviews={totalReviews} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeletons                                                         */
/* ------------------------------------------------------------------ */

function ReviewSkeleton() {
  return (
    <div className="py-[var(--p-space-400)] animate-pulse">
      <div className="flex items-center gap-[var(--p-space-300)]">
        <div className="size-8 rounded-full bg-[var(--p-color-bg-fill-secondary)] shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-[var(--p-space-200)]">
            <div className="h-4 w-28 rounded bg-[var(--p-color-bg-fill-secondary)]" />
            <div className="h-3 w-16 rounded bg-[var(--p-color-bg-fill-secondary)]" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-8 rounded bg-[var(--p-color-bg-fill-secondary)]" />
          <div className="size-4 rounded bg-[var(--p-color-bg-fill-secondary)]" />
        </div>
      </div>
      <div className="mt-[var(--p-space-300)] space-y-[var(--p-space-200)]">
        <div className="h-3 w-full rounded bg-[var(--p-color-bg-fill-secondary)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--p-color-bg-fill-secondary)]" />
      </div>
    </div>
  );
}

function ChefReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-[var(--p-space-500)]">
      {/* Rating summary skeleton */}
      <div className="flex flex-col sm:flex-row gap-[var(--p-space-500)] pb-[var(--p-space-500)] border-b border-[var(--p-color-border-secondary)]">
        <div className="flex flex-col items-center sm:items-start gap-[var(--p-space-200)] shrink-0">
          <div className="h-10 w-16 rounded bg-[var(--p-color-bg-fill-secondary)]" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="size-5 rounded bg-[var(--p-color-bg-fill-secondary)]" />
            ))}
          </div>
          <div className="h-3 w-20 rounded bg-[var(--p-color-bg-fill-secondary)]" />
        </div>
        <div className="flex-1 space-y-[var(--p-space-200)]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-[var(--p-space-200)]">
              <div className="h-3 w-5 rounded bg-[var(--p-color-bg-fill-secondary)]" />
              <div className="flex-1 h-2 rounded-full bg-[var(--p-color-bg-fill-secondary)]" />
              <div className="h-3 w-16 rounded bg-[var(--p-color-bg-fill-secondary)]" />
            </div>
          ))}
        </div>
      </div>
      {/* Sort bar skeleton */}
      <div className="flex items-center justify-end">
        <div className="h-9 w-[9rem] rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)]" />
      </div>
      {/* Review cards skeleton */}
      <div className="divide-y divide-[var(--p-color-border-secondary)]">
        {Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}
      </div>
    </div>
  );
}

function TargetItemSkeleton() {
  return (
    <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border-secondary)] animate-pulse">
      <div className="flex items-center gap-[var(--p-space-300)] p-[var(--p-space-400)]">
        <div className="size-12 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] shrink-0" />
        <div className="flex-1 space-y-[var(--p-space-150)]">
          <div className="h-4 w-40 rounded bg-[var(--p-color-bg-fill-secondary)]" />
          <div className="h-3 w-24 rounded bg-[var(--p-color-bg-fill-secondary)]" />
        </div>
        <div className="size-5 rounded bg-[var(--p-color-bg-fill-secondary)] shrink-0" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chef Reviews Tab                                                  */
/* ------------------------------------------------------------------ */

function ChefReviewsTab({ chefId }: { chefId: string }) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useReviews({
    targetType: "chef",
    targetId: chefId,
    page: currentPage,
    limit: 10,
    sort: sortOrder,
  });

  const reviews = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalReviews = data?.total || 0;

  if (isLoading) return <ChefReviewsSkeleton />;

  if (isError) {
    return (
      <Banner tone="critical">
        <p>{error instanceof Error ? error.message : "Failed to load reviews."}</p>
      </Banner>
    );
  }

  if (reviews.length === 0 && currentPage === 1) {
    return (
      <div data-testid="reviews-empty-state" className="py-[var(--p-space-600)] text-center">
        <StarIcon className="size-8 fill-[var(--p-color-icon-secondary)] mx-auto mb-[var(--p-space-200)]" />
        <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">No reviews yet</p>
        <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">Reviews will appear here once customers leave feedback</p>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Rating summary with distribution */}
      <RatingSummary reviews={reviews} totalReviews={totalReviews} />

      {/* Sort */}
      <div className="flex items-center justify-end">
        <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v as typeof sortOrder); setCurrentPage(1); }}>
          <SelectTrigger data-testid="reviews-sort" className="w-[9rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review cards */}
      <div className="divide-y divide-[var(--p-color-border-secondary)]">
        {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-[var(--p-space-300)] border-t border-[var(--p-color-border-secondary)]">
          <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
            Page {currentPage} of {totalPages}
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reviews list (for dish/bundle accordions)                         */
/* ------------------------------------------------------------------ */

function ReviewsList({ params }: { params: ReviewsQueryParams }) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useReviews({
    ...params,
    page: currentPage,
    limit: 10,
    sort: sortOrder,
  });

  const reviews = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalReviews = data?.total || 0;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="pt-[var(--p-space-300)]">
      {/* Sort + summary */}
      <div className="flex items-center justify-between gap-[var(--p-space-300)] mb-[var(--p-space-400)]">
        {!isLoading && reviews.length > 0 && (
          <div className="flex items-center gap-[var(--p-space-200)]">
            <span className="text-[1.25rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">{avgRating}</span>
            <StarFilledIcon className="size-4 fill-[rgba(255,196,0,1)]" />
            <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
              ({totalReviews})
            </span>
          </div>
        )}
        <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v as typeof sortOrder); setCurrentPage(1); }}>
          <SelectTrigger data-testid="reviews-sort" className="w-[9rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <Banner tone="critical">
          <p>{error instanceof Error ? error.message : "Failed to load reviews."}</p>
        </Banner>
      ) : isLoading ? (
        <div className="divide-y divide-[var(--p-color-border-secondary)]">
          {Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div data-testid="reviews-empty-state" className="py-[var(--p-space-600)] text-center">
          <StarIcon className="size-8 fill-[var(--p-color-icon-secondary)] mx-auto mb-[var(--p-space-200)]" />
          <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">No reviews yet</p>
          <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">Reviews will appear here once customers leave feedback</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-[var(--p-color-border-secondary)]">
            {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-[var(--p-space-300)] mt-[var(--p-space-300)] border-t border-[var(--p-color-border-secondary)]">
              <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                Page {currentPage} of {totalPages}
              </span>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish/Bundle Accordion Item                                        */
/* ------------------------------------------------------------------ */

function TargetItem({ id, name, image, targetType, reviews }: {
  id: string;
  name: string;
  image?: string;
  targetType: "dish" | "bundle";
  reviews?: { rating: number; total: number };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div data-testid="target-item" className={cn(
      "rounded-[var(--p-border-radius-300)] border transition-shadow",
      expanded
        ? "border-[var(--p-color-border)] shadow-[var(--p-shadow-200)]"
        : "border-[var(--p-color-border-secondary)] hover:shadow-[var(--p-shadow-100)]"
    )}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-[var(--p-space-300)] p-[var(--p-space-400)] cursor-pointer"
      >
        <div className="size-12 rounded-[var(--p-border-radius-200)] overflow-hidden shrink-0 bg-[var(--p-color-bg-surface-secondary)] border border-[var(--p-color-border-secondary)]">
          {image ? (
            <img src={image} alt={name} className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center">
              <ImageIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
            </div>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
            {name}
          </p>
          {reviews && reviews.total > 0 ? (
            <div className="flex items-center gap-[var(--p-space-150)] mt-[var(--p-space-050)]">
              <StarFilledIcon className="size-3.5 fill-[rgba(255,196,0,1)]" />
              <span className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                {reviews.rating.toFixed(1)}
              </span>
              <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                ({reviews.total} {reviews.total === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              No reviews yet
            </p>
          )}
        </div>
        <ChevronDownIcon className={cn(
          "size-5 fill-[var(--p-color-icon-secondary)] transition-transform duration-200 shrink-0",
          expanded && "rotate-180"
        )} />
      </button>

      {expanded && (
        <div className="px-[var(--p-space-400)] pb-[var(--p-space-400)] border-t border-[var(--p-color-border-secondary)]">
          <ReviewsList params={{ targetType, targetId: id }} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dishes & Bundles Tabs (lazy-loaded)                               */
/* ------------------------------------------------------------------ */

function DishesTab() {
  const { data: dishesData, isLoading } = useDishes({ page: 1, limit: 100 });
  const dishes = dishesData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-[var(--p-space-300)]">
        {Array.from({ length: 4 }).map((_, i) => <TargetItemSkeleton key={i} />)}
      </div>
    );
  }

  if (dishes.length === 0) {
    return <EmptyState heading="No dishes" description="Create dishes to see their reviews." />;
  }

  return (
    <div className="space-y-[var(--p-space-300)]">
      {dishes.map((dish) => (
        <TargetItem key={dish.id} id={dish.id} name={dish.name} image={dish.image} targetType="dish" reviews={dish.reviews} />
      ))}
    </div>
  );
}

function BundlesTab() {
  const { data: bundlesData, isLoading } = useBundles({ page: 1, limit: 100 });
  const bundles = bundlesData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-[var(--p-space-300)]">
        {Array.from({ length: 3 }).map((_, i) => <TargetItemSkeleton key={i} />)}
      </div>
    );
  }

  if (bundles.length === 0) {
    return <EmptyState heading="No bundles" description="Create bundles to see their reviews." />;
  }

  return (
    <div className="space-y-[var(--p-space-300)]">
      {bundles.map((bundle) => (
        <TargetItem key={bundle.id} id={bundle.id} name={bundle.name} image={bundle.image} targetType="bundle" reviews={bundle.reviews} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ReviewsPage() {
  const router = useRouter();
  const { data: chefProfile, isLoading: isChefLoading } = useChefProfile();
  const [activeTab, setActiveTab] = useState("chef");

  return (
    <div className="space-y-[var(--p-space-500)]">
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Reviews" },
      ]} />

      <div>
        <h2 data-testid="reviews-heading" className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
          Reviews
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          See what customers are saying about your profile, dishes, and bundles
        </p>
      </div>

      <FilterPills
        data-testid="reviews-tab-filter"
        pills={tabs}
        selected={activeTab}
        onSelect={(id) => setActiveTab(Array.isArray(id) ? id[0] : id)}
      />

      {/* Chef Profile tab */}
      {activeTab === "chef" && (
        <Card>
          {isChefLoading ? (
            <ChefReviewsSkeleton />
          ) : chefProfile?.id ? (
            <ChefReviewsTab chefId={chefProfile.id} />
          ) : (
            <div className="flex justify-center py-[var(--p-space-500)]">
              <Spinner size="small" />
            </div>
          )}
        </Card>
      )}

      {/* Dishes tab */}
      {activeTab === "dish" && (
        <Card>
          <DishesTab />
        </Card>
      )}

      {/* Bundles tab */}
      {activeTab === "bundle" && (
        <Card>
          <BundlesTab />
        </Card>
      )}
    </div>
  );
}
