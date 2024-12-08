"use client";

import Usermenu from './Usermenu';
import React from 'react';
import { SafeUser } from '@/app/types';
import { MainNav } from './main-nav';
import StoreSwither from '../store-switcher';

interface NavbarProps {
  currentUser?: SafeUser | null;
}


const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  console.log({ currentUser });



  return (
    <div className="border-b bg-white">
      <div className="flex flex-row items-center justify-between px-6 py-4">
       
        <div className="flex items-center gap-4">
          <StoreSwither/>
          <MainNav className=',x-6'/>
        </div>

    
        
          <Usermenu currentUser={currentUser} />
        </div>
      </div>
    
  );
};

export default Navbar;
