import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      wrapperClassName = '',
      id,
      name,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            className={cn(
              'w-full bg-slate-900/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500',
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-slate-900',
              LeftIcon ? 'pl-10' : 'pl-4',
              RightIcon ? 'pr-10' : 'pr-4',
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                : 'border-slate-700/80 hover:border-slate-600 focus:border-brand-500 focus:ring-brand-500/30',
              className
            )}
            {...props}
          />

          {RightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center">
              {RightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
