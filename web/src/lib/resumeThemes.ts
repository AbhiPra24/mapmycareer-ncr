/**
 * Resume Themes & Custom Styling Engine
 * Provides 4 distinct ATS-compliant themes + custom CSS injection & print stylesheets.
 */

export interface ResumeTheme {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  primaryColor: string;
  headingColor: string;
  containerClass: string;
  defaultCss: string;
}

export const RESUME_THEMES: Record<string, ResumeTheme> = {
  modern: {
    id: 'modern',
    name: 'Modern Minimalist (Default)',
    description: 'Crisp sans-serif, emerald/teal accents, balanced whitespace, and modern dividers.',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    primaryColor: '#059669',
    headingColor: '#111827',
    containerClass: 'theme-modern',
    defaultCss: `/* Modern Minimalist Theme Custom Overrides */
.resume-preview {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: #1f2937;
}

.resume-header h1 {
  color: #111827;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.resume-header .resume-title {
  color: #059669;
  font-weight: 700;
}

.resume-section-title {
  color: #111827;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1.5px solid #e5e7eb;
  padding-bottom: 2px;
  margin-top: 14px;
  margin-bottom: 6px;
}

.resume-bullet {
  color: #374151;
  font-size: 11px;
  margin-bottom: 3px;
}
`,
  },

  executive: {
    id: 'executive',
    name: 'Classic Executive',
    description: 'Refined serif typography, classic navy/slate accents, formal horizontal rules.',
    fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
    primaryColor: '#1e3a8a',
    headingColor: '#0f172a',
    containerClass: 'theme-executive',
    defaultCss: `/* Classic Executive Theme Custom Overrides */
.resume-preview {
  font-family: Georgia, Cambria, "Times New Roman", serif;
  line-height: 1.55;
  color: #1e293b;
}

.resume-header h1 {
  color: #0f172a;
  font-size: 24px;
  font-weight: 700;
  font-family: Georgia, serif;
}

.resume-header .resume-title {
  color: #1e3a8a;
  font-weight: 600;
  font-style: italic;
}

.resume-section-title {
  color: #1e3a8a;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 2px solid #1e3a8a;
  padding-bottom: 2px;
  margin-top: 16px;
  margin-bottom: 6px;
}

.resume-bullet {
  color: #334155;
  font-size: 11.5px;
  margin-bottom: 3.5px;
}
`,
  },

  tech: {
    id: 'tech',
    name: 'Tech / Engineering Clean',
    description: 'High-contrast geometric styling, monospace skill tags, vibrant indigo accents.',
    fontFamily: '"SF Pro Text", "Segoe UI", Inter, sans-serif',
    primaryColor: '#4f46e5',
    headingColor: '#0f172a',
    containerClass: 'theme-tech',
    defaultCss: `/* Tech Clean Theme Custom Overrides */
.resume-preview {
  font-family: "Segoe UI", Inter, -apple-system, sans-serif;
  line-height: 1.45;
  color: #18181b;
}

.resume-header h1 {
  color: #09090b;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.resume-header .resume-title {
  color: #4f46e5;
  font-weight: 700;
}

.resume-section-title {
  color: #4f46e5;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #818cf8;
  padding-bottom: 2px;
  margin-top: 14px;
  margin-bottom: 6px;
}

.resume-skill-badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10.5px;
}

.resume-bullet {
  color: #27272a;
  font-size: 11px;
  margin-bottom: 3px;
}
`,
  },

  compact: {
    id: 'compact',
    name: 'Compact ATS Harvard',
    description: 'Monochrome black & white, high-density layout, optimized for 1-page ATS parsers.',
    fontFamily: 'Arial, Helvetica, sans-serif',
    primaryColor: '#000000',
    headingColor: '#000000',
    containerClass: 'theme-compact',
    defaultCss: `/* Compact ATS Harvard Theme Custom Overrides */
.resume-preview {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.35;
  color: #000000;
  font-size: 10.5px;
}

.resume-header h1 {
  color: #000000;
  font-size: 20px;
  font-weight: 800;
}

.resume-header .resume-title {
  color: #333333;
  font-weight: bold;
}

.resume-section-title {
  color: #000000;
  font-size: 10.5px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #000000;
  padding-bottom: 1px;
  margin-top: 10px;
  margin-bottom: 4px;
}

.resume-bullet {
  color: #000000;
  font-size: 10px;
  margin-bottom: 2px;
}
`,
  },
};

