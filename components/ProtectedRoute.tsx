// components/ProtectedRoute.tsx
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  feature: string;
  action?: 'view' | 'create' | 'update' | 'delete' | 'manage';
}

export function ProtectedRoute({ children, feature, action = 'view' }: ProtectedRouteProps) {
  const { canAccess } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!canAccess(feature, action)) {
      router.push('/unauthorized');
    }
  }, [canAccess, feature, action, router]);

  if (!canAccess(feature, action)) {
    return null;
  }

  return <>{children}</>;
}