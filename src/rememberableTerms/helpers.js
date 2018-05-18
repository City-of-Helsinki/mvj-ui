// @flow
import proj4 from 'proj4';
import get from 'lodash/get';

proj4.defs('EPSG:3879', '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('WGS84', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');

const convertCoordinatesToWSG84 = (coordinates: Array<number>): Array<number> =>
  coordinates.map((coordinate) =>
    proj4('EPSG:3879', 'WGS84', coordinate)
  );


export const convertFeatureGeometryToWSG84 = (feature: Object) => {
  let coordinates = [];
  switch (feature.type) {
    case 'Polygon':
      coordinates = get(feature, 'coordinates[0]', []);
      break;
    case 'LineString':
      coordinates = get(feature, 'coordinates', []);
      break;
    default:
  }

  return {
    type: feature.type,
    coordinates: [convertCoordinatesToWSG84(coordinates)],
  };
};

export const convertFeaturesToRememberableTermList = (features: Array<Object>): Array<Object> => {
  return features.map((feature) => {
    return {
      type: feature.type,
      geometry: convertFeatureGeometryToWSG84(feature.geometry),
      properties: feature.properties,
    };
  });
};

const convertCoordinatesTo3879 = (coordinates: Array<number>): Array<number> =>
  coordinates.map((coordinate) =>
    proj4('WGS84', 'EPSG:3879', coordinate)
  );

const convertFeatureGeometryTo3879 = (feature: Object) => {
  let coordinates = [];
  switch (feature.type) {
    case 'Polygon':
      coordinates = get(feature, 'coordinates[0]', []);
      break;
    case 'LineString':
      coordinates = get(feature, 'coordinates', []);
      break;
    default:
  }

  return {
    type: feature.type,
    coordinates: [convertCoordinatesTo3879(coordinates)],
  };
};

export const convertRememberableTermListToFeatures = (features: Array<Object>): Array<Object> => {
  return features.map((feature) => {
    return {
      type: feature.type,
      geometry: convertFeatureGeometryTo3879(feature.geometry),
      properties: feature.properties,
    };
  });
};

export const getRememberableTermsById = (geoJSON: Object, id: number) => {
  const rememberableTerms = {...geoJSON};
  const features = rememberableTerms.features.filter((feature) => id === feature.properties.id);
  rememberableTerms.features = features;

  return rememberableTerms;
};