import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendPositive = true,
  icon
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        {icon && (
          <span className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {icon}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
            {trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            )}
            <span
              className={
                trendPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

