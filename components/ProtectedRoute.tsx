// components/ProtectedRoute.tsx
"use client"
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  feature: string;
  action?: 'view' | 'create' | 'update' | 'delete' | 'manage';
  loadingComponent?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  feature,
  action = 'view',
  loadingComponent,
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) {
  const { canAccess, isLoading } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect if:
    // 1. We're not loading
    // 2. User definitely doesn't have access
    // 3. We're not already on the unauthorized page
    if (!isLoading && !canAccess(feature, action) && window.location.pathname !== redirectTo) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      router.push(redirectTo);
    }
  }, [isLoading, canAccess, feature, action, router, redirectTo, toast]);

  // Show loading state while checking permissions
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center p-4 min-h-[100px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // If we have explicit access denial, return null
  // The useEffect above will handle the redirect
  if (!canAccess(feature, action)) {
    return null;
  }

  // User has access, render the protected content
  return <>{children}</>;
}