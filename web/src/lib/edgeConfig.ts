/**
 * Vercel Edge Config Dynamic Flags & Announcements Utility
 * Reads dynamic flags (announcements, maintenance, beta engines)
 * with instant fallback when EDGE_CONFIG is not configured.
 */

import { get } from '@vercel/edge-config';

export interface EdgeConfigFlags {
  bannerAnnouncement: string | null;
  maintenanceMode: boolean;
  enableAiPreview: boolean;
  featuredCorridor: string;
}

const DEFAULT_FLAGS: EdgeConfigFlags = {
  bannerAnnouncement: '🚀 1,450+ verified live tech jobs across Bengaluru, NCR & Hyderabad mapped with campus accuracy!',
  maintenanceMode: false,
  enableAiPreview: false,
  featuredCorridor: 'Outer Ring Road & DLF Cyber City',
};

const isEdgeConfigSet = Boolean(process.env.EDGE_CONFIG);

/**
 * Fetch dynamic configuration flags from Edge Config or fallback
 */
export async function getDynamicFeatureFlags(): Promise<EdgeConfigFlags> {
  if (!isEdgeConfigSet) {
    return DEFAULT_FLAGS;
  }

  try {
    const flags = await get<EdgeConfigFlags>('flags');
    return {
      ...DEFAULT_FLAGS,
      ...(flags || {}),
    };
  } catch (err) {
    console.warn('Edge Config fetch error, using defaults:', err);
    return DEFAULT_FLAGS;
  }
}

/**
 * Fetch a single string flag from Edge Config
 */
export async function getEdgeConfigString(key: string, defaultValue: string): Promise<string> {
  if (!isEdgeConfigSet) return defaultValue;

  try {
    const val = await get<string>(key);
    return typeof val === 'string' ? val : defaultValue;
  } catch {
    return defaultValue;
  }
}
