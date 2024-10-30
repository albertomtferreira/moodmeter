// types/roles.ts
import { UserRole } from '@prisma/client';

export interface Permission {
  view: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  manage?: boolean;
}

export interface FeatureAccess {
  homepage: Permission;
  reports: Permission;
  settings: {
    defaultSchool: Permission;
    userManagement: Permission;
    updatePin: Permission;
    deleteMoods?: Permission;
    dbConsole?: Permission;
  };
}

export const RolePermissions: Record<UserRole, FeatureAccess> = {
  VIEWER: {
    homepage: { view: true },
    reports: { view: true },
    settings: {
      defaultSchool: { view: true, update: true },
      userManagement: { view: true },
      updatePin: { view: true, update: true },
    }
  },
  ADMIN: {
    homepage: { view: true },
    reports: { view: true, create: true },
    settings: {
      defaultSchool: { view: true, update: true },
      userManagement: { view: true, update: true },
      updatePin: { view: true, update: true },
      deleteMoods: { view: true, delete: true }
    }
  },
  SUPER_ADMIN: {
    homepage: { view: true, manage: true },
    reports: { view: true, create: true, manage: true },
    settings: {
      defaultSchool: { view: true, update: true, manage: true },
      userManagement: { view: true, update: true, manage: true },
      updatePin: { view: true, update: true },
      deleteMoods: { view: true, delete: true },
      dbConsole: { view: true, manage: true }
    }
  }
};