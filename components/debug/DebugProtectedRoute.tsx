// components/DebugProtectedRoute.tsx
"use client"
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@prisma/client';

interface DebugProtectedRouteProps {
  feature: string;
  action?: 'view' | 'create' | 'update' | 'delete' | 'manage';
}

export function DebugProtectedRoute({ feature, action = 'view' }: DebugProtectedRouteProps) {
  const { role, isLoading, canAccess } = usePermissions();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/80 text-white rounded-lg text-xs z-50">
      <div>Feature: {feature}</div>
      <div>Action: {action}</div>
      <div>Role: {role}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Has Access: {canAccess(feature, action) ? 'Yes' : 'No'}</div>
    </div>
  );
}