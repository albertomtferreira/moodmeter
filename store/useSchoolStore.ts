// store/useSchoolStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/types';

interface SchoolState {
  selectedSchool?: School | null;
  setSelectedSchool?: (school: School | null) => void;
  resetSchool?: () => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      selectedSchool: null,
      setSelectedSchool: (school) => set({ selectedSchool: school }),
      resetSchool: () => set({ selectedSchool: null }),
    }),
    {
      name: 'school-storage',
      skipHydration: true,
    }
  ))
