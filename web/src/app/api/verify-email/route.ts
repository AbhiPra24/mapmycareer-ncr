import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';
import { evaluateEmailClientSide } from '@/lib/emailValidator';
import { getCachedMxRecord, setCachedMxRecord, checkRateLimit } from '@/lib/kvCache';

const BLOCKED_DOMAINS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '::1']);

export async function POST(req: NextRequest) {
  try {
    // 1. Edge Rate Limiting (30 requests/min per IP)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const rateLimit = await checkRateLimit(ip, 30, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 30 verification checks per minute.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    // 2. Client-side syntax audit
    const clientEval = evaluateEmailClientSide(email);
    if (!clientEval.isValidSyntax) {
      return NextResponse.json(clientEval);
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json(clientEval);
    }

    // 3. SSRF Guard
    if (
      BLOCKED_DOMAINS.has(domain) ||
      domain.endsWith('.local') ||
      domain.endsWith('.internal') ||
      domain.endsWith('.lan') ||
      domain.endsWith('.corp')
    ) {
      return NextResponse.json({
        ...clientEval,
        domainResolves: false,
        confidence: 'BOUNCE LIKELY / INVALID',
        warnings: [...clientEval.warnings, 'SSRF Guard: Internal domain resolution blocked.'],
      });
    }

    // 4. Vercel KV / In-Memory Cache Check (<2ms)
    const cached = await getCachedMxRecord(domain);
    if (cached) {
      const warnings = [...clientEval.warnings];
      if (!cached.resolves) {
        warnings.push(`Domain '${domain}' has no active MX/A mail records.`);
      }
      return NextResponse.json({
        ...clientEval,
        domainResolves: cached.resolves,
        confidence: !cached.resolves
          ? 'BOUNCE LIKELY / INVALID'
          : clientEval.isGenericAlias
          ? 'BOUNCE LIKELY (UNMONITORED ALIAS)'
          : 'HIGH CONFIDENCE',
        warnings,
        mxRecords: cached.mxRecords,
      });
    }

    // 5. DNS MX Lookup with 2.5s timeout
    let resolves = false;
    let mxRecords: string[] = [];

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DNS Timeout')), 2500)
      );

      const mxLookup = dns.resolveMx(domain);
      const records = await Promise.race([mxLookup, timeoutPromise]);

      if (records && records.length > 0) {
        resolves = true;
        mxRecords = records.map((r) => `${r.exchange} (pri: ${r.priority})`);
      }
    } catch {
      // Fallback to checking A records
      try {
        const aLookup = dns.resolve4(domain);
        const aRecords = await aLookup;
        if (aRecords && aRecords.length > 0) {
          resolves = true;
          mxRecords = [`A: ${aRecords[0]}`];
        }
      } catch {
        resolves = false;
      }
    }

    // Save to Vercel KV / Memory Cache (1 hr TTL)
    await setCachedMxRecord(domain, { resolves, mxRecords }, 3600);

    const warnings = [...clientEval.warnings];
    if (!resolves) {
      warnings.push(`Domain '${domain}' failed DNS/MX host resolution.`);
    }

    let confidence = clientEval.confidence;
    if (!resolves) {
      confidence = 'BOUNCE LIKELY / INVALID';
    } else if (clientEval.isGenericAlias) {
      confidence = 'BOUNCE LIKELY (UNMONITORED ALIAS)';
    } else {
      confidence = 'HIGH CONFIDENCE';
    }

    return NextResponse.json({
      ...clientEval,
      domainResolves: resolves,
      confidence,
      warnings,
      mxRecords,
    });
  } catch (err: unknown) {
    console.error('Email verification error:', err);
    return NextResponse.json(
      { error: 'Internal server error during email verification' },
      { status: 500 }
    );
  }
}
