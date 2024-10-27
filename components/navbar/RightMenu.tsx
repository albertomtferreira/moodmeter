"use client"
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';

const RightMenu: React.FC = () => {
  const { setSelectedSchool } = useSchool();

  const schools = [
    { id: '1', name: 'School A', color: '#FF5733' },
    { id: '2', name: 'School B', color: '#33FF57' },
    { id: '3', name: 'School C', color: '#5733FF' },
    { id: '4', name: 'School D', color: '#FFFF33' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-none flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {schools.map((school) => (
            <button
              key={school.id}
              className="flex items-center justify-center text-white font-bold w-60 h-60 rounded-full text-xl transition-transform hover:scale-105"
              style={{ backgroundColor: school.color }}
              onClick={() => {
                setSelectedSchool(school);
              }}
            >
              {school.name}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RightMenu;