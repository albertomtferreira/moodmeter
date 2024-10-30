// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  isNavbarVisible: boolean;
  setAuthenticated: (value: boolean) => void;
  toggleNavbar: () => void;
  setNavbarVisibility: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isNavbarVisible: true,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      toggleNavbar: () =>
        set((state) => ({
          isNavbarVisible: !state.isNavbarVisible,
          // Reset authentication when hiding navbar
          isAuthenticated: !state.isNavbarVisible ? false : state.isAuthenticated
        })),
      setNavbarVisibility: (value) =>
        set({
          isNavbarVisible: value,
          // Reset authentication when hiding navbar
          isAuthenticated: value ? false : false
        }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in local storage
      skipHydration: true, // Important for Next.js
    }
  )
);