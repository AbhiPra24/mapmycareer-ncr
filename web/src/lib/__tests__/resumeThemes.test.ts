import { describe, it, expect } from 'vitest';
import { RESUME_THEMES, compileResumeStylesheet, DEFAULT_THEME_ID } from '../resumeThemes';

describe('Resume Themes Engine', () => {
  it('should include default theme and valid theme options', () => {
    expect(RESUME_THEMES).toHaveProperty(DEFAULT_THEME_ID);
    expect(RESUME_THEMES.modern.name).toContain('Modern Minimalist');
    expect(RESUME_THEMES.executive.name).toContain('Classic Executive');
    expect(RESUME_THEMES.tech.name).toContain('Tech');
    expect(RESUME_THEMES.compact.name).toContain('Compact ATS');
  });

  it('should compile stylesheet with print media queries and theme rules', () => {
    const css = compileResumeStylesheet('modern');
    expect(css).toContain('@page {');
    expect(css).toContain('size: A4');
    expect(css).toContain('@media print');
    expect(css).toContain('.resume-preview');
    expect(css).toContain('.resume-header h1');
    expect(css).toContain('.resume-section-title');
  });

  it('should append user custom CSS to compiled stylesheet', () => {
    const custom = '.resume-header h1 { color: #dc2626 !important; }';
    const css = compileResumeStylesheet('executive', custom);

    expect(css).toContain(custom);
    expect(css).toContain('Classic Executive');
  });

  it('should gracefully fallback to default theme if invalid theme id is provided', () => {
    const css = compileResumeStylesheet('non_existent_theme');
    expect(css).toContain('Modern Minimalist');
  });

  describe('Custom CSS Sanitization & Safety', () => {
    it('should neutralize closing </style> and script injection attempts in custom CSS', () => {
      const maliciousCss = '</style><script>alert("xss")</script>';
      const compiled = compileResumeStylesheet('modern', maliciousCss);

      expect(compiled).not.toContain('</style>');
      expect(compiled).not.toContain('<script>');
      expect(compiled).not.toContain('</script>');
    });

    it('should neutralize javascript: URLs and expressions in custom CSS', () => {
      const maliciousCss = `
        .resume-preview {
          background-image: url(javascript:alert(1));
          width: expression(alert('ie_xss'));
        }
      `;
      const compiled = compileResumeStylesheet('modern', maliciousCss);

      expect(compiled).not.toContain('javascript:');
      expect(compiled).not.toContain('expression(');
    });

    it('should neutralize external @import rules in custom CSS', () => {
      const importCss = '@import url("https://evil.com/malicious.css");';
      const compiled = compileResumeStylesheet('modern', importCss);

      expect(compiled).not.toContain('@import url("https://evil.com');
      expect(compiled).toContain('/* @import disallowed */');
    });
  });
});
