import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getInitials } from '../../utils/formatters';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
  role,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-slate-900',
    busy: 'bg-rose-500 ring-slate-900',
    away: 'bg-amber-500 ring-slate-900',
    offline: 'bg-slate-500 ring-slate-900',
  };

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className={cn(
            'rounded-xl object-cover ring-1 ring-white/10',
            sizes[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-semibold flex items-center justify-center shadow-inner ring-1 ring-white/10 select-none',
            sizes[size],
            className
          )}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2',
            statusColors[status] || statusColors.online
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
