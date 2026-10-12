import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { LatLngBounds } from "leaflet";
import { DEFAULT_ZOOM } from "@/util/constants";
import { getUrlParams } from "@/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "@/util/map";

type Options = {
  fitToResults?: (searchQuery: Record<string, any>) => boolean;
  geoJson: Record<string, any>;
  onViewportChanged: (mapOptions: Record<string, any>) => any;
};

type Viewport = {
  bounds: LatLngBounds | undefined;
  center: ReturnType<LatLngBounds["getCenter"]> | undefined;
  handleViewportChanged: (mapOptions: Record<string, any>) => void;
  zoom: number;
};

const getMapBounds = (search: string): LatLngBounds | undefined => {
  const searchQuery = getUrlParams(search);
  return getBoundsFromBBox(searchQuery.in_bbox);
};

const getMapCenter = (search: string) => {
  const bounds = getMapBounds(search);
  return bounds ? bounds.getCenter() : undefined;
};

const getMapZoom = (search: string) => {
  const searchQuery = getUrlParams(search);
  return searchQuery.zoom || DEFAULT_ZOOM;
};

const useMapViewport = ({
  fitToResults = (searchQuery) => Boolean(searchQuery.search),
  geoJson,
  onViewportChanged,
}: Options): Viewport => {
  const location = useLocation();
  const [zoom, setZoom] = useState(() => getMapZoom(location.search));
  const bounds = useMemo<LatLngBounds | undefined>(() => {
    const searchQuery = getUrlParams(location.search);

    return fitToResults(searchQuery)
      ? (getBoundsFromFeatures(geoJson) as unknown as LatLngBounds | undefined)
      : getMapBounds(location.search);
  }, [fitToResults, geoJson, location.search]);
  const center = useMemo(
    () => getMapCenter(location.search),
    [location.search],
  );
  const handleViewportChanged = useCallback(
    (mapOptions: Record<string, any>) => {
      setZoom(mapOptions.zoom);
      onViewportChanged(mapOptions);
    },
    [onViewportChanged],
  );

  return {
    bounds,
    center,
    handleViewportChanged,
    zoom,
  };
};

export default useMapViewport;
