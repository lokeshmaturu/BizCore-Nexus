import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={cn(
        'shimmer rounded-xl bg-slate-800/60 border border-slate-700/20',
        className
      )}
      {...props}
    />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 rounded-2xl bg-slate-800/40 p-6 flex flex-col justify-center gap-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-4 py-3 border-b border-slate-800/60">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
