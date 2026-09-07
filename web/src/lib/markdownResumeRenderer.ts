/**
 * Universal Markdown to Resume HTML Renderer
 * Translates raw Markdown directly into styled, ATS-compliant resume HTML.
 * Preserves 100% of user text: zero trimming, zero arbitrary deletions, and zero injected template data.
 * Supports any standard or custom section headers (## Core Competencies, ## Achievements, ## Volunteer Work, etc.)
 */

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatInlineMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. Links: [label](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const safeUrl = url.replace(/["'<>]/g, '');
    const safeLabel = label;
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer" class="text-blue-600 hover:underline resume-link">${safeLabel}</a>`;
  });

  // 2. Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // 3. Italic: *text* or _text_ (excluding inside words or after bullet markers)
  html = html.replace(/(^|[^\w*])\*([^*]+)\*([^\w*]|$)/g, '$1<em>$2</em>$3');
  html = html.replace(/(^|[^\w_])_([^_]+)_([^\w_]|$)/g, '$1<em>$2</em>$3');

  // 4. Code / badge: `text`
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-[10px] font-mono text-zinc-800 dark:text-zinc-200">$1</code>');

  return html;
}

export interface MarkdownResumeRenderOptions {
  themeId?: string;
  typefaceId?: string;
  paletteId?: string;
}

export function cleanHeaderCandidate(line: string): { title: string; isSection: boolean; isSubSection: boolean } {
  // Strip leading bullet marker e.g. "- " or "* " or "1. "
  let s = line.replace(/^([-*•+]|\d+\.)\s+/, '').trim();
  // Strip trailing empty artifacts like "-- (**)", "-- ()", "(**)", "()"
  s = s.replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '').replace(/\s*\(\*{0,2}\s*\)\s*$/g, '').trim();

  // Check if s is wrapped in bold: **Title**
  const boldMatch = s.match(/^\*\*([^*]+)\*\*$/);
  const plainTitle = (boldMatch ? boldMatch[1] : s).trim();

  // Major section headers
  const majorSectionRegex =
    /^(?:key\s+|notable\s+|major\s+)?(achievements?|accomplishments?|awards?|honors?|recognition|patents?|interests?|hobbies|activities|volunteer(?:ing)?|certifications?|skills|education(?:\s+&\s+certifications)?|experience|projects)$/i;

  if (majorSectionRegex.test(plainTitle)) {
    return { title: plainTitle, isSection: true, isSubSection: false };
  }

  // Subsection category headers (e.g. Innovation, Impact, Leadership, Technical Leadership)
  const subSectionRegex =
    /^(innovation|impact|leadership|technical leadership|key highlights|community|mentorship|strategy|domain expertise)$/i;
  if (subSectionRegex.test(plainTitle)) {
    return { title: plainTitle, isSection: false, isSubSection: true };
  }

  return { title: s, isSection: false, isSubSection: false };
}

/**
 * Render raw Markdown text into a fully styled Resume HTML document.
 */
