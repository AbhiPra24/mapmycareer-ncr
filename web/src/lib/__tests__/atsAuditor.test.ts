import { describe, it, expect } from 'vitest';
import { auditAtsScore } from '../atsAuditor';

describe('AtsAuditor Engine', () => {
  it('should score high for a strong, quantified, multi-section resume', () => {
    const strongResume = `ALEX RIVERA
Senior Software Engineer
Bengaluru, India | alex@example.com | linkedin.com/in/alex

PROFESSIONAL SUMMARY
Architected distributed systems and engineered high-throughput services with proven 99.99% uptime.

TECHNICAL SKILLS
Languages: Go, Python, TypeScript, Java, SQL
Infrastructure: Kubernetes, Docker, AWS, Kafka, Redis

PROFESSIONAL EXPERIENCE
Senior Backend Engineer -- CloudScale Solutions (2022 -- Present)
- Architected high-throughput ingestion pipeline handling 25M+ events daily with 99.99% service uptime.
- Optimized database indexing and query workflows, curtailing P99 latency from 180ms to 24ms.
- Spearheaded migration of monolithic service into 12 Go microservices, accelerating release velocity by 3x.
- Mentored team of 5 junior engineers on distributed tracing and zero-downtime deployment practices.

EDUCATION & CERTIFICATIONS
B.Tech in Computer Science -- NIT (2015 -- 2019)
`;

    const report = auditAtsScore(strongResume, ['Go', 'Kubernetes', 'Kafka']);

    expect(report.totalScore).toBeGreaterThanOrEqual(85);
    expect(report.actionVerbScore).toBe(25);
    expect(report.metricDensityScore).toBe(25);
    expect(report.structureScore).toBe(25);
    expect(report.quantifiedBulletsCount).toBeGreaterThanOrEqual(3);
    expect(report.roleKeywordsMatched).toContain('Go');
    expect(report.roleKeywordsMatched).toContain('Kubernetes');
  });

  it('should penalize weak passive phrasing and unquantified bullets', () => {
    const weakResume = `John Doe
Developer
San Francisco, CA

SUMMARY
I am a developer looking for opportunities.

EXPERIENCE
Developer -- Company
- Responsible for handling bug fixes and database maintenance.
- Helped with testing features.
- Worked on frontend UI improvements.

EDUCATION
B.S. in CS (2020)
`;

    const report = auditAtsScore(weakResume);

    expect(report.totalScore).toBeLessThan(50);
    expect(report.passivePhrasesFound.length).toBeGreaterThanOrEqual(2);
    expect(report.recommendations.some((r) => r.includes('Eliminate passive phrases'))).toBe(true);
    expect(report.metricDensityScore).toBeLessThanOrEqual(10);
  });

  it('should identify missing standard sections', () => {
    const incompleteResume = `Jane Smith
Software Engineer
- Built backend APIs using Python and FastAPI.
`;

    const report = auditAtsScore(incompleteResume);
    expect(report.missingSections).toContain('Education');
    expect(report.missingSections).toContain('Skills');
    expect(report.structureScore).toBeLessThan(25);
  });

  it('should accurately detect target role keywords and identify gaps', () => {
    const resume = `Alex Rivera
Developer
SKILLS: React, TypeScript, Next.js, Node.js
EXPERIENCE: Developed frontend web applications using React and Tailwind CSS.
EDUCATION: B.Tech (2020)
`;

    const targetSkills = ['React', 'TypeScript', 'Docker', 'Kubernetes'];
    const report = auditAtsScore(resume, targetSkills);

    expect(report.roleKeywordsMatched).toEqual(['React', 'TypeScript']);
    expect(report.roleKeywordsMissing).toEqual(['Docker', 'Kubernetes']);
  });
});
