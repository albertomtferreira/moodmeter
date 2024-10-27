"use client"
import { SchoolProvider } from '@/contexts/SchoolContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SchoolProvider>{children}</SchoolProvider>;
}