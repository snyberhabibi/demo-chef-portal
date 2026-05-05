# DataTable with TanStack Query Integration Guide

This guide explains how to use DataTable components with TanStack Query for data fetching and management.

## Architecture Overview

The data flow follows this pattern:

```
Component → TanStack Query Hook → Service → HTTP Client → API
```

1. **Component** - Uses TanStack Query hooks
2. **TanStack Query Hook** - Manages data fetching, caching, and mutations
3. **Service** - Makes HTTP calls via http
4. **HTTP Client** - Handles API requests with auth tokens
5. **API** - Backend endpoint

## Step-by-Step Implementation

### 1. Create a Service (`services/orders.service.ts`)

```typescript
import { http, type ApiResponse } from "@/lib/http-client";

export interface Order {
  id: string;
  customerName: string;
  dish: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  total: number;
  createdAt: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class OrdersService {
  private readonly basePath = "/orders";

  async getOrders(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<OrdersResponse>> {
    return http.get<OrdersResponse>(this.basePath, { params });
  }
}

export const ordersService = new OrdersService();
```

### 2. Create TanStack Query Hooks (`hooks/use-orders.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";

// Query hook for fetching data
export function useOrders(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["orders", params], // Include params in key for caching
    queryFn: async () => {
      const response = await ordersService.getOrders(params);
      return response.data;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}

// Mutation hook for updates
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: () => {
      // Invalidate queries to refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
```

### 3. Use in Component (`app/dashboard/orders/page.tsx`)

```typescript
"use client";

import { useState } from "react";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { DataTable, Pagination } from "@/components/shared/data-table";
import type { ColumnDef } from "@/components/shared/data-table";

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data with TanStack Query
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useOrders({
    page: currentPage,
    pageSize,
  });

  // Mutations
  const updateStatusMutation = useUpdateOrderStatus();

  // Define columns
  const columns: ColumnDef<Order>[] = [
    {
      id: "id",
      header: "Order ID",
      accessorKey: "id",
      cell: ({ value }) => <span>{value}</span>,
    },
    // ... more columns
  ];

  // Handle errors
  if (isError) {
    return <Alert>Error: {error.message}</Alert>;
  }

  // Extract data
  const orders = ordersData?.data || [];
  const totalItems = ordersData?.total || 0;
  const totalPages = ordersData?.totalPages || 0;

  return (
    <>
      <DataTable
        data={orders}
        columns={columns}
        isLoading={isLoading} // Shows skeleton while loading
        emptyMessage="No orders found"
      />
      
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

## Key Features

### Automatic Caching
TanStack Query automatically caches responses based on the `queryKey`. Changing `params` creates a new cache entry.

### Loading States
The `isLoading` prop on DataTable shows a skeleton loader automatically.

### Error Handling
Check `isError` and display error messages to users.

### Mutations
After mutations, use `queryClient.invalidateQueries()` to refetch data automatically.

### Server-Side Pagination
The `params` object includes pagination info, which gets sent to the API. The API returns:
- `data`: Array of items for current page
- `total`: Total number of items
- `totalPages`: Total number of pages
- `page`: Current page number
- `pageSize`: Items per page

## Example Files

- **Service**: `services/orders.service.ts`
- **Hooks**: `hooks/use-orders.ts`
- **Component Example**: `app/dashboard/orders/page.tsx`

## Benefits

1. **Automatic Caching** - Data is cached and reused
2. **Background Refetching** - Data stays fresh automatically
3. **Loading States** - Built-in loading indicators
4. **Error Handling** - Structured error management
5. **Optimistic Updates** - Can update UI before server responds
6. **Type Safety** - Full TypeScript support

## Best Practices

1. **Query Keys** - Include all parameters that affect the query in the key
2. **Stale Time** - Set appropriate `staleTime` for your use case
3. **Error Handling** - Always handle errors gracefully
4. **Invalidation** - Invalidate queries after mutations
5. **Loading States** - Use `isLoading` for better UX

