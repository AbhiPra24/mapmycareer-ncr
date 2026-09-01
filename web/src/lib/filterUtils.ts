import { Job, FilterState } from '../types/job';
import Fuse from 'fuse.js';

export function parseSalaryLPA(salaryRange?: string): { min: number; max: number } {
  if (!salaryRange) return { min: 0, max: 0 };
  
  const matches = salaryRange.match(/(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length === 0) return { min: 0, max: 0 };
  
  if (matches.length >= 2) {
    return {
      min: parseFloat(matches[0]),
      max: parseFloat(matches[1]),
    };
  }
  
  const single = parseFloat(matches[0]);
  return { min: single, max: single };
}

// Clean hub name by removing company-specific parentheses e.g. "DLF Cyber City (Accenture)" -> "DLF Cyber City"
export function normalizeHubName(hub: string): string {
  if (!hub) return '';
  // Remove parenthesized info like (Accenture), (Air India), etc.
  let cleaned = hub.replace(/\s*\([^)]*\)/g, '').trim();
  // Also trim trailing commas or dashes
  cleaned = cleaned.replace(/,\s*$/, '').trim();
  return cleaned || hub;
}

export function getCleanLogoUrl(company: string, domain?: string): string | null {
  if (domain && domain.includes('.') && !domain.includes(' ') && domain.length > 3) {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }
  
  if (!company) return null;
  // Clean company name to extract domain candidate
  let cleanName = company.toLowerCase()
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\b(pvt|ltd|limited|inc|technologies|solutions|services|corp|corporation|llc|india)\b/g, '')
    .trim()
    .replace(/[^a-z0-9]/g, '');

  if (cleanName.length >= 3) {
    return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=128`;
  }
  return null;
}

export function filterJobs(jobs: Job[], filters: FilterState, savedJobIds?: Set<string | number>): Job[] {
  let result = jobs;

  if (filters.showSavedOnly && savedJobIds) {
    result = result.filter(j => savedJobIds.has(j.id));
  }

  // 1. Fuzzy Search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const fuse = new Fuse(result, {
      keys: ['title', 'company', 'skills', 'hub', 'city'],
      threshold: 0.35,
    });
    result = fuse.search(filters.searchQuery.trim()).map((res) => res.item);
  }

  // 2. City Filter
  if (filters.selectedCity && filters.selectedCity !== 'All Cities') {
    result = result.filter((j) => j.city.toLowerCase() === filters.selectedCity.toLowerCase());
  }

  // 3. Hub Filter (Checks normalized match or original)
  if (filters.selectedHub && filters.selectedHub !== 'All Hubs') {
    result = result.filter((j) => 
      normalizeHubName(j.hub) === filters.selectedHub || j.hub === filters.selectedHub
    );
  }

  // 4. Experience Level
  if (filters.experienceLevels.length > 0) {
    result = result.filter((j) => 
      j.experience_level && filters.experienceLevels.includes(j.experience_level)
    );
  }

  // 5. Workplace Model
  if (filters.workplaceModels.length > 0) {
    result = result.filter((j) => 
      j.workplace_model && filters.workplaceModels.includes(j.workplace_model)
    );
  }

  // 6. Min Salary LPA Filter
  if (filters.minSalaryLPA > 0) {
    result = result.filter((j) => {
      const { max } = parseSalaryLPA(j.salary_range);
      return max >= filters.minSalaryLPA;
    });
  }

  // 7. Skills Filter
  if (filters.selectedSkills.length > 0) {
    result = result.filter((j) => 
      j.skills?.some((s) => filters.selectedSkills.map(sk => sk.toLowerCase()).includes(s.toLowerCase()))
    );
  }

  return result;
}

export function extractUniqueValues(jobs: Job[]) {
  const cities = Array.from(new Set(jobs.map((j) => j.city).filter(Boolean))).sort();
  
  // Group and clean hub names to avoid duplicate / verbose company-tagged hubs
  const hubSet = new Set<string>();
  jobs.forEach((j) => {
    if (j.hub) {
      hubSet.add(normalizeHubName(j.hub));
    }
  });
  const hubs = Array.from(hubSet).filter(Boolean).sort();

  const allSkills = Array.from(
    new Set(jobs.flatMap((j) => j.skills || []).filter(Boolean))
  ).sort();
  
  return { cities, hubs, allSkills };
}
