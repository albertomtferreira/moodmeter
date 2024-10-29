// components/Providers.tsx
"use client"
import { SchoolProvider } from '@/contexts/SchoolContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ErrorBoundary } from './ErrorBoundary';

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
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <SchoolProvider>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          </SchoolProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}