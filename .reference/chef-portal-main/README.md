# Chef Portal

A chef portal (admin-like) application built with Next.js, Shadcn UI, and TanStack Query.

## Features

✅ **Shadcn UI** - Complete UI component library  
✅ **TanStack Query** - Data fetching and caching  
✅ **HTTP Service** - Custom fetch API wrapper  
✅ **Protected Routes** - Route protection with authentication  
✅ **Auth Pages** - Login, Signup, Forgot Password, Reset Password  
✅ **Services Pattern** - Organized service layer for API calls  

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STORE_FRONT_URL=http://localhost:3001
```

- `NEXT_PUBLIC_API_URL`: The HTTP client will use this URL as the base URL for all API requests. If not set, it defaults to `/api`.
- `NEXT_PUBLIC_STORE_FRONT_URL`: The base URL for the store-front application. Used for previewing chef profiles. Example: `http://localhost:3001` or `https://store.yourdomain.com`

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
pnpm build
```

## Project Structure

```
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/               # Protected dashboard pages
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page (redirects)
├── components/
│   ├── protected-route.tsx     # Protected route wrapper
│   └── ui/                      # Shadcn UI components
├── contexts/
│   └── auth-context.tsx         # Authentication context
├── hooks/                        # Custom React hooks
├── lib/
│   ├── http-client.ts           # HTTP service wrapper
│   └── providers/
│       └── query-provider.tsx   # TanStack Query provider
└── services/
    └── auth.service.ts           # Authentication service
```

## Authentication Flow

1. **Login/Signup** - Users authenticate via `/auth/login` or `/auth/signup`
2. **Auth Cookies** - Authentication uses HttpOnly cookies; the client includes cookies via `credentials: 'include'` and no tokens are stored in `localStorage`
3. **Protected Routes** - Dashboard routes are protected via `ProtectedRoute` component
4. **Auto Redirect** - Unauthenticated users are redirected to login

## Creating New Services

Follow this pattern:

1. Create a service class with methods using `http`
2. Export the service instance
3. Create TanStack Query hooks for data fetching
4. Use hooks in components

## Protected Routes

Wrap any protected page with the `ProtectedRoute` component. You can either wrap individual pages or use the layout approach (recommended) to protect all dashboard routes at once.

## HTTP Client Features

- Cookie-based authentication (credentials: 'include')
- Request timeout handling
- Error handling with typed responses
- Query parameter support
- TypeScript types throughout

## Next Steps

1. Set up your backend API endpoints
2. Update service methods to match your API
3. Add more services as needed (orders, dishes, etc.)
4. Customize the dashboard layout
5. Add more pages and sections
