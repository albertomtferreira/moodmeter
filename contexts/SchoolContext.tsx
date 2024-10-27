"use client"
import { School } from '@/types';
import React, { createContext, useContext, useState } from 'react';

type SchoolContextType = {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  return (
    <SchoolContext.Provider value={{ selectedSchool, setSelectedSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}