/**
 * ATS Resume Auditor Engine
 * Ported from career-forge ResumeArchitectEngine (Python)
 * Provides 100-point rubric breakdown:
 * 1. Action Verbs (25 pts)
 * 2. Metric Density & Google XYZ formula (25 pts)
 * 3. Section Structure (25 pts)
 * 4. Brevity & Word Count (25 pts)
 */

export const STRONG_ACTION_VERBS = new Set([
  // Engineering, Architecture & Code
  'architected', 'engineered', 'designed', 'implemented', 'developed', 'built',
  'scaled', 'spearheaded', 'orchestrated', 'deployed', 'refactored', 'migrated',
  'constructed', 'authored', 'automated', 'optimized', 'standardized', 'configured',
  // Leadership, Strategy & Direction
  'led', 'directed', 'mentored', 'drove', 'championed', 'supervised', 'established',
  'instituted', 'guided', 'coordinated', 'delivered', 'owned', 'steered', 'served',
  'mobilized', 'empowered', 'aligned', 'advocated',
  // Quality, Testing & Verification
  'validated', 'audited', 'verified', 'isolated', 'targeted', 'benchmarked',
  'monitored', 'uncovered', 'prevented', 'diagnosed', 'eliminated', 'transformed',
  // Business, Finance, Product & Growth
  'accelerated', 'boosted', 'maximized', 'curtailed', 'cut', 'reduced', 'expanded',
  'generated', 'streamlined', 'integrated', 'negotiated', 'achieved', 'launched',
  'prioritized', 'modeled', 'underwrote', 'structured', 'valued', 'closed',
  'recruited', 'sourced', 'retained', 'onboarded', 'captured', 'outperformed'
]);

export const WEAK_PASSIVE_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with', 'assisted in',
  'participated in', 'familiar with', 'involved in', 'handled', 'served as part of',
  'tasked with', 'contributed to helping', 'utilized to do', 'attempted to'
];

export interface BulletEvaluation {
  bullet: string;
  hasMetric: boolean;
  hasStrongVerb: boolean;
  status: 'Optimal' | 'Needs Quantification' | 'Missing Strong Verb' | 'Weak / Passive';
  suggestion: string;
}

export interface AtsAuditReport {
  totalScore: number;
  actionVerbScore: number;       // max 25
  metricDensityScore: number;    // max 25
  structureScore: number;        // max 25
  brevityScore: number;          // max 25
  wordCount: number;
  strongVerbsFound: string[];
  passivePhrasesFound: string[];
  quantifiedBulletsCount: number;
  totalBulletsCount: number;
  missingSections: string[];
  recommendations: string[];
  bulletEvaluations: BulletEvaluation[];
  roleKeywordsMatched?: string[];
  roleKeywordsMissing?: string[];
}

export const METRIC_REGEX = /(\d+[\d,.]*\s*(?:%|rps|qps|req\/s|ms|x|k|m|b|million|billion|traders|regressions|endpoints|microservices?|services?|squads?|teams?|engineers?|users?|queries|daily|monthly|annually|arr|mrr|gmv|ebitda|dau|mau|cac|ltv|bps|days?|weeks?|months?|hours?|years?)|\$\d+[\d,.]*|\d+[\d,.]*\+|\d+\+\s*[\w]+|from\s+\d+[\w\s]+\s+to\s+\d+[\w\s]+)/i;

export const SECTION_ALIASES: Record<string, string[]> = {
  Experience: ['experience', 'employment', 'work history', 'career history', 'projects', 'consulting experience', 'leadership experience'],
  Education: ['education', 'academic', 'university', 'degree', 'certifications', 'academic background'],
  Skills: ['skills', 'skill', 'technologies', 'tech stack', 'competencies', 'tools', 'core competencies', 'specialization'],
  Summary: ['summary', 'profile', 'objective', 'about', 'overview', 'executive summary', 'vision']
};

