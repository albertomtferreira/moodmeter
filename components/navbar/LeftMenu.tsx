// components/LeftMenu.tsx
"use client"
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Menu, Home, FileText, Settings, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';


const LeftMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  // Get reset functions from stores
  const resetAuth = useAuthStore((state) => state.resetState);
  const resetSchool = useSchoolStore((state) => state.resetSchool);
  const resetApp = useAppStore((state) => state.resetState);

  const closeMenu = () => setIsOpen(false);

  const clearAllState = () => {
    // Clear all Zustand stores
    resetAuth();
    resetSchool();
    resetApp();

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      clearAllState();
      setIsOpen(false);
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        duration: 3000,
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const SignOutButton = () => (
    <Button
      variant="ghost"
      className="justify-start"
      onClick={handleSignOut}
    >
      <LogIn className="mr-2" /> Sign out
    </Button>
  );

  const MenuContent = () => (
    <nav className="flex flex-col space-y-4">
      <Link href="/dashboard" passHref>
        <Button variant="ghost" className="justify-start w-full" onClick={closeMenu}>
          <Home className="mr-2" /> Home
        </Button>
      </Link>
      <Link href="/reports" passHref>
        <Button variant="ghost" className="justify-start w-full" onClick={closeMenu}>
          <FileText className="mr-2" /> Report
        </Button>
      </Link>
      <Link href="/settings" passHref>
        <Button variant="ghost" className="justify-start w-full" onClick={closeMenu}>
          <Settings className="mr-2" /> Settings
        </Button>
      </Link>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <Link href="/sign-in">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={closeMenu}
          >
            <LogIn className="mr-2" /> Login
          </Button>
        </Link>
      </SignedOut>
    </nav>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <MenuContent />
      </SheetContent>
    </Sheet>
  );
};

export default LeftMenu;