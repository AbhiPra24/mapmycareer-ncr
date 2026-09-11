/**
 * Universal Markdown & Plaintext Resume Parser
 * Bidirectionally translates Markdown, plain text, and formatted resumes into structured ResumeData.
 * Zero template leakage: never injects dummy text, placeholder bullets, or template fallbacks.
 */

import { ResumeData } from './latexTemplates';

const KNOWN_SECTIONS = [
  {
    type: 'summary' as const,
    patterns: [
      /^(?:##?\s*)?(?:professional\s+|executive\s+)?summary/i,
      /^(?:##?\s*)?profile/i,
      /^(?:##?\s*)?about(?:\s+me)?/i,
      /^(?:##?\s*)?objective/i,
      /^(?:##?\s*)?overview/i,
    ],
  },
  {
    type: 'experience' as const,
    patterns: [
      /^(?:##?\s*)?(?:professional\s+|work\s+)?experience/i,
      /^(?:##?\s*)?employment(?:\s+history)?/i,
      /^(?:##?\s*)?work\s+history/i,
      /^(?:##?\s*)?career\s+history/i,
    ],
  },
  {
    type: 'skills' as const,
    patterns: [
      /^(?:##?\s*)?(?:technical\s+)?skills/i,
      /^(?:##?\s*)?technologies/i,
      /^(?:##?\s*)?core\s+competencies/i,
      /^(?:##?\s*)?competencies/i,
      /^(?:##?\s*)?tools\s+&\s+technologies/i,
    ],
  },
  {
    type: 'projects' as const,
    patterns: [
      /^(?:##?\s*)?(?:key\s+|personal\s+)?projects/i,
      /^(?:##?\s*)?open\s+source/i,
    ],
  },
  {
    type: 'education' as const,
    patterns: [
      /^(?:##?\s*)?education(?:\s+&\s+certifications)?/i,
      /^(?:##?\s*)?academics?/i,
      /^(?:##?\s*)?academic\s+background/i,
    ],
  },
  {
    type: 'certifications' as const,
    patterns: [
      /^(?:##?\s*)?certifications?/i,
      /^(?:##?\s*)?licenses/i,
    ],
  },
  {
    type: 'achievements' as const,
    patterns: [
      /^(?:##?\s*)?(?:key\s+|notable\s+|major\s+)?achievements?/i,
      /^(?:##?\s*)?(?:honors?\s+(?:&|and)\s+)?awards?/i,
      /^(?:##?\s*)?accomplishments?/i,
      /^(?:##?\s*)?honors?/i,
      /^(?:##?\s*)?recognition/i,
      /^(?:##?\s*)?patents?(?:\s+(?:&|and)\s+publications)?/i,
      /^(?:##?\s*)?interests?/i,
      /^(?:##?\s*)?hobbies/i,
      /^(?:##?\s*)?activities/i,
    ],
  },
];

function identifySectionHeader(line: string): string | null {
  let clean = line.replace(/^[-*•+\s#_]+/, '').trim();
  clean = clean
    .replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '')
    .replace(/\s*\(\*{0,2}\s*\)\s*$/g, '')
    .replace(/[*_:#-]+$/g, '')
    .trim();
  if (!clean || clean.length > 50) return null;
  for (const s of KNOWN_SECTIONS) {
    for (const pat of s.patterns) {
      if (pat.test(clean)) return s.type;
    }
  }
  return null;
}

export function parseMarkdownToResumeData(md: string, fallback?: ResumeData): ResumeData {
  const emptyResume: ResumeData = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: { degree: '', school: '', dates: '', gpa: '', certifications: '' },
    achievements: [],
  };

  if (!md || !md.trim()) {
    return fallback || emptyResume;
  }

  const normalized = md.replace(/\r\n/g, '\n');
  const allLines = normalized.split('\n');

  // 1. Identify Section Header Boundaries
  const sectionSpans: { type: string; lineIndex: number; headerText: string }[] = [];
  allLines.forEach((line, index) => {
    const sType = identifySectionHeader(line);
    if (sType) {
      sectionSpans.push({ type: sType, lineIndex: index, headerText: line });
    }
  });

  const firstSectionLine = sectionSpans.length > 0 ? sectionSpans[0].lineIndex : allLines.length;
  const headerLines = allLines
    .slice(0, firstSectionLine)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('---'));

  const result: ResumeData = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: { degree: '', school: '', dates: '', gpa: '', certifications: '' },
    achievements: [],
  };

  // 2. Parse Header Zone (Name, Title, Contact Info)
  headerLines.forEach((line) => {
    if (line.startsWith('#')) {
      result.name = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    } else if (
      line.includes('@') ||
      line.includes('|') ||
      line.includes('•') ||
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github')
    ) {
      const parts = line
        .replace(/^\*+|\*+$/g, '')
        .split(/[|•]/)
        .map((p) => p.trim())
        .filter(Boolean);

      parts.forEach((part) => {
        const emailMatch = part.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
        const liMatch = part.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w.-]+/i);
        const ghMatch = part.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+/i);
        const webMatch =
          part.match(/https?:\/\/[^\s|•,]+/i) ||
          part.match(/[\w.-]+\.(?:dev|io|me|app|com|org|net)(?:\/[^\s|•,]*)?/i);
        const phoneMatch =
          part.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) ||
          part.match(/^\+?\d{10,12}$/);

        if (emailMatch) {
          result.email = emailMatch[0];
        } else if (liMatch) {
          result.linkedin = liMatch[0];
        } else if (ghMatch) {
          result.github = ghMatch[0];
        } else if (webMatch) {
          result.website = webMatch[0];
        } else if (phoneMatch) {
          result.phone = phoneMatch[0];
        } else if (!result.location) {
          const cleanLoc = part.replace(/^[^\w\s]+/, '').trim();
          if (cleanLoc && cleanLoc.length < 50 && !cleanLoc.includes('http')) {
            result.location = cleanLoc;
          }
        }
      });
    } else if (!result.name) {
      result.name = line.replace(/\*\*/g, '').trim();
    } else if (!result.title) {
      result.title = line.replace(/\*\*/g, '').trim();
    }
  });

  // Helper to intelligently split role and company from a single line
  const splitRoleAndCompany = (rawHeader: string): { role: string; company: string } => {
    const clean = rawHeader.replace(/^###\s*/, '').replace(/\*\*/g, '').trim();
    // Support all Unicode dashes: hyphen (-), en-dash (–), em-dash (—), double-hyphen (--)
    const delimRegex = /\s+(?:\||--|[–—]|-)\s+/;

    if (delimRegex.test(clean)) {
      const parts = clean.split(delimRegex);
      const first = parts[0].trim();
      const second = parts.slice(1).join(' - ').trim();

      const roleKeywords =
        /\b(engineer|developer|architect|lead|manager|qa|sdet|specialist|analyst|tester|consultant|intern|officer|director|vp|head|programmer|specialist)\b/i;

      // If first is company and second is title (e.g. "Amdocs – DWH/BI ETL Automation QA")
      if (!roleKeywords.test(first) && roleKeywords.test(second)) {
        return { role: second, company: first };
      }
      return { role: first, company: second };
    }

    if (/\s+at\s+/i.test(clean)) {
      const parts = clean.split(/\s+at\s+/i);
      return { role: parts[0].trim(), company: parts.slice(1).join(' at ').trim() };
    }

    return { role: clean, company: '' };
  };

  // Helper to unwrap soft-wrapped / multi-line bullets and metadata
  const unwrapWrappedLines = (rawLines: string[]): string[] => {
    const unwrapped: string[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      const raw = rawLines[i];
      const line = raw.trim();
      if (!line || line.startsWith('---')) continue;

      const isBullet = /^[-*•+]\s+/.test(line) || /^\d+\.\s+/.test(line);
      const isHeader = line.startsWith('#');
      const isMetaField = /^(?:company|role|title|position|location|dates?|certifications?|gpa|cpi|cgpa|grade|score):\s*/i.test(line);
      const isDateLine =
        /^\*?(?:(?:19|20)\d{2}\b|Present\b)[^*]*\*?$/i.test(line) ||
        /^(?:(?:19|20)\d{2}\b|Present\b)[^|]*\|/i.test(line);
      const isSeparatedRoleCompany =
        (/\s+(?:\||--|[–—]|-)\s+/.test(line) || /\s+at\s+/i.test(line)) &&
        line.length < 90 &&
        !/[.!?]$/.test(line);
      const isCategoryHeader =
        /^(?:###\s+|(?:\*\*)?(?:innovation|impact|leadership|technical leadership|awards|honors|patents|publications|key highlights|community|recognition)(?:\*\*)?:?$)/i.test(line);
      const isActionLead =
        /^(?:Created|Leveraged|Built|Developed|Automated|Designed|Delivered|Enhanced|Reduced|Strengthened|Established|Led|Architected|Spearheaded|Formulated|Engineered|Implemented|Orchestrated|Pioneered|Drove)\b/.test(line);

      const isNewItem = isBullet || isHeader || isMetaField || isDateLine || isSeparatedRoleCompany || isCategoryHeader || isActionLead;

      if (!isNewItem && unwrapped.length > 0) {
        const prev = unwrapped[unwrapped.length - 1];
        if (!prev.startsWith('#') && !prev.startsWith('---')) {
          unwrapped[unwrapped.length - 1] = prev + ' ' + line;
          continue;
        }
      }

      unwrapped.push(line);
    }

    return unwrapped;
  };

  // 3. Parse Sections
  sectionSpans.forEach((span, sIdx) => {
    const start = span.lineIndex + 1;
    const end = sIdx + 1 < sectionSpans.length ? sectionSpans[sIdx + 1].lineIndex : allLines.length;
    const rawContentLines = allLines
      .slice(start, end)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('---'));
    const contentLines = unwrapWrappedLines(rawContentLines);
    const content = rawContentLines.join('\n');

    // A. Summary
    if (span.type === 'summary') {
      result.summary = content;
    }

    // B. Technical Skills
    else if (span.type === 'skills') {
      const parsedSkills: { category: string; skills: string }[] = [];

      contentLines.forEach((line) => {
        const clean = line.replace(/^[-*•+]\s*/, '').trim();
        if (!clean) return;

        const catMatch =
          clean.match(/^\*\*([^*:]+)\*\*:\s*(.+)$/) ||
          clean.match(/^\*\*([^*:]+):\*\*\s*(.+)$/) ||
          clean.match(/^([^:]+):\s*(.+)$/);

        if (catMatch) {
          parsedSkills.push({
            category: catMatch[1].trim(),
            skills: catMatch[2].trim(),
          });
        } else {
          parsedSkills.push({
            category: 'Technical Skills',
            skills: clean,
          });
        }
      });

      if (parsedSkills.length > 0) {
        result.skills = parsedSkills;
      }
    }

    // C. Professional Experience
    else if (span.type === 'experience') {
      let currentJob: ResumeData['experience'][number] | null = null;

      contentLines.forEach((line) => {
        const isBullet =
          line.startsWith('- ') ||
          line.startsWith('* ') ||
          line.startsWith('• ') ||
          line.startsWith('+ ') ||
          /^\d+\.\s+/.test(line);

        const isDateOrMetaLine =
          !isBullet &&
          (line.startsWith('*') ||
            Boolean(line.match(/\b(?:19|20)\d{2}\b/)) ||
            Boolean(line.match(/\bPresent\b/i)));

        const isHeaderCandidate =
          !isBullet &&
          !isDateOrMetaLine &&
          (line.startsWith('### ') ||
            line.includes(' | ') ||
            line.includes(' -- ') ||
            line.includes(' – ') ||
            line.includes(' — ') ||
            line.includes(' - ') ||
            line.toLowerCase().includes(' at ') ||
            line.toLowerCase().startsWith('role:') ||
            line.toLowerCase().startsWith('company:') ||
            (line.startsWith('**') && line.length < 80 && !/[.!?]$/.test(line)));

        if (isHeaderCandidate) {
          if (currentJob) {
            result.experience.push(currentJob);
          }

          if (/^company:\s*/i.test(line)) {
            currentJob = {
              role: '',
              company: line.replace(/^company:\s*/i, '').replace(/\*\*/g, '').trim(),
              dates: '',
              location: '',
              bullets: [],
            };
          } else if (/^(?:role|title):\s*/i.test(line)) {
            currentJob = {
              role: line.replace(/^(?:role|title):\s*/i, '').replace(/\*\*/g, '').trim(),
              company: '',
              dates: '',
              location: '',
              bullets: [],
            };
          } else {
            const { role, company } = splitRoleAndCompany(line);
            currentJob = {
              role,
              company,
              dates: '',
              location: '',
              bullets: [],
            };
          }
        } else if (!isBullet && currentJob && (line.match(/\d{4}/) || line.includes('Present') || line.includes('|'))) {
          const cleanMeta = line.replace(/[*_]/g, '').trim();
          if (cleanMeta.includes('|')) {
            const parts = cleanMeta.split('|');
            if (/\d{4}|present/i.test(parts[0])) {
              currentJob.dates = parts[0].trim();
              currentJob.location = parts.slice(1).join('|').trim();
            } else if (parts.length > 1 && /\d{4}|present/i.test(parts[1])) {
              currentJob.location = parts[0].trim();
              currentJob.dates = parts.slice(1).join('|').trim();
            } else {
              currentJob.dates = parts[0].trim();
              currentJob.location = parts.slice(1).join('|').trim();
            }
          } else {
            currentJob.dates = cleanMeta;
          }
        } else if (isBullet && currentJob) {
          const bText = line.replace(/^[-*•+]\s+/, '').replace(/^\d+\.\s+/, '').trim();
          if (bText) {
            currentJob.bullets.push(bText);
          }
        } else if (!isBullet && currentJob && currentJob.bullets.length > 0) {
          // Extra safety: Append wrapped continuation line to previous bullet
          currentJob.bullets[currentJob.bullets.length - 1] += ' ' + line;
        }
      });

      if (currentJob) {
        result.experience.push(currentJob);
      }
    }

    // D. Key Projects
    else if (span.type === 'projects') {
      let currentProj: NonNullable<ResumeData['projects']>[number] | null = null;

      contentLines.forEach((line) => {
        const isBullet =
          line.startsWith('- ') ||
          line.startsWith('* ') ||
          line.startsWith('• ') ||
          line.startsWith('+ ') ||
          /^\d+\.\s+/.test(line);

        const isHeaderCandidate =
          !isBullet &&
          (line.startsWith('### ') || line.startsWith('**') || line.includes('(') || line.includes(' - '));

        if (isHeaderCandidate) {
          if (currentProj) {
            result.projects?.push(currentProj);
          }
          const cleanHeader = line.replace(/^###\s*/, '').replace(/\*\*/g, '').trim();
          let name = cleanHeader;
          let technologies = '';
          let url: string | undefined;

          const techMatch =
            cleanHeader.match(/\(\*([^*]+)\*\)/) ||
            cleanHeader.match(/\[([^\]]+)\]/) ||
            cleanHeader.match(/\(([^)]+)\)/);

          if (techMatch) {
            technologies = techMatch[1].trim();
            name = cleanHeader.replace(techMatch[0], '').replace(/\|.*$/, '').trim();
          }

          const urlMatch =
            cleanHeader.match(/\[(?:Link|Demo|Code|Github)\]\(([^)]+)\)/i) ||
            cleanHeader.match(/\((https?:\/\/[^\s)]+)\)/);
          if (urlMatch) {
            url = urlMatch[1].trim();
          }

          currentProj = {
            name: name.replace(/^[-\s|]+|[-\s|]+$/g, '').trim(),
            technologies,
            url,
            bullets: [],
          };
        } else if (isBullet && currentProj) {
          const bText = line.replace(/^[-*•+]\s+/, '').replace(/^\d+\.\s+/, '').trim();
          if (bText) {
            currentProj.bullets.push(bText);
          }
        }
      });

      if (currentProj) {
        result.projects = result.projects || [];
        result.projects.push(currentProj);
      }
    }

    // E. Education
    else if (span.type === 'education') {
      const degreesList: NonNullable<ResumeData['education']['degrees']> = [];
      const leakedAchievementLines: string[] = [];
      let inLeakedAchievements = false;

      contentLines.forEach((line) => {
        const clean = line.replace(/^[-*•+]\s*/, '').trim();
        if (!clean) return;

        // Check if an achievements or category header is encountered inside Education
        const testSection = identifySectionHeader(line);
        const testCategory = clean.replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '').replace(/[*_:#-]/g, '').trim();
        const isCat = /^(?:innovation|impact|leadership|technical leadership|key highlights|community|mentorship|strategy|domain expertise|interests?|hobbies)\b/i.test(testCategory);

        if (testSection === 'achievements' || isCat) {
          inLeakedAchievements = true;
        }

        if (inLeakedAchievements) {
          leakedAchievementLines.push(line);
          return;
        }

        // 1. Standalone / inline Certifications line
        if (/^(?:\*\*)?certifications?:/i.test(clean)) {
          result.education.certifications = clean
            .replace(/^(?:\*\*)?certifications?:\*{0,2}\s*/i, '')
            .replace(/^[*_\s]+|[*_\s]+$/g, '')
            .trim();
          return;
        }

        // 2. GPA / CPI / CGPA / Grade
        let gpa = '';
        const gpaMatch = clean.match(/\(?\s*(?:GPA|CGPA|CPI|Grade|Score):\s*([0-9.]+(?:\s*\/\s*[0-9.]+)?%?)\s*\)?/i);
        if (gpaMatch) {
          gpa = gpaMatch[1].trim();
          const remainder = clean.replace(gpaMatch[0], '').replace(/^[|•,\s-]+|[|•,\s-]+$/g, '').trim();
          if (!remainder) {
            // Standalone GPA line - attach to most recent degree if exists
            if (degreesList.length > 0 && !degreesList[degreesList.length - 1].gpa) {
              degreesList[degreesList.length - 1].gpa = gpa;
            }
            if (!result.education.gpa) {
              result.education.gpa = gpa;
            }
            return;
          }
        }

        // 3. Degree, School, Dates
        let degreeLine = clean
          .replace(/\(?\s*(?:GPA|CGPA|CPI|Grade|Score):\s*[0-9.]+(?:\s*\/\s*[0-9.]+)?%?\s*\)?/gi, '')
          .replace(/\(\s*\)/g, '')
          .trim();
        let dates = '';

        const dateMatch =
          degreeLine.match(/\(\*?([^)]*\b(?:19|20)\d{2}\b[^)]*)\*?\)/) ||
          degreeLine.match(/\b(?:19|20)\d{2}\s*(?:--|[–—]|-)\s*(?:(?:19|20)\d{2}|Present)\b/i);

        if (dateMatch) {
          dates = (dateMatch[1] || dateMatch[0]).trim();
          degreeLine = degreeLine.replace(dateMatch[0], '').trim();
        }

        degreeLine = degreeLine.replace(/^[#*_\s-]+|[#*_\s-]+$/g, '').trim();

        // Delimiter between degree and school: --, –, —, |, -
        const eduDelim = /\s+(?:--|[–—]|\||-)\s+/;
        let degree = degreeLine;
        let school = '';

        if (eduDelim.test(degreeLine)) {
          const parts = degreeLine.split(eduDelim);
          degree = parts[0].trim();
          school = parts.slice(1).join(' - ').trim();
        } else if (degreeLine.includes(',')) {
          const parts = degreeLine.split(',');
          degree = parts[0].trim();
          school = parts.slice(1).join(',').trim();
        }

        const cleanDegree = degree.replace(/\*\*/g, '').trim();
        const cleanSchool = school.replace(/\*\*/g, '').trim();
        const cleanDates = dates.replace(/[*_()]/g, '').trim();

        if (cleanDegree && isAcademicDegree({ degree: cleanDegree, school: cleanSchool, dates: cleanDates, gpa })) {
          degreesList.push({
            degree: cleanDegree,
            school: cleanSchool,
            dates: cleanDates,
            gpa: gpa || undefined,
          });
        } else if (cleanDegree) {
          leakedAchievementLines.push(line);
        }
      });

      if (degreesList.length > 0) {
        result.education.degrees = degreesList;
        result.education.degree = degreesList[0].degree;
        result.education.school = degreesList[0].school;
        result.education.dates = degreesList[0].dates;
        if (degreesList[0].gpa) {
          result.education.gpa = degreesList[0].gpa;
        }
      }

      if (leakedAchievementLines.length > 0) {
        const leakedGroups = parseAchievementsLines(leakedAchievementLines);
        if (leakedGroups.length > 0) {
          result.achievements = [...(result.achievements || []), ...leakedGroups];
        }
      }
    }

    // F. Standalone Certifications
    else if (span.type === 'certifications') {
      const certBullets = contentLines
        .map((l) => l.replace(/^[-*•+]\s*/, '').trim())
        .filter(Boolean);

      if (certBullets.length > 0) {
        result.education.certifications = certBullets.join(', ');
      }
    }

    // G. Key Achievements & Honors
    else if (span.type === 'achievements') {
      const isInterests = /^(?:##?\s*)?(?:interests?|hobbies|activities)/i.test(span.headerText);
      const defaultCat = isInterests
        ? span.headerText.replace(/^[-*•+\s#_]+/, '').replace(/[*_:#-]+$/g, '').trim()
        : undefined;

      const achievementGroups = parseAchievementsLines(contentLines, defaultCat);
      if (achievementGroups.length > 0) {
        result.achievements = [...(result.achievements || []), ...achievementGroups];
      }
    }
  });

  return sanitizeResumeData(result);
}

export function parseAchievementsLines(
  lines: string[],
  defaultCategory?: string
): NonNullable<ResumeData['achievements']> {
  const achievementGroups: NonNullable<ResumeData['achievements']> = [];
  let currentGroup: { category?: string; bullets: string[] } = {
    category: defaultCategory || '',
    bullets: [],
  };

  const isCategoryLine = (l: string): boolean => {
    let cleanWord = l.replace(/^[-*•+\s#_]+/, '').trim();
    cleanWord = cleanWord
      .replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '')
      .replace(/\s*\(\*{0,2}\s*\)\s*$/g, '')
      .replace(/[*_:#-]/g, '')
      .trim();

    // Section headers must never be treated as category subheaders
    if (/^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?|honors?\s+(?:&|and)\s+awards?)$/i.test(cleanWord)) {
      return false;
    }

    if (/^###\s+/.test(l)) return true;
    const commonCategories =
      /^(innovation|impact|leadership|technical leadership|awards|honors|patents|publications|key highlights|community|recognition|interests?|hobbies|activities|mentorship|strategy|domain expertise)$/i;
    if (commonCategories.test(cleanWord)) return true;
    if (
      cleanWord.length > 0 &&
      cleanWord.length < 35 &&
      !/[.!?]$/.test(cleanWord) &&
      !/\d{4}/.test(l)
    ) {
      const words = cleanWord.split(/\s+/);
      if (words.length <= 3 && words.every((w) => /^[A-Z]/.test(w))) {
        return true;
      }
    }
    return false;
  };

  lines.forEach((line) => {
    // Skip redundant section headers inside achievements block (e.g. "- **Achievements** -- (**)" or "Achievements")
    let rawClean = line.replace(/^[-*•+\s#_]+/, '').trim();
    rawClean = rawClean
      .replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '')
      .replace(/\s*\(\*{0,2}\s*\)\s*$/g, '')
      .replace(/[*_:#-]/g, '')
      .trim();
    if (/^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(rawClean)) {
      return;
    }

    if (isCategoryLine(line)) {
      if (currentGroup.bullets.length > 0 || currentGroup.category) {
        achievementGroups.push({
          category: currentGroup.category || undefined,
          bullets: currentGroup.bullets,
        });
      }
      let catName = line.replace(/^###\s*/, '').replace(/^[-*•+\s#_]+/, '').trim();
      catName = catName
        .replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '')
        .replace(/\s*\(\*{0,2}\s*\)\s*$/g, '')
        .replace(/[*_:]/g, '')
        .trim();
      currentGroup = { category: catName, bullets: [] };
      return;
    }

    const isBullet = /^[-*•+]\s+/.test(line) || /^\d+\.\s+/.test(line);
    if (isBullet) {
      let bText = line.replace(/^[-*•+]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      bText = bText.replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '').replace(/\s*\(\*{0,2}\s*\)\s*$/g, '').trim();
      bText = bText.replace(/^(\*\*[^*]+\*\*)\s*--\s*/, '$1: ');
      if (bText) {
        currentGroup.bullets.push(bText);
      }
    } else if (line.startsWith('**') && line.includes('**')) {
      let bText = line.replace(/\s*--\s*\(\*{0,2}\s*\)\s*$/g, '').replace(/\s*\(\*{0,2}\s*\)\s*$/g, '').trim();
      bText = bText.replace(/^(\*\*[^*]+\*\*)\s*--\s*/, '$1: ');
      if (bText) {
        currentGroup.bullets.push(bText);
      }
    } else {
      // Unbulleted line
      if (
        currentGroup.bullets.length > 0 &&
        (/^[a-z]/.test(line) ||
          /^(?:enabling|saving|cutting|reducing|improving|strengthening|delivering|supported|directly)\b/i.test(line))
      ) {
        currentGroup.bullets[currentGroup.bullets.length - 1] += ' ' + line;
      } else if (
        currentGroup.bullets.length > 0 &&
        !/^[A-Z][a-z]+ [A-Z]/.test(line) &&
        line.length < 80 &&
        /[.!?)]$/.test(line)
      ) {
        currentGroup.bullets[currentGroup.bullets.length - 1] += ' ' + line;
      } else if (line.trim()) {
        currentGroup.bullets.push(line.trim());
      }
    }
  });

  if (
    currentGroup.bullets.length > 0 ||
    (currentGroup.category && !/^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(currentGroup.category))
  ) {
    achievementGroups.push({
      category: currentGroup.category || undefined,
      bullets: currentGroup.bullets,
    });
  }

  return achievementGroups.filter(
    (g) =>
      g.bullets.length > 0 ||
      (g.category && !/^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(g.category))
  );
}

export function isAcademicDegree(deg: { degree?: string; school?: string; dates?: string; gpa?: string }): boolean {
  if (!deg || !deg.degree) return false;
  const raw = deg.degree.trim();
  const clean = raw.replace(/^[-*•+\s#_]+/, '').replace(/[*_:#-]+$/g, '').trim();
  if (!clean) return false;

  // Obvious non-degree section or category headers
  const nonDegreeHeaders =
    /^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?|awards?|honors?|recognition|patents?|interests?|hobbies|activities|volunteer(?:ing)?|certifications?|innovation|impact|leadership|technical leadership|key highlights|community|mentorship|strategy|domain expertise)$/i;
  if (nonDegreeHeaders.test(clean)) return false;

  // Obvious action verbs starting a bullet sentence
  const actionVerbStart =
    /^(?:reduced|designed|engineered|built|integrated|increased|uncovered|enabled|spearheaded|mentored|championed|partnered|created|leveraged|automated|delivered|enhanced|positioned|drove|established|exploring|developed|implemented|orchestrated|coached|architected|streamlined)\b/i;
  if (actionVerbStart.test(clean)) return false;

  // If long sentence (> 50 chars) with no degree keywords
  const degreeKeywords =
    /\b(?:b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|b\.?s\.?|m\.?s\.?|ph\.?d|bachelor|master|doctorate|diploma|degree|high\s+school|secondary|senior\s+secondary|matriculation|associate|b\.?a\.?|m\.?a\.?|b\.?sc|m\.?sc|bca|mca|bba|mba|llb|llm|md|mbbs)\b/i;
  if (degreeKeywords.test(clean)) return true;

  // School keywords in school or degree
  const schoolKeywords = /\b(?:university|college|institute|school|academy|polytechnic|campus)\b/i;
  if (deg.school && schoolKeywords.test(deg.school) && clean.length <= 70) return true;

  // Has dates, reasonable length, and not an action verb
  const hasDates = Boolean(deg.dates && /\b(?:19|20)\d{2}\b/.test(deg.dates));
  if (hasDates && clean.length <= 70 && !actionVerbStart.test(clean)) return true;

  return false;
}

export function sanitizeResumeData(data: ResumeData): ResumeData {
  if (!data || !data.education) return data;

  const clone: ResumeData = JSON.parse(JSON.stringify(data));
  const rawDegrees = clone.education.degrees;

  if (Array.isArray(rawDegrees) && rawDegrees.length > 0) {
    const validDegrees: NonNullable<ResumeData['education']['degrees']> = [];
    const leakedLines: string[] = [];

    for (const d of rawDegrees) {
      if (isAcademicDegree(d)) {
        validDegrees.push(d);
      } else {
        // Collect leaked degree title and school if any
        leakedLines.push(d.degree);
        if (d.school && !/^(?:university|college|institute|school)/i.test(d.school)) {
          leakedLines.push(d.school);
        }
      }
    }

    clone.education.degrees = validDegrees;
    if (validDegrees.length > 0) {
      clone.education.degree = validDegrees[0].degree;
      clone.education.school = validDegrees[0].school;
      clone.education.dates = validDegrees[0].dates;
      if (validDegrees[0].gpa) {
        clone.education.gpa = validDegrees[0].gpa;
      }
    } else {
      clone.education.degree = '';
      clone.education.school = '';
      clone.education.dates = '';
      clone.education.gpa = '';
    }

    // If leaked lines were detected, parse them and migrate to achievements if achievements are empty
    if (leakedLines.length > 0) {
      const existingAchievements = clone.achievements || [];
      const hasExisting = existingAchievements.some((g) => g.bullets.length > 0);
      if (!hasExisting) {
        const migrated = parseAchievementsLines(leakedLines);
        if (migrated.length > 0) {
          clone.achievements = migrated;
        }
      }
    }
  }

  // Also sanitize clone.education.degree if corrupted
  if (
    clone.education.degree &&
    !isAcademicDegree({
      degree: clone.education.degree,
      school: clone.education.school,
      dates: clone.education.dates,
      gpa: clone.education.gpa,
    })
  ) {
    if (clone.education.degrees && clone.education.degrees.length > 0) {
      clone.education.degree = clone.education.degrees[0].degree;
      clone.education.school = clone.education.degrees[0].school;
      clone.education.dates = clone.education.degrees[0].dates;
      clone.education.gpa = clone.education.degrees[0].gpa;
    } else {
      clone.education.degree = '';
      clone.education.school = '';
      clone.education.dates = '';
      clone.education.gpa = '';
    }
  }

  // Also sanitize clone.achievements to strip self-named "Achievements" categories
  if (Array.isArray(clone.achievements)) {
    clone.achievements = clone.achievements
      .filter((g) => {
        const cat = (g.category || '').trim();
        const isSelfHeader = /^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(cat);
        if (isSelfHeader && g.bullets.length === 0) return false;
        return g.bullets.length > 0 || cat.length > 0;
      })
      .map((g) => {
        const cat = (g.category || '').trim();
        const isSelfHeader = /^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(cat);
        if (isSelfHeader) {
          return { ...g, category: undefined };
        }
        return g;
      });
  }

  return clone;
}

