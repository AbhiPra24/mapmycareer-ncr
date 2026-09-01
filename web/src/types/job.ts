export interface Job {
  id: number | string;
  title: string;
  company: string;
  company_logo?: string;
  company_domain?: string;
  experience_yoe?: string;
  experience_level?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | string;
  job_type?: string;
  city: string;
  hub: string;
  lat: number;
  lon: number;
  skills?: string[];
  salary_range?: string;
  salary_min_lpa?: number;
  salary_max_lpa?: number;
  workplace_model?: 'Remote' | 'Hybrid' | 'On-site' | string;
  apply_url?: string;
  source?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCity: string;
  selectedHub: string;
  experienceLevels: string[];
  workplaceModels: string[];
  minSalaryLPA: number;
  selectedSkills: string[];
  showSavedOnly?: boolean;
}
