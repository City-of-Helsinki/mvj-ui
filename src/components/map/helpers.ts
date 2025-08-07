import { LatLngTuple } from "leaflet";
import { Position, RecursivePosition } from "@/types/geojson";

export const convertGeoJSONArrayForLeaflet = (
  coordinates: Position[][],
): LatLngTuple[][] => {
  const reverseLngLat = ([
    longitude,
    latitude,
    altitude,
  ]: Position): LatLngTuple => [latitude, longitude, altitude];

  const transformCoordinates = (
    items: RecursivePosition,
  ): LatLngTuple | LatLngTuple[] => {
    if (!items.length) return [];
    if (typeof items[0] === 'number') {
      return reverseLngLat(items as Position);
    } else {
      return (items as RecursivePosition[]).map(
        transformCoordinates,
      ) as LatLngTuple[];
    }
  };
  return coordinates.map(transformCoordinates) as LatLngTuple[][];
};