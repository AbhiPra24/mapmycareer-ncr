import React from 'react';
import { FilterState } from '../types/job';
import { Search, MapPin, Briefcase, SlidersHorizontal, IndianRupee, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  cities: string[];
  hubs: string[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  cities,
  hubs,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = React.useState(filters.searchQuery);

  React.useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        onFilterChange({ ...filters, searchQuery: localSearch });
      }
    }, 150);
    return () => clearTimeout(handler);
  }, [localSearch, filters, onFilterChange]);

  const experienceOptions = ['Entry', 'Mid', 'Senior', 'Lead'];
  const workplaceOptions = ['Remote', 'Hybrid', 'On-site'];

  const toggleExperience = (exp: string) => {
    const exists = filters.experienceLevels.includes(exp);
    const updated = exists
      ? filters.experienceLevels.filter((e) => e !== exp)
      : [...filters.experienceLevels, exp];
    onFilterChange({ ...filters, experienceLevels: updated });
  };

  const toggleWorkplace = (wp: string) => {
    const exists = filters.workplaceModels.includes(wp);
    const updated = exists
      ? filters.workplaceModels.filter((w) => w !== wp)
      : [...filters.workplaceModels, wp];
    onFilterChange({ ...filters, workplaceModels: updated });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* Top Search & Dropdown Row */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-12">
        {/* Search input */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search role, skills (e.g. React, Python), or company..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-blue-400"
          />
        </div>

        {/* City Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.selectedCity}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedCity: e.target.value,
                selectedHub: 'All Hubs', // reset hub when city changes
              })
            }
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 px-3 text-xs font-medium text-zinc-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="All Cities">All Indian Cities</option>
            {cities.map((city) => (
              <option key={city} value={city} className="dark:bg-zinc-800 dark:text-zinc-100">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Hub Filter */}
        <div className="md:col-span-3">
          <select
            value={filters.selectedHub}
            onChange={(e) => onFilterChange({ ...filters, selectedHub: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 px-3 text-xs font-medium text-zinc-900 outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="All Hubs">All Tech Hubs / Zones</option>
            {hubs.map((hub) => (
              <option key={hub} value={hub} className="dark:bg-zinc-800 dark:text-zinc-100">
                {hub}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        <div className="flex items-center md:col-span-2">
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 py-2 px-3 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Badges & Sliders Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
        {/* Experience Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Experience:
          </span>
          {experienceOptions.map((exp) => {
            const active = filters.experienceLevels.includes(exp);
            return (
              <button
                key={exp}
                onClick={() => toggleExperience(exp)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {exp}
              </button>
            );
          })}
        </div>

        {/* Workplace Model Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Mode:
          </span>
          {workplaceOptions.map((wp) => {
            const active = filters.workplaceModels.includes(wp);
            return (
              <button
                key={wp}
                onClick={() => toggleWorkplace(wp)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {wp}
              </button>
            );
          })}
        </div>

        {/* Saved Jobs Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFilterChange({ ...filters, showSavedOnly: !filters.showSavedOnly })}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              filters.showSavedOnly
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="hidden sm:inline">Saved Jobs</span>
            <span className="sm:hidden">Saved</span>
          </button>
        </div>

        {/* Min Salary Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Min Salary:
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
            <span>{filters.minSalaryLPA > 0 ? `${filters.minSalaryLPA} LPA+` : 'Any'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={filters.minSalaryLPA}
            onChange={(e) => onFilterChange({ ...filters, minSalaryLPA: parseInt(e.target.value, 10) })}
            className="h-1.5 w-24 cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
