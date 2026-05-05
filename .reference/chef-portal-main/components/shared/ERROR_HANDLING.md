# Error Handling System

A comprehensive error handling system that catches and displays errors in a user-friendly way across the application.

## Features

- ✅ **Error Boundary** - Catches React component errors
- ✅ **Error Display Component** - Beautiful, categorized error UI
- ✅ **Error Utilities** - Categorize and handle different error types
- ✅ **React Query Integration** - Automatic error handling for queries
- ✅ **Toast Notifications** - User-friendly error messages
- ✅ **Retry Logic** - Automatic retry for network/server errors

## Components

### ErrorBoundary

Catches React runtime errors and displays a fallback UI.

```tsx
import { ErrorBoundary } from "@/components/shared";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### ErrorDisplay

Displays errors with appropriate icons and actions.

```tsx
import { ErrorDisplay } from "@/components/shared";

// Full error display
<ErrorDisplay
  error={error}
  onRetry={() => refetch()}
  showDetails={true}
/>

// Compact inline error
<ErrorDisplay error={error} compact />
```

## Hooks

### useErrorHandler

Provides convenient error handling utilities.

```tsx
import { useErrorHandler } from "@/hooks/use-error-handler";

function MyComponent() {
  const { handleError, handleAsyncError } = useErrorHandler();

  // Option 1: Handle async operations
  const [result, error] = await handleAsyncError(
    fetch("/api/data").then(r => r.json()),
    { fallbackMessage: "Failed to load data" }
  );

  // Option 2: Handle errors in try/catch
  try {
    await doSomething();
  } catch (error) {
    handleError(error, {
      showToast: true,
      fallbackMessage: "Operation failed"
    });
  }
}
```

## Error Categories

The system automatically categorizes errors:

- **Network** - Connection issues, timeouts
- **API** - HTTP errors (400-499)
- **Authentication** - 401 Unauthorized
- **Authorization** - 403 Forbidden
- **Not Found** - 404
- **Server** - 500+ errors
- **Validation** - Input validation errors
- **Unknown** - Other errors

## Usage Examples

### React Query with ErrorDisplay

```tsx
import { useQuery } from "@tanstack/react-query";
import { ErrorDisplay } from "@/components/shared";

function MyComponent() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["my-data"],
    queryFn: fetchData,
  });

  if (isLoading) return <Loading />;
  
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <div>{/* Your content */}</div>;
}
```

### Mutation with Error Handling

```tsx
import { useMutation } from "@tanstack/react-query";
import { useErrorHandler } from "@/hooks/use-error-handler";

function MyForm() {
  const { handleError } = useErrorHandler();
  const mutation = useMutation({
    mutationFn: submitData,
    onError: (error) => {
      handleError(error, {
        showToast: true,
        fallbackMessage: "Failed to submit"
      });
    },
  });

  return <form onSubmit={mutation.mutate}>...</form>;
}
```

### Custom Error Boundary

```tsx
import { ErrorBoundary } from "@/components/shared";

<ErrorBoundary
  fallback={(error, reset) => (
    <CustomErrorUI error={error} onReset={reset} />
  )}
>
  <YourApp />
</ErrorBoundary>
```

## Integration

The error handling system is already integrated into the app:

1. **ErrorBoundary** wraps the entire app in `app/layout.tsx`
2. **ErrorHandlerProvider** handles React Query errors globally
3. **Toast notifications** are shown for user actions
4. **Authentication errors** automatically redirect to login

## Best Practices

1. **Use ErrorDisplay** for query errors that need full UI
2. **Use toast notifications** for mutation errors (automatic via `useErrorHandler`)
3. **Let ErrorBoundary** catch unexpected React errors
4. **Provide retry actions** for network/server errors
5. **Show error details** only in development mode

## Error Types

All errors are normalized to `AppError` type:

```typescript
interface AppError {
  message: string;
  category: ErrorCategory;
  statusCode?: number;
  originalError?: unknown;
  details?: Record<string, unknown>;
  retryable?: boolean;
}
```

Use `createAppError()` to convert any error to `AppError`:

```tsx
import { createAppError } from "@/lib/errors";

const appError = createAppError(error, "Fallback message");
```

