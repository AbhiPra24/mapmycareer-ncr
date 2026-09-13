/**
 * Client-Side Resume-to-Job Matching Engine
 * 100% in-browser, privacy-preserving semantic & heuristic matcher.
 * Extracts technical skills, seniority level, and domain track from resume text,
 * then scores and ranks live jobs against candidate capabilities.
 */

import { Job, CandidateProfile, JobMatchResult, MatchedJob } from '../types/job';

// Curated skills dictionary based on the 1,450+ live tech jobs dataset
export const SKILL_TAXONOMY: Record<string, string[]> = {
  // Languages
  python: ['python', 'py'],
  javascript: ['javascript', 'js', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  java: ['java', 'core java', 'j2ee'],
  golang: ['golang', 'go', 'go language'],
  'c++': ['c++', 'cpp'],
  'c#': ['c#', 'csharp', '.net', 'dotnet'],
  rust: ['rust'],
  scala: ['scala'],
  kotlin: ['kotlin'],
  swift: ['swift'],
  ruby: ['ruby', 'ruby on rails', 'rails'],
  php: ['php', 'laravel'],
  sql: ['sql', 'advanced sql', 'pl/sql', 't-sql'],
  bash: ['bash', 'shell scripting', 'shell'],

  // Frontend
  react: ['react', 'react.js', 'reactjs'],
  'react native': ['react native'],
  'next.js': ['next.js', 'nextjs'],
  angular: ['angular', 'angularjs'],
  vue: ['vue', 'vue.js', 'vuejs'],
  svelte: ['svelte'],
  tailwind: ['tailwind', 'tailwind css', 'tailwindcss'],
  html: ['html', 'html5'],
  css: ['css', 'css3', 'sass', 'scss'],
  redux: ['redux', 'zustand'],

  // Backend & Architecture
  microservices: ['microservices', 'microservice', 'distributed systems'],
  restful: ['restful', 'rest api', 'rest apis', 'restful api', 'rest'],
  graphql: ['graphql'],
  grpc: ['grpc'],
  'node.js': ['node.js', 'nodejs', 'node'],
  express: ['express', 'express.js'],
  nestjs: ['nestjs'],
  'spring boot': ['spring boot', 'spring framework', 'spring'],
  django: ['django'],
  flask: ['flask'],
  fastapi: ['fastapi'],
  kafka: ['kafka', 'apache kafka'],
  rabbitmq: ['rabbitmq'],
  redis: ['redis', 'caching'],

  // Cloud & DevOps
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'eks', 'rds'],
  azure: ['azure', 'microsoft azure'],
  gcp: ['gcp', 'google cloud', 'google cloud platform'],
  docker: ['docker', 'containerization', 'containers'],
  kubernetes: ['kubernetes', 'k8s'],
  terraform: ['terraform', 'iac', 'infrastructure as code'],
  'ci/cd': ['ci/cd', 'continuous integration', 'continuous deployment', 'ci-cd'],
  jenkins: ['jenkins'],
  github: ['github', 'git', 'version control', 'gitlab'],
  ansible: ['ansible'],
  linux: ['linux', 'unix'],

  // Databases & Big Data
  postgresql: ['postgresql', 'postgres'],
  mysql: ['mysql'],
  mongodb: ['mongodb', 'mongo'],
  dynamodb: ['dynamodb'],
  elasticsearch: ['elasticsearch', 'elk'],
  snowflake: ['snowflake'],
  databricks: ['databricks'],
  spark: ['spark', 'apache spark'],
  hadoop: ['hadoop'],

  // QA, SDET & Testing
  selenium: ['selenium', 'selenium webdriver'],
  playwright: ['playwright'],
  cypress: ['cypress'],
  sdet: ['sdet', 'software development engineer in test'],
  'test automation': ['test automation', 'automated testing', 'automation testing', 'automation tools'],
  qa: ['qa', 'quality assurance', 'software quality', 'testing'],
  testng: ['testng'],
  junit: ['junit'],
  pytest: ['pytest'],
  postman: ['postman', 'api testing'],
  jmeter: ['jmeter', 'performance testing', 'load testing'],
  appium: ['appium'],
  cucumber: ['cucumber', 'bdd'],

  // AI & Data Science
  'machine learning': ['machine learning', 'ml'],
  'deep learning': ['deep learning', 'neural networks'],
  ai: ['ai', 'artificial intelligence', 'genai', 'generative ai', 'llm', 'llms'],
  pytorch: ['pytorch'],
  tensorflow: ['tensorflow', 'keras'],
  pandas: ['pandas'],
  numpy: ['numpy'],
  'power bi': ['power bi', 'powerbi'],
  tableau: ['tableau'],

  // Methodologies & Principles
  agile: ['agile', 'scrum', 'kanban'],
  'system design': ['system design', 'solution architecture', 'software architecture'],
  oop: ['oop', 'object-oriented', 'solid principles'],
};

