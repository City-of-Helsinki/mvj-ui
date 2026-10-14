import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { LatLngBounds } from "leaflet";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import TargetListLayer from "@/plotApplications/components/map/TargetListLayer";
import { DEFAULT_ZOOM, MAP_COLORS } from "@/util/constants";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "@/leases/constants";
import { getApplicationTargetGeoJson } from "@/plotApplications/helpers";
import { getApiResponseResults, getUrlParams } from "@/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "@/util/map";
import { getApplicationsByBBox } from "@/plotApplications/selectors";

const getMapBounds = (search: string): LatLngBounds | undefined => {
  const searchQuery = getUrlParams(search);
  return getBoundsFromBBox(searchQuery.in_bbox);
};

const getMapCenter = (search: string) => {
  const bounds = getMapBounds(search);
  return bounds ? bounds.getCenter() : null;
};

const getMapZoom = (search: string) => {
  const searchQuery = getUrlParams(search);
  return searchQuery.zoom || DEFAULT_ZOOM;
};

type OwnProps = {
  isLoading: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
const ApplicationListMap = ({ isLoading, onViewportChanged }: OwnProps) => {
  const location = useLocation();
  const applicationsData = useAppSelector(getApplicationsByBBox);
  const [zoom, setZoom] = useState(() => getMapZoom(location.search));
  const applicationsGeoJson = useMemo(
    () => getApplicationTargetGeoJson(getApiResponseResults(applicationsData)),
    [applicationsData],
  );
  const overlayLayers = useMemo(
    () => [
      {
        checked: true,
        component: (
          <TargetListLayer
            key="plot_search_targets"
            color={MAP_COLORS[0]}
            targetsGeoJson={applicationsGeoJson}
            stateOptions={[]}
          />
        ),
        name: "Kohteet",
      },
    ],
    [applicationsGeoJson],
  );
  const bounds = useMemo(() => {
    const searchQuery = getUrlParams(location.search);
    return searchQuery?.search
      ? (getBoundsFromFeatures(applicationsGeoJson) as unknown as
          LatLngBounds | undefined)
      : getMapBounds(location.search);
  }, [applicationsGeoJson, location.search]);
  const handleViewportChanged = useCallback(
    (mapOptions: Record<string, any>) => {
      setZoom(mapOptions.zoom);
      onViewportChanged(mapOptions);
    },
    [onViewportChanged],
  );

  return (
    <AreaNotesEditMap
      allowToEdit={false}
      bounds={bounds}
      center={getMapCenter(location.search)}
      isLoading={isLoading}
      onViewportChanged={handleViewportChanged}
      overlayLayers={overlayLayers}
      showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES}
      zoom={zoom}
      zoomLevelWarningText="Tarkenna lähemmäksi kartalla hakeaksesi hakemusten kohteet"
    />
  );
};

export default ApplicationListMap;
