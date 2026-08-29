import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  title: 'MapMyCareer Delhi NCR - Geo-Spatial Job Discovery & Tech Radar',
  description:
    'Explore 500+ verified real tech jobs across Gurugram, Noida, and Delhi with interactive map corridors, salary filters, and metro insights.',
  keywords: [
    'Delhi NCR Jobs',
    'Gurgaon Tech Jobs',
    'Noida Software Engineer Jobs',
    'DLF Cyber City Jobs',
    'MapMyCareer',
    'Geospatial Job Radar',
  ],
  authors: [{ name: 'MapMyCareer Team' }],
  openGraph: {
    title: 'MapMyCareer Delhi NCR · Geo-Spatial Tech Job Radar',
    description:
      'Map-first interactive job discovery for Delhi NCR tech corridors (Gurugram, Noida, Delhi).',
    url: 'https://mapmycareer.vercel.app',
    siteName: 'MapMyCareer',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
