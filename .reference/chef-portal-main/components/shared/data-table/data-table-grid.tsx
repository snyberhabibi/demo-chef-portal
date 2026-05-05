"use client";

import * as React from "react";
import { OptimizedImage } from "@/components/shared/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DataTableAction } from "./data-table-actions";

export interface DataTableGridProps<T> {
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: T) => void;
  renderCard: (item: T) => {
    title: string;
    description?: string;
    image?: string;
    badge?: React.ReactNode;
    footer?: React.ReactNode;
    actions?: DataTableAction<T>[];
  };
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  showQuickActions?: boolean; // Show quick action buttons instead of dropdown
  maxQuickActions?: number; // Max number of quick actions to show (default: 2)
}

export function DataTableGrid<T extends Record<string, unknown>>({
  data,
  isLoading = false,
  emptyMessage = "No items available",
  onItemClick,
  renderCard,
  className,
  columns = 4,
  showQuickActions = true,
  maxQuickActions = 2,
}: DataTableGridProps<T>) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4", gridCols[columns], className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-md border p-12 text-center", className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {data.map((item, index) => {
        const cardContent = renderCard(item);
        const { actions } = cardContent;

        return (
          <Card
            key={index}
            className={cn(
              "flex flex-col transition-colors",
              onItemClick && "cursor-pointer hover:bg-muted/50"
            )}
            onClick={() => onItemClick?.(item)}
          >
            {cardContent.image ? (
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <OptimizedImage
                  src={cardContent.image}
                  alt={cardContent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  showSkeleton={true}
                />
                {cardContent.badge && (
                  <div className="absolute top-2 right-2 z-20">
                    {cardContent.badge}
                  </div>
                )}
              </div>
            ) : cardContent.badge ? (
              <CardHeader className="pb-2">
                <div className="flex justify-end">{cardContent.badge}</div>
              </CardHeader>
            ) : null}
            <CardContent className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{cardContent.title}</h3>
              {cardContent.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cardContent.description}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-4 gap-2">
              {cardContent.footer}
              {actions && actions.length > 0 && (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {showQuickActions ? (
                    // Quick action buttons (first 2 by default)
                    actions
                      .slice(0, maxQuickActions)
                      .filter((action) => !action.disabled?.(item))
                      .map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={idx}
                            variant={action.variant === "destructive" ? "destructive" : "outline"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(item);
                            }}
                            title={action.label}
                          >
                            {Icon ? <Icon className="h-4 w-4" /> : action.label[0]}
                          </Button>
                        );
                      })
                  ) : null}
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

