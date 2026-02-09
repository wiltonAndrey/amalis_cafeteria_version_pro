
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cream' | 'caramel' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'cream' }) => {
  const styles = {
    cream: 'bg-beige/90 text-brownie',
    caramel: 'bg-caramel text-white',
    outline: 'border border-caramel text-caramel',
  };

  return (
    <span className={`px-3 py-1 backdrop-blur-sm text-xs font-bold uppercase tracking-widest rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
};
