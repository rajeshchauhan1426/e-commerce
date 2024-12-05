"use client"

import Container from '../Container'
import Usermenu from './Usermenu'



import React from 'react'
import { SafeUser } from '@/app/types'

interface NavbarProps{
  currentUser? : SafeUser | null;
}
const Navbar: React.FC<NavbarProps> =({
  currentUser
}) => {
  console.log({currentUser})

  return (
    <div className=''>
        <div className=''>

            <Container>
                <div className='flex flex-row items-start justify-between gap-3 md:gap-3'>
                   
                    
                    <Usermenu currentUser={currentUser}/>
                </div>
                </Container>
            </div> 
            
            </div>
  )
}

export default Navbar