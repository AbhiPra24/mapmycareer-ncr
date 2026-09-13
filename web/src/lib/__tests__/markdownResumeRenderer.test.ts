import { describe, it, expect } from 'vitest';
import { renderMarkdownToResumeHtml, formatInlineMarkdown } from '../markdownResumeRenderer';

describe('Universal Markdown Resume Renderer', () => {
  it('should format inline markdown including bold, italics, links, and code', () => {
    const raw = '**Bold text** and *italic text* with [LinkedIn](https://linkedin.com/in/test) and `Python`';
    const formatted = formatInlineMarkdown(raw);
    expect(formatted).toContain('<strong>Bold text</strong>');
    expect(formatted).toContain('<em>italic text</em>');
    expect(formatted).toContain('<a href="https://linkedin.com/in/test"');
    expect(formatted).toContain('<code');
  });

  it('should render candidate resume with custom headers like Core Competencies without trimming', () => {
    const md = `
# Jane Doe
**Principal Software QA Engineer | Test Automation Architect**
jane.doe@example.com | +1-555-0199 | [LinkedIn](https://linkedin.com/in/janedoe)

---

## Professional Summary
Principal Software QA Engineer with 10+ years of experience in test automation strategy, distributed testing, and business-impactful QA solutions.

---

## Core Competencies
- **AI in QA Automation:** Autonomous E2E test automation platform, test case generation, anomaly detection.
- **Developer Tooling:** Automated CLI tooling, code analysis engines, and agentic workflows.
- **Automation Frameworks:** Regression, functional, integration, self-healing scripts.
- **Programming & Tools:** Python, Selenium, SQL, Shell scripting, Docker.
- **Workflow & Platforms:** REST API testing, automated CI/CD pipelines, cloud test environments.
- **Business Impact:** Reduced downtime, accelerated partner onboarding, release velocity.
- **Leadership & Strategy:** Team mentoring, project ownership, quality-first culture.

---

## Professional Experience
### Principal QA Engineer | Acme Corp
*2021 - Present | San Francisco, CA*
- Created an autonomous E2E test automation platform enabling test authoring.
- Reduced external defect leakage by 45% via automated continuous regression.

---

## Achievements
### Innovation
- Developed AI-based locator healer for Selenium automation reducing maintenance overhead by 50%.
`;

    const html = renderMarkdownToResumeHtml(md);

    // Document header
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Principal Software QA Engineer | Test Automation Architect');
    expect(html).toContain('jane.doe@example.com');

    // Section headers - custom headers MUST be rendered as uppercase section titles
    expect(html).toContain('Professional Summary');
    expect(html).toContain('Core Competencies');
    expect(html).toContain('Professional Experience');
    expect(html).toContain('Achievements');

    // Bullets under Core Competencies must all be present
    expect(html).toContain('AI in QA Automation');
    expect(html).toContain('Developer Tooling');
    expect(html).toContain('Automation Frameworks');
    expect(html).toContain('Python, Selenium, SQL');
    expect(html).toContain('REST API testing');
    expect(html).toContain('Reduced downtime');
    expect(html).toContain('Team mentoring');

    // Experience subsections and bullets
    expect(html).toContain('Principal QA Engineer');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('Created an autonomous E2E test automation platform');

    // Achievements
    expect(html).toContain('Innovation');
    expect(html).toContain('Developed AI-based locator healer');
  });

  it('should close resume-header before sections and align body text to left even with **** separator', () => {
    const md = `
# Alex Rivera
****
*Staff Software SDET Engineer | alex.rivera@example.com | https://linkedin.com/in/alexrivera*

---

## Professional Summary
Staff Software SDET Engineer with 10+ years of experience in test automation strategy.

---

## Technical Skills
- **AI in QA Automation:** Automated E2E platform
`;

    const html = renderMarkdownToResumeHtml(md);

    // resume-header must be closed before the first section
    const headerOpenIdx = html.indexOf('<div class="resume-header');
    const headerCloseIdx = html.indexOf('</div>', headerOpenIdx);

    expect(headerOpenIdx).toBeGreaterThanOrEqual(0);
    expect(headerCloseIdx).toBeGreaterThan(headerOpenIdx);
    
    // Sections and paragraphs must be left-aligned
    expect(html).toContain('class="resume-section mt-4 text-left"');
    expect(html).toContain('class="text-xs leading-relaxed text-zinc-700 mb-1.5 text-left"');
    expect(html).toContain('class="resume-bullet-list list-disc pl-4 space-y-0.5 text-[11px] text-zinc-700 mt-1 mb-2 text-left"');
  });

  it('should render bulleted Achievements and Interests as major section headers and subcategories as H3 subheaders', () => {
    const md = `
## Education & Certifications
- **M.S. in Computer Science** -- Tech University , (*2012–2014*) (GPA: 3.9/4.0)
- **B.S. in Software Engineering** -- State College , 3.8/4.0 (*2008–2012*)
- **Achievements** --  (**)
- **Innovation** --  (**)
- **Created an autonomous E2E test automation platform at Acme Corp** -- enabling autonomous review and debug of tests across products. (**)
- **Impact** --  (**)
- **Reduced downtime and accelerated partner onboarding** -- directly contributing to business growth and revenue expansion. (**)
- **Leadership** --  (**)
- **Established an automation-first QA culture** -- mentoring engineers and aligning QA outcomes with strategic business goals. (**)
- **Interests** --  (**)
- **Exploring AI-driven automation frameworks** --  (**)
`;

    const html = renderMarkdownToResumeHtml(md);

    // Achievements must be rendered as a major section header
    expect(html).toContain('ACHIEVEMENTS');
    expect(html).toMatch(/<h2[^>]*>\s*ACHIEVEMENTS\s*<\/h2>/i);

    // Subcategories Innovation, Impact, Leadership must be rendered as subheaders
    expect(html).toMatch(/<h3[^>]*>\s*Innovation\s*<\/h3>/i);
    expect(html).toMatch(/<h3[^>]*>\s*Impact\s*<\/h3>/i);
    expect(html).toMatch(/<h3[^>]*>\s*Leadership\s*<\/h3>/i);

    // Interests must be rendered as a major section header
    expect(html).toContain('INTERESTS');
    expect(html).toMatch(/<h2[^>]*>\s*INTERESTS\s*<\/h2>/i);

    // Trailing (**) artifacts should not appear in the rendered HTML bullets
    expect(html).not.toContain('(**)');
    expect(html).toContain('Created an autonomous E2E test automation platform at Acme Corp');
  });

  it('should render standard ## Achievements and ## Interests markdown with category subheaders and bullets', () => {
    const md = `
## Achievements
- **Innovation** -- (**) 
  - Reduced test execution cycle from 14 days to 4 hours by engineering a distributed framework.
  - Designed Python-based agentic workflows to automatically generate end-to-end test cases.

- **Impact** -- (**) 
  - Increased test automation coverage across critical flows from 35% to 92%.

- **Leadership** -- (**) 
  - Spearheaded QA automation roadmap across 4 multi-disciplinary engineering squads.

---

## Interests
Cricket, Reading, Open Source AI Agents
`;

    const html = renderMarkdownToResumeHtml(md);

    expect(html).toMatch(/<h2[^>]*>\s*Achievements\s*<\/h2>/i);
    expect(html).toMatch(/<h3[^>]*>\s*Innovation\s*<\/h3>/i);
    expect(html).toMatch(/<h3[^>]*>\s*Impact\s*<\/h3>/i);
    expect(html).toMatch(/<h3[^>]*>\s*Leadership\s*<\/h3>/i);
    expect(html).toMatch(/<h2[^>]*>\s*Interests\s*<\/h2>/i);
    expect(html).toContain('Reduced test execution cycle');
    expect(html).toContain('Cricket, Reading, Open Source AI Agents');
    expect(html).not.toContain('(**)');
  });

  it('should not duplicate ACHIEVEMENTS header when bulleted line repeats Achievements', () => {
    const md = `
## Education & Certifications
- **M.S. in Computer Science** -- Tech University (*2012–2014*) (GPA: 3.9/4.0)
- **B.S. in Software Engineering** -- State College (*2008–2012*)
- **Achievements** --  (**)
- **Innovation** --  (**)
- Created an autonomous E2E test automation platform.
`;

    const html = renderMarkdownToResumeHtml(md);
    const matches = html.match(/ACHIEVEMENTS/gi) || [];
    expect(matches.length).toBe(1);
  });

  describe('Security & XSS Neutralization', () => {
    it('should strictly neutralize img tag injection and onerror event handlers', () => {
      const maliciousPayload = '"><img src=x onerror=alert(1)>';
      const formatted = formatInlineMarkdown(maliciousPayload);
      expect(formatted).not.toContain('<img');
      expect(formatted).not.toContain('onerror=');
      expect(formatted).toContain('&lt;img');

      const renderedHtml = renderMarkdownToResumeHtml(`
# Jane Doe
${maliciousPayload}
## Experience
- ${maliciousPayload}
      `);
      expect(renderedHtml).not.toContain('<img');
      expect(renderedHtml).not.toContain('onerror=alert');
    });

    it('should neutralize javascript: and data: pseudo-protocols in links', () => {
      const jsLink = '[Click Me](javascript:alert(1))';
      const dataLink = '[Click Me](data:text/html,<script>alert(1)</script>)';
      const vbLink = '[Click Me](vbscript:msgbox(1))';
      const safeLink = '[LinkedIn](https://linkedin.com/in/test)';

      const formattedJs = formatInlineMarkdown(jsLink);
      expect(formattedJs).not.toContain('href="javascript:');
      expect(formattedJs).not.toContain('javascript:alert(1)');

      const formattedData = formatInlineMarkdown(dataLink);
      expect(formattedData).not.toContain('href="data:');

      const formattedVb = formatInlineMarkdown(vbLink);
      expect(formattedVb).not.toContain('href="vbscript:');

      const formattedSafe = formatInlineMarkdown(safeLink);
      expect(formattedSafe).toContain('href="https://linkedin.com/in/test"');
      expect(formattedSafe).toContain('rel="noopener noreferrer"');
    });

    it('should escape raw script tags and dangerous HTML in resume content', () => {
      const mdWithScript = `
# Attacker <script>alert("hacked")</script>
## Skills
- <script>document.location="http://evil.com"</script>
- Normal Skill
`;
      const html = renderMarkdownToResumeHtml(mdWithScript);
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('</script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should neutralize malicious payload inside link labels and URLs', () => {
      const payload = '[<script>alert(1)</script>](https://example.com)';
      const formatted = formatInlineMarkdown(payload);
      expect(formatted).not.toContain('<script>');
      expect(formatted).toContain('&lt;script&gt;');
      expect(formatted).toContain('href="https://example.com"');
    });
  });
});
