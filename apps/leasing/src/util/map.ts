import { isArray } from "lodash-es";
import * as L from "leaflet";
import type { LatLngBounds } from "leaflet";

/**
 * Translate Geoman literals in Finnish.
 */
export const localizeMap = (map: L.Map): void => {
  map.pm.setLang("fi", {
    tooltips: {
      firstVertex: "Aloita alueen piirtäminen klikkaamalla.",
      continueLine: "Jatka alueen piirtämistä klikkaamalla",
      finishPoly: "Klikkaa ensimmäistä pistettä kuvion päättämiseksi",
      finishRect: "Vapauta hiiren painike päättääksesi piirtämisen.",
    },
    actions: {
      cancel: "Peruuta",
      finish: "Lopeta",
      removeLastVertex: "Poista viimeisin piste",
    },
    buttonTitles: {
      drawPolyButton: "Piirrä monikulmio",
      drawRectButton: "Piirrä suorakaide",
      editButton: "Muokkaa alueita",
      deleteButton: "Poista alueita",
    },
  });
};

const collectPositions = (
  items: unknown,
  positions: Array<[number, number]>,
): void => {
  if (!isArray(items) || items.length === 0) {
    return;
  }

  if (!isArray(items[0])) {
    if (items.length >= 2) {
      positions.push([items[0], items[1]]);
    }
    return;
  }

  items.forEach((item) => collectPositions(item, positions));
};

/**
 * Get the [longitude, latitude] positions of a geometry, whatever its nesting.
 */
export const getCoordinatesOfGeometry = (
  geometry: any,
): Array<[number, number]> => {
  const positions: Array<[number, number]> = [];
  collectPositions(geometry?.coordinates, positions);
  return positions;
};

// Loops instead of Math.min(...values), which overflows the stack on large inputs.
const getExtent = (positions: ReadonlyArray<GeoJSON.Position>) => {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of positions) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  // Not finite when there were no positions to measure.
  return [minLng, maxLng, minLat, maxLat].every(Number.isFinite)
    ? { minLng, maxLng, minLat, maxLat }
    : null;
};

const toCoordinate = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }

  return typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
};

/**
 * Get bounds from a [west, south, east, north] bbox, as numbers or the numeric
 * strings read from the URL. Returns null for anything else.
 */
export const getBoundsFromBBox = (bbox: unknown): LatLngBounds | null => {
  if (!isArray(bbox) || bbox.length < 4) return null;

  const [west, south, east, north] = bbox.slice(0, 4).map(toCoordinate);
  if (![west, south, east, north].every(Number.isFinite)) return null;

  return L.latLngBounds([south, west], [north, east]);
};

/**
 * Get bounds around [longitude, latitude] positions, or null if there are none.
 */
export const getBoundsFromCoordinates = (
  coordinates: ReadonlyArray<GeoJSON.Position>,
): LatLngBounds | null => {
  const extent = getExtent(coordinates);
  if (!extent) return null;

  return L.latLngBounds(
    [extent.minLat, extent.minLng],
    [extent.maxLat, extent.maxLng],
  );
};

/**
 * Get bounds around the geometries of a feature collection, or null if there
 * are none.
 */
export const getBoundsFromFeatures = (
  featureCollection: {
    features?: ReadonlyArray<{ geometry?: unknown }> | null;
  } | null,
): LatLngBounds | null =>
  getBoundsFromCoordinates(
    (featureCollection?.features ?? []).flatMap((feature) =>
      getCoordinatesOfGeometry(feature?.geometry),
    ),
  );

/**
 * Get the center of [longitude, latitude] positions as a Leaflet
 * [latitude, longitude] tuple, or null if there are none.
 */
export const getCenterFromCoordinates = (
  coordinates: ReadonlyArray<GeoJSON.Position>,
): [number, number] | null => {
  const extent = getExtent(coordinates);
  if (!extent) return null;

  const { minLng, maxLng, minLat, maxLat } = extent;
  return [maxLat - (maxLat - minLat) / 2, maxLng - (maxLng - minLng) / 2];
};
export const getAreaFromGeoJSON = (geometry: Record<string, any>): number => {
  let area = 0;

  if (!geometry?.type) {
    return area;
  }

  switch (geometry.type) {
    case "GeometryCollection":
      geometry.geometries.forEach((geometry) => {
        area += getAreaFromGeoJSON(geometry);
      });
      break;

    case "MultiPolygon":
      L.GeoJSON.coordsToLatLngs(geometry.coordinates, 2).forEach((latLngs) => {
        area += getPolygonArea(latLngs);
      });
      break;

    case "Polygon":
      area = getPolygonArea(L.GeoJSON.coordsToLatLngs(geometry.coordinates, 1));
      break;

    default:
      break;
  }

  return area;
};

const getGeodesicRingArea = (latLngs: Array<L.LatLng>): number => {
  const earthRadius = 6378137;
  const degreesToRadians = Math.PI / 180;
  let area = 0;

  for (let index = 0; index < latLngs.length; index += 1) {
    const current = latLngs[index];
    const previous = latLngs[(index + latLngs.length - 1) % latLngs.length];
    area +=
      (previous.lng - current.lng) *
      degreesToRadians *
      (2 +
        Math.sin(previous.lat * degreesToRadians) +
        Math.sin(current.lat * degreesToRadians));
  }

  return Math.abs((area * earthRadius * earthRadius) / 2);
};

export const getPolygonArea = (rings: Array<Array<L.LatLng>>): number =>
  rings.reduce(
    (area, ring, index) =>
      area +
      (index === 0 ? getGeodesicRingArea(ring) : -getGeodesicRingArea(ring)),
    0,
  );
