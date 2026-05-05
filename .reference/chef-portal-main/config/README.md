# Config Folder

This folder contains application-wide configuration files.

## endpoints.ts

Centralized configuration for all API endpoints grouped by service. Endpoints are built dynamically from environment variables.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Base API URL (relative path or full URL)
NEXT_PUBLIC_API_URL=/api
# Or for full URL:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Usage

Import the endpoints config and use it in your services:

```typescript
import { endpoints } from "@/config/endpoints";
import { http } from "@/lib/http-client";

// For simple string endpoints
const dishes = await http.get(endpoints.dishes.base);

// For dynamic endpoints (with IDs)
const dish = await http.get(endpoints.dishes.getById(dishId));
```

### How Endpoints Are Built

Endpoints are automatically built using the pattern: `{API_URL}/v1/{path}` (API version is hardcoded as `v1`)

Examples:
- With `NEXT_PUBLIC_API_URL="/api"`:
  - `endpoints.dishes.base` = `/api/v1/chef-portal/dishes`
  - `endpoints.dishes.getById("123")` = `/api/v1/chef-portal/dishes/123`
- With `NEXT_PUBLIC_API_URL="http://localhost:3000/api"`:
  - `endpoints.dishes.base` = `http://localhost:3000/api/v1/chef-portal/dishes`
  - `endpoints.dishes.getById("123")` = `http://localhost:3000/api/v1/chef-portal/dishes/123`

### Benefits

- **Environment-based**: Configure endpoints via environment variables
- **Centralized**: All endpoints in one place
- **Type-safe**: TypeScript helps catch errors
- **Maintainable**: Easy to update endpoints across the app
- **Consistent**: Ensures consistent endpoint naming
- **Dynamic**: Supports parameterized endpoints (e.g., with IDs)

