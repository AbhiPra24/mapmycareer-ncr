import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CompactJobTuple } from '@/types/geo';

const LEVEL_MAP: Record<string, number> = {
  entry: 0,
  junior: 0,
  mid: 1,
  senior: 2,
  lead: 3,
  principal: 3,
  executive: 3,
};

let cachedPoints: CompactJobTuple[] | null = null;

export async function GET() {
  if (cachedPoints) {
    return NextResponse.json(cachedPoints, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const filePath = path.join(process.cwd(), 'public/data/jobs.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jobs = JSON.parse(fileContent);

    // Build thin payload: [id, lat, lon, levelIndex]
    const points: CompactJobTuple[] = [];
    for (const j of jobs) {
      if (typeof j.lat === 'number' && typeof j.lon === 'number') {
        const lvlStr = (j.experience_level || '').toLowerCase();
        const level = LEVEL_MAP[lvlStr] ?? 4;
        points.push([String(j.id), j.lat, j.lon, level]);
      }
    }

    cachedPoints = points;

    return NextResponse.json(points, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Failed to load map points:', err);
    return NextResponse.json({ error: 'Failed to generate map points' }, { status: 500 });
  }
}
