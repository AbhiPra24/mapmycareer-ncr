import { describe, it, expect } from 'vitest';
import {
  ROLE_TEMPLATES,
  ResumeData,
  escapeLatex,
  generateLatexSource,
  generateMarkdownSource,
  generatePlainText,
} from '../latexTemplates';

describe('LatexTemplates & Resume Generator Engine', () => {
  const sampleData: ResumeData = {
    name: 'Jane Doe & Associates',
    title: 'Lead Cloud & Systems Engineer (100% Remote)',
    email: 'jane@example.com',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    website: 'https://janedoe.dev',
    summary: 'Cloud Architect with $5M budget optimization track record.',
    skills: [
      { category: 'Cloud & Infrastructure', skills: 'AWS, Kubernetes, Terraform #1' },
      { category: 'Languages', skills: 'Go, Python, SQL' },
    ],
    experience: [
      {
        role: 'Staff Engineer',
        company: 'Cloud Corp',
        dates: '2022 -- Present',
        location: 'Bengaluru',
        bullets: ['Architected multi-region failover saving 45% costs.'],
      },
    ],
    projects: [
      {
        name: 'Open Source Mesh',
        technologies: 'Rust & Go',
        url: 'https://github.com/mesh',
        bullets: ['Built high-speed proxy.'],
      },
    ],
    education: {
      degree: 'B.Tech in Computer Science',
      school: 'IIT Delhi',
      dates: '2016 -- 2020',
      gpa: '9.4/10',
      certifications: 'CKA & AWS Architect',
    },
  };

  it('should safely escape LaTeX special control characters', () => {
    expect(escapeLatex('Jane Doe & Associates')).toBe('Jane Doe \\& Associates');
    expect(escapeLatex('Saved 50% on $100K bill')).toBe('Saved 50\\% on \\$100K bill');
    expect(escapeLatex('Issue #42_final')).toBe('Issue \\#42\\_final');
  });

  it('should generate valid LaTeX document structure with all sections', () => {
    const latex = generateLatexSource(sampleData);

    expect(latex).toContain('\\documentclass[10pt,letterpaper]{article}');
    expect(latex).toContain('Jane Doe \\& Associates');
    expect(latex).toContain('Lead Cloud \\& Systems Engineer (100\\% Remote)');
    expect(latex).toContain('\\section*{\\large\\bfseries\\color{primary}\\uppercase{Professional Summary}}');
    expect(latex).toContain('\\section*{\\large\\bfseries\\color{primary}\\uppercase{Technical Skills}}');
    expect(latex).toContain('\\section*{\\large\\bfseries\\color{primary}\\uppercase{Professional Experience}}');
    expect(latex).toContain('\\section*{\\large\\bfseries\\color{primary}\\uppercase{Key Projects}}');
    expect(latex).toContain('\\section*{\\large\\bfseries\\color{primary}\\uppercase{Education \\& Certifications}}');
    expect(latex).toContain('\\end{document}');
  });

  it('should generate Markdown source format', () => {
    const md = generateMarkdownSource(sampleData);

    expect(md).toContain('# Jane Doe & Associates');
    expect(md).toContain('## Professional Summary');
    expect(md).toContain('## Technical Skills');
    expect(md).toContain('## Professional Experience');
    expect(md).toContain('## Key Projects');
  });

  it('should generate Plain Text format for ATS parsers', () => {
    const txt = generatePlainText(sampleData);

    expect(txt).toContain('JANE DOE & ASSOCIATES');
    expect(txt).toContain('PROFESSIONAL SUMMARY');
    expect(txt).toContain('TECHNICAL SKILLS');
    expect(txt).toContain('PROFESSIONAL EXPERIENCE');
  });

  it('should have standard templates configured for all major engineering roles', () => {
    const roles = ['swe', 'fullstack', 'data', 'aiml', 'devops', 'lead', 'sdet'];
    roles.forEach((r) => {
      expect(ROLE_TEMPLATES[r]).toBeDefined();
      expect(ROLE_TEMPLATES[r].defaultTitle).toBeTruthy();
      expect(ROLE_TEMPLATES[r].defaultSkills.length).toBeGreaterThan(0);
      expect(ROLE_TEMPLATES[r].defaultExperience.length).toBeGreaterThan(0);
    });
  });
});