export function auditAtsScore(text: string, targetSkills: string[] = []): AtsAuditReport {
  const cleanText = text.trim();
  const textLower = cleanText.toLowerCase();

  // 1. Action Verbs Score (25 pts)
  const verbsFound: string[] = [];
  STRONG_ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(textLower)) {
      verbsFound.push(verb);
    }
  });

  const passiveFound = WEAK_PASSIVE_PHRASES.filter((phrase) => textLower.includes(phrase));

  let verbScore = 5;
  if (verbsFound.length >= 6 && passiveFound.length === 0) {
    verbScore = 25;
  } else if (verbsFound.length >= 4) {
    verbScore = Math.max(10, 20 - passiveFound.length * 5);
  } else if (verbsFound.length >= 2) {
    verbScore = Math.max(5, 15 - passiveFound.length * 5);
  }

  // 2. Metric Density & Google XYZ (25 pts)
  const lines = cleanText.split('\n');
  const rawBullets = lines
    .map((l) => l.trim().replace(/^[-•*▸–—]\s*/, ''))
    .filter((l) => l.length > 20);

  // Filter out categorical skill listings (e.g. "Languages: Python, JS")
  let bullets = rawBullets.filter((b) => {
    if (b.slice(0, 35).includes(':')) {
      const firstWord = b.split(/\s+/)[0]?.toLowerCase().replace(/[^\w]/g, '');
      if (firstWord && STRONG_ACTION_VERBS.has(firstWord)) {
        return true;
      }
      return false;
    }
    return true;
  });

  if (bullets.length === 0) {
    bullets = rawBullets;
  }

  const bulletEvaluations: BulletEvaluation[] = [];
  let quantifiedCount = 0;

  bullets.forEach((b) => {
    const hasMetric = METRIC_REGEX.test(b);
    if (hasMetric) quantifiedCount++;

    const firstWord = b.split(/\s+/)[0]?.toLowerCase().replace(/[^\w]/g, '').replace(/ed$/, '') || '';
    let hasVerb = false;
    STRONG_ACTION_VERBS.forEach((v) => {
      if (v.startsWith(firstWord) || firstWord.startsWith(v)) {
        hasVerb = true;
      }
    });

    const hasPassive = WEAK_PASSIVE_PHRASES.some((p) => b.toLowerCase().includes(p));

    let status: BulletEvaluation['status'] = 'Optimal';
    let suggestion = 'Optimal Google XYZ quantification.';

    if (hasPassive) {
      status = 'Weak / Passive';
      suggestion = 'Replace passive phrasing with a direct strong action verb.';
    } else if (!hasMetric && !hasVerb) {
      status = 'Needs Quantification';
      suggestion = 'Lead with a strong action verb and add a measurable metric (e.g. %, ms, throughput, latency, revenue).';
    } else if (!hasMetric) {
      status = 'Needs Quantification';
      suggestion = 'Enhance with Google XYZ: add quantifiable metric (e.g. % improvement, latency reduction, volume, cost savings).';
    } else if (!hasVerb) {
      status = 'Missing Strong Verb';
      suggestion = 'Lead with a strong action verb (e.g. Architected, Engineered, Spearheaded, Launched).';
    }

    bulletEvaluations.push({
      bullet: b,
      hasMetric,
      hasStrongVerb: hasVerb,
      status,
      suggestion,
    });
  });

  const totalBullets = bullets.length || 1;
  const quantRatio = quantifiedCount / totalBullets;

  let metricScore = 8;
  if (quantRatio >= 0.5) {
    metricScore = 25;
  } else if (quantRatio >= 0.3) {
    metricScore = 20;
  } else if (quantRatio >= 0.15) {
    metricScore = 15;
  }

  // 3. Structure & Sections (25 pts)
  const missingSections: string[] = [];
  Object.entries(SECTION_ALIASES).forEach(([canonicalName, aliases]) => {
    const found = aliases.some((alias) => {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      return regex.test(textLower);
    });
    if (!found) {
      missingSections.push(canonicalName);
    }
  });

  const structureScore = Math.max(5, 25 - missingSections.length * 5);

  // 4. Brevity & Word Count (25 pts)
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  let brevityScore = 12;
  if (wordCount >= 300 && wordCount <= 850) {
    brevityScore = 25;
  } else if (wordCount >= 200 && wordCount <= 1100) {
    brevityScore = 20;
  }

  const totalScore = verbScore + metricScore + structureScore + brevityScore;

  // Recommendations
  const recommendations: string[] = [];
  if (passiveFound.length > 0) {
    recommendations.push(`Eliminate passive phrases: ${passiveFound.slice(0, 3).join(', ')}`);
  }
  if (quantRatio < 0.5) {
    recommendations.push('Apply Google XYZ formula: Increase percentage of metric-driven bullets (%, $, QPS, latency, volume).');
  }
  if (missingSections.length > 0) {
    recommendations.push(`Add missing standard sections: ${missingSections.join(', ')}`);
  }
  if (wordCount < 300) {
    recommendations.push(`Increase content density (current: ${wordCount} words; recommended: 350-750 words).`);
  } else if (wordCount > 1000) {
    recommendations.push(`Condense lengthy content (current: ${wordCount} words; single-page ATS limit: ~450-800 words).`);
  }

  // Target Skills Comparison (if provided)
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  if (targetSkills.length > 0) {
    matchedKeywords = targetSkills.filter((skill) => textLower.includes(skill.toLowerCase()));
    missingKeywords = targetSkills.filter((skill) => !textLower.includes(skill.toLowerCase()));
  }

  return {
    totalScore,
    actionVerbScore: verbScore,
    metricDensityScore: metricScore,
    structureScore,
    brevityScore,
    wordCount,
    strongVerbsFound: verbsFound,
    passivePhrasesFound: passiveFound,
    quantifiedBulletsCount: quantifiedCount,
    totalBulletsCount: bullets.length,
    missingSections,
    recommendations,
    bulletEvaluations: bulletEvaluations.slice(0, 15), // Top bullets for display
    roleKeywordsMatched: matchedKeywords,
    roleKeywordsMissing: missingKeywords,
  };
}
