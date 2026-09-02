import React from 'react';
import { Compass, Layers, FileCode2, Zap, MailCheck } from 'lucide-react';

interface HeaderProps {
  totalJobs: number;
  filteredCount: number;
  onOpenAtsAuditor?: () => void;
  onOpenResumeBuilder?: () => void;
  onOpenRecruiterValidator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalJobs,
  filteredCount,
  onOpenAtsAuditor,
  onOpenResumeBuilder,
  onOpenRecruiterValidator,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/85 px-4 py-2.5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85 sm:px-6">
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
            Interactive Geo-Spatial Tech Openings & CareerForge Utility Engines
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Mobile quick launcher icons (visible on small screens) */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={onOpenAtsAuditor}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
            title="ATS Auditor"
            aria-label="ATS Auditor"
          >
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={onOpenResumeBuilder}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200/80 bg-emerald-50/70 text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
            title="Resume Builder"
            aria-label="Resume Builder"
          >
            <FileCode2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={onOpenRecruiterValidator}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
            title="Recruiter Radar"
            aria-label="Recruiter Radar"
          >
            <MailCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </button>
        </div>

        {/* Desktop CareerForge Utility Quick Launchers */}
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            onClick={onOpenAtsAuditor}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-blue-50/70 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
            title="100-Point Heuristic ATS Score & Google XYZ Auditor"
          >
            <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>ATS Auditor</span>
          </button>

          <button
            onClick={onOpenResumeBuilder}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            title="Role-Tailored LaTeX & ATS Resume Generator"
          >
            <FileCode2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Resume Builder</span>
          </button>

          <button
            onClick={onOpenRecruiterValidator}
            className="flex items-center gap-1.5 rounded-lg border border-purple-200/80 bg-purple-50/70 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50"
            title="Recruiter Email Deliverability & Anti-Bounce Validator"
          >
            <MailCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Recruiter Radar</span>
          </button>
        </div>

        {/* Job Counter Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 sm:px-3">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          <span className="hidden sm:inline">
            Showing <strong className="text-zinc-900 dark:text-white">{filteredCount}</strong> of {totalJobs} jobs
          </span>
          <span className="sm:hidden">
            <strong className="text-zinc-900 dark:text-white">{filteredCount}</strong> jobs
          </span>
        </div>
      </div>
    </header>
  );
};
