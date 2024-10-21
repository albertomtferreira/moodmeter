"use client"
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react';


const RightMenu: React.FC = () => {
  const schools = [
    { name: 'School A', color: '#FF5733' },
    { name: 'School B', color: '#33FF57' },
    { name: 'School C', color: '#5733FF' },
    { name: 'School D', color: '#FFFF33' },
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
          {schools.map((school, index) => (
            <button
              key={index}
              className="flex items-center justify-center text-white font-bold w-60 h-60 rounded-full text-xl transition-transform hover:scale-105"
              style={{ backgroundColor: school.color }}
            >
              {school.name}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
  ;
};

export default RightMenu;