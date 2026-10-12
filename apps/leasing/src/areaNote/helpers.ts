import { mergePolygonFeaturesToMultiPolygon } from "@/components/map/geojson";
import { getCoordinatesOfGeometry } from "@/util/map";
import type { AreaNote } from "./types";

type AreaNoteProperties = {
  id?: number;
  modified_at?: string;
  note?: string;
  user?: Record<string, any>;
};

export type AreaNoteMultiPolygonFeature = GeoJSON.Feature<
  GeoJSON.MultiPolygon,
  AreaNoteProperties
>;

export type AreaNotePolygonFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Polygon,
  AreaNoteProperties
>;

export type AreaNotePayload = {
  geometry: GeoJSON.MultiPolygon;
  id?: number;
  note?: string;
};

/**
 * Convert area note list to geojson
 * @param {Object[]} areaNotes
 * @returns {Object}
 */
export const convertAreaNoteListToGeoJson = (
  areaNotes: Array<Record<string, any>>,
): GeoJSON.FeatureCollection => {
  const features: Array<GeoJSON.Feature> = areaNotes.map((areaNote) => ({
    type: "Feature",
    geometry: areaNote.geometry,
    properties: {
      id: areaNote.id,
      modified_at: areaNote.modified_at,
      note: areaNote.note,
      user: areaNote.user,
    },
  }));
  return {
    type: "FeatureCollection",
    features: features,
  };
};

/**
 * Split an area note multipolygon into editable polygon features.
 */
export const convertAreaNoteToPolygonFeatureCollection = (
  feature: AreaNoteMultiPolygonFeature,
): AreaNotePolygonFeatureCollection => {
  const polygons = feature.geometry.coordinates;
  return {
    type: "FeatureCollection",
    features: polygons.map((polygon) => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: polygon,
      },
      properties: feature.properties,
    })),
  };
};

/**
 * Create an area-note API payload from Leaflet-drawn polygon features.
 */
export const convertDrawnFeaturesToAreaNotePayload = (
  features: Parameters<typeof mergePolygonFeaturesToMultiPolygon>[0],
): AreaNotePayload => {
  return {
    geometry: mergePolygonFeaturesToMultiPolygon(features),
  };
};

/**
 * Find area note by id
 * @param {Object[]} araNotes
 * @param {number} id
 * @returns {Object}
 */
export const getAreaNoteById = (
  areaNotes: Array<AreaNote>,
  id: number | null | undefined,
) => (id ? areaNotes.find((areaNote) => areaNote.id === id) : null);

/**
 * Get coordinates of area note
 * @param {Object} areaNote
 * @returns {Object[]}
 */
export const getAreaNoteCoordinates = (
  areaNote: AreaNote | null | undefined,
): Array<Record<string, any>> =>
  areaNote ? getCoordinatesOfGeometry(areaNote.geometry) : [];
