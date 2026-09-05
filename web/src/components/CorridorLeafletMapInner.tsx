'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job } from '../types/job';
import { buildCompanyClusters } from './MapViewInner';
import { getCleanLogoUrl } from '../lib/filterUtils';
import { Building2, ExternalLink } from 'lucide-react';

interface CorridorLeafletMapInnerProps {
  jobs: Job[];
  centerLat: number;
  centerLon: number;
  zoom?: number;
}

function createClusterIcon(company: string, count: number, logoUrl?: string): L.DivIcon {
  const badgeHtml =
    count > 1
      ? `<span style="
          position: absolute;
          top: -4px;
          right: -4px;
          background: #2563eb;
          color: #ffffff;
          border-radius: 9999px;
          padding: 1px 5px;
          font-size: 10px;
          font-weight: 800;
          line-height: 14px;
          border: 1.5px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        ">${count}</span>`
      : '';

  const innerHtml = logoUrl
    ? `<img src="${logoUrl}" alt="${company}" style="width: 22px; height: 22px; object-fit: contain; border-radius: 6px;" onerror="this.style.display='none'" />`
    : `<span style="font-size: 11px; font-weight: 800; color: #1e40af;">${company.slice(0, 2).toUpperCase()}</span>`;

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #ffffff;
      border: 2px solid #2563eb;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      cursor: pointer;
    ">
      ${innerHtml}
      ${badgeHtml}
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export const CorridorLeafletMapInner: React.FC<CorridorLeafletMapInnerProps> = ({
  jobs,
  centerLat,
  centerLon,
  zoom = 14,
}) => {
  const clusters = buildCompanyClusters(jobs);

  return (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', borderRadius: '0 0 16px 16px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />

      {clusters.slice(0, 75).map((cluster) => {
        const logo = cluster.company_logo || getCleanLogoUrl(cluster.company, cluster.company_domain);
        const icon = createClusterIcon(cluster.company, cluster.jobs.length, logo || undefined);

        return (
          <Marker
            key={cluster.key}
            position={[cluster.lat, cluster.lon]}
            icon={icon}
          >
            <Popup className="corridor-popup">
              <div className="p-1 min-w-[200px] text-xs font-sans">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-1.5 font-bold text-zinc-900">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>{cluster.company}</span>
                  <span className="ml-auto rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                    {cluster.jobs.length} jobs
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
                  {cluster.jobs.slice(0, 5).map((j) => (
                    <div key={j.id} className="text-zinc-700">
                      <p className="font-semibold text-zinc-800 line-clamp-1">{j.title}</p>
                      <p className="text-[10px] text-zinc-500">{j.salary_range || j.experience_yoe || 'Open'}</p>
                    </div>
                  ))}
                  {cluster.jobs.length > 5 && (
                    <p className="text-[10px] text-zinc-400">+{cluster.jobs.length - 5} more openings</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
