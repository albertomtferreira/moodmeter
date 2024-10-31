// hooks/usePermissions.ts
import { useUser } from './useUser';
import { Permission, RolePermissions, FeatureAccess } from '@/types/roles';
import { UserRole } from '@prisma/client';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState } from 'react';

interface UsePermissionsReturn {
  canAccess: (feature: string, action?: keyof Permission) => boolean;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  checkMultiplePermissions: (permissions: Array<{ feature: string; action?: keyof Permission }>) => boolean;
  getAvailableFeatures: () => string[];
  hasMinRole: (minRole: UserRole) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const {
    user,
    isLoading: userLoading,
    error: userError,
    hasMinRole,
  } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useAppStore();

  // Use the actual role from the user or default to VIEWER
  const role: UserRole = user?.role ?? UserRole.VIEWER;

  // Handle initial loading state
  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      setLoading(true);
    } else {
      setIsLoading(false);
      setLoading(false);
    }
  }, [userLoading, setLoading]);

  // Handle errors
  useEffect(() => {
    if (userError) {
      setError(userError instanceof Error ? userError.message : 'Failed to load user permissions');
    } else {
      setError(null);
    }
  }, [userError]);

  const canAccess = (feature: string, action: keyof Permission = 'view'): boolean => {
    try {
      // If still loading or there's an error, deny access
      if (isLoading || error || !user) return false;

      const permissions = RolePermissions[role];
      if (!permissions) return false;

      const featurePath = feature.split('.');

      let currentLevel: any = permissions;
      for (const path of featurePath) {
        if (!currentLevel || !currentLevel[path]) return false;
        currentLevel = currentLevel[path];
      }

      // If user is SUPER_ADMIN, grant all permissions
      if (role === UserRole.SUPER_ADMIN) return true;

      return Boolean(currentLevel[action]);
    } catch (err) {
      console.error('Error checking permissions:', err);
      return false;
    }
  };

  const checkMultiplePermissions = (
    permissions: Array<{ feature: string; action?: keyof Permission }>
  ): boolean => {
    return permissions.every(({ feature, action = 'view' }) => canAccess(feature, action));
  };

  const getAvailableFeatures = (): string[] => {
    const features: string[] = [];
    const permissions = RolePermissions[role];

    const traverse = (obj: any, path: string[] = []) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && !('view' in obj[key])) {
          traverse(obj[key], [...path, key]);
        } else if (obj[key].view) {
          features.push([...path, key].join('.'));
        }
      }
    };

    traverse(permissions);
    return features;
  };

  return {
    canAccess,
    role,
    isLoading,
    error,
    checkMultiplePermissions,
    getAvailableFeatures,
    hasMinRole,
  };
}

// Helper hook for protected routes
export const useProtectedRoute = (
  feature: string,
  action?: keyof Permission,
  minRole?: UserRole
) => {
  const { canAccess, isLoading, error, hasMinRole } = usePermissions();
  const hasAccess = canAccess(feature, action);
  const hasRequiredRole = minRole ? hasMinRole(minRole) : true;

  return {
    hasAccess: hasAccess && hasRequiredRole,
    isLoading,
    error,
    isReady: !isLoading && !error,
  };
};