"use client"
"use client"
import React from 'react'
import Image from 'next/image';

function Logo() {
  return (
   <Image
   alt='logo'
   className='hidden md:block cursor-pointer  border-solid border-2 border-black rounded-full'
   height={50}
   width={50}
   src="/images/logo1.png"
   />
  )
}

export default Logo