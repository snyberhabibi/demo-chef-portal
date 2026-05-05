"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OptimizedImage } from "@/components/shared/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export interface FilterPill {
  id: string;
  label: string;
  image?: string | null;
}

export interface FilterPillsProps {
  filters: FilterPill[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  title?: string;
  className?: string;
}

function FilterTab({
  filter,
  isActive,
  onFilterChange,
}: {
  filter: FilterPill;
  isActive: boolean;
  onFilterChange: (filterId: string) => void;
}) {
  return (
    <button
      onClick={() => onFilterChange(filter.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFilterChange(filter.id);
        }
      }}
      className={cn(
        "inline-flex items-center justify-center relative flex-shrink-0",
        "px-4 py-3 h-[44px] text-sm",
        "select-none cursor-pointer",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none",
        isActive
          ? "text-gray-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-red-500"
          : "text-gray-700 font-normal hover:text-gray-900"
      )}
      aria-pressed={isActive}
      aria-label={`${filter.label} filter${isActive ? " (active)" : ""}`}
      type="button"
    >
      {filter.image && (
        <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2">
          <OptimizedImage
            src={filter.image}
            alt={filter.label}
            width={20}
            height={20}
            className="w-full h-full object-contain"
            sizes="20px"
            showSkeleton={false}
            fallbackComponent={
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-[8px] text-muted-foreground">
                  {filter.label.charAt(0).toUpperCase()}
                </span>
              </div>
            }
          />
        </div>
      )}
      <span className="truncate whitespace-nowrap">{filter.label}</span>
    </button>
  );
}

export function FilterPills({
  filters,
  selectedFilters,
  onFilterChange,
  title,
  className,
}: FilterPillsProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Get active filter count (excluding "all")
  const activeCount = selectedFilters.filter((id) => id !== "all").length;
  const hasActiveFilters = activeCount > 0;

  return (
    <div className={cn(className)}>
      {isMobile ? (
        <>
          {/* Mobile: Collapsible button */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{title}</span>
              {hasActiveFilters && (
                <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {activeCount}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile: Expanded filters */}
          {isExpanded && (
            <div
              className="relative h-[44px] border-b border-black/20 mt-2"
              role="group"
              aria-label={title}
            >
              <div className="flex items-end gap-0 overflow-x-auto scrollbar-hide touch-pan-x overscroll-x-none">
                {filters.map((filter) => (
                  <FilterTab
                    key={filter.id}
                    filter={filter}
                    isActive={selectedFilters.includes(filter.id)}
                    onFilterChange={onFilterChange}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Desktop: Always visible */}
          {title && (
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </h3>
          )}
          <div
            className="relative h-[44px] border-b border-black/20"
            role="group"
            aria-label={title}
          >
            <div className="flex items-end gap-0 overflow-x-auto scrollbar-hide touch-pan-x overscroll-x-none">
              {filters.map((filter) => (
                <FilterTab
                  key={filter.id}
                  filter={filter}
                  isActive={selectedFilters.includes(filter.id)}
                  onFilterChange={onFilterChange}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
