import L from "leaflet";

const EARTH_RADIUS = 6371008.8;

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

const formatArea = (squareMeters: number): string => {
  if (squareMeters < 10000) {
    return `${Math.round(squareMeters)} m²`;
  }
  return `${(squareMeters / 10000).toFixed(2)} ha`;
};

const getLatLngs = (layer: L.Polyline | L.Polygon): L.LatLng[] => {
  const latLngs = layer.getLatLngs() as L.LatLng[] | L.LatLng[][];
  const flatten = (items: L.LatLng[] | L.LatLng[][]): L.LatLng[] =>
    items.flatMap((item) => (Array.isArray(item) ? flatten(item) : [item]));
  return flatten(latLngs);
};

const getPolygonArea = (latLngs: L.LatLng[]): number => {
  if (latLngs.length < 3) {
    return 0;
  }

  const radians = latLngs.map((latLng) => ({
    latitude: (latLng.lat * Math.PI) / 180,
    longitude: (latLng.lng * Math.PI) / 180,
  }));
  let area = 0;
  for (let index = 0; index < radians.length; index += 1) {
    const current = radians[index];
    const next = radians[(index + 1) % radians.length];
    area +=
      (next.longitude - current.longitude) *
      (2 + Math.sin(current.latitude) + Math.sin(next.latitude));
  }
  return Math.abs((area * EARTH_RADIUS ** 2) / 2);
};

const getMeasurement = (layer: L.Polyline | L.Polygon): string => {
  const latLngs = getLatLngs(layer);
  if (layer instanceof L.Polygon) {
    return formatArea(getPolygonArea(latLngs));
  }

  let distance = 0;
  for (let index = 1; index < latLngs.length; index += 1) {
    distance += latLngs[index - 1].distanceTo(latLngs[index]);
  }
  return formatDistance(distance);
};

const getCircleMeasurement = (circle: L.Circle): string =>
  `${formatDistance(circle.getRadius())} radius, ${formatArea(
    Math.PI * circle.getRadius() ** 2,
  )}`;

export const showMeasurements = (layer: L.Layer): void => {
  if (!(layer instanceof L.Polyline) && !(layer instanceof L.Circle)) {
    return;
  }

  const measurement =
    layer instanceof L.Circle
      ? getCircleMeasurement(layer)
      : getMeasurement(layer);
  layer.bindTooltip(measurement, {
    permanent: true,
    direction: "center",
    className: "map-measurement",
  });
  layer.openTooltip();
};

export const updateMeasurements = (layer: L.Layer): void => {
  if (!(layer instanceof L.Polyline) && !(layer instanceof L.Circle)) return;
  const measurement =
    layer instanceof L.Circle
      ? getCircleMeasurement(layer)
      : getMeasurement(layer);
  layer.setTooltipContent(measurement);
};
