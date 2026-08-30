import { describe, it, expect, beforeEach } from 'vitest';
import { getCachedMxRecord, setCachedMxRecord, checkRateLimit } from '../kvCache';
import { getDynamicFeatureFlags, getEdgeConfigString } from '../edgeConfig';

describe('Vercel KV & Edge Config Utilities', () => {
  describe('kvCache with in-memory fallback', () => {
    it('should set and get MX records in fallback memory cache', async () => {
      await setCachedMxRecord('google.com', {
        resolves: true,
        mxRecords: ['smtp.google.com (pri: 10)'],
      });

      const cached = await getCachedMxRecord('google.com');
      expect(cached).not.toBeNull();
      expect(cached?.resolves).toBe(true);
      expect(cached?.mxRecords).toContain('smtp.google.com (pri: 10)');
    });

    it('should return null for uncached domain', async () => {
      const cached = await getCachedMxRecord('uncached-nonexistent-domain-123.com');
      expect(cached).toBeNull();
    });

    it('should rate limit requests after exceeding max limit', async () => {
      const ip = '192.168.1.100';
      const limit = 5;

      for (let i = 0; i < limit; i++) {
        const res = await checkRateLimit(ip, limit, 60);
        expect(res.success).toBe(true);
      }

      const blockedRes = await checkRateLimit(ip, limit, 60);
      expect(blockedRes.success).toBe(false);
      expect(blockedRes.remaining).toBe(0);
    });
  });

  describe('edgeConfig fallback', () => {
    it('should return default feature flags when EDGE_CONFIG is not configured', async () => {
      const flags = await getDynamicFeatureFlags();
      expect(flags.bannerAnnouncement).toBeTruthy();
      expect(flags.maintenanceMode).toBe(false);
      expect(flags.featuredCorridor).toContain('Outer Ring Road');
    });

    it('should return default fallback string for individual key query', async () => {
      const val = await getEdgeConfigString('customBanner', 'Fallback Message');
      expect(val).toBe('Fallback Message');
    });
  });
});
