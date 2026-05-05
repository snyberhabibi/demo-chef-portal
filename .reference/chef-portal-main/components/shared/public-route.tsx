'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { LoadingScreen } from '@/components/shared';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component
 * 
 * Wraps public routes (like auth pages) that should not be accessible
 * when the user is already authenticated.
 * - Shows loading spinner while checking authentication
 * - Redirects to dashboard if user is already authenticated
 * - Renders children if user is not authenticated
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Don't render children if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

