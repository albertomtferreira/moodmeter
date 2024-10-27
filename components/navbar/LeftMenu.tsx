"use client"
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Menu, Home, FileText, Settings, LogIn, LogOut } from 'lucide-react';
import { SignedIn, SignedOut, useClerk, } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const LeftMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const closeMenu = () => {
    setIsOpen(false);
  };

  const SignOutButton = () => {
    const { signOut } = useClerk()

    return (
      // Clicking this button signs out a user
      // and redirects them to the home page "/".
      <Button
        variant="ghost"
        className="justify-start"
        onClick={async () => {
          await signOut();
          closeMenu();
          router.push('/');
        }}
      >
        <LogIn className="mr-2" /> Sign out
      </Button>

    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute left-4 top-4">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
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
          {/* Control if user is signed in */}
          <SignedIn>

            <SignOutButton />

          </SignedIn>

          {/* Control is user is signed out */}
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
      </SheetContent >
    </Sheet >
  );
};

export default LeftMenu;