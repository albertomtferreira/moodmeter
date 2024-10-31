// components/LeftMenu.tsx
"use client"
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Menu, Home, FileText, Settings, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


const LeftMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const { signOut } = useClerk();

  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
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