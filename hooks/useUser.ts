// hooks/useUser.ts
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { UserRole } from "@prisma/client";
import { User } from "@/types";



export function useUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();

  const { data: dbUser, isLoading } = useQuery<User>({
    queryKey: ['user', clerkUser?.id],
    queryFn: async () => {
      if (!clerkUser?.id) return null;
      const response = await fetch(`/api/users/me`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!clerkUser?.id && clerkLoaded,
  });

  return {
    user: dbUser,
    isLoading: isLoading || !clerkLoaded,
    isAdmin: dbUser?.role === 'ADMIN' || dbUser?.role === 'SUPER_ADMIN',
    isSuperAdmin: dbUser?.role === 'SUPER_ADMIN',
  };
}