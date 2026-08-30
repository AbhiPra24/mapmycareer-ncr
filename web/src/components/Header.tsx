import React from 'react';
import { MapPin, Compass, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  totalJobs: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({ totalJobs, filteredCount }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white sm:text-lg">
              MapMyCareer <span className="text-blue-600 dark:text-blue-400">India</span>
            </h1>
            <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 sm:inline-block">
              Radar v2.0
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Interactive Geo-Spatial Discovery of Verified Live Tech Openings Across India
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          <span>Showing <strong className="text-zinc-900 dark:text-white">{filteredCount}</strong> of {totalJobs} jobs</span>
        </div>
      </div>
    </header>
  );
};
