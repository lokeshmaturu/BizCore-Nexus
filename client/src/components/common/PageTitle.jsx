import React from 'react';
import { ChevronRight } from 'lucide-react';

export const PageTitle = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : 'hover:text-slate-700'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageTitle;
