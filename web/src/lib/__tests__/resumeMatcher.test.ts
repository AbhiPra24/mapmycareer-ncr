import { describe, it, expect } from 'vitest';
import {
  extractCandidateProfile,
  scoreJobMatch,
  rankJobsByResume,
} from '../resumeMatcher';
import { Job } from '../../types/job';

describe('Resume-to-Job Matching Engine', () => {
  const sampleSdetResume = `
Priya Sharma
Lead SDET & Automation Architect
Bengaluru, India | 7+ years of experience

SUMMARY
Seasoned automation lead with 7 years of experience building E2E test suites in Python, Selenium, and Playwright.

SKILLS:
Python, Java, TypeScript, Selenium, Playwright, Cypress, TestNG, Docker, AWS, Jenkins, SQL
`;

  const sampleBackendResume = `
Alex Rivera
Senior Backend Engineer
6 years of experience in distributed systems.

SKILLS:
Go, Python, Microservices, Kubernetes, Docker, Kafka, Redis, PostgreSQL, AWS, RESTful
`;

  it('should extract candidate skills, seniority, and track accurately', () => {
    const profile = extractCandidateProfile(sampleSdetResume);

    expect(profile.detectedTrack).toBe('QA / SDET / Test Automation');
    expect(profile.seniority).toBe('Senior');
    expect(profile.yoeEstimate).toBe(7);
    expect(profile.skills).toContain('Python');
    expect(profile.skills).toContain('Selenium');
    expect(profile.skills).toContain('Playwright');
    expect(profile.skills).toContain('Docker');
    expect(profile.skills).toContain('Aws');
  });

  it('should detect backend engineer track and appropriate skills', () => {
    const profile = extractCandidateProfile(sampleBackendResume);

    expect(profile.detectedTrack).toBe('Backend Engineer');
    expect(profile.seniority).toBe('Senior');
    expect(profile.skills).toContain('Golang');
    expect(profile.skills).toContain('Kubernetes');
    expect(profile.skills).toContain('Kafka');
  });

  it('should score high for a matching job and identify matched vs missing skills', () => {
    const profile = extractCandidateProfile(sampleSdetResume);

    const sdetJob: Job = {
      id: 101,
      title: 'Senior SDET Automation Engineer',
      company: 'FinTech Corp',
      city: 'Bengaluru',
      hub: 'Bellandur ORR',
      lat: 12.93,
      lon: 77.68,
      experience_level: 'Senior',
      skills: ['Python', 'Selenium', 'Playwright', 'Docker', 'Postman'],
    };

    const match = scoreJobMatch(sdetJob, profile);

    expect(match.matchScore).toBeGreaterThanOrEqual(75);
    expect(match.matchedSkills).toContain('Python');
    expect(match.matchedSkills).toContain('Selenium');
    expect(match.matchedSkills).toContain('Playwright');
    expect(match.matchedSkills).toContain('Docker');
    expect(match.missingSkills).toContain('Postman');
  });

  it('should score lower for an unrelated job track', () => {
    const profile = extractCandidateProfile(sampleSdetResume);

    const dataScientistJob: Job = {
      id: 202,
      title: 'Principal Machine Learning Scientist',
      company: 'AI Labs',
      city: 'Hyderabad',
      hub: 'HITEC City',
      lat: 17.44,
      lon: 78.38,
      experience_level: 'Lead',
      skills: ['PyTorch', 'TensorFlow', 'Deep Learning', 'NLP', 'Data Science'],
    };

    const match = scoreJobMatch(dataScientistJob, profile);
    expect(match.matchScore).toBeLessThan(45);
  });

  it('should rank jobs by matchScore in descending order', () => {
    const profile = extractCandidateProfile(sampleBackendResume);

    const jobs: Job[] = [
      {
        id: 1,
        title: 'Frontend React Developer',
        company: 'WebCo',
        city: 'Delhi NCR',
        hub: 'Cyber City',
        lat: 28.49,
        lon: 77.09,
        experience_level: 'Junior',
        skills: ['React', 'CSS', 'HTML', 'Next.js'],
      },
      {
        id: 2,
        title: 'Senior Backend Go Microservices Engineer',
        company: 'CloudScale',
        city: 'Bengaluru',
        hub: 'Outer Ring Road',
        lat: 12.93,
        lon: 77.68,
        experience_level: 'Senior',
        skills: ['Go', 'Microservices', 'Kubernetes', 'Kafka', 'Redis'],
      },
    ];

    const ranked = rankJobsByResume(jobs, profile, 20);

    expect(ranked.length).toBeGreaterThanOrEqual(1);
    expect(ranked[0].id).toBe(2);
    expect(ranked[0].matchResult?.matchScore).toBeGreaterThan(ranked[1]?.matchResult?.matchScore || 0);
  });

  it('should detect Product Management and B2B Sales tracks accurately', () => {
    const pmResume = `
Rohan Mehta | Senior Product Manager
6 years building PRDs, roadmaps, running A/B testing and agile sprints with Jira and Mixpanel.
`;
    const pmProfile = extractCandidateProfile(pmResume);
    expect(pmProfile.detectedTrack).toBe('Product Manager / TPM');
    expect(pmProfile.skills).toContain('Product Management');
    expect(pmProfile.skills).toContain('Jira');

    const salesResume = `
Karan Kapoor | Enterprise Account Executive
5 years exceeding quota in B2B enterprise sales using Salesforce, MEDDPICC and cold prospecting.
`;
    const salesProfile = extractCandidateProfile(salesResume);
    expect(salesProfile.detectedTrack).toBe('B2B Sales & Account Executive');
    expect(salesProfile.skills).toContain('Salesforce');
    expect(salesProfile.skills).toContain('B2b Sales');
  });

  it('should accurately match a non-tech Talent Acquisition resume against live job opportunities', () => {
    const nonTechResume = `
Priya Sharma
Gurugram, Haryana | priya.sharma@example.com | +91 98765 43210
Senior Talent Acquisition Specialist with 6+ years of experience in technical recruiting, talent acquisition, and candidate sourcing.
Extensive experience managing ATS platforms including Greenhouse, Lever, and Workday.
Expertise in people operations, human resources, employee relations, and stakeholder management.
    `;

    const profile = extractCandidateProfile(nonTechResume);
    expect(profile.detectedTrack).toBe('HR & Talent Acquisition');
    expect(profile.seniority).toBe('Senior');
    expect(profile.yoeEstimate).toBe(6);
    expect(profile.skills).toContain('Recruiting');
    expect(profile.skills).toContain('Hr');

    const sampleJobs: Job[] = [
      {
        id: 101,
        title: 'Senior Technical Recruiter',
        company: 'Stripe',
        city: 'Bengaluru',
        hub: 'Outer Ring Road',
        lat: 12.92,
        lon: 77.68,
        experience_level: 'Senior',
        skills: ['Recruiting', 'Talent Acquisition', 'Sourcing', 'Greenhouse'],
      },
      {
        id: 102,
        title: 'People Operations & HR Generalist',
        company: 'Postman',
        city: 'Bengaluru',
        hub: 'Indiranagar',
        lat: 12.97,
        lon: 77.64,
        experience_level: 'Mid',
        skills: ['Human Resources', 'HRIS', 'Employee Relations'],
      },
      {
        id: 103,
        title: 'Principal Distributed Systems Engineer',
        company: 'Databricks',
        city: 'Bengaluru',
        hub: 'Whitefield',
        lat: 12.98,
        lon: 77.75,
        experience_level: 'Lead',
        skills: ['C++', 'Rust', 'Distributed Systems', 'Kafka'],
      },
    ];

    const ranked = rankJobsByResume(sampleJobs, profile);

    // Verify non-tech recruiter job ranks at the top with a high match score
    expect(ranked[0].id).toBe(101);
    expect(ranked[0].matchResult?.matchScore).toBeGreaterThanOrEqual(75);
    expect(ranked[0].matchResult?.titleScore).toBeGreaterThanOrEqual(80);

    // Verify people operations / HR job ranks second
    expect(ranked[1].id).toBe(102);
    expect(ranked[1].matchResult?.matchScore).toBeGreaterThanOrEqual(40);

    // Verify unrelated deep-tech role scores below threshold and is excluded
    expect(ranked.some((j) => j.id === 103)).toBe(false);
  });
});
