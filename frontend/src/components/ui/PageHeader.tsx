import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
};

