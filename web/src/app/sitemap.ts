import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mapmycareer.online';
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'jobs.json');
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, 'utf-8');
      const jobs = JSON.parse(fileData);

      // Unique Cities
      const cities = new Set<string>();
      jobs.forEach((j: { city?: string }) => {
        if (j.city) cities.add(j.city.toLowerCase().replace(/\s+/g, '-'));
      });

      cities.forEach((citySlug) => {
        entries.push({
          url: `${baseUrl}/jobs/${citySlug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (e) {
    console.error('Error generating dynamic sitemap:', e);
  }

  return entries;
}

