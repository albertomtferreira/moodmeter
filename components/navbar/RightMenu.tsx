// components/RightMenu.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Loader2 } from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { School } from '@/types';
import { useRouter } from 'next/navigation';
import { AuthModal } from '../AuthModal';
import { useToast } from '@/hooks/use-toast';


const RightMenu: React.FC = () => {
  const { setSelectedSchool } = useSchool();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPendingAuth, setIsPendingAuth] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Effect to handle auth success
  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (isAuthenticated && isPendingAuth) {
        console.log('Auth state changed - fetching schools');
        await fetchSchools();
        setIsOpen(true);
        setIsPendingAuth(false);
        toast({
          title: "Access Granted",
          description: "You can now select a school",
          duration: 3000,
        });
      }
    };

    handleAuthStateChange();
  }, [isAuthenticated, isPendingAuth, toast]);

  const fetchSchools = async () => {
    console.log('Fetching schools...');
    setLoading(true);
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools!');
      }
      const data = await response.json();
      console.log('Schools fetched:', data);
      setSchools(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    console.log('Auth success handler called');
    setIsAuthenticated(true);
    await fetchSchools(); // Fetch schools immediately
    setShowAuthModal(false); // Close modal after fetching schools
    setIsOpen(true); // Open the menu
    toast({
      title: "Access Granted",
      description: "You can now select a school",
      duration: 3000,
      variant: "success",
    });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (open && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsOpen(open);
  };

  const handleSchoolSelect = (school: School) => {
    console.log('School selected:', school);
    setSelectedSchool(school);
    setIsOpen(false);
    setIsAuthenticated(false);
    router.push('/');
    toast({
      title: "School Selected",
      description: `You've selected ${school.name}`,
      duration: 3000,
      style: {
        backgroundColor: school.color,
        color: 'white',
      },
    });
  };
  const closeMenu = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setShowAuthModal(false)
  };

  const SchoolGrid = () => (
    <div className="grid grid-cols-2 gap-4">
      {loading ? (
        <div className="col-span-2 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="col-span-2 text-center text-red-500">
          {error}
        </div>
      ) : schools.length === 0 ? (
        <div className="col-span-2 text-center">
          No schools available
        </div>
      ) : (
        schools.map((school) => (
          <button
            key={school.id}
            className="flex items-center justify-center text-white font-bold w-60 h-60 rounded-full text-xl transition-transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: school.color }}
            onClick={() => handleSchoolSelect(school)}
          >
            {school.name}
          </button>
        ))
      )}
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleMenuClick}
          >
            <Menu />
          </Button>
        </SheetTrigger>
        {isAuthenticated && (
          <SheetContent
            side="right"
            className="w-full sm:max-w-none flex items-center justify-center"
          >
            <SchoolGrid />
          </SheetContent>
        )}
      </Sheet>

      <AuthModal
        isOpen={showAuthModal}
        onSuccess={handleAuthSuccess}
        onCancel={closeMenu}
      />
    </>
  );
};

export default RightMenu;