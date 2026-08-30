import React from 'react';
import { Job } from '../types/job';
import { X, Building2, MapPin, Briefcase, IndianRupee, ExternalLink, CheckCircle2, Train } from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
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
          <div className="mt-5">
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

        {/* 🎯 One-Click Resume Tailoring & Skill Gap Checker */}
        <div className="mt-5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-800/30">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              ⚡ Instant Resume Skill Matcher
            </h4>
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Client-Side Privacy</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Paste your resume text or bullet points to instantly highlight matching skills & identify gaps.
          </p>
          <textarea
            placeholder="Paste your resume summary / skills here..."
            rows={2}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            onChange={(e) => {
              const text = e.target.value.toLowerCase();
              const matchedEl = document.getElementById(`matched-skills-${job.id}`);
              const missingEl = document.getElementById(`missing-skills-${job.id}`);
              if (matchedEl && missingEl && job.skills) {
                if (!text.trim()) {
                  matchedEl.innerHTML = '';
                  missingEl.innerHTML = '';
                  return;
                }
                const matched = job.skills.filter((s) => text.includes(s.toLowerCase()));
                const missing = job.skills.filter((s) => !text.includes(s.toLowerCase()));
                matchedEl.innerHTML = matched.length
                  ? `✅ Matched (${matched.length}): ` + matched.map(m => `<span class="inline-block rounded bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 text-emerald-800 dark:text-emerald-300 font-semibold mr-1">${m}</span>`).join('')
                  : '⚠️ No direct skill matches detected in pasted text';
                missingEl.innerHTML = missing.length
                  ? `💡 Recommended to add (${missing.length}): ` + missing.map(m => `<span class="inline-block rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-amber-800 dark:text-amber-300 font-semibold mr-1">${m}</span>`).join('')
                  : '🎉 100% Skill Coverage!';
              }
            }}
          />
          <div id={`matched-skills-${job.id}`} className="mt-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"></div>
          <div id={`missing-skills-${job.id}`} className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"></div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
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
