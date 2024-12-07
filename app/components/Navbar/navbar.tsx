"use client"

import Usermenu from './Usermenu'

import React from 'react'
import { SafeUser } from '@/app/types'

import { MainNav } from './main-nav'

interface NavbarProps{
  currentUser? : SafeUser | null;
}
const Navbar: React.FC<NavbarProps> =({
  currentUser
}) => {
  console.log({currentUser})

  return (
    <div className='border-b'>
        <div className=' items-center border-b-[3px]'>

                <div className='flex flex-row items-center justify-end gap-3 md:gap-3'>
               
                    <Usermenu currentUser={currentUser}/>
                </div>
                
               This will be a Store Switcher
                <MainNav/>
            </div> 
         
            
            </div>
  )
}

export default Navbar