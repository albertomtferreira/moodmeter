// components/Providers.tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingOverlay } from './LoadingOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useAuthStore } from '@/store/useAuthStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchInterval: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (error: unknown) => {
              useAppStore.getState().setError(
                error instanceof Error ? error.message : 'An error occurred'
              );
            },
          },
        },
      })
  );

  // Hydrate Zustand stores
  useEffect(() => {
    useAppStore.persist.rehydrate();
    useSchoolStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <LoadingOverlay />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}