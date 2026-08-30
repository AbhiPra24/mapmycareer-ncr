'use client';

import React, { useState, useEffect } from 'react';
import { AtsAuditReport, auditAtsScore } from '../lib/atsAuditor';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Zap,
  BookOpen,
  ArrowRight,
  UploadCloud
} from 'lucide-react';

interface AtsAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJobContext?: {
    title: string;
    company: string;
    skills: string[];
  } | null;
}

const SAMPLE_RESUME = `Alex Rivera
Senior Software Engineer
Bengaluru, India | alex.rivera@example.com | linkedin.com/in/alexrivera

SUMMARY
Experienced distributed systems engineer with 6+ years designing, building, and scaling resilient cloud infrastructure and high-throughput microservices.

SKILLS
Languages: Go, Python, TypeScript, Java, SQL, Bash
Cloud & DevOps: AWS (EKS, Lambda, S3, RDS), Kubernetes, Docker, Terraform, Kafka
Databases: PostgreSQL, Redis, DynamoDB, Elasticsearch

EXPERIENCE
Senior Backend Engineer -- CloudScale Solutions (2022 - Present)
- Architected high-throughput ingestion pipeline handling 25M+ events daily with 99.99% service uptime.
- Optimized database indexing and query workflows, curtailing P99 latency from 180ms to 24ms.
- Spearheaded migration of monolithic service into 12 Go microservices, accelerating release velocity by 3x.
- Mentored team of 5 junior engineers on distributed tracing and zero-downtime deployment practices.

Software Engineer -- Apex Digital Infrastructure (2019 - 2022)
- Responsible for maintaining backend REST APIs and customer authentication services.
- Engineered distributed caching layer in Redis, reducing database load by 40%.
- Automated unit and integration testing suites achieving 88% overall test coverage.

EDUCATION
B.Tech in Computer Science -- National Institute of Technology (2015 - 2019)
`;