export const DEFAULT_THEME_ID = 'modern';

export type FontCategory = 'all' | 'sans' | 'serif' | 'mono';

export interface ResumeTypeface {
  id: string;
  name: string;
  category: 'sans' | 'serif' | 'mono';
  description: string;
  fontFamily: string;
  googleFont?: string;
}

export const RESUME_TYPEFACES: ResumeTypeface[] = [
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'sans',
    description: 'Familiar README look',
    fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
    googleFont: 'Roboto:wght@400;500;700;900',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans',
    description: 'Sans-serif for business docs',
    fontFamily: '"Montserrat", system-ui, -apple-system, sans-serif',
    googleFont: 'Montserrat:wght@400;500;600;700;800',
  },
  {
    id: 'lato',
    name: 'Lato',
    category: 'sans',
    description: 'Friendly neutral sans',
    fontFamily: '"Lato", system-ui, -apple-system, sans-serif',
    googleFont: 'Lato:wght@400;700;900',
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans',
    description: 'Modern clean UI sans',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    googleFont: 'Inter:wght@400;500;600;700;800',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'sans',
    description: 'Legible open geometry',
    fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
    googleFont: 'Open+Sans:wght@400;600;700;800',
  },
  {
    id: 'libre-baskerville',
    name: 'Libre Baskerville',
    category: 'serif',
    description: 'Serif for papers & notes',
    fontFamily: '"Libre Baskerville", Georgia, Cambria, serif',
    googleFont: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'serif',
    description: 'Highly readable editorial serif',
    fontFamily: '"Merriweather", Georgia, serif',
    googleFont: 'Merriweather:wght@300;400;700;900',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'serif',
    description: 'High-contrast classic serif',
    fontFamily: '"Playfair Display", Georgia, serif',
    googleFont: 'Playfair+Display:wght@400;600;700;900',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'mono',
    description: 'Developer favorite monospace',
    fontFamily: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
    googleFont: 'JetBrains+Mono:wght@400;500;700',
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'mono',
    description: 'Crisp technical monospaced',
    fontFamily: '"Fira Code", monospace',
    googleFont: 'Fira+Code:wght@400;500;700',
  },
];

export const DEFAULT_TYPEFACE_ID = 'roboto';

export interface ResumeColorPalette {
  id: string;
  name: string;
  primary: string;
  heading: string;
  accent: string;
  text: string;
  link: string;
}

export const RESUME_COLOR_PALETTES: ResumeColorPalette[] = [
  {
    id: 'modern-teal',
    name: 'Teal & Emerald',
    primary: '#0d9488',
    heading: '#0f766e',
    accent: '#059669',
    text: '#1f2937',
    link: '#0d9488',
  },
  {
    id: 'classic-navy',
    name: 'Navy & Blue',
    primary: '#1e40af',
    heading: '#1e3a8a',
    accent: '#2563eb',
    text: '#1e293b',
    link: '#1d4ed8',
  },
  {
    id: 'charcoal-slate',
    name: 'Executive Charcoal',
    primary: '#334155',
    heading: '#0f172a',
    accent: '#475569',
    text: '#1e293b',
    link: '#2563eb',
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson & Rose',
    primary: '#be123c',
    heading: '#9f1239',
    accent: '#e11d48',
    text: '#1c1917',
    link: '#be123c',
  },
  {
    id: 'royal-purple',
    name: 'Royal Violet',
    primary: '#6d28d9',
    heading: '#581c87',
    accent: '#7c3aed',
    text: '#1e1b4b',
    link: '#7c3aed',
  },
  {
    id: 'monochrome',
    name: 'Pure Monochrome',
    primary: '#18181b',
    heading: '#09090b',
    accent: '#52525b',
    text: '#18181b',
    link: '#09090b',
  },
];

export const DEFAULT_COLOR_PALETTE_ID = 'modern-teal';

/**
 * Compile theme and custom CSS into a unified stylesheet string
 */
