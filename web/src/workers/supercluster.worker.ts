/// <reference lib="webworker" />
import Supercluster from 'supercluster';
import {
  CompactJobTuple,
  ClusterFeature,
  GeoPointProperties,
  WorkerInMessage,
  WorkerOutMessage,
} from '../types/geo';

let index: Supercluster<GeoPointProperties, any> | null = null;

/**
 * Transforms compact tuple arrays into GeoJSON Points for Supercluster indexing.
 * This conversion runs entirely off the main thread.
 */
function convertTuplesToGeoJSON(
  points: CompactJobTuple[]
): GeoJSON.Feature<GeoJSON.Point, GeoPointProperties>[] {
  const len = points.length;
  const features = new Array<GeoJSON.Feature<GeoJSON.Point, GeoPointProperties>>(len);

  for (let i = 0; i < len; i++) {
    const [id, lat, lng, level] = points[i];
    features[i] = {
      type: 'Feature',
      properties: {
        cluster: false,
        id,
        level,
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };
  }

  return features;
}

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const data = event.data;

  switch (data.type) {
    case 'LOAD_POINTS': {
      const geoFeatures = convertTuplesToGeoJSON(data.points);

      // Supercluster instance with fast spatial k-d tree
      index = new Supercluster<GeoPointProperties, any>({
        radius: 60,
        maxZoom: 18,
        minPoints: 2,
      });

      index.load(geoFeatures);

      const res: WorkerOutMessage = {
        type: 'POINTS_LOADED',
        total: geoFeatures.length,
      };
      self.postMessage(res);
      break;
    }

    case 'GET_CLUSTERS': {
      if (!index) return;

      const { bbox, zoom } = data;
      // Clamp zoom to integer as supercluster expects integer zoom steps
      const clusters = index.getClusters(bbox, Math.round(zoom)) as ClusterFeature[];

      const res: WorkerOutMessage = {
        type: 'CLUSTERS_READY',
        clusters,
        zoom,
      };
      self.postMessage(res);
      break;
    }
  }
};
