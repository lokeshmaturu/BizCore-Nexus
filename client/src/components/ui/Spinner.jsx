import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Spinner = ({
  size = 'md',
  color = 'brand',
  className = '',
  label,
}) => {
  const sizes = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    brand: 'border-brand-500/20 border-t-brand-500',
    white: 'border-white/20 border-t-white',
    slate: 'border-slate-700 border-t-slate-300',
    emerald: 'border-emerald-500/20 border-t-emerald-500',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizes[size],
          colors[color]
        )}
      />
      {label && <p className="text-xs text-slate-400 font-medium">{label}</p>}
    </div>
  );
};

export default Spinner;
