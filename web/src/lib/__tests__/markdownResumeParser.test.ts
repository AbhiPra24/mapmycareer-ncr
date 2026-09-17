import { describe, it, expect } from 'vitest';
import { parseMarkdownToResumeData, sanitizeResumeData } from '../markdownResumeParser';
import { generateMarkdownSource, ROLE_TEMPLATES, ResumeData } from '../latexTemplates';

describe('Markdown to ResumeData Parser', () => {
  const sampleMarkdown = `
# Priya Sharma
**Lead SDET & Automation Architect**
*Bengaluru, India | priya@example.com | linkedin.com/in/priyasharma | github.com/priyasharma*

---

## Professional Summary
Accomplished SDET with 8+ years building enterprise test frameworks.

---

## Technical Skills
- **Core Languages:** Python, Java, TypeScript, SQL
- **Test Automation:** Playwright, Selenium, Cypress, TestNG
- **DevOps & Cloud:** Docker, AWS, Jenkins, GitHub Actions

---

## Professional Experience
### Lead SDET | FinScale Core Platform
*2022 -- Present | Bengaluru / Hybrid*

  - Architected unified Playwright test automation framework expanding coverage to 94%.
  - Curtailed release deployment cycle time from 4 hours to 15 minutes via CI gates.

### Senior QA Engineer | CloudScale Infra
*2019 -- 2022 | Gurugram, India*

  - Constructed automated REST API test regression suites covering 200+ endpoints.

---

## Key Projects
### Distributed Test Runner (*Go, Docker*) | [Link](https://github.com/priya/runner)
  - Engineered parallel execution scheduler slicing regression run time by 60%.

---

## Education & Certifications
- **B.Tech in Computer Science** -- Delhi Technological University (*2015 -- 2019*)
- **Certifications:** AWS Certified Developer Associate
`;

  it('should parse candidate name, title, contact information', () => {
    const data = parseMarkdownToResumeData(sampleMarkdown);

    expect(data.name).toBe('Priya Sharma');
    expect(data.title).toBe('Lead SDET & Automation Architect');
    expect(data.email).toBe('priya@example.com');
    expect(data.location).toBe('Bengaluru, India');
    expect(data.linkedin).toBe('linkedin.com/in/priyasharma');
    expect(data.github).toBe('github.com/priyasharma');
  });

  it('should parse professional summary and technical skills', () => {
    const data = parseMarkdownToResumeData(sampleMarkdown);

    expect(data.summary).toContain('Accomplished SDET with 8+ years');
    expect(data.skills.length).toBe(3);
    expect(data.skills[0].category).toBe('Core Languages');
    expect(data.skills[0].skills).toContain('Python, Java');
  });

  it('should parse experience roles, dates, locations, and bullets', () => {
    const data = parseMarkdownToResumeData(sampleMarkdown);

    expect(data.experience.length).toBe(2);
    expect(data.experience[0].role).toBe('Lead SDET');
    expect(data.experience[0].company).toBe('FinScale Core Platform');
    expect(data.experience[0].dates).toBe('2022 -- Present');
    expect(data.experience[0].bullets.length).toBe(2);
    expect(data.experience[0].bullets[0]).toContain('Playwright test automation');
  });

  it('should parse projects and education', () => {
    const data = parseMarkdownToResumeData(sampleMarkdown);

    expect(data.projects?.length).toBe(1);
    expect(data.projects?.[0].name).toBe('Distributed Test Runner');
    expect(data.projects?.[0].technologies).toBe('Go, Docker');
    expect(data.projects?.[0].url).toBe('https://github.com/priya/runner');

    expect(data.education.degree).toBe('B.Tech in Computer Science');
    expect(data.education.school).toBe('Delhi Technological University');
    expect(data.education.certifications).toBe('AWS Certified Developer Associate');
  });

  it('should roundtrip with generateMarkdownSource cleanly', () => {
    const original = ROLE_TEMPLATES.swe;
    const initialData: ResumeData = {
      name: 'Test Engineer',
      title: original.defaultTitle,
      email: 'engineer@test.com',
      location: 'Bengaluru',
      linkedin: 'linkedin.com/in/test',
      github: 'github.com/test',
      website: '',
      summary: original.defaultSummary,
      skills: original.defaultSkills,
      experience: original.defaultExperience,
      education: original.defaultEducation,
    };

    const markdown = generateMarkdownSource(initialData);
    const parsed = parseMarkdownToResumeData(markdown, initialData);

    expect(parsed.name).toBe('Test Engineer');
    expect(parsed.title).toBe(initialData.title);
    expect(parsed.experience.length).toBe(initialData.experience.length);
    expect(parsed.skills.length).toBe(initialData.skills.length);
  });

  it('should parse resilient markdown with blank lines, unicode bullets, and GPA', () => {
    const rawMd = `
# Alex Chen
Senior Backend Engineer
📍 Delhi NCR | ✉️ alex@cloudscale.io | 🔗 linkedin.com/in/alexchen

## Professional Summary
Building scalable backends.

## Work Experience
### Staff Platform Engineer at CloudScale

*2021 - Present | Hybrid*

• Architected Kafka streaming pipeline with 99.99% SLA.
• Slashed P99 latency by 40% using Redis caches.

## Education & Certifications
- **M.S. in Computer Science** -- IIIT Delhi (*2019 - 2021*) (GPA: 3.9)
- **Certifications:** CKA, AWS Solutions Architect
`;

    const data = parseMarkdownToResumeData(rawMd);
    expect(data.name).toBe('Alex Chen');
    expect(data.title).toBe('Senior Backend Engineer');
    expect(data.email).toBe('alex@cloudscale.io');
    expect(data.linkedin).toBe('linkedin.com/in/alexchen');
    expect(data.experience.length).toBe(1);
    expect(data.experience[0].role).toBe('Staff Platform Engineer');
    expect(data.experience[0].company).toBe('CloudScale');
    expect(data.experience[0].dates).toBe('2021 - Present');
    expect(data.experience[0].location).toBe('Hybrid');
    expect(data.experience[0].bullets.length).toBe(2);
    expect(data.education.degree).toBe('M.S. in Computer Science');
    expect(data.education.school).toBe('IIIT Delhi');
    expect(data.education.gpa).toBe('3.9');
  });

  it('should respect user section deletions when parsing markdown', () => {
    const markdownWithoutProjects = `
# Developer
**Fullstack**
*dev@example.com*

## Professional Summary
Summary text.

## Skills
- **Languages:** TypeScript, Node.js

## Experience
### Fullstack Dev | Startup
*2023 - 2024*
- Developed dashboard.

## Education
- **B.S.** -- University (*2020*)
`;

    const fallback: ResumeData = {
      name: 'Developer',
      title: 'Fullstack',
      email: 'dev@example.com',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: '',
      skills: [],
      experience: [],
      projects: [{ name: 'Old Project', technologies: 'React', bullets: ['Old bullet'] }],
      education: { degree: '', school: '', dates: '' },
    };

    const parsed = parseMarkdownToResumeData(markdownWithoutProjects, fallback);
    expect(parsed.projects).toEqual([]);
  });

  it('should parse full pasted resume with zero template leakage or extra stuff', () => {
    const userPastedResume = `
David Miller
Staff Security Engineer
david.miller@secops.io | San Francisco, CA | linkedin.com/in/davidmiller

SUMMARY
10+ years in cybersecurity, application security, and zero-trust architectures.

EXPERIENCE
Staff Security Engineer - CyberDefend Inc
2021 - Present | San Francisco, CA
• Designed and rolled out Zero Trust identity architecture across 5,000 employees.
• Reduced external attack surface by 70% via automated vulnerability scanners.

Security Analyst - SecureNet
2016 - 2021 | Austin, TX
• Conducted 100+ penetration tests across web applications and AWS cloud environments.

EDUCATION
B.S. in Computer Engineering - University of Texas at Austin (2012 - 2016)
`;

    const fallback: ResumeData = {
      name: 'Abhinav Prakash',
      title: 'Senior Backend Engineer',
      email: 'abhinav@example.com',
      phone: '12345',
      location: 'Noida',
      linkedin: 'linkedin.com/in/abhinav',
      github: 'github.com/abhinav',
      website: '',
      summary: 'Abhinav summary',
      skills: [{ category: 'Core Languages', skills: 'Go, Java' }],
      experience: [{ role: 'Abhinav Job', company: 'Abhinav Co', dates: '2020', location: 'Noida', bullets: ['Abhinav bullet'] }],
      projects: [{ name: 'Abhinav Project', technologies: 'Go, Kafka', bullets: ['Abhinav proj bullet'] }],
      education: { degree: 'NIT B.Tech', school: 'NIT', dates: '2016-2020', certifications: 'AWS Architect' },
    };

    const res = parseMarkdownToResumeData(userPastedResume, fallback);

    expect(res.name).toBe('David Miller');
    expect(res.title).toBe('Staff Security Engineer');
    expect(res.email).toBe('david.miller@secops.io');
    expect(res.location).toBe('San Francisco, CA');
    expect(res.linkedin).toBe('linkedin.com/in/davidmiller');
    expect(res.summary).toContain('10+ years in cybersecurity');

    // Must NOT have fallback skills or projects
    expect(res.skills).toEqual([]);
    expect(res.projects).toEqual([]);

    // Experience must strictly be David's jobs
    expect(res.experience.length).toBe(2);
    expect(res.experience[0].role).toBe('Staff Security Engineer');
    expect(res.experience[0].company).toBe('CyberDefend Inc');
    expect(res.experience[0].dates).toBe('2021 - Present');
    expect(res.experience[0].location).toBe('San Francisco, CA');
    expect(res.experience[0].bullets.length).toBe(2);
    expect(res.experience[0].bullets[0]).toContain('Zero Trust identity architecture');

    expect(res.experience[1].role).toBe('Security Analyst');
    expect(res.experience[1].company).toBe('SecureNet');
    expect(res.experience[1].dates).toBe('2016 - 2021');
    expect(res.experience[1].location).toBe('Austin, TX');

    // Education must strictly be David's degree and school
    expect(res.education.degree).toBe('B.S. in Computer Engineering');
    expect(res.education.school).toBe('University of Texas at Austin');
    expect(res.education.dates).toBe('2012 - 2016');
    expect(res.education.certifications).toBe('');
  });

  it('should cleanly parse Unicode dashes, smart role/company, and CPI in education', () => {
    const userResume = `
# Jordan Taylor
Lead QA Engineer
jordan.taylor@example.com | Pune, India

## EXPERIENCE
Acme Systems – DWH/BI ETL Automation QA
Pune, India | Mar 2015 – 2017
• Automated test case creation using Python & Selenium, reducing manual QA workload by 35%.
• Designed test strategies and automation frameworks for ETL processes, improving reporting efficiency.
• Hands-on expertise in Teradata ETL QA, ensuring data integrity and faster delivery cycles.

## EDUCATION & CERTIFICATIONS
M.Tech in VLSI & Embedded Systems – Tech University (2012–2014)
CPI: 7.1/10
Certifications: ISTQB Certified Tester -- Advanced Level Test Automation Engineer
`;

    const res = parseMarkdownToResumeData(userResume);

    expect(res.name).toBe('Jordan Taylor');
    expect(res.title).toBe('Lead QA Engineer');

    // Experience: Acme Systems identified as company, DWH/BI ETL Automation QA as role
    expect(res.experience.length).toBe(1);
    expect(res.experience[0].company).toBe('Acme Systems');
    expect(res.experience[0].role).toBe('DWH/BI ETL Automation QA');
    expect(res.experience[0].location).toBe('Pune, India');
    expect(res.experience[0].dates).toBe('Mar 2015 – 2017');
    expect(res.experience[0].bullets.length).toBe(3);

    // Education: Degree, School, Dates, CPI, Certifications
    expect(res.education.degree).toBe('M.Tech in VLSI & Embedded Systems');
    expect(res.education.school).toBe('Tech University');
    expect(res.education.dates).toBe('2012–2014');
    expect(res.education.gpa).toBe('7.1/10');
    expect(res.education.certifications).toBe('ISTQB Certified Tester -- Advanced Level Test Automation Engineer');
  });

  it('should preserve multi-line soft wrapped bullets without trimming any text', () => {
    const wrappedResume = `
# Priya Sharma
Senior Backend Engineer
priya@example.com | Bengaluru, India

## EXPERIENCE
Senior Engineer - Acme Cloud Systems
2021 - Present | Bengaluru
- Engineered and maintained backend REST APIs and authentication
services, supporting 10M+ daily requests with 99.99% uptime, by
implementing scalable microservices and proactive monitoring.
- Architected automated continuous integration workflows reducing deployment
latency from 45 minutes down to 8 minutes across 12 distributed squads.

## EDUCATION & CERTIFICATIONS
- M.Tech in Computer Science -- IIT Bombay (2018 - 2020)
- B.Tech in Information Technology -- NIT Trichy (2014 - 2018)
- Certifications: AWS Certified Solutions Architect - Professional
`;

    const res = parseMarkdownToResumeData(wrappedResume);
    expect(res.experience.length).toBe(1);
    expect(res.experience[0].bullets.length).toBe(2);
    // Line 1 should have had its continuations preserved without trimming
    expect(res.experience[0].bullets[0]).toBe(
      'Engineered and maintained backend REST APIs and authentication services, supporting 10M+ daily requests with 99.99% uptime, by implementing scalable microservices and proactive monitoring.'
    );
    expect(res.experience[0].bullets[1]).toBe(
      'Architected automated continuous integration workflows reducing deployment latency from 45 minutes down to 8 minutes across 12 distributed squads.'
    );

    // Multi-degree verification
    expect(res.education.degrees).toBeDefined();
    expect(res.education.degrees?.length).toBe(2);
    expect(res.education.degrees?.[0].degree).toBe('M.Tech in Computer Science');
    expect(res.education.degrees?.[0].school).toBe('IIT Bombay');
    expect(res.education.degrees?.[1].degree).toBe('B.Tech in Information Technology');
    expect(res.education.degrees?.[1].school).toBe('NIT Trichy');
    expect(res.education.certifications).toBe('AWS Certified Solutions Architect - Professional');
  });

  it('should parse Achievements as its own section header rather than bundling it into Education', () => {
    const resumeWithAchievements = `
# Taylor Reed
Lead QA Engineer
taylor.reed@example.com | Pune, India

## EDUCATION & CERTIFICATIONS
M.Tech in VLSI & Embedded Systems – Apex Institute of Technology (2012–2014)
CPI: 7.1/10

B.Tech in Electronics & Communication Engineering – Metro Engineering College (2008–2012)
67.3%

## Achievements

### Innovation
- Created an autonomous E2E test automation platform at TechCorp
enabling AI agents to author, review, and debug end-to-end tests across products.
- Leveraged developer toolkits
and AI assistants to design intelligent QA workflows.

### Impact
- Reduced downtime and accelerated partner onboarding
directly contributing to business growth and revenue expansion.

### Leadership
- Established an automation-first QA culture
`;

    const res = parseMarkdownToResumeData(resumeWithAchievements);

    // Education should strictly have the 2 degrees and NOT swallow achievements
    expect(res.education.degrees?.length).toBe(2);
    expect(res.education.degrees?.[0].degree).toBe('M.Tech in VLSI & Embedded Systems');
    expect(res.education.degrees?.[1].degree).toBe('B.Tech in Electronics & Communication Engineering');

    // Achievements must be parsed into its own section with categories and bullets
    expect(res.achievements).toBeDefined();
    expect(res.achievements?.length).toBe(3);
    expect(res.achievements?.[0].category).toBe('Innovation');
    expect(res.achievements?.[0].bullets.length).toBe(2);
    expect(res.achievements?.[0].bullets[0]).toContain('enabling AI agents to author');
    expect(res.achievements?.[1].category).toBe('Impact');
    expect(res.achievements?.[2].category).toBe('Leadership');
  });

  it('should parse user exact resume markdown with bulleted Achievements and subcategories', () => {
    const userMd = `
# Morgan Bailey
****  
*Staff Software SDET Engineer | morgan.bailey@example.com | https://www.linkedin.com/in/morganbailey*

---

## Professional Summary
Staff Software SDET Engineer with 10+ years of experience in **test automation strategy, automation platform development, and business-impactful QA solutions**. Proven success across **cloud infrastructure, telecom, and payment domains**, enabling faster releases, reduced costs, and stronger client partnerships. Recognized for pioneering **automation platforms** (E2E test automation platform, test case generation, anomaly detection, intelligent log analysis, **self-healing locator healer**) and aligning QA practices with business growth.

---

## Technical Skills
- **Automation Strategy:** Automated E2E test automation platform, test case creation engines, anomaly detection, log analysis
- **Developer Tooling:** Automated CLI tools, code analyzers, containerized testing environments
- **Automation Frameworks:** Regression, functional, integration, end-to-end testing, CI/CD pipeline integration
- **Programming & Tools:** Python, Selenium, SQL, Shell scripting, Pandas, Docker
- **Workflow & Platforms:** REST API testing, automated ticketing integrations, cloud-native QA environments
- **Business Impact:** Reduced downtime, accelerated partner onboarding, improved defect detection
- **Leadership & Strategy:** Team mentoring, project ownership, cross-functional collaboration

---

## Professional Experience
### Staff Software QA Engineer | CloudTech Systems
*Jan 2020 – Present | Gurugram, India*

  - Promoted to **Staff Engineer** for leading innovation in automated QA architecture and delivering measurable impact.
  - **Created an automated E2E test platform**, enabling autonomous review and execution of end-to-end tests across products.
  - Built tools for **automated test case creation** (40% manual effort reduction) and **log anomaly detection**.
  - Developed **self-healing locator healer** for Selenium automation, reducing maintenance overhead by 50%.
  - Automated **ticket-to-automation PR workflows**, cutting resolution times by 30%.
  - Designed **REST API roaming simulator** (Python), reducing partner onboarding time by weeks.
  - Enhanced regression coverage with Selenium automation, reducing defect leakage and improving release confidence.

### Software Engineer Automation (QA) | DataMatrix Inc
*Mar 2017 – Jan 2020 | Noida, India*

  - **Mentored** a team of 5 junior engineers, **improving deployment reliability by [reducing P1 incidents by 40%]**.
  - Customized **Payment solutions** ensuring secure, compliant transactions.
  - Automated QA workflows using Python, improving efficiency and reducing manual errors.

### DWH/BI ETL Automation QA | Apex Technologies
*Mar 2015 – 2017 | Pune, India*

  - **Engineered** and maintained backend REST APIs and authentication services.
  - Automated test case creation using Python & Selenium, reducing manual QA workload by 35%.
  - Designed **test strategies and automation frameworks** for ETL processes.

---

## Education & Certifications
- **M.Tech in Computer Science** -- Tech Institute of India , (*2012–2014*) (GPA: 7.1/10)
- **B.Tech in Information Technology** -- Regional Engineering College , 67.3% (*2008–2012*)
- **Achievements** --  (**)
- **Innovation** --  (**)
- **Created an automated E2E test platform at CloudTech Systems** -- enabling autonomous test authoring across products. (**)
- **Developed self-healing locator healer for automation** -- reducing maintenance overhead by 50%. (**)
- **Impact** --  (**)
- **Reduced downtime and accelerated partner onboarding** -- directly contributing to business growth. (**)
- **Leadership** --  (**)
- **Established an automation-first QA culture** -- mentoring engineers and aligning QA outcomes with strategic goals. (**)
- **Interests** --  (**)
- **Exploring AI-driven automation frameworks** --  (**)
- **Open Source Tooling** --  (**)
`;

    const res = parseMarkdownToResumeData(userMd);
    expect(res.education.degrees?.length).toBe(2);
    expect(res.achievements).toBeDefined();
    expect(res.achievements?.length).toBeGreaterThan(0);
  });

  it('should parse exact user resume with ## Achievements and ## Interests correctly', () => {
    const md = `
# Casey Adams
****  
*Staff Software SDET Engineer | casey.adams@example.com | https://www.linkedin.com/in/caseyadams*

---

## Professional Summary
Staff Software SDET Engineer with 10+ years of experience in test automation strategy...

---

## Technical Skills
- **Automation Strategy:** Automated E2E test automation platform

---

## Professional Experience
### Staff Software QA Engineer | Apex Software Solutions
*Jan 2020 – Present | Gurugram, India*

  - Created an automated E2E test automation platform.

---

## Education & Certifications
- **M.Tech in VLSI & Embedded Systems** -- Metro University (*2013 -- 2015*) (GPA: 7.1/10)
- **B.Tech in Electronics & Communication Engineering** -- National Tech Institute (*2008 -- 2012*) (GPA: 71.9%)
Certifications: ISTQB Certified Tester -- Advanced Level Test Automation Engineer

---

## Achievements
- **Innovation** -- (**) 
  - Reduced test execution cycle from 14 days to 4 hours by engineering a distributed, containerized Playwright automation framework.
  - Designed Python-based agentic workflows to automatically generate end-to-end test cases directly from PRDs and OpenAPI specs.
  - Engineered an automated HSM crypto transaction testing suite, eliminating manual testing for payment encryption.
  - Built an end-to-end framework for charging protocols, accelerating certification.
  - Integrated AI-driven locator healer, automatically updating broken selectors on DOM changes and decreasing flakiness by 80%.

- **Impact** -- (**) 
  - Increased test automation coverage across critical flows from 35% to 92%, directly cutting post-release defects by 45%.
  - Uncovered 40+ high-severity security, transaction, and concurrency flaws prior to production rollout.
  - Reduced regression suite runtime by 65% through intelligent test selection and parallel container orchestration.
  - Enabled continuous, zero-touch deployment pipelines for high-velocity releases without compromising quality.

- **Leadership** -- (**) 
  - Spearheaded QA automation roadmap across 4 multi-disciplinary engineering squads (30+ engineers).
  - Mentored 15+ QA engineers, leading weekly tech workshops on modern test patterns and Playwright.
  - Championed quality-first engineering culture, driving automated test coverage metrics directly into CI gates.
  - Partnered with Product and Solutions teams to define SLAs and acceptance criteria for high-stakes enterprise deliverables.

---

## Interests
Cricket, Reading, Open Source AI Agents
`;

    const parsed = parseMarkdownToResumeData(md);

    // 1. Education degrees must strictly contain only the 2 degrees
    expect(parsed.education.degrees?.length).toBe(2);
    expect(parsed.education.degrees?.[0].degree).toBe('M.Tech in VLSI & Embedded Systems');
    expect(parsed.education.degrees?.[0].school).toBe('Metro University');
    expect(parsed.education.degrees?.[0].dates).toBe('2013 -- 2015');
    expect(parsed.education.degrees?.[0].gpa).toBe('7.1/10');

    expect(parsed.education.degrees?.[1].degree).toBe('B.Tech in Electronics & Communication Engineering');
    expect(parsed.education.degrees?.[1].school).toBe('National Tech Institute');
    expect(parsed.education.degrees?.[1].dates).toBe('2008 -- 2012');
    expect(parsed.education.degrees?.[1].gpa).toBe('71.9%');

    // 2. Certifications
    expect(parsed.education.certifications).toBe('ISTQB Certified Tester -- Advanced Level Test Automation Engineer');

    // 3. Achievements categories and bullets
    expect(parsed.achievements).toBeDefined();
    expect(parsed.achievements?.length).toBe(4);

    const innovationGroup = parsed.achievements?.find((a) => a.category?.toLowerCase() === 'innovation');
    expect(innovationGroup).toBeDefined();
    expect(innovationGroup?.bullets.length).toBe(5);
    expect(innovationGroup?.bullets[0]).toContain('Reduced test execution cycle');

    const impactGroup = parsed.achievements?.find((a) => a.category?.toLowerCase() === 'impact');
    expect(impactGroup).toBeDefined();
    expect(impactGroup?.bullets.length).toBe(4);

    const leadershipGroup = parsed.achievements?.find((a) => a.category?.toLowerCase() === 'leadership');
    expect(leadershipGroup).toBeDefined();
    expect(leadershipGroup?.bullets.length).toBe(4);

    const interestsGroup = parsed.achievements?.find((a) => a.category?.toLowerCase() === 'interests');
    expect(interestsGroup).toBeDefined();
    expect(interestsGroup?.bullets[0]).toContain('Cricket, Reading, Open Source AI Agents');
  });

  it('should heal corrupted localStorage data via sanitizeResumeData', () => {
    const corruptedData: ResumeData = {
      name: 'Casey Adams',
      title: 'Staff Software SDET Engineer',
      email: 'casey.adams@example.com',
      location: 'Gurugram',
      linkedin: 'linkedin.com/in/caseyadams',
      summary: 'Summary...',
      skills: [],
      experience: [],
      education: {
        degree: 'M.Tech in VLSI & Embedded Systems',
        school: 'Metro University',
        dates: '2013 -- 2015',
        gpa: '7.1/10',
        certifications: 'ISTQB Certified Tester',
        degrees: [
          { degree: 'M.Tech in VLSI & Embedded Systems', school: 'Metro University', dates: '2013 -- 2015', gpa: '7.1/10' },
          { degree: 'B.Tech in Electronics & Communication Engineering', school: 'National Tech Institute', dates: '2008 -- 2012', gpa: '71.9%' },
          { degree: 'Achievements', school: '', dates: '' },
          { degree: 'Innovation', school: '', dates: '' },
          { degree: 'Reduced test execution cycle from 14 days to 4 hours by engineering a distributed framework', school: '', dates: '' },
          { degree: 'Designed Python-based agentic workflows to automatically generate end-to-end test cases', school: '', dates: '' },
          { degree: 'Impact', school: '', dates: '' },
          { degree: 'Increased test automation coverage across critical flows from 35% to 92%', school: '', dates: '' },
          { degree: 'Leadership', school: '', dates: '' },
          { degree: 'Spearheaded QA automation roadmap across 4 multi-disciplinary engineering squads', school: '', dates: '' },
          { degree: 'Interests', school: '', dates: '' },
          { degree: 'Cricket, Reading, Open Source AI Agents', school: '', dates: '' },
        ],
      },
    };

    const sanitized = sanitizeResumeData(corruptedData);

    // Only 2 degrees must remain
    expect(sanitized.education.degrees?.length).toBe(2);
    expect(sanitized.education.degrees?.[0].degree).toBe('M.Tech in VLSI & Embedded Systems');
    expect(sanitized.education.degrees?.[1].degree).toBe('B.Tech in Electronics & Communication Engineering');

    // Achievements must be populated from the leaked items
    expect(sanitized.achievements).toBeDefined();
    expect(sanitized.achievements?.length).toBeGreaterThan(0);
    const innovation = sanitized.achievements?.find((a) => a.category?.toLowerCase() === 'innovation');
    expect(innovation).toBeDefined();
    expect(innovation?.bullets.length).toBe(2);

    const interests = sanitized.achievements?.find((a) => a.category?.toLowerCase() === 'interests');
    expect(interests).toBeDefined();
    expect(interests?.bullets[0]).toBe('Cricket, Reading, Open Source AI Agents');
  });
});

