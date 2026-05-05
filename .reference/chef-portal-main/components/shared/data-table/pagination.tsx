"use client";

import * as React from "react";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PaginationProps } from "./types";

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48, 96],
  showPageSizeSelector = true,
  isLoading = false,
}: PaginationProps) {
  // Calculate display values, handle zero/undefined cases
  const safeTotalItems = totalItems || 0;
  const safeTotalPages = totalPages || 1;
  const startItem = safeTotalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem =
    safeTotalItems > 0 ? Math.min(currentPage * pageSize, safeTotalItems) : 0;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    const safeTotalPages = totalPages || 1;

    if (safeTotalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(safeTotalPages);
      } else if (currentPage >= safeTotalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = safeTotalPages - 3; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(safeTotalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile: Stacked layout */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
          {showPageSizeSelector && onPageSizeChange && (
            <>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Rows per page
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  if (!isLoading) {
                    onPageSizeChange(Number(value));
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-[70px]" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          <span className="text-sm text-muted-foreground">
            {isLoading && safeTotalItems === 0 ? (
              "Loading..."
            ) : safeTotalItems > 0 ? (
              <>
                <span className="hidden sm:inline">
                  Showing {startItem} to {endItem} of {safeTotalItems} results
                </span>
                <span className="sm:hidden">
                  {startItem}-{endItem} of {safeTotalItems}
                </span>
                {isLoading && <span className="ml-1">(loading...)</span>}
              </>
            ) : (
              "No results"
            )}
          </span>
        </div>
      </div>

      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1 && !isLoading) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={cn(
                (currentPage === 1 || isLoading) &&
                  "pointer-events-none opacity-50"
              )}
              aria-disabled={currentPage === 1 || isLoading}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                      onPageChange(page);
                    }
                  }}
                  isActive={currentPage === page}
                  className={cn(isLoading && "pointer-events-none opacity-50")}
                  aria-disabled={isLoading}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < safeTotalPages && !isLoading) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={cn(
                (currentPage === safeTotalPages || isLoading) &&
                  "pointer-events-none opacity-50"
              )}
              aria-disabled={currentPage === safeTotalPages || isLoading}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
}
