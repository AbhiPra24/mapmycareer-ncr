'use client';

import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Job, FilterState } from '../types/job';
import { filterJobs, extractUniqueValues } from '../lib/filterUtils';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { JobCard } from '../components/JobCard';
import { MapView } from '../components/MapView';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { AtsAuditModal } from '../components/AtsAuditModal';
import { ResumeBuilderModal } from '../components/ResumeBuilderModal';
import { RecruiterValidatorModal } from '../components/RecruiterValidatorModal';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { CorridorFaqSection } from '../components/CorridorFaqSection';
import { CorridorFaqModal } from '../components/CorridorFaqModal';
import { Loader2, AlertCircle, List, Map } from 'lucide-react';

export default function Home() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [hoveredJob, setHoveredJob] = useState<Job | null>(null);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // CareerForge Modals State
  const [isAtsModalOpen, setIsAtsModalOpen] = useState<boolean>(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState<boolean>(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState<boolean>(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState<boolean>(false);
  const [activeJobContext, setActiveJobContext] = useState<{
    title: string;
    company: string;
    skills: string[];
  } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCity: 'All Cities',
    selectedHub: 'All Hubs',
    experienceLevels: [],
    workplaceModels: [],
    minSalaryLPA: 0,
    selectedSkills: [],
    showSavedOnly: false,
  });

  const [savedJobIds, setSavedJobIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleSaveJob = (jobId: string | number) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      localStorage.setItem('savedJobs', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Fetch jobs dataset
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/data/jobs.json');
        if (!res.ok) throw new Error('Failed to load dataset');
        const data = await res.json();
        setAllJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, []);

  const { cities, hubs } = useMemo(() => extractUniqueValues(allJobs), [allJobs]);

  const deferredFilters = useDeferredValue(filters);

  const filteredJobs = useMemo(() => {
    return filterJobs(allJobs, deferredFilters, savedJobIds);
  }, [allJobs, deferredFilters, savedJobIds]);

  const [displayLimit, setDisplayLimit] = useState<number>(40);

  // Reset displayLimit whenever filters change
  useEffect(() => {
    setDisplayLimit(40);
  }, [filters]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, displayLimit);
  }, [filteredJobs, displayLimit]);

  const handleScrollFeed = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      if (displayLimit < filteredJobs.length) {
        setDisplayLimit((prev) => Math.min(prev + 40, filteredJobs.length));
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCity: 'All Cities',
      selectedHub: 'All Hubs',
      experienceLevels: [],
      workplaceModels: [],
      minSalaryLPA: 0,
      selectedSkills: [],
    });
  };

  // Job Modal Action Handlers
  const handleAuditForJob = (job: Job) => {
    setActiveJobContext({
      title: job.title,
      company: job.company,
      skills: job.skills || [],
    });
    setModalJob(null);
    setIsAtsModalOpen(true);
  };

  const handleGenerateForJob = (job: Job) => {
    setActiveJobContext({
      title: job.title,
      company: job.company,
      skills: job.skills || [],
    });
    setModalJob(null);
    setIsResumeBuilderOpen(true);
  };

  const handleVerifyRecruiterForJob = (job: Job) => {
    setActiveJobContext({
      title: job.title,
      company: job.company,
      skills: job.skills || [],
    });
    setModalJob(null);
    setIsRecruiterModalOpen(true);
  };

  const handleScrollToInsights = () => {
    setMobileTab('list');
    setTimeout(() => {
      const el = document.getElementById('corridor-insights-faq');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading India Geo-Spatial Job Radar...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-100 dark:bg-zinc-950">
      {/* Dynamic Announcement Banner (Vercel Edge Config) */}
      <AnnouncementBanner />

      {/* Top Navbar */}
      <Header
        totalJobs={allJobs.length}
        filteredCount={filteredJobs.length}
        onOpenAtsAuditor={() => {
          setActiveJobContext(null);
          setIsAtsModalOpen(true);
        }}
        onOpenResumeBuilder={() => {
          setActiveJobContext(null);
          setIsResumeBuilderOpen(true);
        }}
        onOpenRecruiterValidator={() => {
          setActiveJobContext(null);
          setIsRecruiterModalOpen(true);
        }}
        onScrollToInsights={handleScrollToInsights}
        onOpenFaqModal={() => setIsFaqModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-4">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          cities={cities}
          hubs={hubs}
          onReset={handleResetFilters}
        />

        {/* Split Screen Content: Left Job Feed, Right Geospatial Map */}
        <div className="relative grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
          {/* Left: Job Cards List */}
          <div
            onScroll={handleScrollFeed}
            className={`h-full flex-col overflow-y-auto pr-1 lg:col-span-5 xl:col-span-4 ${
              mobileTab === 'list' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <AlertCircle className="h-8 w-8 text-zinc-400" />
                <h3 className="mt-2 text-sm font-bold text-zinc-800 dark:text-white">
                  No matching jobs found
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Try relaxing your salary or experience filters to see more opportunities.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pb-20 lg:pb-6">
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    isSaved={savedJobIds.has(job.id)}
                    onSelect={(j) => {
                      setSelectedJob(j);
                      setModalJob(j);
                    }}
                    onHover={(j) => setHoveredJob(j)}
                    onToggleSave={(j, e) => {
                      e.stopPropagation();
                      toggleSaveJob(j.id);
                    }}
                  />
                ))}
                {displayLimit < filteredJobs.length && (
                  <div className="py-2 text-center text-xs text-zinc-400">
                    Scroll down to load more ({displayedJobs.length} of {filteredJobs.length} loaded)...
                  </div>
                )}
                <CorridorFaqSection />
              </div>
            )}
          </div>

          {/* Right: Map Explorer */}
          <div
            className={`h-full w-full lg:col-span-7 xl:col-span-8 ${
              mobileTab === 'map' ? 'block' : 'hidden lg:block'
            }`}
          >
            <MapView
              jobs={filteredJobs}
              selectedJob={selectedJob}
              hoveredJob={hoveredJob}
              onSelectJob={(j) => {
                setSelectedJob(j);
                setModalJob(j);
              }}
            />
          </div>
        </div>

        {/* Mobile Floating View Switcher Pill */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/95 lg:hidden">
          <button
            onClick={() => setMobileTab('list')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              mobileTab === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Jobs ({filteredJobs.length})</span>
          </button>
          <button
            onClick={() => {
              setMobileTab('map');
              setTimeout(() => {
                window.dispatchEvent(new Event('mapInvalidateSize'));
              }, 50);
            }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              mobileTab === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Job Details Popup Modal */}
      <JobDetailsModal
        job={modalJob}
        isSaved={modalJob ? savedJobIds.has(modalJob.id) : false}
        onClose={() => setModalJob(null)}
        onToggleSave={() => modalJob && toggleSaveJob(modalJob.id)}
        onAuditResume={handleAuditForJob}
        onGenerateResume={handleGenerateForJob}
        onVerifyRecruiter={handleVerifyRecruiterForJob}
      />

      {/* CareerForge ATS Auditor Modal */}
      <AtsAuditModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        initialJobContext={activeJobContext}
      />

      {/* CareerForge Resume Builder Modal */}
      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
        initialJobContext={activeJobContext}
      />

      {/* CareerForge Recruiter Radar Modal */}
      <RecruiterValidatorModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
        initialJobContext={activeJobContext}
      />

      {/* Corridor Insights & Tech Career FAQ Modal */}
      <CorridorFaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
    </div>
  );
}
