'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job } from '../types/job';
import { getCleanLogoUrl } from '../lib/filterUtils';
import { ExternalLink, ChevronRight } from 'lucide-react';

interface MapViewInnerProps {
  jobs: Job[];
  selectedJob: Job | null;
  hoveredJob: Job | null;
  onSelectJob: (job: Job) => void;
}

// ─── Company cluster type ────────────────────────────────────────────────────
export interface CompanyCluster {
  key: string;           // unique cluster key
  company: string;
  company_logo?: string;
  company_domain?: string;
  lat: number;
  lon: number;
  jobs: Job[];
}

// ─── Group jobs by company into clusters ─────────────────────────────────────
// Jobs at the same company but very different lat/lon get separate clusters.
// We round to 3 decimal places (~100 m) to merge markers that are essentially the same office.
export function buildCompanyClusters(jobs: Job[]): CompanyCluster[] {
  const map = new Map<string, CompanyCluster>();

  for (const job of jobs) {
    if (!job.lat || !job.lon) continue;

    // Round to ~100 m grid to group nearby offices of the same company
    const latGrid = Math.round(job.lat * 100) / 100;
    const lonGrid = Math.round(job.lon * 100) / 100;
    const key = `${job.company}__${latGrid}__${lonGrid}`;

    if (map.has(key)) {
      map.get(key)!.jobs.push(job);
    } else {
      map.set(key, {
        key,
        company: job.company,
        company_logo: job.company_logo || getCleanLogoUrl(job.company, job.company_domain) || undefined,
        company_domain: job.company_domain,
        lat: job.lat,
        lon: job.lon,
        jobs: [job],
      });
    }
  }

  return Array.from(map.values());
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getLevelColor = (level?: string) => {
  switch (level?.toLowerCase()) {
    case 'entry':  return '#10B981';
    case 'mid':    return '#2563EB';
    case 'senior': return '#8B5CF6';
    case 'lead':   return '#F59E0B';
    default:       return '#6B7280';
  }
};

export const getCompanyColor = (name: string): string => {
  if (!name) return '#3b82f6';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 42%)`;
};

// ─── Create Leaflet DivIcon for a cluster ────────────────────────────────────
const createClusterIcon = (cluster: CompanyCluster, isActive: boolean) => {
  const count   = cluster.jobs.length;
  const size    = isActive ? 44 : 34;
  const initial = cluster.company.charAt(0).toUpperCase();
  const brandBg = getCompanyColor(cluster.company);

  // Dominant experience level (most common in the cluster)
  const levelCounts: Record<string, number> = {};
  for (const j of cluster.jobs) {
    const l = j.experience_level || 'Unknown';
    levelCounts[l] = (levelCounts[l] || 0) + 1;
  }
  const dominantLevel = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const borderColor   = getLevelColor(dominantLevel);

  const logoHtml = cluster.company_logo
    ? `<img src="${cluster.company_logo}" alt="${cluster.company}"
          style="width:100%;height:100%;object-fit:contain;padding:2px;border-radius:50%;"
          onload="if(this.naturalWidth<=16){this.style.display='none';this.nextElementSibling.style.display='flex';}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
       <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:${brandBg};border-radius:50%;color:white;font-size:${isActive ? '16px' : '13px'};font-weight:800;letter-spacing:-0.5px;text-shadow:0 1px 2px rgba(0,0,0,0.3);">
         ${initial}
       </div>`
    : `<div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:${brandBg};border-radius:50%;color:white;font-size:${isActive ? '16px' : '13px'};font-weight:800;letter-spacing:-0.5px;text-shadow:0 1px 2px rgba(0,0,0,0.3);">
         ${initial}
       </div>`;

  // Badge showing job count (only when > 1)
  const badgeHtml = count > 1
    ? `<div style="
          position:absolute;
          top:-4px;right:-4px;
          min-width:16px;height:16px;
          background:#2563EB;
          color:white;
          border-radius:8px;
          font-size:9px;
          font-weight:800;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0 3px;
          border:1.5px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
          line-height:1;
        ">${count > 99 ? '99+' : count}</div>`
    : '';

  const html = `
    <div style="
      position:relative;
      width:${size}px;
      height:${size}px;
    ">
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:white;
        border:${isActive ? '3px' : '2px'} solid ${borderColor};
        box-shadow:0 4px 10px rgba(0,0,0,${isActive ? '0.4' : '0.2'});
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        transform:${isActive ? 'scale(1.15)' : 'scale(1)'};
        transition:all 0.2s cubic-bezier(0.4,0,0.2,1);
      ">
        ${logoHtml}
      </div>
      ${badgeHtml}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-company-cluster-pin',
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size / 2) - 8],
  });
};

// ─── Map flyTo & resize controller with Viewport Bounds Tracking ──────────────
function MapController({
  selectedJob,
  hoveredJob,
  onBoundsChange,
}: {
  selectedJob: Job | null;
  hoveredJob: Job | null;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
}) {
  const map = useMap();

  // Invalidate size on mount, resize, tab switch, and container size changes
  useEffect(() => {
    map.invalidateSize();
    onBoundsChange(map.getBounds());

    // Auto-invalidate size when container becomes visible or resizes
    const container = map.getContainer();
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
        onBoundsChange(map.getBounds());
      });
      resizeObserver.observe(container);
    }

    const timer1 = setTimeout(() => {
      map.invalidateSize();
      onBoundsChange(map.getBounds());
    }, 100);
    const timer2 = setTimeout(() => {
      map.invalidateSize();
      onBoundsChange(map.getBounds());
    }, 300);

    const handleInvalidate = () => {
      map.invalidateSize();
      // If no job is selected/focused, keep the camera centered on Delhi NCR
      if (!selectedJob && !hoveredJob) {
        map.setView([28.5355, 77.3910], 11);
      }
      onBoundsChange(map.getBounds());
    };

    window.addEventListener('resize', handleInvalidate);
    window.addEventListener('orientationchange', handleInvalidate);
    window.addEventListener('mapInvalidateSize', handleInvalidate);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleInvalidate);
      window.removeEventListener('orientationchange', handleInvalidate);
      window.removeEventListener('mapInvalidateSize', handleInvalidate);
    };
  }, [map, onBoundsChange, selectedJob, hoveredJob]);

  // Update bounds on moveend and zoomend
  useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
  });

  useEffect(() => {
    const target = selectedJob || hoveredJob;
    if (target && target.lat && target.lon) {
      map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), 13), {
        duration: 0.6,
      });
    }
  }, [selectedJob, hoveredJob, map]);

  useEffect(() => {
    const handleFlyTo = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { lat, lon, zoom } = customEvent.detail;
      if (lat && lon) {
        map.flyTo([lat, lon], zoom || 11, { duration: 0.6 });
      }
    };
    window.addEventListener('flyTo', handleFlyTo);
    return () => window.removeEventListener('flyTo', handleFlyTo);
  }, [map]);

  return null;
}

// ─── Company Positions Popup ──────────────────────────────────────────────────
interface CompanyPopupProps {
  cluster: CompanyCluster;
  onSelectJob: (job: Job) => void;
}

const CompanyPopup: React.FC<CompanyPopupProps> = ({ cluster, onSelectJob }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleJobs = expanded ? cluster.jobs : cluster.jobs.slice(0, 5);
  const brandBg = getCompanyColor(cluster.company);

  return (
    <div className="p-1" style={{ minWidth: '240px', maxWidth: '300px' }}>
      {/* Company header */}
      <div className="flex items-center gap-2.5 mb-3">
        {cluster.company_logo ? (
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white">
            <img
              src={cluster.company_logo}
              alt={cluster.company}
              className="h-full w-full object-contain p-0.5"
              onLoad={(e) => {
                if ((e.currentTarget as HTMLImageElement).naturalWidth <= 16) {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div
              style={{ display: 'none', backgroundColor: brandBg }}
              className="h-full w-full items-center justify-center font-bold text-white text-sm"
            >
              {cluster.company.charAt(0)}
            </div>
          </div>
        ) : (
          <div
            style={{ backgroundColor: brandBg }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-white text-sm shadow-sm"
          >
            {cluster.company.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-bold text-zinc-900 text-sm leading-tight">{cluster.company}</h4>
          <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
            {cluster.jobs.length} open position{cluster.jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-2">
        {visibleJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 hover:bg-blue-50 cursor-pointer group transition-colors"
            onClick={() => onSelectJob(job)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 group-hover:text-blue-700 line-clamp-1">
                {job.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {job.experience_level && (
                  <span
                    className="text-[10px] font-bold rounded px-1 py-px"
                    style={{
                      background: `${getLevelColor(job.experience_level)}18`,
                      color: getLevelColor(job.experience_level),
                    }}
                  >
                    {job.experience_level}
                  </span>
                )}
                {job.salary_range && (
                  <span className="text-[10px] text-emerald-600 font-semibold">{job.salary_range}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Apply"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <ChevronRight className="h-3 w-3 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}

        {cluster.jobs.length > 5 && (
          <button
            className="mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 text-center py-1 transition-colors"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? '▲ Show less'
              : `▼ Show ${cluster.jobs.length - 5} more position${cluster.jobs.length - 5 !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main MapViewInner component ──────────────────────────────────────────────
export const MapViewInner: React.FC<MapViewInnerProps> = ({
  jobs,
  selectedJob,
  hoveredJob,
  onSelectJob,
}) => {
  // Build company clusters from filtered jobs
  const clusters = useMemo(() => buildCompanyClusters(jobs), [jobs]);

  // Always open on NCR (Gurugram / Noida / Delhi corridor) at street level
  const NCR_CENTER: [number, number] = [28.5355, 77.3910];
  const NCR_ZOOM = 11;

  // Track map viewport bounds for aggressive marker pruning
  const [currentBounds, setCurrentBounds] = useState<L.LatLngBounds | null>(null);

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    setCurrentBounds(bounds);
  }, []);

  // Prune markers outside viewport bounds (with 35% margin so panning remains smooth)
  const visibleClusters = useMemo(() => {
    if (!currentBounds) {
      // Default initial view: Delhi NCR region (~1,100 markers instead of 4,700+)
      return clusters.filter((c) => {
        const inNcr = c.lat >= 28.0 && c.lat <= 29.1 && c.lon >= 76.5 && c.lon <= 77.9;
        const isSelected = selectedJob && c.jobs.some((j) => j.id === selectedJob.id);
        const isHovered = hoveredJob && c.jobs.some((j) => j.id === hoveredJob.id);
        return inNcr || isSelected || isHovered;
      });
    }

    const paddedBounds = currentBounds.pad(0.35);
    return clusters.filter((c) => {
      if (paddedBounds.contains([c.lat, c.lon])) return true;
      if (selectedJob && c.jobs.some((j) => j.id === selectedJob.id)) return true;
      if (hoveredJob && c.jobs.some((j) => j.id === hoveredJob.id)) return true;
      return false;
    });
  }, [clusters, currentBounds, selectedJob, hoveredJob]);

  // Used for the count badge overlay only
  const validJobs = jobs.filter((j) => j.lat && j.lon);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <MapContainer
        center={NCR_CENTER}
        zoom={NCR_ZOOM}
        scrollWheelZoom={true}
        preferCanvas={true}
        className="h-full w-full"
        style={{ minHeight: '100%', height: '100%', width: '100%', background: '#e5e7eb' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
          keepBuffer={4}
          updateWhenIdle={true}
          updateWhenZooming={false}
        />

        <MapController
          selectedJob={selectedJob}
          hoveredJob={hoveredJob}
          onBoundsChange={handleBoundsChange}
        />

        {visibleClusters.map((cluster) => {
          // A cluster is "active" if the selected/hovered job belongs to it
          const isActive =
            (selectedJob && cluster.jobs.some((j) => j.id === selectedJob.id)) ||
            (hoveredJob && cluster.jobs.some((j) => j.id === hoveredJob.id)) ||
            false;

          const icon = createClusterIcon(cluster, isActive);

          return (
            <Marker
              key={cluster.key}
              position={[cluster.lat, cluster.lon]}
              icon={icon}
            >
              <Popup
                className="custom-leaflet-popup company-cluster-popup"
                maxHeight={420}
              >
                <CompanyPopup cluster={cluster} onSelectJob={onSelectJob} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Cluster count badge overlay (visible on tablet/desktop) */}
      <div className="hidden sm:block absolute bottom-4 right-4 z-[400] rounded-lg border border-zinc-200/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md text-xs font-semibold text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-300">
        <span className="text-blue-600 font-bold dark:text-blue-400">{clusters.length}</span> companies ·{' '}
        <span className="text-zinc-800 font-bold dark:text-zinc-200">{validJobs.length}</span> positions
      </div>

      {/* Map Actions Overlay (Near me) */}
      <div className="absolute top-12 right-3 sm:top-3 sm:right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  window.dispatchEvent(
                    new CustomEvent('flyTo', { detail: { lat: latitude, lon: longitude, zoom: 12 } })
                  );
                },
                (err) => alert('Geolocation error: ' + err.message)
              );
            } else {
              alert('Geolocation is not supported by your browser.');
            }
          }}
          className="rounded-lg border border-zinc-200/80 bg-white/95 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-blue-600 shadow-md backdrop-blur-md hover:bg-blue-50 dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:text-blue-400 dark:hover:bg-zinc-800"
          title="Find jobs near me"
        >
          <span className="hidden sm:inline">📍 Find jobs near me</span>
          <span className="sm:hidden">📍 Near me</span>
        </button>
      </div>

      {/* City quick-nav */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-4 sm:right-36 z-[400] flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { name: 'NCR',       coords: [28.5355, 77.3910] },
          { name: 'Bengaluru', coords: [12.9716, 77.5946] },
          { name: 'Hyderabad', coords: [17.3850, 78.4867] },
          { name: 'Pune',      coords: [18.5204, 73.8567] },
          { name: 'Mumbai',    coords: [19.0760, 72.8777] },
          { name: 'Chennai',   coords: [13.0827, 80.2707] },
          { name: 'Kolkata',   coords: [22.5726, 88.3639] },
          { name: 'GIFT City', coords: [23.1600, 72.6845] },
          { name: 'Kochi',     coords: [9.9312,  76.2673] },
        ].map((city) => (
          <button
            key={city.name}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('flyTo', { detail: { lat: city.coords[0], lon: city.coords[1], zoom: 11 } })
              )
            }
            className="whitespace-nowrap rounded-full border border-zinc-200/80 bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 shadow-sm backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Map Legend */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-[400] items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <span className="text-[10px] font-bold uppercase text-zinc-400">Level:</span>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Entry
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Mid
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600" /> Senior
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Lead
        </div>
        <span className="text-[10px] text-zinc-400">· border = dominant level</span>
      </div>
    </div>
  );
};
