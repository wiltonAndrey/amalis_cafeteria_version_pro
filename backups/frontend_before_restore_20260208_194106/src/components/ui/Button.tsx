
import React from 'react';
import { COLORS, TRANSITIONS } from '../../theme/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'honey';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = `${TRANSITIONS} rounded-full font-bold active:scale-95 flex items-center justify-center gap-2 cursor-pointer`;

  const variants = {
    primary: `bg-brownie text-cream hover:bg-coffee shadow-md`,
    secondary: `bg-caramel text-brownie hover:bg-brownie hover:text-white shadow-md`,
    outline: `border-2 border-caramel text-cream hover:bg-caramel hover:text-white`,
    ghost: `bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30`,
    honey: `bg-honey text-brownie hover:bg-amber-400 shadow-lg font-bold`,
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
