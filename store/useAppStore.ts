// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoadingType } from '@/components/LoadingOverlay';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  loadingType: LoadingType;
  rows?: number;
}

interface AppState {
  loading: LoadingState;
  error: string | null;
  setLoading: (options: {
    isLoading: boolean;
    message?: string;
    type?: LoadingType;
    rows?: number;
  }) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialLoadingState: LoadingState = {
  isLoading: false,
  loadingMessage: '',
  loadingType: 'overlay',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      loading: initialLoadingState,
      error: null,

      setLoading: ({
        isLoading,
        message = 'Loading...',
        type = 'overlay',
        rows,
      }) =>
        set((state) => ({
          loading: {
            isLoading,
            loadingMessage: isLoading ? message : '',
            loadingType: type,
            rows,
          },
        })),

      setError: (error) =>
        set({ error }),

      resetState: () =>
        set({
          loading: initialLoadingState,
          error: null,
        }),
    }),
    {
      name: 'app-storage',
      skipHydration: true,
      // Only persist error state, not loading states
      partialize: (state) => ({
        error: state.error,
      }),
    }
  )
);

// Helper function to create loading options with proper typing
export const createLoadingState = (
  options: Partial<LoadingState> & { isLoading: boolean }
): Parameters<AppState['setLoading']>[0] => ({
  message: 'Loading...',
  type: 'overlay',
  ...options,
});