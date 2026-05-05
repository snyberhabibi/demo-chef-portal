import { ReactNode } from "react";

export interface ColumnDef<T> {
  id: string;
  header: string | ((props: { column: Record<string, unknown> }) => ReactNode);
  cell: (props: { row: T; value: unknown }) => ReactNode;
  accessorKey?: keyof T;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  pageSize?: number; // For skeleton row count
  mobileBreakpoint?: "sm" | "md" | "lg"; // Breakpoint for mobile card view
  mobileCardRender?: (row: T) => React.ReactNode; // Custom mobile card renderer
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  isLoading?: boolean; // Show loading state without hiding pagination
}

