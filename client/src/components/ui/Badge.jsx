import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROLE_BADGE_STYLES, ROLE_LABELS } from '../../constants/roles';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Badge = ({
  children,
  role,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  let style = 'bg-slate-800 text-slate-300 border-slate-700';

  if (role && ROLE_BADGE_STYLES[role]) {
    style = ROLE_BADGE_STYLES[role];
  } else {
    const variants = {
      default: 'bg-slate-800/80 text-slate-300 border-slate-700',
      success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
    };
    style = variants[variant] || variants.default;
  }

  const content = role ? ROLE_LABELS[role] || role : children;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        sizeStyles[size],
        style,
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {content}
    </span>
  );
};

export default Badge;
