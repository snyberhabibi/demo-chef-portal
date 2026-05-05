# Data Table Components

A set of reusable components for building data tables with pagination and actions.

## Components

### `DataTable`
A flexible table component that displays data with customizable columns.

### `Pagination`
A pagination component with page size selector and page navigation.

### `DataTableActions`
Action buttons/menu for table rows (edit, delete, view, etc.).

## Usage

### Basic DataTable

```tsx
import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@/components/shared/data-table";

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    cell: ({ value }) => <span>{value}</span>,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    cell: ({ value }) => <span>{value}</span>,
  },
];

export function MyTable() {
  const data: User[] = [
    { id: "1", name: "John", email: "john@example.com" },
    { id: "2", name: "Jane", email: "jane@example.com" },
  ];

  return <DataTable data={data} columns={columns} />;
}
```

### With Pagination

```tsx
import { useState } from "react";
import { DataTable, Pagination } from "@/components/data-table";

export function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const allData = [...]; // Your data
  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = allData.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <DataTable data={paginatedData} columns={columns} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
```

### With Actions

```tsx
import { DataTableActions } from "@/components/data-table";
import type { DataTableAction } from "@/components/data-table";

const getRowActions = (row: User): DataTableAction<User>[] => [
  {
    label: "Edit",
    onClick: (row) => {
      console.log("Edit", row);
    },
  },
  {
    label: "Delete",
    variant: "destructive",
    onClick: (row) => {
      console.log("Delete", row);
    },
  },
];

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableActions row={row} actions={getRowActions(row)} />
    ),
  },
];
```

### Action Variants

Actions can be displayed as:
- **Dropdown** (default): Actions in a dropdown menu
- **Inline**: Actions as separate buttons

```tsx
// Dropdown (default)
<DataTableActions row={row} actions={actions} />

// Inline buttons
<DataTableActions row={row} actions={actions} variant="inline" />
```

## Column Definition

```tsx
interface ColumnDef<T> {
  id: string;                    // Unique identifier
  header: string | Function;      // Header text or component
  cell: (props: { row: T; value: any }) => ReactNode; // Cell renderer
  accessorKey?: keyof T;          // Data key (optional)
  enableSorting?: boolean;        // Enable sorting (future)
  enableHiding?: boolean;        // Enable hiding (future)
}
```

## Props

### DataTable Props
- `data`: Array of data items
- `columns`: Column definitions
- `isLoading?: boolean`: Show loading skeleton
- `emptyMessage?: string`: Message when no data
- `onRowClick?: (row: T) => void`: Callback on row click
- `className?: string`: Additional CSS classes

### Pagination Props
- `currentPage`: Current page number (1-indexed)
- `totalPages`: Total number of pages
- `pageSize`: Items per page
- `totalItems`: Total number of items
- `onPageChange`: Callback when page changes
- `onPageSizeChange?:`: Callback when page size changes
- `pageSizeOptions?: number[]`: Available page sizes (default: [10, 20, 50, 100])
- `showPageSizeSelector?: boolean`: Show page size selector (default: true)

### DataTableActions Props
- `row`: The data row
- `actions`: Array of action definitions
- `variant?: "dropdown" | "inline"`: Display variant
- `className?: string`: Additional CSS classes

## Examples

See `app/dashboard/orders/page.tsx` for a complete working example with TanStack Query integration.

