'use client';

import React, { useState, useEffect } from 'react';
import {
  ROLE_TEMPLATES,
  ResumeData,
  ResumeProject,
  generateLatexSource,
  generateMarkdownSource,
  generatePlainText,
} from '../lib/latexTemplates';
import { STRONG_ACTION_VERBS, WEAK_PASSIVE_PHRASES, METRIC_REGEX } from '../lib/atsAuditor';
import {
  X,
  FileCode2,
  Copy,
  Check,
  Eye,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  FileEdit,
  Layers,
  ChevronDown,
  ChevronUp,
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

const STORAGE_KEY = 'mapmycareer_resume_draft';

// Helper to evaluate a single bullet point in real-time
function getBulletStatus(bullet: string): {
  type: 'strong' | 'needs_numbers' | 'weak';
  label: string;
} {
  const clean = bullet.trim();
  if (!clean) {
    return { type: 'needs_numbers', label: 'Empty Bullet' };
  }

  const lower = clean.toLowerCase();
  const hasPassive = WEAK_PASSIVE_PHRASES.some((p) => lower.includes(p));
  if (hasPassive) {
    return { type: 'weak', label: '🔴 Weak / Passive' };
  }

  const hasMetric = METRIC_REGEX.test(clean);
  const firstWord = clean.split(/\s+/)[0]?.toLowerCase().replace(/[^\w]/g, '').replace(/ed$/, '') || '';
  
  let hasActionVerb = false;
  STRONG_ACTION_VERBS.forEach((v) => {
    if (v.startsWith(firstWord) || firstWord.startsWith(v)) {
      hasActionVerb = true;
    }
  });

  if (hasActionVerb && hasMetric) {
    return { type: 'strong', label: '🟢 Strong XYZ' };
  }
  if (hasActionVerb) {
    return { type: 'needs_numbers', label: '🟡 Needs Numbers' };
  }
  if (hasMetric) {
    return { type: 'needs_numbers', label: '🟡 Needs Action Verb' };
  }
  return { type: 'weak', label: '🔴 Weak / Unquantified' };
}

export const ResumeBuilderModal: React.FC<ResumeBuilderModalProps> = ({
  isOpen,
  onClose,
  initialRoleKey,
  initialJobContext,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('swe');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
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

  // Load from LocalStorage or template defaults
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData(parsed);
        return;
      } catch {
        // Fallback to template defaults
      }
    }

    loadTemplateDefaults(selectedRole);
  }, [selectedRole]);

  const loadTemplateDefaults = (roleKey: string) => {
    const tmpl = ROLE_TEMPLATES[roleKey] || ROLE_TEMPLATES.swe;
    let skillsCopy = JSON.parse(JSON.stringify(tmpl.defaultSkills));
    if (initialJobContext?.skills && initialJobContext.skills.length > 0) {
      const topSkills = initialJobContext.skills.slice(0, 6).join(', ');
      skillsCopy[0] = {
        category: 'Target Role Competencies',
        skills: topSkills,
      };
    }

    const defaultData: ResumeData = {
      name: 'Abhinav Prakash',
      title: tmpl.defaultTitle,
      email: 'abhinav.prakash@example.com',
      location: 'Bengaluru / Gurugram, India',
      linkedin: 'linkedin.com/in/abhinav-prakash',
      github: 'github.com/AbhiPra24',
      website: '',
      summary: tmpl.defaultSummary,
      skills: skillsCopy,
      experience: tmpl.defaultExperience,
      projects: [
        {
          name: 'Distributed Event Streaming Engine',
          technologies: 'Go, Kafka, Redis, Docker',
          url: 'https://github.com/example/engine',
          bullets: [
            'Architected asynchronous messaging worker pool processing 50k RPS with sub-10ms delivery.',
            'Implemented zero-loss offset recovery mechanisms in Redis caching layer.',
          ],
        },
      ],
      education: tmpl.defaultEducation,
    };

    setResumeData(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  };

  // Save to LocalStorage whenever resumeData updates
  const updateResumeData = (updater: (prev: ResumeData) => ResumeData) => {
    setResumeData((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Reset form to role template defaults? Any manual unsaved edits will be replaced.')) {
      loadTemplateDefaults(selectedRole);
    }
  };

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
    const filename = `Resume_${selectedRole.toUpperCase()}.${format}`;

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-builder-title"
    >
      <div
        className="relative flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3.5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="resume-builder-title" className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Visual ATS Resume Architect & Form Editor
                </h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Non-AI visual editor • Live Google XYZ bullet badges • Persistent draft in LocalStorage
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

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/70 px-6 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Track:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setSelectedRole(newRole);
                  loadTemplateDefaults(newRole);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                {Object.values(ROLE_TEMPLATES).map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
              title="Reset current form to template baseline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* View Modes & Export Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => setViewMode('editor')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                  viewMode === 'editor'
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                <FileEdit className="mr-1 inline h-3 w-3" />
                Edit Form
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`hidden md:flex items-center rounded px-2.5 py-1 text-xs font-bold transition ${
                  viewMode === 'split'
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                <Layers className="mr-1 inline h-3 w-3" />
                Split View
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                  viewMode === 'preview'
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                <Eye className="mr-1 inline h-3 w-3" />
                Live Preview
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Downloads */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => handleDownload('tex')}
                className="rounded px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                title="Download LaTeX Source"
              >
                .TEX
              </button>
              <button
                onClick={() => handleDownload('md')}
                className="rounded px-2 py-1 text-xs font-bold text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50"
                title="Download Markdown"
              >
                .MD
              </button>
              <button
                onClick={() => handleDownload('txt')}
                className="rounded px-2 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                title="Download Plain Text"
              >
                .TXT
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* Form Editor (Left) */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div
              className={`flex h-full flex-col overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-800 ${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              }`}
            >
              <div className="flex flex-col gap-5 pb-6">
                {/* 1. Header & Contact Information */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      Personal & Contact Details
                    </h3>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.name}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, name: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Target Role Title</label>
                      <input
                        type="text"
                        value={resumeData.title}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, title: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Email Address</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, email: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Location (City, Country)</label>
                      <input
                        type="text"
                        value={resumeData.location}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, location: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">LinkedIn URL</label>
                      <input
                        type="text"
                        value={resumeData.linkedin}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, linkedin: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">GitHub (Optional)</label>
                      <input
                        type="text"
                        value={resumeData.github || ''}
                        onChange={(e) => updateResumeData((prev) => ({ ...prev, github: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Professional Summary */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Professional Summary
                      </h3>
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      {resumeData.summary.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={resumeData.summary}
                    onChange={(e) => updateResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                    className="mt-3 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-xs leading-relaxed text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                {/* 3. Technical Skills Categorization */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Technical Skills
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        updateResumeData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, { category: 'Tools & Protocols', skills: '' }],
                        }))
                      }
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-2.5">
                    {resumeData.skills.map((skillGroup, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skillGroup.category}
                          placeholder="Category (e.g. Languages)"
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResumeData((prev) => {
                              const s = [...prev.skills];
                              s[idx].category = val;
                              return { ...prev, skills: s };
                            });
                          }}
                          className="w-1/3 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                        <input
                          type="text"
                          value={skillGroup.skills}
                          placeholder="Comma-separated skills (e.g. Go, Python, SQL)"
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResumeData((prev) => {
                              const s = [...prev.skills];
                              s[idx].skills = val;
                              return { ...prev, skills: s };
                            });
                          }}
                          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                        <button
                          onClick={() =>
                            updateResumeData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== idx),
                            }))
                          }
                          className="p-1.5 text-zinc-400 hover:text-rose-600"
                          title="Remove Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Professional Experience & Rule-Based Bullet Badges */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Professional Experience
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        updateResumeData((prev) => ({
                          ...prev,
                          experience: [
                            {
                              role: 'Software Engineer',
                              company: 'Company Name',
                              dates: '2023 -- Present',
                              location: 'City, India',
                              bullets: ['Architected scalable features increasing system throughput by 30%.'],
                            },
                            ...prev.experience,
                          ],
                        }))
                      }
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Position</span>
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-5">
                    {resumeData.experience.map((job, jobIdx) => (
                      <div
                        key={jobIdx}
                        className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-800/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            Position #{jobIdx + 1}
                          </span>
                          <button
                            onClick={() =>
                              updateResumeData((prev) => ({
                                ...prev,
                                experience: prev.experience.filter((_, i) => i !== jobIdx),
                              }))
                            }
                            className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 hover:underline"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove Job</span>
                          </button>
                        </div>

                        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={job.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const exp = [...prev.experience];
                                exp[jobIdx].role = val;
                                return { ...prev, experience: exp };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={job.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const exp = [...prev.experience];
                                exp[jobIdx].company = val;
                                return { ...prev, experience: exp };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Dates (e.g. 2022 -- Present)"
                            value={job.dates}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const exp = [...prev.experience];
                                exp[jobIdx].dates = val;
                                return { ...prev, experience: exp };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Location (e.g. Bengaluru / Hybrid)"
                            value={job.location}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const exp = [...prev.experience];
                                exp[jobIdx].location = val;
                                return { ...prev, experience: exp };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                        </div>

                        {/* Bullets List */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500">
                            <span>Key Achievements & Responsibilities</span>
                            <button
                              onClick={() => {
                                updateResumeData((prev) => {
                                  const exp = [...prev.experience];
                                  exp[jobIdx].bullets.push('Architected new feature delivering 20% latency optimization.');
                                  return { ...prev, experience: exp };
                                });
                              }}
                              className="text-emerald-600 hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          <div className="mt-2 flex flex-col gap-2">
                            {job.bullets.map((b, bIdx) => {
                              const badge = getBulletStatus(b);
                              return (
                                <div key={bIdx} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={b}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateResumeData((prev) => {
                                          const exp = [...prev.experience];
                                          exp[jobIdx].bullets[bIdx] = val;
                                          return { ...prev, experience: exp };
                                        });
                                      }}
                                      className="flex-1 rounded-lg border border-zinc-200 bg-white p-2 font-mono text-[11px] text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                    <button
                                      onClick={() => {
                                        updateResumeData((prev) => {
                                          const exp = [...prev.experience];
                                          exp[jobIdx].bullets = exp[jobIdx].bullets.filter((_, i) => i !== bIdx);
                                          return { ...prev, experience: exp };
                                        });
                                      }}
                                      className="p-1.5 text-zinc-400 hover:text-rose-600"
                                      title="Remove Bullet"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between px-1">
                                    <span
                                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                        badge.type === 'strong'
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                          : badge.type === 'needs_numbers'
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                      }`}
                                    >
                                      {badge.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Key Projects */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Key Projects
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        updateResumeData((prev) => ({
                          ...prev,
                          projects: [
                            ...(prev.projects || []),
                            {
                              name: 'Project Title',
                              technologies: 'React, Node.js, AWS',
                              url: '',
                              bullets: ['Engineered scalable web application serving 10k users.'],
                            },
                          ],
                        }))
                      }
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    {resumeData.projects?.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 text-xs dark:border-zinc-800/80 dark:bg-zinc-800/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">
                            Project #{pIdx + 1}
                          </span>
                          <button
                            onClick={() =>
                              updateResumeData((prev) => ({
                                ...prev,
                                projects: prev.projects?.filter((_, i) => i !== pIdx),
                              }))
                            }
                            className="text-[10px] font-semibold text-rose-600 hover:underline"
                          >
                            Remove Project
                          </button>
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={proj.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const p = [...(prev.projects || [])];
                                p[pIdx].name = val;
                                return { ...prev, projects: p };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Technologies (e.g. Next.js, Go)"
                            value={proj.technologies}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const p = [...(prev.projects || [])];
                                p[pIdx].technologies = val;
                                return { ...prev, projects: p };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="URL / Demo (Optional)"
                            value={proj.url || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const p = [...(prev.projects || [])];
                                p[pIdx].url = val;
                                return { ...prev, projects: p };
                              });
                            }}
                            className="rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Education & Certifications */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      Education & Certifications
                    </h3>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Degree</label>
                      <input
                        type="text"
                        value={resumeData.education.degree}
                        onChange={(e) =>
                          updateResumeData((prev) => ({
                            ...prev,
                            education: { ...prev.education, degree: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Institution / University</label>
                      <input
                        type="text"
                        value={resumeData.education.school}
                        onChange={(e) =>
                          updateResumeData((prev) => ({
                            ...prev,
                            education: { ...prev.education, school: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">Graduation Dates</label>
                      <input
                        type="text"
                        value={resumeData.education.dates}
                        onChange={(e) =>
                          updateResumeData((prev) => ({
                            ...prev,
                            education: { ...prev.education, dates: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500">GPA / Honors (Optional)</label>
                      <input
                        type="text"
                        value={resumeData.education.gpa || ''}
                        onChange={(e) =>
                          updateResumeData((prev) => ({
                            ...prev,
                            education: { ...prev.education, gpa: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-zinc-500">Certifications (Optional)</label>
                    <input
                      type="text"
                      value={resumeData.education.certifications || ''}
                      onChange={(e) =>
                        updateResumeData((prev) => ({
                          ...prev,
                          education: { ...prev.education, certifications: e.target.value },
                        }))
                      }
                      placeholder="e.g. AWS Solutions Architect, CKA"
                      className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Preview & Code View (Right) */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={`flex h-full flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50 ${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              }`}
            >
              {/* Format Tabs */}
              <div className="flex border-b border-zinc-200 bg-white px-6 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  onClick={() => setActiveFormat('preview')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
                    activeFormat === 'preview'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveFormat('latex')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
                    activeFormat === 'latex'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>LaTeX (.tex)</span>
                </button>
                <button
                  onClick={() => setActiveFormat('markdown')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
                    activeFormat === 'markdown'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() => setActiveFormat('text')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 transition ${
                    activeFormat === 'text'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>Text (.txt)</span>
                </button>
              </div>

              {/* Rendered View */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeFormat === 'preview' ? (
                  <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Document Header */}
                    <div className="border-b border-zinc-200 pb-3.5 text-center dark:border-zinc-800">
                      <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                        {resumeData.name}
                      </h1>
                      <p className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {resumeData.title}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {[
                          resumeData.location,
                          resumeData.email,
                          resumeData.linkedin,
                          resumeData.github,
                          resumeData.website,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="mt-3.5">
                      <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Professional Summary
                      </h2>
                      <div className="mt-0.5 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {resumeData.summary}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                      <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Technical Skills
                      </h2>
                      <div className="mt-0.5 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-1.5 flex flex-col gap-1 text-xs">
                        {resumeData.skills.map((s, idx) => (
                          <div key={idx} className="text-zinc-700 dark:text-zinc-300">
                            <strong className="text-zinc-900 dark:text-white">{s.category}:</strong>{' '}
                            {s.skills}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mt-4">
                      <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Professional Experience
                      </h2>
                      <div className="mt-0.5 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-2.5 flex flex-col gap-3.5">
                        {resumeData.experience.map((job, idx) => (
                          <div key={idx} className="flex flex-col gap-0.5 text-xs">
                            <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                              <span>{job.role}</span>
                              <span className="text-zinc-500 font-normal">{job.dates}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] italic text-zinc-600 dark:text-zinc-400">
                              <span>{job.company}</span>
                              <span>{job.location}</span>
                            </div>
                            <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                              {job.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    {resumeData.projects && resumeData.projects.length > 0 && (
                      <div className="mt-4">
                        <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                          Key Projects
                        </h2>
                        <div className="mt-0.5 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                        <div className="mt-2.5 flex flex-col gap-3">
                          {resumeData.projects.map((proj, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                                <span>
                                  {proj.name} <span className="font-normal italic text-zinc-500">[{proj.technologies}]</span>
                                </span>
                                {proj.url && (
                                  <a
                                    href={proj.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-normal text-blue-600 hover:underline"
                                  >
                                    Demo / Code
                                  </a>
                                )}
                              </div>
                              <ul className="mt-0.5 list-disc pl-4 space-y-0.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                                {proj.bullets.map((b, bIdx) => (
                                  <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    <div className="mt-4">
                      <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                        Education & Certifications
                      </h2>
                      <div className="mt-0.5 h-[1px] w-full bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                          <span>{resumeData.education.degree}</span>
                          <span className="text-zinc-500 font-normal">{resumeData.education.dates}</span>
                        </div>
                        <p className="text-[11px] italic text-zinc-600 dark:text-zinc-400">
                          {resumeData.education.school}
                          {resumeData.education.gpa ? ` • GPA: ${resumeData.education.gpa}` : ''}
                        </p>
                        {resumeData.education.certifications && (
                          <p className="mt-0.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                            <strong>Certifications:</strong> {resumeData.education.certifications}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 dark:border-zinc-800 overflow-x-auto">
                    <pre>{getActiveCode()}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/80">
          <span className="text-xs text-zinc-500">
            Auto-persisted to LocalStorage • Compatible with Overleaf & LaTeX Workshop
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
