/**
 * Recruiter Radar & Email Deliverability Engine
 * Ported from career-forge RecruiterRadarEngine
 * Validates RFC 5322 syntax, generic unmonitored prefixes, and DNS/MX health.
 */

export const GENERIC_UNMONITORED_PREFIXES = new Set([
  'recruiting', 'hiring', 'careers', 'jobs', 'info', 'contact',
  'hr', 'talent', 'support', 'help', 'sales', 'general', 'inquiries', 'reception', 'apply',
  'no-reply', 'noreply', 'donotreply', 'billing', 'admin'
]);

export interface DeliverabilityStatus {
  email: string;
  isValidSyntax: boolean;
  domainResolves: boolean | null; // null if not yet checked
  isGenericAlias: boolean;
  confidence: 'HIGH CONFIDENCE' | 'MEDIUM / CAUTION' | 'BOUNCE LIKELY / INVALID' | 'BOUNCE LIKELY (UNMONITORED ALIAS)';
  warnings: string[];
  mxRecords?: string[];
}

export function validateEmailSyntax(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return pattern.test(email.trim());
}

export function isGenericAlias(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const prefix = email.split('@')[0].toLowerCase().trim().split('+')[0];
  return GENERIC_UNMONITORED_PREFIXES.has(prefix);
}

export function evaluateEmailClientSide(email: string): DeliverabilityStatus {
  const clean = email.trim();
  const warnings: string[] = [];

  if (!validateEmailSyntax(clean)) {
    return {
      email: clean,
      isValidSyntax: false,
      domainResolves: false,
      isGenericAlias: false,
      confidence: 'BOUNCE LIKELY / INVALID',
      warnings: ['Malformed RFC 5322 email syntax.'],
    };
  }

  const domain = clean.split('@')[1]?.toLowerCase();
  const isGeneric = isGenericAlias(clean);

  // Common disposable domains
  const disposableDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'throwawaymail.com'];
  if (disposableDomains.includes(domain)) {
    warnings.push('Disposable / temporary email domain detected.');
    return {
      email: clean,
      isValidSyntax: true,
      domainResolves: true,
      isGenericAlias: isGeneric,
      confidence: 'BOUNCE LIKELY / INVALID',
      warnings,
    };
  }

  if (isGeneric) {
    warnings.push('Generic unmonitored alias detected (e.g., careers@, hr@). High risk of automated rejection or no response.');
  }

  const confidence = isGeneric ? 'BOUNCE LIKELY (UNMONITORED ALIAS)' : 'HIGH CONFIDENCE';

  return {
    email: clean,
    isValidSyntax: true,
    domainResolves: null, // Pending server MX check
    isGenericAlias: isGeneric,
    confidence,
    warnings,
  };
}

export interface OutreachTemplates {
  hiringManager: string;
  recruiter: string;
  peerReferral: string;
}

export function generateOutreachTemplates(
  candidateName: string,
  roleTitle: string,
  targetCompany: string,
  topMetric: string
): OutreachTemplates {
  const safeName = candidateName.trim() || 'Candidate Name';
  const safeRole = roleTitle.trim() || 'Software Engineer';
  const safeCompany = targetCompany.trim() || 'Target Company';
  const safeMetric = topMetric.trim() || 'Engineered scalable distributed services delivering sub-15ms P99 latency';

  return {
    hiringManager: `Subject: ${safeRole} @ ${safeCompany} – Scaling & Systems Impact

Hi [Hiring Manager],

I saw your team's expansion in engineering at ${safeCompany}. As a ${safeRole}, I specialize in building high-throughput infrastructure and production-grade systems.

Most recently: ${safeMetric}.

I would welcome a brief 10-minute conversation to explore how my background could support your team's upcoming milestones.

Best regards,
${safeName}`,

    recruiter: `Subject: Re: ${safeRole} Open Requisition @ ${safeCompany}

Hi [Recruiter Name],

I noticed the ${safeRole} opening on your engineering team at ${safeCompany}. My background aligns directly with your core stack and requirements.

Key Impact: ${safeMetric}.

I have attached my tailored resume and would love to connect for an initial conversation.

Best,
${safeName}`,

    peerReferral: `Subject: Quick question about Engineering @ ${safeCompany}

Hi [First Name],

I noticed your work as an engineer at ${safeCompany} and wanted to reach out. I am exploring the open ${safeRole} position on your team.

My recent focus: ${safeMetric}.

Would you be open to sharing your perspective on the engineering culture and team roadmap?

Thanks a lot,
${safeName}`
  };
}
