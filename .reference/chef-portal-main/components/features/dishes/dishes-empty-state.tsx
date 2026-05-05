"use client";

import { EmptyState } from "@/components/polaris";
import { SearchIcon, FilterIcon, ArchiveIcon } from "@shopify/polaris-icons";
import { DishIcon } from "@/components/icons/dish-icon";

interface DishesEmptyStateProps {
  variant: "no-dishes" | "no-results" | "no-draft" | "no-published" | "no-archived" | "no-search-results";
  onAction?: () => void;
  searchQuery?: string;
  className?: string;
}

const variants: Record<string, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; heading: string; description: string | ((q?: string) => string); action?: string }> = {
  "no-dishes": {
    icon: DishIcon,
    heading: "Add your first dish",
    description: "Create a dish to start building your menu.",
    action: "Create Dish",
  },
  "no-results": {
    icon: FilterIcon,
    heading: "No dishes match your filters",
    description: "Try adjusting your filters to find what you're looking for.",
    action: "Clear Filters",
  },
  "no-draft": {
    icon: DishIcon,
    heading: "No draft dishes",
    description: "All your dishes are published. Nice work!",
  },
  "no-published": {
    icon: DishIcon,
    heading: "No published dishes",
    description: "Publish your draft dishes to make them visible to customers.",
  },
  "no-archived": {
    icon: ArchiveIcon,
    heading: "No archived dishes",
    description: "Archived dishes will appear here. You can restore them anytime.",
  },
  "no-search-results": {
    icon: SearchIcon,
    heading: "No results found",
    description: (q?: string) => q ? `No dishes matching "${q}".` : "Try a different search term.",
    action: "Clear Search",
  },
};

export function DishesEmptyState({ variant, onAction, searchQuery, className }: DishesEmptyStateProps) {
  const c = variants[variant];
  const description = typeof c.description === "function" ? c.description(searchQuery) : c.description;

  return (
    <div className={className}>
      <EmptyState
        heading={c.heading}
        description={description}
        icon={c.icon}
        primaryAction={c.action && onAction ? { label: c.action, onClick: onAction } : undefined}
      />
    </div>
  );
}
