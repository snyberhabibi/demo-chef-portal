'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount: number, error: Error) => {
              // Don't retry auth errors — http-client handles 401 refresh+retry
              if (error instanceof Error && "status" in error && (error as Error & { status: number }).status === 401) {
                return false;
              }
              return failureCount < 1;
            },
          },
          mutations: {
            retry: 0, // Disable retry by default - prevent duplicate requests
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

