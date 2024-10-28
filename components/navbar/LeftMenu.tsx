// components/LeftMenu.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Menu, Home, FileText, Settings, LogIn, LogOut } from 'lucide-react';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AuthModal } from '../AuthModal';
import { useToast } from '@/hooks/use-toast';

const LeftMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPendingAuth, setIsPendingAuth] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();
  const { toast } = useToast();

  // Effect to handle pending authentication
  useEffect(() => {
    if (isPendingAuth && isAuthenticated) {
      setIsOpen(true);
      setIsPendingAuth(false);
    }
  }, [isPendingAuth, isAuthenticated]);

  const closeMenu = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = async () => {
    console.log('Auth success handler called');
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setIsOpen(true); // Open the menu
    toast({
      title: "Access Granted",
      description: "You can now select an option",
      duration: 3000,
      variant: "success",
    });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (open && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsOpen(open);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsAuthenticated(false);
    setIsOpen(false);
    router.push('/');
  };

  const SignOutButton = () => {
    return (
      <Button
        variant="ghost"
        className="justify-start"
        onClick={handleSignOut}
      >
        <LogIn className="mr-2" /> Sign out
      </Button>
    );
  };

  const MenuContent = () => (
    <nav className="flex flex-col space-y-4">
      <Link href="/" passHref>
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
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4"
            onClick={handleMenuClick}
          >
            <Menu />
          </Button>
        </SheetTrigger>
        {isAuthenticated && (
          <SheetContent side="left">
            <MenuContent />
          </SheetContent>
        )}
      </Sheet>

      <AuthModal
        isOpen={showAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default LeftMenu;