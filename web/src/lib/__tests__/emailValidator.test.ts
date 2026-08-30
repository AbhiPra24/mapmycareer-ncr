import { describe, it, expect } from 'vitest';
import {
  validateEmailSyntax,
  isGenericAlias,
  evaluateEmailClientSide,
  generateOutreachTemplates,
} from '../emailValidator';

describe('EmailValidator & Recruiter Radar Engine', () => {
  it('should validate RFC 5322 email syntax correctly', () => {
    expect(validateEmailSyntax('john.doe@google.com')).toBe(true);
    expect(validateEmailSyntax('alex+careers@startup.io')).toBe(true);
    expect(validateEmailSyntax('invalid-email')).toBe(false);
    expect(validateEmailSyntax('@missingusername.com')).toBe(false);
    expect(validateEmailSyntax('missingdomain@')).toBe(false);
  });

  it('should flag generic unmonitored prefixes', () => {
    expect(isGenericAlias('recruiting@company.com')).toBe(true);
    expect(isGenericAlias('careers@startup.io')).toBe(true);
    expect(isGenericAlias('jobs@tech.org')).toBe(true);
    expect(isGenericAlias('info@enterprise.com')).toBe(true);
    expect(isGenericAlias('hr@firm.com')).toBe(true);
    expect(isGenericAlias('alex.rivera@company.com')).toBe(false);
  });

  it('should evaluate client-side deliverability confidence and warnings', () => {
    const validEval = evaluateEmailClientSide('alex.doe@microsoft.com');
    expect(validEval.isValidSyntax).toBe(true);
    expect(validEval.confidence).toBe('HIGH CONFIDENCE');
    expect(validEval.warnings).toHaveLength(0);

    const genericEval = evaluateEmailClientSide('careers@google.com');
    expect(genericEval.isGenericAlias).toBe(true);
    expect(genericEval.confidence).toBe('BOUNCE LIKELY (UNMONITORED ALIAS)');
    expect(genericEval.warnings.length).toBeGreaterThan(0);

    const disposableEval = evaluateEmailClientSide('test@mailinator.com');
    expect(disposableEval.confidence).toBe('BOUNCE LIKELY / INVALID');
  });

  it('should generate 3-tier personalized outreach templates', () => {
    const templates = generateOutreachTemplates(
      'Jane Doe',
      'Staff Cloud Architect',
      'Acme Corp',
      'Scaled multi-region Kubernetes clusters cutting P99 latency by 50%'
    );

    expect(templates.hiringManager).toContain('Staff Cloud Architect @ Acme Corp');
    expect(templates.hiringManager).toContain('Jane Doe');
    expect(templates.recruiter).toContain('Staff Cloud Architect Open Requisition');
    expect(templates.peerReferral).toContain('Quick question about Engineering @ Acme Corp');
  });
});
