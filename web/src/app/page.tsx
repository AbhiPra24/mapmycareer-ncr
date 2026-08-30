'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [hoveredJob, setHoveredJob] = useState<Job | null>(null);
  const [modalJob, setModalJob] = useState<Job | null>(null);

  // CareerForge Modals State
  const [isAtsModalOpen, setIsAtsModalOpen] = useState<boolean>(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState<boolean>(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState<boolean>(false);
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
  });

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

  const filteredJobs = useMemo(() => {
    return filterJobs(allJobs, filters);
  }, [allJobs, filters]);

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
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
          {/* Left: Job Cards List */}
          <div className="flex h-full flex-col overflow-y-auto pr-1 lg:col-span-5 xl:col-span-4">
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
              <div className="flex flex-col gap-2.5 pb-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onSelect={(j) => {
                      setSelectedJob(j);
                      setModalJob(j);
                    }}
                    onHover={(j) => setHoveredJob(j)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Map Explorer */}
          <div className="h-[400px] w-full lg:h-full lg:col-span-7 xl:col-span-8">
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
      </div>

      {/* Job Details Popup Modal */}
      <JobDetailsModal
        job={modalJob}
        onClose={() => setModalJob(null)}
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
    </div>
  );
}
