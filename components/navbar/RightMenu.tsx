// components/RightMenu.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Loader2 } from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { School } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

const RightMenu: React.FC = () => {
  const { setSelectedSchool } = useSchool();
  const { isAuthenticated, isNavbarVisible } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch schools when menu opens
  useEffect(() => {
    if (isOpen) {
      fetchSchools();
    }
  }, [isOpen]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools!');
      const data = await response.json();
      setSchools(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setIsOpen(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-none flex items-center justify-center"
      >
        <SchoolGrid />
      </SheetContent>
    </Sheet>
  );
};

export default RightMenu;