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
  resetState: () => void;
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
          isAuthenticated: !state.isNavbarVisible ? false : state.isAuthenticated
        })),
      setNavbarVisibility: (value) =>
        set({
          isNavbarVisible: value,
          isAuthenticated: value ? false : false
        }),
      logout: () => set({ isAuthenticated: false }),
      resetState: () => set({
        isAuthenticated: false,
        isNavbarVisible: true,
      }),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);