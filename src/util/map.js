// @flow
import L from 'leaflet';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

/**
 * Get areas coordinates & invert them
 * @param area
 */
export const getAreaCoordinates = (area: ?Object) => area && get(area, 'mpoly.coordinates.0.0').map(arr => [arr[1], arr[0]]);

export const getCoordinatesOfGeometry = (geometry: any) => {
  if(!geometry) {
    return [];
  }

  const getSingleArrayOfCoordinates = (items) => {
    let tempCoords = [];
    if(isArray(items) && !isArray(items[0])) {
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
 * Set leaflet draw strings in Finnish
 */
export const localizeMap = () => {
  L.drawLocal.draw.handlers.circle.tooltip.start = 'Klikkaa ja raahaa piirtääksesi ympyrän';
  L.drawLocal.draw.handlers.circle.radius = 'Säde';
  L.drawLocal.draw.handlers.polygon.tooltip.start = 'Aloita alueen piirtäminen klikkaamalla.';
  L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Jatka alueen piirtämistä klikkaamalla';
  L.drawLocal.draw.handlers.polygon.tooltip.end = 'Klikkaa ensimmäistä pistettä kuvion päättämiseksi';
  L.drawLocal.draw.handlers.polyline.error = '<strong>Virhe:</strong> kuvion reunat ei saa leikata toisiaan!';
  L.drawLocal.draw.handlers.polyline.tooltip.start = 'Aloita viivan piirtäminen klikkaamalla.';
  L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Jatka viivan piirtämistä klikkaamalla';
  L.drawLocal.draw.handlers.polyline.tooltip.end = 'Klikkaa viimeistä pistettä viivan päättämiseksi';
  L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Klikkaa ja raahaa piirtääksesi suorakulmion';
  L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Vapauta hiiren painike päättääksesi piirtämisen.';

  L.drawLocal.edit.handlers.edit.tooltip.text = 'Muokkaa ominaisuuksia vetämällä kahvoja';
  L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Klikkaa peruuta-painiketta kumotaksesi muutokset';
  L.drawLocal.edit.handlers.remove.tooltip.text = 'Klikkaa aluetta poistaaksesi sen';

  L.drawLocal.draw.toolbar.actions.title = 'Peruuta piirtäminen';
  L.drawLocal.draw.toolbar.actions.text = 'Peruuta';
  L.drawLocal.draw.toolbar.finish.title = 'Lopeta piirtäminen';
  L.drawLocal.draw.toolbar.finish.text = 'Lopeta';
  L.drawLocal.draw.toolbar.undo.title = 'Poista viimeisin piirretty piste';
  L.drawLocal.draw.toolbar.undo.text = 'Poista viimeisin piste';

  L.drawLocal.edit.toolbar.actions.save.title = 'Tallenna muutokset';
  L.drawLocal.edit.toolbar.actions.save.text = 'Tallenna';
  L.drawLocal.edit.toolbar.actions.cancel.title = 'Peruuta muutokset';
  L.drawLocal.edit.toolbar.actions.cancel.text = 'Peruuta';
  L.drawLocal.edit.toolbar.actions.clearAll.title = 'Poista kaikki';
  L.drawLocal.edit.toolbar.actions.clearAll.text = 'Poista kaikki';

  L.drawLocal.draw.toolbar.buttons.polyline = 'Piirrä viiva';
  L.drawLocal.draw.toolbar.buttons.polygon = 'Piirrä monikulmio';
  L.drawLocal.draw.toolbar.buttons.rectangle = 'Piirrä suorakaide';
  L.drawLocal.draw.toolbar.buttons.circle = 'Piirrä ympyrä';
  L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
  L.drawLocal.edit.toolbar.buttons.edit = 'Muokkaa alueita';
  L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
  L.drawLocal.edit.toolbar.buttons.remove = 'Poista alueita';
  L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Ei poistettavia alueita';
};

export const getCoordsToLatLng = (geojson: ?Object) => {
  let crs;

  if (geojson) {
    if (geojson.crs && geojson.crs.type === 'name') {
      crs = new L.Proj.CRS(geojson.crs.properties.name);
    } else if (geojson.crs && geojson.crs.type) {
      crs = new L.Proj.CRS(geojson.crs.type + ':' + geojson.crs.properties.code);
    }

    if (crs !== undefined) {
      return (coords: Array<Object>) => {
        var point = L.point(coords[0], coords[1]);
        return crs ? crs.projection.unproject(point) : null;
      };
    }
  }
};

export const getCoordinatesCenter = (coordinates: Array<any>) => {
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
    lat = maxLat - ((maxLat - minLat) / 2),
    lng = maxLon - ((maxLon - minLon) / 2);

  return [lng, lat];
};

export const getCoordinatesBounds = (coordinates: Array<any>) => {
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
