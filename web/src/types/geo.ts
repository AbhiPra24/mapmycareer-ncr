/**
 * Compact representation for geospatial point indexing.
 * Tuple: [id, lat, lng, levelIndex]
 * 0 = entry, 1 = mid, 2 = senior, 3 = lead/principal/exec, 4 = unknown
 */
export type CompactJobTuple = [
  id: string,
  lat: number,
  lng: number,
  level: number
];

export interface GeoPointProperties {
  cluster: false;
  id: string;
  level: number;
}

export interface GeoClusterProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
}

export type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, GeoClusterProperties | GeoPointProperties>;

export type BBox = [westLng: number, southLat: number, eastLng: number, northLat: number];

export type WorkerInMessage =
  | { type: 'LOAD_POINTS'; points: CompactJobTuple[] }
  | { type: 'GET_CLUSTERS'; bbox: BBox; zoom: number };

export type WorkerOutMessage =
  | { type: 'POINTS_LOADED'; total: number }
  | { type: 'CLUSTERS_READY'; clusters: ClusterFeature[]; zoom: number };