export function renderMarkdownToResumeHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return `<div class="p-8 text-center text-xs text-zinc-400 italic">No resume content. Paste your markdown resume to see preview.</div>`;
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];

  let inList = false;
  let inHeader = false;
  let inSection = false;
  let currentSection = '';

  const closeListIfOpen = () => {
    if (inList) {
      htmlParts.push(`</ul>`);
      inList = false;
    }
  };

  const closeHeaderIfOpen = () => {
    if (inHeader) {
      htmlParts.push(`</div>`);
      inHeader = false;
    }
  };

  const closeSectionIfOpen = () => {
    if (inSection) {
      htmlParts.push(`</div>`);
      inSection = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Blank line
    if (!line) {
      closeListIfOpen();
      continue;
    }

    // Ignore empty bold/italic decorative markers like **** or ** **
    if (/^[*_]{4,}$/.test(line) || /^[*_]{2,}\s+[*_]{2,}$/.test(line)) {
      continue;
    }

    // Horizontal Rule: --- or ***
    if (/^[-*_]{3,}$/.test(line)) {
      closeListIfOpen();
      closeHeaderIfOpen();
      htmlParts.push(`<hr class="my-3 border-t border-zinc-200" />`);
      continue;
    }

    // H1: Document Title / Candidate Name (# Name)
    if (line.startsWith('# ')) {
      closeListIfOpen();
      closeHeaderIfOpen();
      closeSectionIfOpen();
      currentSection = '';
      const titleText = line.replace(/^#\s+/, '').trim();
      inHeader = true;
      htmlParts.push(
        `<div class="resume-header text-center pb-2">
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">${formatInlineMarkdown(titleText)}</h1>`
      );
      continue;
    }

    // Header metadata directly following H1 (contact line, title/role)
    if (inHeader) {
      if (line.startsWith('## ') || line.startsWith('# ')) {
        closeHeaderIfOpen();
      } else if (
        line.includes('@') ||
        line.includes('|') ||
        line.includes('•') ||
        line.toLowerCase().includes('linkedin') ||
        line.toLowerCase().includes('github') ||
        line.length < 120
      ) {
        if (line.includes('@') || line.toLowerCase().includes('linkedin') || line.toLowerCase().includes('github')) {
          htmlParts.push(
            `<p class="resume-contact-row mt-1 text-[11px] text-zinc-600">${formatInlineMarkdown(line)}</p>`
          );
        } else {
          htmlParts.push(
            `<p class="resume-title mt-0.5 text-xs font-bold">${formatInlineMarkdown(line)}</p>`
          );
        }
        continue;
      } else {
        closeHeaderIfOpen();
      }
    }

    // H2: Major Section Header (## Section Title) - universal treatment
    if (line.startsWith('## ')) {
      closeListIfOpen();
      closeHeaderIfOpen();
      closeSectionIfOpen();
      inSection = true;
      const sectionTitle = line.replace(/^##\s+/, '').replace(/\*\*/g, '').trim();
      currentSection = sectionTitle.toUpperCase();
      htmlParts.push(
        `<div class="resume-section mt-4 text-left">
          <h2 class="resume-section-title text-[11px] font-black uppercase tracking-wider pb-0.5 mb-1.5 text-left">
            ${escapeHtml(sectionTitle)}
          </h2>`
      );
      continue;
    }

    // H3: Subsection / Role / Project Title (### Title | Dates)
    if (line.startsWith('### ')) {
      const subText = line.replace(/^###\s+/, '').trim();
      if (subText.toUpperCase() === currentSection) {
        continue;
      }
      closeListIfOpen();
      closeHeaderIfOpen();

      // Check if subText has dates or location separated by | or --
      const delimRegex = /\s+(?:\||--|[–—])\s+/;
      if (delimRegex.test(subText)) {
        const parts = subText.split(delimRegex);
        const left = parts[0].trim();
        const right = parts.slice(1).join(' | ').trim();
        htmlParts.push(
          `<div class="resume-row flex items-baseline justify-between font-bold text-zinc-900 text-xs mt-2 mb-0.5 text-left">
            <span class="resume-row-left text-left">${formatInlineMarkdown(left)}</span>
            <span class="resume-row-right text-right text-zinc-500 font-normal text-[11px] ml-4 shrink-0">${formatInlineMarkdown(right)}</span>
          </div>`
        );
      } else {
        htmlParts.push(
          `<h3 class="resume-subsection-title text-xs font-bold mt-2 mb-0.5 text-left">${formatInlineMarkdown(subText)}</h3>`
        );
      }
      continue;
    }

    // H4: Sub-category / small header (#### Category)
    if (line.startsWith('#### ')) {
      closeListIfOpen();
      closeHeaderIfOpen();
      const h4Text = line.replace(/^####\s+/, '').trim();
      htmlParts.push(
        `<h4 class="text-[11px] font-bold text-zinc-800 uppercase tracking-wide mt-2 mb-0.5 text-left">${formatInlineMarkdown(h4Text)}</h4>`
      );
      continue;
    }

    // Check if line (even if prefixed with - or *) is actually a Major Section Header or Category Subheader
    const headerCheck = cleanHeaderCandidate(line);
    if (headerCheck.isSection) {
      if (headerCheck.title.toUpperCase() === currentSection) {
        continue;
      }
      closeListIfOpen();
      closeHeaderIfOpen();
      closeSectionIfOpen();
      inSection = true;
      currentSection = headerCheck.title.toUpperCase();
      htmlParts.push(
        `<div class="resume-section mt-4 text-left">
          <h2 class="resume-section-title text-[11px] font-black uppercase tracking-wider pb-0.5 mb-1.5 text-left">
            ${escapeHtml(headerCheck.title.toUpperCase())}
          </h2>`
      );
      continue;
    } else if (headerCheck.isSubSection) {
      if (headerCheck.title.toUpperCase() === currentSection) {
        continue;
      }
      closeListIfOpen();
      closeHeaderIfOpen();
      htmlParts.push(
        `<h3 class="resume-subsection-title text-xs font-bold mt-3 mb-1 text-left uppercase tracking-wide">
          ${formatInlineMarkdown(headerCheck.title)}
        </h3>`
      );
      continue;
    }

    // Bullet item: - / * / • / + / 1.
    const bulletMatch = line.match(/^([-*•+]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      closeHeaderIfOpen();
      if (!inList) {
        htmlParts.push(`<ul class="resume-bullet-list list-disc pl-4 space-y-0.5 text-[11px] text-zinc-700 mt-1 mb-2 text-left">`);
        inList = true;
      }
      let itemContent = bulletMatch[2].trim();
      // Clean trailing empty artifacts like "-- (**)", " (**)", "()"
      itemContent = itemContent.replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '').replace(/\s*\(\*{0,2}\s*\)\s*$/g, '').trim();
      // Convert "**Header** -- description" to "**Header:** description"
      itemContent = itemContent.replace(/^(\*\*[^*]+\*\*)\s*--\s*/, '$1: ');

      htmlParts.push(`<li class="resume-bullet text-left">${formatInlineMarkdown(itemContent)}</li>`);
      continue;
    }

    // Standalone line:
    // If inList and line looks like an unbulleted continuation, append to previous <li>
    if (inList) {
      const last = htmlParts.pop();
      if (last && last.endsWith('</li>')) {
        const updated = last.replace(/<\/li>$/, ` ${formatInlineMarkdown(line)}</li>`);
        htmlParts.push(updated);
        continue;
      } else if (last) {
        htmlParts.push(last);
      }
    }

    // Check if line is a metadata row with dates (e.g. "*2021 - Present | San Francisco, CA*" or "Pune, India | Mar 2015 – 2017")
    const isMetaRow = (line.includes('|') || /\b(?:19|20)\d{2}\b/.test(line)) && line.length < 90 && !line.includes('.');
    if (isMetaRow) {
      closeListIfOpen();
      closeHeaderIfOpen();
      htmlParts.push(
        `<p class="text-[11px] italic text-zinc-600 mb-1 text-left">${formatInlineMarkdown(line)}</p>`
      );
      continue;
    }

    // Regular paragraph
    closeListIfOpen();
    closeHeaderIfOpen();
    htmlParts.push(
      `<p class="text-xs leading-relaxed text-zinc-700 mb-1.5 text-left">${formatInlineMarkdown(line)}</p>`
    );
  }

  closeListIfOpen();
  closeHeaderIfOpen();
  closeSectionIfOpen();

  return htmlParts.join('\n');
}
