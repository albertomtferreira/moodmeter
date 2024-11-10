// app/(app)/layout.tsx
import { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import "./tablet_orientation.css";

// Loading component for the main content
function MainLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoadingOverlay />
    </div>
  );
}

// Loading component for the navbar
function NavbarLoadingFallback() {
  return (
    <div className="h-20 bg-background border-b animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="w-10 h-10 bg-gray-200 rounded" />
        <div className="w-32 h-10 bg-gray-200 rounded" />
        <div className="w-10 h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Suspense fallback={<NavbarLoadingFallback />}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        <Suspense fallback={<MainLoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}