"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "./types";

interface MobileCardProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  getValue: (row: T, accessorKey?: keyof T) => unknown;
}

export function DataTableMobileCard<T extends Record<string, unknown>>({
  row,
  columns,
  onRowClick,
  getValue,
}: MobileCardProps<T>) {
  // Check if last column is actions
  const lastColumn = columns[columns.length - 1];
  const hasActionsColumn = lastColumn?.id === "actions";
  
  // Primary columns (usually first 2-3 columns)
  const primaryColumns = hasActionsColumn 
    ? columns.slice(0, Math.min(3, columns.length - 1))
    : columns.slice(0, 3);
  
  // Secondary columns (rest, except actions)
  const secondaryColumns = hasActionsColumn
    ? columns.slice(3, -1)
    : columns.slice(3);
  
  // Actions column (last if exists and is actions)
  const actionsColumn = hasActionsColumn ? lastColumn : null;

  const handleClick = () => {
    onRowClick?.(row);
  };

  return (
    <Card
      className={cn(
        "transition-colors",
        onRowClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Primary info row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            {primaryColumns.map((column) => {
              const value = getValue(row, column.accessorKey);
              return (
                <div key={column.id} className="mb-2 last:mb-0">
                  <div className="text-xs text-muted-foreground mb-1">
                    {typeof column.header === "string"
                      ? column.header
                      : column.header({ column: {} })}
                  </div>
                  <div className="text-sm font-medium">
                    {column.cell({ row, value })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Actions on top right */}
          {actionsColumn && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {actionsColumn.cell({ row, value: null })}
            </div>
          )}
        </div>

        {/* Secondary info row (if exists) */}
        {secondaryColumns.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t">
            {secondaryColumns.map((column) => {
              const value = getValue(row, column.accessorKey);
              return (
                <div key={column.id} className="flex-1 min-w-[120px]">
                  <div className="text-xs text-muted-foreground mb-1">
                    {typeof column.header === "string"
                      ? column.header
                      : column.header({ column: {} })}
                  </div>
                  <div className="text-sm">
                    {column.cell({ row, value })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

