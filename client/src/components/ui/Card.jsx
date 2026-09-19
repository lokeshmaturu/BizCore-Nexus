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
    glass: 'glass-panel rounded-2xl shadow-xl',
    solid: 'bg-slate-900 border border-slate-800 rounded-2xl shadow-lg',
    subtle: 'bg-slate-800/40 border border-slate-800/80 rounded-2xl',
  };

  return (
    <div
      className={cn(
        variants[variant],
        hoverEffect && 'transition-all duration-300 hover:border-slate-600 hover:-translate-y-0.5',
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-slate-950/40 border-t border-slate-800/80 text-xs text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
