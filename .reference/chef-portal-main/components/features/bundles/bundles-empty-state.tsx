"use client";

import { EmptyState } from "@/components/polaris";
import {
  SearchIcon,
  FilterIcon,
  ArchiveIcon,
  PackageIcon,
} from "@shopify/polaris-icons";

interface BundlesEmptyStateProps {
  variant: "no-bundles" | "no-results" | "no-draft" | "no-published" | "no-archived" | "no-search-results";
  onAction?: () => void;
  searchQuery?: string;
  className?: string;
}

const variants: Record<string, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; heading: string; description: string | ((q?: string) => string); action?: string }> = {
  "no-bundles": {
    icon: PackageIcon,
    heading: "Create your first bundle",
    description: "Combine your dishes into bundles to offer customers curated meal packages at special prices.",
    action: "Create Bundle",
  },
  "no-results": {
    icon: FilterIcon,
    heading: "No bundles match your filters",
    description: "Try adjusting your filters to find what you're looking for.",
    action: "Clear Filters",
  },
  "no-draft": {
    icon: PackageIcon,
    heading: "No draft bundles",
    description: "All your bundles are published. Great job keeping your offerings up to date.",
  },
  "no-published": {
    icon: PackageIcon,
    heading: "No published bundles",
    description: "Publish your draft bundles to make them visible to customers.",
  },
  "no-archived": {
    icon: ArchiveIcon,
    heading: "No archived bundles",
    description: "Archived bundles will appear here. You can restore them anytime.",
  },
  "no-search-results": {
    icon: SearchIcon,
    heading: "No results found",
    description: (q?: string) => q ? `No bundles matching "${q}".` : "Try a different search term.",
    action: "Clear Search",
  },
};

export function BundlesEmptyState({ variant, onAction, searchQuery, className }: BundlesEmptyStateProps) {
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
