'use client';

import React, { useState, useEffect } from 'react';
import {
  DeliverabilityStatus,
  evaluateEmailClientSide,
  generateOutreachTemplates,
  OutreachTemplates,
} from '../lib/emailValidator';
import {
  X,
  MailCheck,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Send,
  Building,
  User,
  Sparkles,
} from 'lucide-react';

interface RecruiterValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialJobContext?: {
    title: string;
    company: string;
    skills: string[];
  } | null;
}

export const RecruiterValidatorModal: React.FC<RecruiterValidatorModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  initialJobContext,
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [candidateName, setCandidateName] = useState<string>('Candidate');
  const [roleTitle, setRoleTitle] = useState<string>(initialJobContext?.title || 'Software Engineer');
  const [companyName, setCompanyName] = useState<string>(initialJobContext?.company || 'Target Company');
  const [topMetric, setTopMetric] = useState<string>(
    'Engineered high-throughput microservices handling 10M+ daily events with sub-20ms latency'
  );

  const [status, setStatus] = useState<DeliverabilityStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [templates, setTemplates] = useState<OutreachTemplates | null>(null);
  const [activeTemplateTab, setActiveTemplateTab] = useState<'hiringManager' | 'recruiter' | 'peerReferral'>('hiringManager');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      handleVerify(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (initialJobContext) {
      setRoleTitle(initialJobContext.title);
      setCompanyName(initialJobContext.company);
    }
  }, [initialJobContext]);

  useEffect(() => {
    const tmpls = generateOutreachTemplates(candidateName, roleTitle, companyName, topMetric);
    setTemplates(tmpls);
  }, [candidateName, roleTitle, companyName, topMetric]);

  const handleVerify = async (emailToVerify?: string) => {
    const target = (emailToVerify !== undefined ? emailToVerify : email).trim();
    if (!target) return;

    // Fast client-side preliminary evaluation
    const clientStatus = evaluateEmailClientSide(target);
    setStatus(clientStatus);

    if (!clientStatus.isValidSyntax) {
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      });

      if (res.ok) {
        const data: DeliverabilityStatus = await res.json();
        setStatus(data);
      }
    } catch {
      // Fallback to client-side evaluation already set
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getConfidenceBadge = (confidence: DeliverabilityStatus['confidence']) => {
    switch (confidence) {
      case 'HIGH CONFIDENCE':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            HIGH CONFIDENCE (SAFE TO SEND)
          </span>
        );
      case 'BOUNCE LIKELY (UNMONITORED ALIAS)':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            UNMONITORED ALIAS (LOW RESPONSE)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            BOUNCE LIKELY / INVALID DOMAIN
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <MailCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg">
                  Recruiter Radar & Email Deliverability Engine
                </h2>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-950 dark:text-purple-300">
                  ANTI-BOUNCE
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                RFC 5322 syntax audit • Unmonitored catch-all detection • DNS/MX health verification
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

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Input & Verification Box */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Recruiter / Contact Email Address
              </label>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="e.g. rahul.sharma@microsoft.com or careers@startup.io"
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  onClick={() => handleVerify()}
                  disabled={isVerifying || !email.trim()}
                  className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
                  <span>Verify Deliverability</span>
                </button>
              </div>

              {/* Status Report Badge */}
              {status && (
                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-200/80 pt-3 dark:border-zinc-700/80">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {getConfidenceBadge(status.confidence)}
                    <span className="text-[11px] text-zinc-400">
                      RFC 5322: {status.isValidSyntax ? 'Valid' : 'Malformed'} • Domain MX:{' '}
                      {status.domainResolves === true
                        ? 'Active'
                        : status.domainResolves === false
                        ? 'Failed / Offline'
                        : 'Checking...'}
                    </span>
                  </div>

                  {status.warnings.length > 0 && (
                    <div className="flex flex-col gap-1 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                      {status.warnings.map((w, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {status.mxRecords && status.mxRecords.length > 0 && (
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      <strong>Resolved MX Hosts:</strong> {status.mxRecords.slice(0, 2).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cold Outreach Generator */}
            <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    3-Tier Personalized Outreach Generator
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase">High Response Rate Formula</span>
              </div>

              {/* Outreach Variables Form */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500">Your Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500">Target Role Title</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[11px] font-semibold text-zinc-500">
                  Key Quantified Achievement / Highlight
                </label>
                <input
                  type="text"
                  value={topMetric}
                  onChange={(e) => setTopMetric(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-900 outline-none focus:border-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Template Tabs */}
              {templates && (
                <div className="mt-5">
                  <div className="flex border-b border-zinc-200 text-xs font-semibold dark:border-zinc-800">
                    <button
                      onClick={() => setActiveTemplateTab('hiringManager')}
                      className={`border-b-2 px-4 py-2 transition ${
                        activeTemplateTab === 'hiringManager'
                          ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      Hiring Manager Outreach
                    </button>
                    <button
                      onClick={() => setActiveTemplateTab('recruiter')}
                      className={`border-b-2 px-4 py-2 transition ${
                        activeTemplateTab === 'recruiter'
                          ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      Recruiter / Sourcer Pitch
                    </button>
                    <button
                      onClick={() => setActiveTemplateTab('peerReferral')}
                      className={`border-b-2 px-4 py-2 transition ${
                        activeTemplateTab === 'peerReferral'
                          ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      Peer Engineer Referral
                    </button>
                  </div>

                  <div className="relative mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200">
                    <button
                      onClick={() => handleCopy(templates[activeTemplateTab], activeTemplateTab)}
                      className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {copiedKey === activeTemplateTab ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === activeTemplateTab ? 'Copied' : 'Copy'}</span>
                    </button>
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {templates[activeTemplateTab]}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950/80">
          <span className="text-xs text-zinc-500">
            Powered by CareerForge Recruiter Radar Deliverability Engine
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
