import React from 'react';
import { Job } from '../types/job';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  ExternalLink,
  CheckCircle2,
  Zap,
  FileCode2,
  MailCheck,
} from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onAuditResume?: (job: Job) => void;
  onGenerateResume?: (job: Job) => void;
  onVerifyRecruiter?: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onAuditResume,
  onGenerateResume,
  onVerifyRecruiter,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company}
              className="h-14 w-14 rounded-xl border border-zinc-100 object-contain p-1 dark:border-zinc-800 dark:bg-zinc-800"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <Building2 className="h-7 w-7" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{job.title}</h2>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{job.company}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span>{job.hub || job.city}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <IndianRupee className="h-4 w-4 text-emerald-500" />
            <span>{job.salary_range || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <Briefcase className="h-4 w-4 text-blue-500" />
            <span>{job.workplace_model} · {job.job_type || 'Full-time'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
            <span>{job.experience_yoe || job.experience_level}</span>
          </div>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Required Skills</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🚀 CareerForge Deterministic Action Utilities Grid */}
        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/30">
          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            ⚡ Career Acceleration Utilities
          </h4>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            Tailor your application and verify recruiter outreach with deterministic engines:
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              onClick={() => onAuditResume?.(job)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white p-2 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:border-blue-900/60 dark:bg-zinc-800 dark:text-blue-300 dark:hover:bg-zinc-700"
            >
              <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Audit Resume</span>
            </button>

            <button
              onClick={() => onGenerateResume?.(job)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white p-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-zinc-800 dark:text-emerald-300 dark:hover:bg-zinc-700"
            >
              <FileCode2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Generate ATS Resume</span>
            </button>

            <button
              onClick={() => onVerifyRecruiter?.(job)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-white p-2 text-xs font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50 dark:border-purple-900/60 dark:bg-zinc-800 dark:text-purple-300 dark:hover:bg-zinc-700"
            >
              <MailCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Verify Recruiter</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Close
          </button>
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
            >
              <span>Apply Directly</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
