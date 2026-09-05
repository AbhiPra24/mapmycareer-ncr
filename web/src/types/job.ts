/**
 * Nominal Brand type helper for strict type safety
 */
export type Brand<K, T> = K & { readonly __brand: T };

export type JobId = Brand<number | string, 'JobId'>;
export type Latitude = Brand<number, 'Latitude'>;
export type Longitude = Brand<number, 'Longitude'>;

export type ExperienceTier = 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
export type WorkplaceModel = 'Remote' | 'Hybrid' | 'On-site';

export type TechHubCity =
  | 'Bengaluru'
  | 'Gurugram'
  | 'Noida'
  | 'Hyderabad'
  | 'Pune'
  | 'Mumbai'
  | 'Kochi'
  | 'Chandigarh'
  | 'Kolkata'
  | 'Delhi'
  | (string & {});

export interface Job {
  id: number | string;
  title: string;
  company: string;
  company_logo?: string;
  company_domain?: string;
  experience_yoe?: string;
  experience_level?: ExperienceTier | string;
  job_type?: string;
  city: TechHubCity;
  hub: string;
  lat: number;
  lon: number;
  skills?: string[];
  salary_range?: string;
  salary_min_lpa?: number;
  salary_max_lpa?: number;
  workplace_model?: WorkplaceModel | string;
  apply_url?: string;
  source?: string;
  standard_level?: string;
  level_name?: string;
  level_code?: string;
  level_tier?: string;
  level_yoe_range?: string;
  levels_fyi_benchmark?: string;
  levels_fyi_url?: string;
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

/**
 * Readonly immutable helper for state filtering
 */
export type ReadonlyFilterState = Readonly<FilterState>;

