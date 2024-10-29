// hooks/usePermissions.ts
import { useUser } from './useUser';
import { Permission, RolePermissions, UserRole } from '@/types/roles';

export function usePermissions() {
  const { user } = useUser();
  const role = user?.role || UserRole.VIEWER;

  const canAccess = (feature: string, action: keyof Permission = 'view'): boolean => {
    const permissions = RolePermissions[role];
    const featurePath = feature.split('.');

    let currentLevel: any = permissions;
    for (const path of featurePath) {
      if (!currentLevel[path]) return false;
      currentLevel = currentLevel[path];
    }

    return !!currentLevel[action];
  };

  return { canAccess, role };
}