import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';
import { evaluateEmailClientSide } from '@/lib/emailValidator';

// Simple in-memory cache for domain MX resolution
const mxCache = new Map<string, { resolves: boolean; mxRecords: string[]; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

const BLOCKED_DOMAINS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '::1']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    const clientEval = evaluateEmailClientSide(email);
    if (!clientEval.isValidSyntax) {
      return NextResponse.json(clientEval);
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json(clientEval);
    }

    // SSRF Guard
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

    // Check cache
    const cached = mxCache.get(domain);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
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

    // DNS MX Lookup with 2.5s timeout
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
      // Fallback to checking A/AAAA records
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

    // Save to cache
    mxCache.set(domain, { resolves, mxRecords, timestamp: now });

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
