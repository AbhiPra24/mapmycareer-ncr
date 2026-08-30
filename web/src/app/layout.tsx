import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mapmycareer.online'),
  title: {
    default: 'MapMyCareer Delhi NCR - Geo-Spatial Job Discovery & Tech Radar',
    template: '%s | MapMyCareer',
  },
  description:
    'Explore 500+ verified real tech jobs across Gurugram, Noida, and Delhi with interactive map corridors, campus coordinates, commute insights, and salary filters.',
  keywords: [
    'Delhi NCR Tech Jobs',
    'Gurgaon Software Engineer Jobs',
    'Noida Developer Jobs',
    'DLF Cyber City Tech Openings',
    'Golf Course Road Gurgaon Jobs',
    'Sector 62 Noida IT Jobs',
    'Noida Expressway Tech Parks',
    'Aerocity Delhi Tech Jobs',
    'Geospatial Job Radar',
    'MapMyCareer',
    'Tech Jobs Commute Radar',
  ],
  authors: [{ name: 'Abhinav Prakash' }, { name: 'MapMyCareer' }],
  creator: 'Abhinav Prakash',
  publisher: 'MapMyCareer',
  applicationName: 'MapMyCareer',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MapMyCareer Delhi NCR · Geo-Spatial Tech Job Radar',
    description:
      'Map-first interactive job discovery for Delhi NCR tech corridors (Gurugram, Noida, Delhi). Explore 500+ verified tech jobs mapped to exact office campuses.',
    url: 'https://www.mapmycareer.online',
    siteName: 'MapMyCareer',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Geo-Spatial%20Tech%20Job%20Radar&company=India%20Tech%20Hubs&city=Delhi%20NCR%20%7C%20Bengaluru%20%7C%20Hyderabad&hub=DLF%20Cyber%20City%20%7C%20Outer%20Ring%20Road&salary=%E2%82%B925L%20-%20%E2%82%B960L',
        width: 1200,
        height: 630,
        alt: 'MapMyCareer India Tech Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MapMyCareer Delhi NCR · Geo-Spatial Tech Job Radar',
    description:
      'Explore 500+ verified tech jobs mapped to exact office campuses across Gurugram, Noida & Delhi.',
    images: ['/api/og?title=Geo-Spatial%20Tech%20Job%20Radar&company=India%20Tech%20Hubs&city=Delhi%20NCR%20%7C%20Bengaluru%20%7C%20Hyderabad&hub=DLF%20Cyber%20City%20%7C%20Outer%20Ring%20Road&salary=%E2%82%B925L%20-%20%E2%82%B960L'],
  },
  verification: {
    google: 'XR4_4wE5Q3wYA7z66aZFzdZNDBgLOQoOYDowiaKROck',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.mapmycareer.online/#website',
      url: 'https://www.mapmycareer.online',
      name: 'MapMyCareer',
      description:
        'Geospatial tech job discovery radar for Delhi NCR (Gurugram, Noida, Delhi).',
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://www.mapmycareer.online/#webapp',
      name: 'MapMyCareer Delhi NCR Job Radar',
      url: 'https://www.mapmycareer.online',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      featureList: [
        'Interactive Leaflet Pin Clusters',
        'Hiring Density Heatmaps',
        'Campus & Tech Park Coordinates',
        '500+ Verified Live Tech Openings in Delhi NCR',
        'Inline Filtering by Stack, Experience, and Work Model',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
