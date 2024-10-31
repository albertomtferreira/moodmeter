// hooks/usePreferredSchool.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useAppStore } from '@/store/useAppStore';
import { useUser } from '@clerk/nextjs';
import { School } from '@/types';

interface UserSchool {
  school: School;
  isPreferred: boolean;
}

export function usePreferredSchool() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const { selectedSchool, setSelectedSchool } = useSchoolStore();
  const { setLoading } = useAppStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Sync Clerk authentication state with our store
  useEffect(() => {
    if (clerkLoaded) {
      setAuthenticated(!!user);
    }
  }, [clerkLoaded, user, setAuthenticated]);

  // Load preferred school
  useEffect(() => {
    const loadPreferredSchool = async () => {
      // Only proceed if:
      // 1. Clerk has loaded
      // 2. We have a user
      // 3. We haven't already loaded the school
      // 4. No school is currently selected
      if (clerkLoaded && user && !hasAttemptedLoad && !selectedSchool) {
        console.log('Attempting to load preferred school');
        setLoading(true, 'Loading your school...');

        try {
          const response = await fetch('/api/users/schools', {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch schools');
          }

          const schools = await response.json();
          console.log('Fetched schools:', schools);

          const preferredSchool = schools.find((s: UserSchool) => s.isPreferred);
          console.log('Preferred school:', preferredSchool);

          if (preferredSchool) {
            setSelectedSchool(preferredSchool.school);
          }
        } catch (error) {
          console.error('Error loading preferred school:', error);
        } finally {
          setLoading(false);
          setIsInitialLoad(false);
          setHasAttemptedLoad(true);
        }
      }
    };

    loadPreferredSchool();
  }, [
    clerkLoaded,
    user,
    selectedSchool,
    setLoading,
    setSelectedSchool,
    hasAttemptedLoad
  ]);

  // Reset hasAttemptedLoad when user changes
  useEffect(() => {
    if (!user) {
      setHasAttemptedLoad(false);
    }
  }, [user]);

  return {
    isInitialLoad,
    hasAttemptedLoad,
    isLoading: !clerkLoaded || (clerkLoaded && user && !hasAttemptedLoad)
  };
}