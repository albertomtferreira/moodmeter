// hooks/useUser.ts
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { UserRole } from "@prisma/client";
import { toast } from "./use-toast";
import { User } from "@/types";


interface UserError {
  message: string;
  statusCode?: number;
}

export function useUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();

  const {
    data: dbUser,
    isLoading,
    error,
    refetch
  } = useQuery<User, Error>({
    queryKey: ['user', clerkUser?.id],
    queryFn: async (): Promise<User> => {
      try {
        if (!clerkUser?.id) {
          throw new Error('No user ID available');
        }

        const response = await fetch('/api/users/me');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const userData = await response.json();
        return userData as User;
      } catch (err) {
        const error = err as Error;
        console.error('User fetch error:', error);

        toast({
          title: "Error fetching user data",
          description: error.message || 'An unexpected error occurred',
          variant: "destructive",
        });

        throw error;
      }
    },
    enabled: !!clerkUser?.id && clerkLoaded,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: dbUser,
    isLoading: isLoading || !clerkLoaded,
    error,
    isAdmin: dbUser?.role === UserRole.ADMIN || dbUser?.role === UserRole.SUPER_ADMIN,
    isSuperAdmin: dbUser?.role === UserRole.SUPER_ADMIN,
    isViewer: dbUser?.role === UserRole.VIEWER,
    refetch,
    // Helper method to check specific roles
    hasRole: (role: UserRole) => dbUser?.role === role,
    // Helper method to check minimum role level
    hasMinRole: (minRole: UserRole) => {
      const roleHierarchy = {
        [UserRole.VIEWER]: 0,
        [UserRole.ADMIN]: 1,
        [UserRole.SUPER_ADMIN]: 2,
      };
      return dbUser ? roleHierarchy[dbUser.role] >= roleHierarchy[minRole] : false;
    }
  };
}