// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoading: false,
      loadingMessage: '',
      error: null,
      setLoading: (loading: boolean, message: string = 'Loading...') =>
        set({ isLoading: loading, loadingMessage: loading ? message : '' }),
      setError: (error) => set({ error }),
      resetState: () => set({ isLoading: false, loadingMessage: '', error: null }),
    }),
    {
      name: 'app-storage',
      skipHydration: true,
    }
  )
);