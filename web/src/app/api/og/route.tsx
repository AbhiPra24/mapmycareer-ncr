import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Senior Distributed Systems Engineer';
    const company = searchParams.get('company') || 'Verified Tech Employer';
    const city = searchParams.get('city') || 'India';
    const hub = searchParams.get('hub') || 'Top Tech Corridor';
    const salary = searchParams.get('salary') || '₹25L - ₹45L';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#09090b',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #18181b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  height: '48px',
                  width: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 900,
                  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
                }}
              >
                🧭
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                  }}
                >
                  MapMyCareer <span style={{ color: '#60a5fa' }}>India</span>
                </span>
                <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 600 }}>
                  Geo-Spatial Tech Intelligence & Radar
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#93c5fd',
              }}
            >
              <span>⚡ 100% Verified Live Role</span>
            </div>
          </div>

          {/* Central Role Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(63, 63, 70, 0.8)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#60a5fa',
                }}
              >
                {company}
              </span>
              <span style={{ color: '#52525b' }}>•</span>
              <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 600 }}>
                {city}
              </span>
            </div>

            <div
              style={{
                fontSize: title.length > 35 ? '38px' : '46px',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#fafafa',
              }}
            >
              {title}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(39, 39, 42, 0.9)',
                  border: '1px solid #3f3f46',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#e4e4e7',
                }}
              >
                <span>📍</span>
                <span>{hub}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#34d399',
                }}
              >
                <span>💰</span>
                <span>{salary}</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Details */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#71717a',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>• ATS Heuristic Audited</span>
              <span>• Levels.fyi Benchmarked</span>
              <span>• Exact Building GIS</span>
            </div>
            <div style={{ color: '#a1a1aa', fontWeight: 700 }}>mapmycareer.online</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('Failed to generate OG image:', e);
    return new Response('Failed to generate OpenGraph image', { status: 500 });
  }
}
