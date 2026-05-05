# Components Structure

This project uses a **feature-based** component organization structure for better maintainability and scalability.

## Directory Structure

```
components/
├── ui/                    # Shadcn UI components (design system)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
│
├── features/             # Feature-specific components
│   ├── auth/             # Authentication feature components
│   │   ├── auth-logo.tsx
│   │   └── index.ts
│   │
│   ├── dashboard/        # Dashboard feature components
│   │   ├── app-sidebar.tsx
│   │   └── index.ts
│   │
│   └── orders/           # Order-specific components (future)
│       └── ...
│
└── shared/               # Shared/reusable components across features
    ├── data-table/       # Data table components
    │   ├── data-table.tsx
    │   ├── pagination.tsx
    │   ├── data-table-actions.tsx
    │   ├── data-table-toolbar.tsx
    │   └── index.ts
    │
    ├── protected-route.tsx
    └── index.ts
```

## Organization Principles

### 1. **`ui/`** - Design System Components
- Shadcn UI components only
- These are pure UI primitives
- No business logic
- Examples: `Button`, `Card`, `Input`, `Dialog`

### 2. **`features/`** - Feature-Specific Components
- Components tied to a specific feature/domain
- Organized by feature name (auth, dashboard, orders, etc.)
- May include feature-specific logic
- Examples:
  - `features/auth/auth-logo.tsx` - Logo used in auth pages
  - `features/dashboard/app-sidebar.tsx` - Dashboard sidebar navigation

### 3. **`shared/`** - Shared Components
- Reusable across multiple features
- No feature-specific logic
- Examples:
  - `shared/data-table/` - Table components used everywhere
  - `shared/protected-route.tsx` - Route protection wrapper

## Usage Examples

### Importing Feature Components

```typescript
// Auth feature
import { AuthLogo } from "@/components/features/auth/auth-logo";
// or using index
import { AuthLogo } from "@/components/features/auth";

// Dashboard feature
import { AppSidebar } from "@/components/features/dashboard/app-sidebar";
// or using index
import { AppSidebar } from "@/components/features/dashboard";
```

### Importing Shared Components

```typescript
// Data table components
import { DataTable, Pagination } from "@/components/shared/data-table";
import type { ColumnDef } from "@/components/shared/data-table";

// Protected route
import { ProtectedRoute } from "@/components/shared/protected-route";
// or using index
import { ProtectedRoute } from "@/components/shared";
```

### Importing UI Components

```typescript
// UI components (unchanged)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Adding New Features

When adding a new feature (e.g., "dishes"):

1. Create feature folder: `components/features/dishes/`
2. Add feature-specific components
3. Create `index.ts` for clean exports
4. Use shared components when possible

Example:
```
components/features/dishes/
├── dish-form.tsx
├── dish-card.tsx
└── index.ts
```

## Benefits

✅ **Better Organization** - Easy to find feature-specific components  
✅ **Scalability** - Easy to add new features without cluttering  
✅ **Reusability** - Shared components are clearly separated  
✅ **Maintainability** - Each feature is self-contained  
✅ **Team Collaboration** - Multiple developers can work on different features  

## Migration Notes

- All imports have been updated to use the new paths
- Old paths will not work - use the new structure
- Shadcn UI components remain in `components/ui/`

