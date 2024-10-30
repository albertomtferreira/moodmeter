// components/LoadingOverlay.tsx
"use client"
import { useAppStore } from '@/store/useAppStore';

export const LoadingOverlay = () => {
  const { isLoading, loadingMessage } = useAppStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-center">{loadingMessage || 'Loading...'}</p>
      </div>
    </div>
  );
};