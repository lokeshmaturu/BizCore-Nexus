import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  variant = 'glass',
  header,
  footer,
  ...props
}) => {
  const variants = {
    glass: 'bg-white border border-slate-200 rounded-2xl shadow-sm',
    solid: 'bg-white border border-slate-200 rounded-2xl shadow-md',
    subtle: 'bg-slate-50 border border-slate-200 rounded-2xl',
  };

  return (
    <div
      className={cn(
        variants[variant],
        hoverEffect && 'transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5',
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
