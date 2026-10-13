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

/**
 * Get coordinates array from geometry
 * @param  geometry
 * @returns {Object[]}
 */
export const getCoordinatesOfGeometry = (
  geometry: any,
): Array<[number, number]> => {
  if (!geometry) {
    return [];
  }

  const getSingleArrayOfCoordinates = (items) => {
    let tempCoords = [];

    if (isArray(items) && !isArray(items[0])) {
      tempCoords.push([items[0], items[1]]);
    } else {
      items.forEach((item) => {
        tempCoords = [...tempCoords, ...getSingleArrayOfCoordinates(item)];
      });
    }

    return tempCoords;
  };

  return getSingleArrayOfCoordinates(geometry.coordinates);
};

/**
 * Format geojson coordinates to leaflet understandable format
 * @param  {Object} geojson
 * @returns {Object}
 */
export const formatCoordsToLatLng = (
  geojson: Record<string, any> | null | undefined,
): (Record<string, any> | null | undefined) | null => {
  let crs;

  if (geojson) {
    if (geojson.crs && geojson.crs.type === "name") {
      crs = new L.Proj.CRS(geojson.crs.properties.name);
    } else if (geojson.crs && geojson.crs.type) {
      crs = new L.Proj.CRS(geojson.crs.type, geojson.crs.properties.code);
    }

    if (crs !== undefined) {
      return (coords: Array<number>) => {
        const point = L.point(coords[0], coords[1]);
        return crs ? crs.projection.unproject(point) : null;
      };
    }
  }
};

/**
 * Get bounds for leaflet from bbox array
 * @param {Object[]} bbox
 * @returns {Object}
 */
export const getBoundsFromBBox = (bbox: Array<number>): LatLngBounds => {
  if (!bbox || !isArray(bbox) || bbox.length < 4) return null;
  const maxBoundsSouthWest = new L.LatLng(bbox[3], bbox[2]),
    maxBoundsNorthEast = new L.LatLng(bbox[1], bbox[0]);
  return new L.LatLngBounds(maxBoundsSouthWest, maxBoundsNorthEast);
};

/**
 * Get bounds for leaflet from coordinates
 * @param {Object[]} coordinates
 * @returns Object
 */
export const getBoundsFromCoordinates = (
  coordinates: Array<any>,
): LatLngBounds => {
  const lats = [],
    lons = [];
  coordinates.forEach((coordinate) => {
    lats.push(coordinate[0]);
    lons.push(coordinate[1]);
  });
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLon = Math.min(...lons),
    maxLon = Math.max(...lons),
    maxBoundsSouthWest = new L.LatLng(minLon, minLat),
    maxBoundsNorthEast = new L.LatLng(maxLon, maxLat);
  return new L.LatLngBounds(maxBoundsSouthWest, maxBoundsNorthEast);
};

/**
 * Get bounds for leaflet from features object
 * @param {Object[]} leasesGeoJson
 * @returns Object
 */
export const getBoundsFromFeatures = (
  leasesGeoJson: Record<string, any>,
): Record<string, any> => {
  const lats = [],
    lons = [];
  if (leasesGeoJson && leasesGeoJson.features)
    leasesGeoJson.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.coordinates)
        feature.geometry.coordinates.forEach((points) =>
          points.forEach((point) =>
            point.forEach((coordinate) => {
              lats.push(coordinate[0]);
              lons.push(coordinate[1]);
            }),
          ),
        );
    });
  if (lats.length < 1 || lons.length < 1) return null;
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLon = Math.min(...lons),
    maxLon = Math.max(...lons),
    maxBoundsSouthWest = new L.LatLng(minLon, minLat),
    maxBoundsNorthEast = new L.LatLng(maxLon, maxLat);
  return new L.LatLngBounds(maxBoundsSouthWest, maxBoundsNorthEast);
};

/**
 * Get center for leaflet from coordinates
 * @param {Object[]} coordinates
 * @returns Object
 */
export const getCenterFromCoordinates = (
  coordinates: Array<any>,
): [number, number] => {
  const lats = [],
    lons = [];
  coordinates.forEach((coordinate) => {
    lats.push(coordinate[0]);
    lons.push(coordinate[1]);
  });
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLon = Math.min(...lons),
    maxLon = Math.max(...lons),
    lat = maxLat - (maxLat - minLat) / 2,
    lng = maxLon - (maxLon - minLon) / 2;
  return [lng, lat];
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
