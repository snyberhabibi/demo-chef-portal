"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DataTableProps } from "./types";
import { DataTableMobileCard } from "./data-table-mobile-card";

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
  className,
  pageSize = 10,
  mobileCardRender,
}: DataTableProps<T>) {
  const getValue = (row: T, accessorKey?: keyof T) => {
    if (!accessorKey) return null;
    return row[accessorKey];
  };

  // Use pageSize for skeleton rows, or fallback to 10 if not provided
  const skeletonRowCount = pageSize;

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: skeletonRowCount }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <div className="pt-3 border-t flex gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Desktop skeleton */}
        <div className={cn("rounded-md border hidden md:block", className)}>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>
                    {typeof column.header === "string"
                      ? column.header
                      : column.header({ column: {} })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => {
                    // Match the exact structure and dimensions of actual cells
                    // Each column type gets skeleton dimensions matching its content
                    
                    if (column.id === "actions") {
                      // Actions column: Button/dropdown (8x8)
                      return (
                        <TableCell key={column.id}>
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </TableCell>
                      );
                    }
                    
                    if (column.id === "status") {
                      // Status column: Badge (height 5, rounded-full, width ~16)
                      return (
                        <TableCell key={column.id}>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </TableCell>
                      );
                    }
                    
                    if (column.id === "id") {
                      // ID column: Monospace text (consistent width ~24)
                      return (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      );
                    }
                    
                    if (column.id === "total") {
                      // Total column: Currency (consistent width ~16)
                      return (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                      );
                    }
                    
                    if (column.id === "createdAt" || column.id === "date") {
                      // Date column: Date text (width ~20)
                      return (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      );
                    }
                    
                    // Default: Text content (varies but typically 60-70% width, max ~150px)
                    return (
                      <TableCell key={column.id}>
                        <Skeleton className="h-4 w-[60%] max-w-[150px]" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <>
        {/* Mobile empty state */}
        <div className="md:hidden">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {emptyMessage}
            </CardContent>
          </Card>
        </div>
        
        {/* Desktop empty state */}
        <div className="rounded-md border hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>
                    {typeof column.header === "string"
                      ? column.header
                      : column.header({ column: {} })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className={cn("space-y-3 md:hidden", className)}>
        {data.map((row, rowIndex) => {
          if (mobileCardRender) {
            return (
              <div key={rowIndex} onClick={() => onRowClick?.(row)}>
                {mobileCardRender(row)}
              </div>
            );
          }
          return (
            <DataTableMobileCard
              key={rowIndex}
              row={row}
              columns={columns}
              onRowClick={onRowClick}
              getValue={getValue}
            />
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className={cn("rounded-md border hidden md:block", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {typeof column.header === "string"
                    ? column.header
                    : column.header({ column: {} })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => {
                  const value = getValue(row, column.accessorKey);
                  return (
                    <TableCell key={column.id}>
                      {column.cell({ row, value })}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

