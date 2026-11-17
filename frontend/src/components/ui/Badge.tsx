import React from 'react';

export type BadgeColor =
  | 'zinc'
  | 'rose'
  | 'orange'
  | 'yellow'
  | 'emerald'
  | 'blue'
  | 'purple'
  | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200/80 dark:border-orange-500/20',
  yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/20',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/20',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-500/20',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'zinc',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};

