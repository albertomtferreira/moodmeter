// components/RightMenu.tsx
"use client"
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Loader2 } from 'lucide-react';
import { School } from '@/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSchoolStore } from '@/store/useSchoolStore';
import { SignedIn, useAuth } from '@clerk/nextjs';
import { ContentSkeleton, LoadingSpinner } from '../LoadingOverlay';

interface UserSchool {
  school: School;
  isPreferred: boolean;
}

const RightMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setSelectedSchool } = useSchoolStore();
  const { isSignedIn, userId } = useAuth();
  const [userSchools, setUserSchools] = React.useState<UserSchool[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const closeMenu = () => setIsOpen(false);

  React.useEffect(() => {
    if (isOpen && isSignedIn) {
      fetchUserSchools();
    }
  }, [isOpen, isSignedIn]);

  const fetchUserSchools = async () => {
    setLoading(true);
    try {
      // Add authentication header
      const response = await fetch('/api/users/schools', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch your schools!');
      }

      const data = await response.json();
      console.log("Fetched schools data:", data);
      setUserSchools(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelect = (userSchool: UserSchool) => {
    setSelectedSchool(userSchool.school);
    closeMenu();
    router.push('/');
    toast({
      title: "School Selected",
      description: `You've selected ${userSchool.school.name}`,
      duration: 3000,
      style: {
        backgroundColor: userSchool.school.color,
        color: 'white',
      },
    });
  };

  const SchoolGrid = () => (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto">
      {loading ? (
        <ContentSkeleton />
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      ) : userSchools.length === 0 ? (
        <div className="text-center py-4">
          No schools available for your account
        </div>
      ) : (
        userSchools.map(({ school, isPreferred }) => (
          <button
            key={school.id}
            className={`
              flex flex-col items-center justify-center
              text-white font-bold w-full h-24
              rounded-lg text-xl transition-transform
              hover:scale-105 hover:shadow-lg relative
              ${isPreferred ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}
            style={{ backgroundColor: school.color }}
            onClick={() => handleSchoolSelect({ school, isPreferred })}
          >
            <span>{school.name}</span>
            {isPreferred && (
              <span className="text-sm font-normal mt-1">
                Preferred School
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-10 top-4 text-white font-bold w-40 rounded-lg text-lg"
        >
          Select School
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SignedIn>
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Select School</h2>
            <SchoolGrid />
          </div>
        </SignedIn>
      </SheetContent>
    </Sheet>
  );
};

export default RightMenu;