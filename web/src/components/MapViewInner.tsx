'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job } from '../types/job';
import { ExternalLink, Building2 } from 'lucide-react';

interface MapViewInnerProps {
  jobs: Job[];
  selectedJob: Job | null;
  hoveredJob: Job | null;
  onSelectJob: (job: Job) => void;
}

const getMarkerBorderColor = (level?: string) => {
  switch (level?.toLowerCase()) {
    case 'entry':
      return '#10B981'; // emerald
    case 'mid':
      return '#2563EB'; // blue
    case 'senior':
      return '#8B5CF6'; // purple
    case 'lead':
      return '#F59E0B'; // amber
    default:
      return '#6B7280'; // gray
  }
};

// Create a custom Leaflet HTML DivIcon with the company logo / fallback initial
const createCompanyIcon = (job: Job, isSelected: boolean, isHovered: boolean) => {
  const color = getMarkerBorderColor(job.experience_level);
  const size = isSelected || isHovered ? 38 : 28;
  const initial = job.company.charAt(0).toUpperCase();

  const logoHtml = job.company_logo
    ? `<img src="${job.company_logo}" alt="${job.company}" class="w-full h-full object-contain p-0.5 rounded-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="fallback-initial hidden w-full h-full rounded-full bg-zinc-800 text-white text-[11px] font-bold items-center justify-center">${initial}</div>`
    : `<div class="w-full h-full rounded-full bg-zinc-800 text-white text-[11px] font-bold flex items-center justify-center">${initial}</div>`;

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: white;
      border: ${isSelected || isHovered ? '3px' : '2px'} solid ${color};
      box-shadow: 0 4px 10px rgba(0,0,0,${isSelected || isHovered ? '0.4' : '0.2'});
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform: ${isSelected || isHovered ? 'scale(1.15)' : 'scale(1)'};
      overflow: hidden;
    ">
      ${logoHtml}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-company-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

function MapController({
  selectedJob,
  hoveredJob,
}: {
  selectedJob: Job | null;
  hoveredJob: Job | null;
}) {
  const map = useMap();

  useEffect(() => {
    const target = selectedJob || hoveredJob;
    if (target && target.lat && target.lon) {
      map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), 13), {
        duration: 0.6,
      });
    }
  }, [selectedJob, hoveredJob, map]);

  return null;
}

export const MapViewInner: React.FC<MapViewInnerProps> = ({
  jobs,
  selectedJob,
  hoveredJob,
  onSelectJob,
}) => {
  // Compute center based on jobs
  const validJobs = jobs.filter((j) => j.lat && j.lon);
  const defaultCenter: [number, number] =
    validJobs.length > 0
      ? [
          validJobs.reduce((sum, j) => sum + j.lat!, 0) / validJobs.length,
          validJobs.reduce((sum, j) => sum + j.lon!, 0) / validJobs.length,
        ]
      : [20.5937, 78.9629];
  const defaultZoom = validJobs.length > 0 && Math.abs(validJobs[0].lat! - validJobs[validJobs.length - 1].lat!) > 3 ? 5 : 10;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: '100%', width: '100%', background: '#09090b' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedJob={selectedJob} hoveredJob={hoveredJob} />

        {jobs.map((job) => {
          if (!job.lat || !job.lon) return null;

          const isSelected = selectedJob?.id === job.id;
          const isHovered = hoveredJob?.id === job.id;
          const color = getMarkerBorderColor(job.experience_level);
          const customIcon = createCompanyIcon(job, isSelected, isHovered);

          return (
            <Marker
              key={job.id}
              position={[job.lat, job.lon]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectJob(job),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-start gap-2.5">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company}
                        className="h-8 w-8 shrink-0 rounded-lg border border-zinc-100 object-contain p-0.5"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 font-bold text-xs">
                        {job.company.charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          {job.experience_level || 'Tech'} · {job.workplace_model || 'Hybrid'}
                        </span>
                      </div>
                      <h4 className="mt-0.5 font-bold text-zinc-900 line-clamp-1">{job.title}</h4>
                      <p className="text-xs font-semibold text-zinc-600">{job.company}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 text-xs">
                    <span className="font-bold text-emerald-600">
                      {job.salary_range || 'Competitive'}
                    </span>
                    {job.apply_url && (
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Apply <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <span className="text-[10px] font-bold uppercase text-zinc-400">Experience:</span>
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
      </div>
    </div>
  );
};
