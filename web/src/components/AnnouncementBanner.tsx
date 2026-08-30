'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface AnnouncementBannerProps {
  initialMessage?: string | null;
}

export function AnnouncementBanner({
  initialMessage = '🚀 1,450+ verified live tech jobs across Bengaluru, NCR & Hyderabad mapped with campus accuracy!',
}: AnnouncementBannerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || !initialMessage) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-between border-b border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80 px-4 py-2 text-xs font-medium text-blue-200 backdrop-blur-md dark:border-blue-500/30">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2 py-0.5 font-bold text-blue-300 ring-1 ring-inset ring-blue-400/30">
          <Sparkles className="h-3 w-3 text-blue-400" />
          <span>LIVE RADAR</span>
        </span>
        <span className="text-zinc-200">{initialMessage}</span>
        <span className="hidden items-center gap-1 font-semibold text-blue-400 underline decoration-blue-500/40 underline-offset-2 sm:inline-flex">
          Explore Corridors <ArrowRight className="h-3 w-3" />
        </span>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        aria-label="Dismiss banner"
        className="rounded-md p-1 text-blue-400 transition hover:bg-blue-900/50 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
