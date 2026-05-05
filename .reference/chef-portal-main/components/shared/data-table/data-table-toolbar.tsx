"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchTestId?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DataTableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  searchTestId,
  children,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4", className)}>
      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3 sm:gap-2 w-full">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 pr-9 w-full"
            {...(searchTestId ? { "data-testid": searchTestId } : {})}
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => onSearchChange?.("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

