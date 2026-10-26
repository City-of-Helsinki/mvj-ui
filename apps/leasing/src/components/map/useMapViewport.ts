import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { LatLngBounds } from "leaflet";
import { DEFAULT_ZOOM } from "@/util/constants";
import { getUrlParams } from "@/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "@/util/map";

type Options = {
  fitToResults: (searchQuery: Record<string, any>) => boolean;
  geoJson: Record<string, any>;
  onViewportChanged: (mapOptions: Record<string, any>) => any;
};

/**
 * The map owns its viewport after mount; the URL only seeds the initial view,
 * so `center` is read once and `bounds` is only a request to fit to results.
 */
const useMapViewport = ({
  fitToResults,
  geoJson,
  onViewportChanged,
}: Options) => {
  const location = useLocation();
  const [center] = useState(() =>
    getBoundsFromBBox(getUrlParams(location.search).in_bbox)?.getCenter(),
  );
  const [zoom, setZoom] = useState(
    () => getUrlParams(location.search).zoom || DEFAULT_ZOOM,
  );
  const shouldFitToResults = fitToResults(getUrlParams(location.search));
  const bounds = useMemo(
    () =>
      shouldFitToResults
        ? (getBoundsFromFeatures(geoJson) as unknown as
            LatLngBounds | undefined)
        : undefined,
    [geoJson, shouldFitToResults],
  );
  const handleViewportChanged = useCallback(
    (mapOptions: Record<string, any>) => {
      setZoom(mapOptions.zoom);
      onViewportChanged(mapOptions);
    },
    [onViewportChanged],
  );

  return { bounds, center, handleViewportChanged, zoom };
};

export default useMapViewport;
