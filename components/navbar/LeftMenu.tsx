"use client"
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Menu, Home, FileText, Settings, LogIn, LogOut } from 'lucide-react';

const LeftMenu: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

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
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setIsLoggedIn(!isLoggedIn);
              closeMenu();
            }}
          >
            {isLoggedIn ? <><LogOut className="mr-2" /> Logout</> : <><LogIn className="mr-2" /> Login</>}
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default LeftMenu;