export const AtsAuditModal: React.FC<AtsAuditModalProps> = ({
  isOpen,
  onClose,
  initialJobContext,
}) => {
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUME);
  const [targetSkills, setTargetSkills] = useState<string[]>(initialJobContext?.skills || []);
  const [report, setReport] = useState<AtsAuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bullets' | 'skills'>('overview');

  useEffect(() => {
    if (initialJobContext?.skills) {
      setTargetSkills(initialJobContext.skills);
    }
  }, [initialJobContext]);

  // Run audit on text or targetSkills change
  useEffect(() => {
    if (!resumeText.trim()) {
      setReport(null);
      return;
    }
    const res = auditAtsScore(resumeText, targetSkills);
    setReport(res);
  }, [resumeText, targetSkills]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-50 dark:bg-blue-950/40';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-950/40';
  };

  const getProgressColor = (score: number, max: number = 25) => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'bg-emerald-500';
    if (ratio >= 0.6) return 'bg-blue-500';
    if (ratio >= 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Deterministic ATS Heuristic Auditor
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950 dark:text-blue-300">
                  100-PT RUBRIC
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                100% Client-side rule engine • Action verbs • Google XYZ metric density • Section syntax
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

        {/* Job Context Banner (if triggered for a specific job) */}
        {initialJobContext && (
          <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/60 px-6 py-2 text-xs dark:border-blue-950 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>
                Auditing for: <strong>{initialJobContext.title}</strong> at {initialJobContext.company}
              </span>
            </div>
            <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">
              {targetSkills.length} required skills mapped
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* Left Column: Text Input (5 cols) */}
          <div className="flex flex-col border-r border-zinc-200 p-4 dark:border-zinc-800 lg:col-span-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Resume Content (Markdown / Text)
              </span>
              <button
                onClick={() => setResumeText(SAMPLE_RESUME)}
                className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Reset to Sample
              </button>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your raw resume text, markdown, or bullet points here..."
              className="flex-1 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:focus:bg-zinc-950"
            />

            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
              <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
              <span>{resumeText.split('\n').filter((l) => l.trim().length > 0).length} lines</span>
            </div>
          </div>

          {/* Right Column: Score Breakdown & Feedback (7 cols) */}
          <div className="flex flex-col overflow-y-auto p-5 lg:col-span-7">
            {report ? (
              <div className="flex flex-col gap-5">
                {/* Score Hero Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-800/30">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl font-black shadow-inner ${getScoreColor(
                        report.totalScore
                      )}`}
                    >
                      {report.totalScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                          {report.totalScore >= 85
                            ? 'Top 5% Tier -- Highly Competitive'
                            : report.totalScore >= 70
                            ? 'Solid Profile -- Ready for Polish'
                            : report.totalScore >= 50
                            ? 'Average -- Needs Metric Quantification'
                            : 'High ATS Rejection Risk'}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Evaluated across 4 key heuristic pillars (25 pts each)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-zinc-100 px-3 py-1.5 text-center dark:bg-zinc-800">
                      <div className="text-[10px] uppercase font-bold text-zinc-400">Quantified</div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white">
                        {report.quantifiedBulletsCount} / {report.totalBulletsCount}
                      </div>
                    </div>
                    <div className="rounded-lg bg-zinc-100 px-3 py-1.5 text-center dark:bg-zinc-800">
                      <div className="text-[10px] uppercase font-bold text-zinc-400">Verbs</div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white">
                        {report.strongVerbsFound.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Pillars Progress Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {/* Pillar 1: Action Verbs */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Action Verbs</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {report.actionVerbScore}/25
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className={`h-full ${getProgressColor(report.actionVerbScore)}`}
                        style={{ width: `${(report.actionVerbScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-zinc-400">
                      {report.strongVerbsFound.length} powerful verbs found
                    </p>
                  </div>

                  {/* Pillar 2: Metric Density */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Google XYZ</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {report.metricDensityScore}/25
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className={`h-full ${getProgressColor(report.metricDensityScore)}`}
                        style={{ width: `${(report.metricDensityScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-zinc-400">
                      {Math.round((report.quantifiedBulletsCount / (report.totalBulletsCount || 1)) * 100)}%
                      bullets quantified
                    </p>
                  </div>

                  {/* Pillar 3: Section Structure */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Sections</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {report.structureScore}/25
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className={`h-full ${getProgressColor(report.structureScore)}`}
                        style={{ width: `${(report.structureScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-zinc-400">
                      {report.missingSections.length === 0
                        ? 'All standard sections'
                        : `Missing: ${report.missingSections.join(', ')}`}
                    </p>
                  </div>

                  {/* Pillar 4: Brevity & Density */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Word Count</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {report.brevityScore}/25
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className={`h-full ${getProgressColor(report.brevityScore)}`}
                        style={{ width: `${(report.brevityScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-zinc-400">
                      {report.wordCount} words (ideal: 350-750)
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 text-xs font-semibold dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`border-b-2 px-4 py-2 transition ${
                      activeTab === 'overview'
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Actionable Fixes ({report.recommendations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('bullets')}
                    className={`border-b-2 px-4 py-2 transition ${
                      activeTab === 'bullets'
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Bullet-by-Bullet Analysis ({report.bulletEvaluations.length})
                  </button>
                  {targetSkills.length > 0 && (
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`border-b-2 px-4 py-2 transition ${
                        activeTab === 'skills'
                          ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      Target Role Keywords ({report.roleKeywordsMatched?.length || 0}/{targetSkills.length})
                    </button>
                  )}
                </div>

                {/* Tab 1: Actionable Recommendations */}
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-3">
                    {report.recommendations.length > 0 ? (
                      report.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span>All core ATS heuristics satisfied with zero major defects!</span>
                      </div>
                    )}

                    {/* Detected Action Verbs Chips */}
                    <div className="mt-2 rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
                      <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Detected Strong Verbs ({report.strongVerbsFound.length})
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {report.strongVerbsFound.map((v, i) => (
                          <span
                            key={i}
                            className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Bullet-by-Bullet Analysis */}
                {activeTab === 'bullets' && (
                  <div className="flex flex-col gap-2.5">
                    {report.bulletEvaluations.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/40 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800/20"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              item.status === 'Optimal'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : item.status === 'Needs Quantification'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {item.hasMetric ? '📊 Metric Included' : '❌ No Metric'}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
                          {item.bullet}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          💡 <em>{item.suggestion}</em>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Target Role Keywords */}
                {activeTab === 'skills' && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        ✅ Matched Role Keywords ({report.roleKeywordsMatched?.length || 0})
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {report.roleKeywordsMatched && report.roleKeywordsMatched.length > 0 ? (
                          report.roleKeywordsMatched.map((kw, i) => (
                            <span
                              key={i}
                              className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                            >
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-700">No exact keywords matched yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-950 dark:bg-amber-950/20">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        💡 Missing Target Keywords ({report.roleKeywordsMissing?.length || 0})
                      </h4>
                      <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                        Add these keywords naturally into your experience bullets or skills section:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {report.roleKeywordsMissing && report.roleKeywordsMissing.length > 0 ? (
                          report.roleKeywordsMissing.map((kw, i) => (
                            <span
                              key={i}
                              className="rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                            >
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-amber-700">100% target keywords covered!</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-zinc-400">
                <FileText className="h-10 w-10 text-zinc-300" />
                <p className="mt-2 text-xs">Paste resume text on the left to start the ATS audit.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950/80">
          <span className="text-xs text-zinc-500">
            Powered by CareerForge Deterministic Heuristics
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