// Domain tracks and their hallmark skills/keywords
const TRACK_SIGNATURES: Record<string, { skills: string[]; titles: string[] }> = {
  'QA / SDET / Test Automation': {
    skills: ['selenium', 'playwright', 'cypress', 'sdet', 'test automation', 'qa', 'testng', 'appium', 'postman', 'cucumber', 'pytest', 'jmeter'],
    titles: ['sdet', 'qa', 'quality', 'test', 'automation', 'test engineer'],
  },
  'Frontend Engineer': {
    skills: ['react', 'next.js', 'angular', 'vue', 'tailwind', 'html', 'css', 'javascript', 'typescript', 'redux'],
    titles: ['frontend', 'front end', 'front-end', 'ui developer', 'ui engineer', 'react developer', 'web developer'],
  },
  'Backend Engineer': {
    skills: ['golang', 'python', 'java', 'spring boot', 'node.js', 'microservices', 'restful', 'kafka', 'redis', 'postgresql', 'fastapi'],
    titles: ['backend', 'back end', 'back-end', 'server', 'java developer', 'golang developer', 'python developer', 'software engineer'],
  },
  'Full Stack Engineer': {
    skills: ['react', 'node.js', 'python', 'javascript', 'typescript', 'full stack', 'next.js', 'sql'],
    titles: ['full stack', 'fullstack', 'full-stack'],
  },
  'DevOps / Cloud / SRE': {
    skills: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'linux', 'ansible'],
    titles: ['devops', 'sre', 'site reliability', 'cloud engineer', 'infrastructure', 'platform engineer'],
  },
  'Data / AI / ML Engineer': {
    skills: ['python', 'machine learning', 'ai', 'pytorch', 'tensorflow', 'spark', 'databricks', 'snowflake', 'pandas', 'sql', 'power bi'],
    titles: ['data engineer', 'machine learning', 'ml engineer', 'data scientist', 'ai engineer', 'data analyst'],
  },
  'Mobile Engineer': {
    skills: ['react native', 'flutter', 'swift', 'kotlin', 'appium'],
    titles: ['android', 'ios', 'mobile developer', 'react native developer', 'flutter developer'],
  },
};

/**
 * Extracts candidate profile from raw resume text:
 * - Identified technical skills
 * - Estimated seniority (Entry, Mid, Senior, Lead)
 * - Detected domain track (SDET, Backend, Frontend, etc.)
 */
export function extractCandidateProfile(resumeText: string): CandidateProfile {
  const clean = resumeText.toLowerCase();

  // 1. Extract Skills
  const detectedSkills = new Set<string>();

  for (const [canonical, aliases] of Object.entries(SKILL_TAXONOMY)) {
    for (const alias of aliases) {
      // Use boundary-aware regex to avoid false positives (e.g., 'go' inside 'good')
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (regex.test(clean)) {
        // Format canonical name nicely (capitalize first letter of words)
        const formatted = canonical.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        detectedSkills.add(formatted);
        break;
      }
    }
  }

  // 2. Estimate Years of Experience (YOE)
  let yoeEstimate: number | undefined;
  const yoeMatches = clean.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+(?:of\s+)?experience)?/i);
  if (yoeMatches && yoeMatches[1]) {
    const parsed = parseInt(yoeMatches[1], 10);
    if (parsed > 0 && parsed <= 35) {
      yoeEstimate = parsed;
    }
  }

  // 3. Estimate Seniority
  let seniority: CandidateProfile['seniority'] = 'Mid';
  if (yoeEstimate !== undefined) {
    if (yoeEstimate <= 2) seniority = 'Entry';
    else if (yoeEstimate <= 5) seniority = 'Mid';
    else if (yoeEstimate <= 9) seniority = 'Senior';
    else seniority = 'Lead';
  } else {
    // Check titles in resume
    if (/\b(lead|principal|architect|director|staff|head of)\b/i.test(clean)) {
      seniority = 'Lead';
    } else if (/\b(senior|sr\.|sr\b)/i.test(clean)) {
      seniority = 'Senior';
    } else if (/\b(junior|jr\.|fresher|intern|internship|graduate|entry level)\b/i.test(clean)) {
      seniority = 'Entry';
    }
  }

  // 4. Detect Primary Track
  let detectedTrack = 'Software Engineer';
  let highestTrackScore = 0;

  for (const [track, sig] of Object.entries(TRACK_SIGNATURES)) {
    let score = 0;
    // Check title mentions
    for (const titleKw of sig.titles) {
      if (clean.includes(titleKw)) {
        score += 3;
      }
    }
    // Check skill mentions
    for (const skillKw of sig.skills) {
      if (detectedSkills.has(skillKw) || detectedSkills.has(skillKw.charAt(0).toUpperCase() + skillKw.slice(1))) {
        score += 1;
      }
    }

    if (score > highestTrackScore) {
      highestTrackScore = score;
      detectedTrack = track;
    }
  }

  return {
    skills: Array.from(detectedSkills),
    seniority,
    detectedTrack,
    yoeEstimate,
    rawText: resumeText,
  };
}

