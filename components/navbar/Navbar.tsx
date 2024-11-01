// components/Navbar.tsx
"use client"
import React from 'react';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const Navbar = () => {
  const { isNavbarVisible } = useAuthStore();

  if (!isNavbarVisible) {
    return null;
  }

  return (
    <div className='flex flex-row justify-between items-center'>
      <LeftMenu />
      <div className='top-4 mx-auto'>
        <Link href="/">
          <img src="/assets/images/LogoHorizontal.svg" alt="Logo" className="h-20" />
        </Link>
      </div>
      <RightMenu />
    </div>
  );
};

export default Navbar;