'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  onclick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onclick,
  disabled = false,
  outline = false,
  small = false,
  icon: Icon,
}) => {
  return (
    <div className="flex justify-center w-full"> {/* Parent container to center the button */}
      <button
        onClick={onclick}
        disabled={disabled}
        className={`
          relative 
          flex
          items-center
          justify-center
          disabled:opacity-75 
          disabled:cursor-not-allowed 
          rounded-lg 
          hover:opacity-90 
          transition 
          w-[90%]
          cursor-pointer
          ${outline ? 'bg-white' : 'bg-blue-500'}
          ${outline ? 'border-black' : 'border-black'}
          ${outline ? 'text-black' : 'text-white'}
          ${small ? 'py-1 px-3 text-sm font-light border-[1px]' : 'py-3 px-6 text-md font-semibold border-2'}
          md:hover:scale-105 md:active:scale-95
          md:hover:shadow-lg transition-transform duration-300
        `}
      >
        {Icon && (
          <Icon
            size={small ? 18 : 24}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${small ? 'left-3' : 'left-4'}`}
          />
        )}
        {label}
      </button>
    </div>
  );
};

export default Button;
