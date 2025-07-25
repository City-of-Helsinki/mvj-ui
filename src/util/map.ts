import isArray from "lodash/isArray";
import * as L from "leaflet";
import "leaflet-draw";
import type { LatLngBounds } from "leaflet";

/**
 * Translate leaflet draw literals in Finnish
 */
export const localizeMap = (): void => {
  L.drawLocal.draw.handlers.circle.tooltip.start =
    "Klikkaa ja raahaa piirtääksesi ympyrän";
  L.drawLocal.draw.handlers.circle.radius = "Säde";
  L.drawLocal.draw.handlers.polygon.tooltip.start =
    "Aloita alueen piirtäminen klikkaamalla.";
  L.drawLocal.draw.handlers.polygon.tooltip.cont =
    "Jatka alueen piirtämistä klikkaamalla";
  L.drawLocal.draw.handlers.polygon.tooltip.end =
    "Klikkaa ensimmäistä pistettä kuvion päättämiseksi";
  L.drawLocal.draw.handlers.polyline.error =
    "<strong>Virhe:</strong> kuvion reunat ei saa leikata toisiaan!";
  L.drawLocal.draw.handlers.polyline.tooltip.start =
    "Aloita viivan piirtäminen klikkaamalla.";
  L.drawLocal.draw.handlers.polyline.tooltip.cont =
    "Jatka viivan piirtämistä klikkaamalla";
  L.drawLocal.draw.handlers.polyline.tooltip.end =
    "Klikkaa viimeistä pistettä viivan päättämiseksi";
  L.drawLocal.draw.handlers.rectangle.tooltip.start =
    "Klikkaa ja raahaa piirtääksesi suorakulmion";
  L.drawLocal.draw.handlers.simpleshape.tooltip.end =
    "Vapauta hiiren painike päättääksesi piirtämisen.";
  L.drawLocal.edit.handlers.edit.tooltip.text =
    "Muokkaa ominaisuuksia vetämällä kahvoja";
  L.drawLocal.edit.handlers.edit.tooltip.subtext =
    "Klikkaa peruuta-painiketta kumotaksesi muutokset";
  L.drawLocal.edit.handlers.remove.tooltip.text =
    "Klikkaa aluetta poistaaksesi sen";
  L.drawLocal.draw.toolbar.actions.title = "Peruuta piirtäminen";
  L.drawLocal.draw.toolbar.actions.text = "Peruuta";
  L.drawLocal.draw.toolbar.finish.title = "Lopeta piirtäminen";
  L.drawLocal.draw.toolbar.finish.text = "Lopeta";
  L.drawLocal.draw.toolbar.undo.title = "Poista viimeisin piirretty piste";
  L.drawLocal.draw.toolbar.undo.text = "Poista viimeisin piste";
  L.drawLocal.edit.toolbar.actions.save.title = "Tallenna muutokset";
  L.drawLocal.edit.toolbar.actions.save.text = "Tallenna";
  L.drawLocal.edit.toolbar.actions.cancel.title = "Peruuta muutokset";
  L.drawLocal.edit.toolbar.actions.cancel.text = "Peruuta";
  L.drawLocal.edit.toolbar.actions.clearAll.title = "Poista kaikki";
  L.drawLocal.edit.toolbar.actions.clearAll.text = "Poista kaikki";
  L.drawLocal.draw.toolbar.buttons.polyline = "Piirrä viiva";
  L.drawLocal.draw.toolbar.buttons.polygon = "Piirrä monikulmio";
  L.drawLocal.draw.toolbar.buttons.rectangle = "Piirrä suorakaide";
  L.drawLocal.draw.toolbar.buttons.circle = "Piirrä ympyrä";
  L.drawLocal.edit.toolbar.buttons.editDisabled = "Ei muokattavia alueita";
  L.drawLocal.edit.toolbar.buttons.edit = "Muokkaa alueita";
  L.drawLocal.edit.toolbar.buttons.editDisabled = "Ei muokattavia alueita";
  L.drawLocal.edit.toolbar.buttons.remove = "Poista alueita";
  L.drawLocal.edit.toolbar.buttons.removeDisabled = "Ei poistettavia alueita";
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
        var point = L.point(coords[0], coords[1]);
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
        latLngs.forEach((latLng) => {
          const polygonArea = L.GeometryUtil.geodesicArea(latLng);
          area += polygonArea;
        });
      });
      break;

    case "Polygon":
      L.GeoJSON.coordsToLatLngs(geometry.coordinates, 1).forEach((latLng) => {
        area = L.GeometryUtil.geodesicArea(latLng);
      });
      break;

    default:
      break;
  }

  return area;
};
