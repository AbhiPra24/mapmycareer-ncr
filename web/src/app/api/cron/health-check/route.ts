import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // 1. Authorization check for Vercel Cron
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
    }

    // 2. Validate jobs.json integrity
    const filePath = path.join(process.cwd(), 'public', 'data', 'jobs.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { status: 'error', message: 'public/data/jobs.json dataset file not found' },
        { status: 500 }
      );
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const jobs = JSON.parse(rawData);

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Dataset is empty or invalid array' },
        { status: 500 }
      );
    }

    // 3. Validate GIS coordinate completeness
    let validCoordinates = 0;
    let missingCoordinates = 0;

    jobs.forEach((job: { latitude?: number; longitude?: number }) => {
      if (
        typeof job.latitude === 'number' &&
        typeof job.longitude === 'number' &&
        !isNaN(job.latitude) &&
        !isNaN(job.longitude) &&
        job.latitude !== 0 &&
        job.longitude !== 0
      ) {
        validCoordinates += 1;
      } else {
        missingCoordinates += 1;
      }
    });

    const coordinateCoverage = ((validCoordinates / jobs.length) * 100).toFixed(2);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      dataset: {
        totalJobs: jobs.length,
        validCoordinates,
        missingCoordinates,
        coordinateCoverage: `${coordinateCoverage}%`,
      },
      system: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'production',
      },
    });
  } catch (err: unknown) {
    console.error('Health check cron error:', err);
    return NextResponse.json(
      { status: 'error', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
