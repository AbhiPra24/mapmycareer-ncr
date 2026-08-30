'use client';

import React, { useState, useEffect } from 'react';
import {
  ROLE_TEMPLATES,
  ResumeData,
  generateLatexSource,
  generateMarkdownSource,
  generatePlainText,
} from '../lib/latexTemplates';
import {
  X,
  FileCode2,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileText,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface ResumeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoleKey?: string;
  initialJobContext?: {
    title: string;
    company: string;
    skills: string[];
  } | null;
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({
  isOpen,
  onClose,
  initialRoleKey,
  initialJobContext,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('swe');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeFormat, setActiveFormat] = useState<'preview' | 'latex' | 'markdown' | 'text'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect role template from job title or prop
  useEffect(() => {
    let target = 'swe';
    if (initialRoleKey && ROLE_TEMPLATES[initialRoleKey]) {
      target = initialRoleKey;
    } else if (initialJobContext?.title) {
      const t = initialJobContext.title.toLowerCase();
      if (t.includes('fullstack') || t.includes('full stack') || t.includes('frontend')) {
        target = 'fullstack';
      } else if (t.includes('data') || t.includes('etl') || t.includes('analytics') || t.includes('spark')) {
        target = 'data';
      } else if (t.includes('ai') || t.includes('ml') || t.includes('learning') || t.includes('llm')) {
        target = 'aiml';
      } else if (t.includes('devops') || t.includes('cloud') || t.includes('sre') || t.includes('infrastructure')) {
        target = 'devops';
      } else if (t.includes('qa') || t.includes('sdet') || t.includes('test') || t.includes('automation')) {
        target = 'sdet';
      } else if (t.includes('lead') || t.includes('principal') || t.includes('staff') || t.includes('architect') || t.includes('manager')) {
        target = 'lead';
      }
    }
    setSelectedRole(target);
  }, [initialRoleKey, initialJobContext]);

  // Load template data on role change
  useEffect(() => {
    const tmpl = ROLE_TEMPLATES[selectedRole] || ROLE_TEMPLATES.swe;
    
    // If job context provides skills, enhance core skills category
    let skillsCopy = JSON.parse(JSON.stringify(tmpl.defaultSkills));
    if (initialJobContext?.skills && initialJobContext.skills.length > 0) {
      const topSkills = initialJobContext.skills.slice(0, 6).join(', ');
      skillsCopy[0] = {
        category: 'Target Role Competencies',
        skills: topSkills
      };
    }

    setResumeData({
      name: 'Abhinav Prakash',
      title: tmpl.defaultTitle,
      email: 'abhinav.prakash@example.com',
      location: 'Bengaluru / Gurugram, India',
      linkedin: 'linkedin.com/in/abhinav-prakash',
      summary: tmpl.defaultSummary,
      skills: skillsCopy,
      experience: tmpl.defaultExperience,
      education: tmpl.defaultEducation,
    });
  }, [selectedRole, initialJobContext]);

  if (!isOpen || !resumeData) return null;

  const latexCode = generateLatexSource(resumeData);
  const markdownCode = generateMarkdownSource(resumeData);
  const plainTextCode = generatePlainText(resumeData);

  const getActiveCode = () => {
    switch (activeFormat) {
      case 'latex':
        return latexCode;
      case 'markdown':
        return markdownCode;
      case 'text':
        return plainTextCode;
      default:
        return markdownCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'tex' | 'md' | 'txt') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `Resume_${selectedRole.toUpperCase()}.${format}`;

    if (format === 'tex') {
      content = latexCode;
      mimeType = 'application/x-tex';
    } else if (format === 'md') {
      content = markdownCode;
      mimeType = 'text/markdown';
    } else {
      content = plainTextCode;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Role-Tailored ATS Resume Generator
                </h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300">
                  LATEX & ATS OPTIMIZED
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Single-column ATS templates with Google XYZ quantified bullet points
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Controls: Role Selection & Job Matcher Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/70 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Target Track:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              {Object.values(ROLE_TEMPLATES).map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => handleDownload('tex')}
                className="rounded px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                title="Download LaTeX Source"
              >
                .TEX
              </button>
              <button
                onClick={() => handleDownload('md')}
                className="rounded px-2.5 py-1 text-xs font-bold text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50"
                title="Download Markdown"
              >
                .MD
              </button>
              <button
                onClick={() => handleDownload('txt')}
                className="rounded px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                title="Download Plain Text"
              >
                .TXT
              </button>
            </div>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex border-b border-zinc-200 bg-white px-6 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setActiveFormat('preview')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 transition ${
              activeFormat === 'preview'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Formatted Preview</span>
          </button>
          <button
            onClick={() => setActiveFormat('latex')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 transition ${
              activeFormat === 'latex'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>LaTeX Source (.tex)</span>
          </button>
          <button
            onClick={() => setActiveFormat('markdown')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 transition ${
              activeFormat === 'markdown'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Markdown (.md)</span>
          </button>
          <button
            onClick={() => setActiveFormat('text')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 transition ${
              activeFormat === 'text'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Plain ATS Text (.txt)</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          {activeFormat === 'preview' ? (
            /* Rendered Document Preview */
            <div className="mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Header */}
              <div className="border-b border-zinc-200 pb-4 text-center dark:border-zinc-800">
                <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {resumeData.name}
                </h1>
                <p className="mt-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  {resumeData.title}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {resumeData.location} • {resumeData.email} • {resumeData.linkedin}
                </p>
              </div>

              {/* Summary */}
              <div className="mt-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Professional Summary
                </h2>
                <div className="mt-1 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                <p className="mt-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {resumeData.summary}
                </p>
              </div>

              {/* Skills */}
              <div className="mt-5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Technical Skills
                </h2>
                <div className="mt-1 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="mt-2 flex flex-col gap-1 text-xs">
                  {resumeData.skills.map((s, idx) => (
                    <div key={idx} className="text-zinc-700 dark:text-zinc-300">
                      <strong className="text-zinc-900 dark:text-white">{s.category}:</strong> {s.skills}
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mt-5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Professional Experience
                </h2>
                <div className="mt-1 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="mt-3 flex flex-col gap-4">
                  {resumeData.experience.map((job, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                        <span>{job.role}</span>
                        <span className="text-zinc-500 font-normal">{job.dates}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] italic text-zinc-600 dark:text-zinc-400">
                        <span>{job.company}</span>
                        <span>{job.location}</span>
                      </div>
                      <ul className="mt-1 list-disc pl-4 space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                        {job.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Education & Certifications
                </h2>
                <div className="mt-1 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="mt-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                    <span>{resumeData.education.degree}</span>
                    <span className="text-zinc-500 font-normal">{resumeData.education.dates}</span>
                  </div>
                  <p className="text-[11px] italic text-zinc-600 dark:text-zinc-400">
                    {resumeData.education.school}
                  </p>
                  {resumeData.education.certifications && (
                    <p className="mt-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                      <strong>Certifications:</strong> {resumeData.education.certifications}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Raw Code Display */
            <div className="h-full rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 dark:border-zinc-800 overflow-x-auto">
              <pre>{getActiveCode()}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950/80">
          <span className="text-xs text-zinc-500">
            Export directly to Overleaf, VSCode LaTeX Workshop, or standard text.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