export function compileResumeStylesheet(
  themeId: string = DEFAULT_THEME_ID,
  customCss: string = '',
  typefaceId: string = DEFAULT_TYPEFACE_ID,
  paletteId: string = DEFAULT_COLOR_PALETTE_ID
): string {
  const theme = RESUME_THEMES[themeId] || RESUME_THEMES[DEFAULT_THEME_ID];
  const typeface = RESUME_TYPEFACES.find((t) => t.id === typefaceId) || RESUME_TYPEFACES[0];
  
  // Support either predefined palette ID or raw hex color like #1e40af
  let palette = RESUME_COLOR_PALETTES.find((p) => p.id === paletteId);
  if (!palette && paletteId && paletteId.startsWith('#')) {
    palette = {
      id: 'custom',
      name: 'Custom',
      primary: paletteId,
      heading: paletteId,
      accent: paletteId,
      text: '#1f2937',
      link: paletteId,
    };
  }
  if (!palette) {
    palette = RESUME_COLOR_PALETTES[0];
  }

  const fontImport = typeface.googleFont
    ? `@import url('https://fonts.googleapis.com/css2?family=${typeface.googleFont}&display=swap');`
    : '';

  return `
/* Font Import */
${fontImport}

/* Layout Custom Properties */
:root {
  --resume-font: ${typeface.fontFamily};
  --resume-primary: ${palette.primary};
  --resume-heading: ${palette.heading};
  --resume-accent: ${palette.accent};
  --resume-text: ${palette.text};
  --resume-link: ${palette.link};
}

/* Base Printable Structure */
@page {
  size: A4;
  margin: 12mm 14mm 12mm 14mm;
}

@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: var(--resume-font) !important;
  }
  .no-print {
    display: none !important;
  }
  .resume-printable-area {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
}

/* Theme Default Rules */
${theme.defaultCss}

/* User Custom CSS Overrides */
${customCss}

/* Active Palette & Typography Application (Applied with top specificity to guarantee color responsiveness) */
.resume-preview {
  font-family: var(--resume-font) !important;
  color: var(--resume-text) !important;
  box-sizing: border-box;
  text-align: left !important;
}

.resume-preview h1,
.resume-preview .resume-header h1 {
  color: var(--resume-heading) !important;
}

.resume-preview .resume-title,
.resume-preview .resume-header .resume-title {
  color: var(--resume-primary) !important;
}

.resume-preview h2,
.resume-preview .resume-section-title {
  color: var(--resume-primary) !important;
  border-bottom: 2px solid var(--resume-primary) !important;
  padding-bottom: 2px !important;
}

.resume-preview .resume-section-divider {
  background-color: var(--resume-primary) !important;
  height: 2px !important;
}

.resume-preview h3,
.resume-preview .resume-subsection-title {
  color: var(--resume-accent) !important;
}

.resume-preview strong.resume-skill-badge,
.resume-preview .resume-skill-badge {
  color: var(--resume-primary) !important;
}

.resume-preview a,
.resume-preview .resume-link {
  color: var(--resume-link) !important;
}

.resume-preview hr {
  border: none !important;
  border-top: 1.5px solid var(--resume-primary) !important;
  opacity: 0.5 !important;
}

/* Layout & Alignment Primitives (Print & Screen Safe) */
.resume-preview *, .resume-preview *::before, .resume-preview *::after {
  box-sizing: border-box;
}

.resume-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: baseline !important;
  width: 100% !important;
  margin-bottom: 2px !important;
  text-align: left !important;
}

.resume-row-left {
  flex: 1 1 auto !important;
  text-align: left !important;
  min-width: 0 !important;
}

.resume-row-right {
  flex: 0 0 auto !important;
  text-align: right !important;
  margin-left: 16px !important;
  white-space: nowrap !important;
}

.resume-bullet-list {
  list-style-type: disc !important;
  padding-left: 20px !important;
  margin-top: 4px !important;
  margin-bottom: 6px !important;
  text-align: left !important;
}

.resume-bullet {
  display: list-item !important;
  list-style-type: disc !important;
  text-align: left !important;
  color: var(--resume-text) !important;
}
  `.trim();
}
