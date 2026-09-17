'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CompactJobTuple,
  ClusterFeature,
  WorkerInMessage,
  WorkerOutMessage,
  BBox,
} from '../types/geo';

interface UseSuperclusterWorkerOptions {
  points: CompactJobTuple[];
  debounceMs?: number;
}

export function useSuperclusterWorker({
  points,
  debounceMs = 50,
}: UseSuperclusterWorkerOptions) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [clusters, setClusters] = useState<ClusterFeature[]>([]);
  const pendingQueryRef = useRef<{ bbox: BBox; zoom: number } | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Worker lifecycle (Next.js compatible worker URL)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const worker = new Worker(
      new URL('../workers/supercluster.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const msg = event.data;

      if (msg.type === 'POINTS_LOADED') {
        setIsReady(true);
        // If a query was requested before points finished indexing, dispatch now
        if (pendingQueryRef.current) {
          const { bbox, zoom } = pendingQueryRef.current;
          worker.postMessage({ type: 'GET_CLUSTERS', bbox, zoom });
          pendingQueryRef.current = null;
        }
      } else if (msg.type === 'CLUSTERS_READY') {
        setClusters(msg.clusters);
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Dispatch point loading when the points array changes
  useEffect(() => {
    if (!workerRef.current || points.length === 0) return;

    setIsReady(false);
    const msg: WorkerInMessage = { type: 'LOAD_POINTS', points };
    workerRef.current.postMessage(msg);
  }, [points]);

  // Viewport change handler debounced to prevent flooding worker during smooth zoom/pan
  const updateBoundingBox = useCallback(
    (bbox: BBox, zoom: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (!workerRef.current || !isReady) {
          pendingQueryRef.current = { bbox, zoom };
          return;
        }

        const msg: WorkerInMessage = { type: 'GET_CLUSTERS', bbox, zoom };
        workerRef.current.postMessage(msg);
      }, debounceMs);
    },
    [isReady, debounceMs]
  );

  return {
    clusters,
    isReady,
    updateBoundingBox,
  };
}
