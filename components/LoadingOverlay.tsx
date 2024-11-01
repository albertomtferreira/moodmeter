// components/LoadingOverlay.tsx
"use client"
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  className?: string;
}

export function LoadingOverlay({ className }: LoadingOverlayProps) {
  const { loading } = useAppStore();
  const { isLoading, loadingMessage, loadingType, rows } = loading;

  if (!isLoading) return null;

  const renderLoader = () => {
    switch (loadingType) {
      case 'content':
        return <ContentSkeleton />;
      case 'table':
        return <TableSkeleton rows={rows} />;
      case 'card':
        return <CardSkeleton />;
      case 'spinner':
        return <LoadingSpinner size="lg" />;
      case 'form':
        return <FormFieldSkeleton />;
      case 'settings':
        return <SettingsSkeleton />;
      case 'overlay':
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-center text-sm">{loadingMessage || 'Loading...'}</p>
          </div>
        );
    }
  };

  // Only apply overlay styles for overlay type
  if (loadingType === 'overlay') {
    return (
      <div
        className={cn(
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
          "backdrop-blur-[2px] transition-all duration-200",
          className
        )}
      >
        {renderLoader()}
      </div>
    );
  }

  // For other types, render directly
  return renderLoader();
}

// Content skeleton for larger sections
export function ContentSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-md w-[250px]" />
        <div className="h-4 bg-gray-200 rounded-md w-[400px]" />
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded-lg w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="h-32 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* List items */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-[90%]" />
        <div className="h-4 bg-gray-200 rounded w-[80%]" />
      </div>
    </div>
  );
}

// Card skeleton for card-based layouts
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-[90%]" />
          <div className="h-4 bg-gray-200 rounded w-[80%]" />
        </div>
      </div>
    </div>
  );
}

// Table skeleton for data tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="h-10 bg-gray-200 rounded-md w-full mb-4" />

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 rounded-md w-full"
          />
        ))}
      </div>
    </div>
  );
}

// Small loading spinner for buttons or small areas
export function LoadingSpinner({
  size = "default",
  className
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

// Form field skeleton
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );
}

// Settings section skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-[90%]" />
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export all loading types for TypeScript support
export type LoadingType = 'overlay' | 'content' | 'table' | 'card' | 'spinner' | 'form' | 'settings';

// Export loading component options for type safety
export interface LoadingOptions {
  isLoading: boolean;
  message?: string;
  type?: LoadingType;
  rows?: number;
}

// Helper function to generate loading options
export function createLoadingOptions(
  options: Partial<LoadingOptions> & { isLoading: boolean }
): LoadingOptions {
  return {
    message: 'Loading...',
    type: 'overlay',
    ...options,
  };
}