/**
 * Evaluates match alignment between a Candidate Profile and a Job Opening (0 to 100%)
 */
export function scoreJobMatch(job: Job, profile: CandidateProfile): JobMatchResult {
  const candidateSkillsLower = new Set(profile.skills.map((s) => s.toLowerCase()));
  const jobSkills = job.skills || [];

  // 1. Skills Overlap Score (60% weight)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jobSkills.forEach((jobSkill) => {
    const sLower = jobSkill.toLowerCase();
    // Check direct match or alias match
    let isMatched = candidateSkillsLower.has(sLower);
    if (!isMatched) {
      // Check if skill taxonomy aliases match
      for (const [canonical, aliases] of Object.entries(SKILL_TAXONOMY)) {
        if (aliases.includes(sLower) || canonical === sLower) {
          if (aliases.some((a) => candidateSkillsLower.has(a)) || candidateSkillsLower.has(canonical)) {
            isMatched = true;
            break;
          }
        }
      }
    }

    if (isMatched) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  let skillsScore = 0;
  if (jobSkills.length > 0) {
    skillsScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  } else {
    // If job has no listed skills, match against job title & hub
    const jobText = `${job.title} ${job.hub} ${job.company}`.toLowerCase();
    let matches = 0;
    candidateSkillsLower.forEach((cs) => {
      if (jobText.includes(cs)) matches++;
    });
    skillsScore = Math.min(100, matches * 25);
  }

  // 2. Title & Domain Alignment Score (25% weight)
  let titleScore = 40; // baseline
  const jobTitleLower = job.title.toLowerCase();

  if (profile.detectedTrack && TRACK_SIGNATURES[profile.detectedTrack]) {
    const sig = TRACK_SIGNATURES[profile.detectedTrack];
    const matchesTitle = sig.titles.some((t) => jobTitleLower.includes(t));
    if (matchesTitle) {
      titleScore = 100;
    } else {
      // Partial check: does candidate have skills in the job title?
      const titleHasSkill = Array.from(candidateSkillsLower).some((cs) => jobTitleLower.includes(cs));
      if (titleHasSkill) {
        titleScore = 80;
      }
    }
  } else {
    titleScore = 60;
  }

  // 3. Seniority Level Fit (15% weight)
  let experienceScore = 70;
  const jobLevel = (job.experience_level || 'Mid').toLowerCase();
  const candLevel = profile.seniority.toLowerCase();

  if (jobLevel === candLevel) {
    experienceScore = 100;
  } else if (
    (candLevel === 'senior' && jobLevel === 'lead') ||
    (candLevel === 'lead' && jobLevel === 'senior') ||
    (candLevel === 'mid' && (jobLevel === 'senior' || jobLevel === 'entry'))
  ) {
    experienceScore = 80;
  } else {
    experienceScore = 40;
  }

  // Final Composite Score (0 - 100)
  const compositeScore = Math.min(
    100,
    Math.round(skillsScore * 0.60 + titleScore * 0.25 + experienceScore * 0.15)
  );

  return {
    jobId: job.id,
    matchScore: compositeScore,
    skillsScore,
    titleScore,
    experienceScore,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Filter and rank jobs against a candidate profile, sorted by highest matchScore
 */
export function rankJobsByResume(
  jobs: Job[],
  profile: CandidateProfile,
  minThreshold: number = 30
): MatchedJob[] {
  const results: MatchedJob[] = [];

  for (const job of jobs) {
    const matchResult = scoreJobMatch(job, profile);
    if (matchResult.matchScore >= minThreshold) {
      results.push({
        ...job,
        matchResult,
      });
    }
  }

  // Sort by highest matchScore first; tiebreak by matched skills count
  return results.sort((a, b) => {
    const scoreDiff = (b.matchResult?.matchScore || 0) - (a.matchResult?.matchScore || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (b.matchResult?.matchedSkills.length || 0) - (a.matchResult?.matchedSkills.length || 0);
  });
}
