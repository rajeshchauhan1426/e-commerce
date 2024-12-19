'use client'
import Image from 'next/image'

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image 
      className='rounded-full'
      height={30} // Use a numeric value instead of a string
      width={30}  // Use a numeric value instead of a string
      alt='User Avatar'
      src={src || '/images/user2.png'} // Default to user.png if src is null or undefined
    />
  )
}

export default Avatar;
