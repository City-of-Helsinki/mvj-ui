import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { LatLngBounds } from "leaflet";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import { DEFAULT_ZOOM } from "@/util/constants";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { getApiResponseResults, getUrlParams } from "@/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "@/util/map";
import AreaSearchLayer from "@/areaSearch/components/map/AreaSearchLayer";
import { getAreaSearchListByBBox } from "@/areaSearch/selectors";
import { getAreaSearchGeoJson } from "@/areaSearch/helpers";
import { MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES } from "@/areaSearch/constants";

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
const AreaSearchListMap = ({ isLoading, onViewportChanged }: OwnProps) => {
  const location = useLocation();
  const searchData = useAppSelector(getAreaSearchListByBBox);
  const [zoom, setZoom] = useState(() => getMapZoom(location.search));
  const searchGeoJson = useMemo(
    () => getAreaSearchGeoJson(getApiResponseResults(searchData) || []),
    [searchData],
  );
  const overlayLayers = useMemo(
    () => [
      {
        checked: true,
        component: (
          <AreaSearchLayer
            key="plot_search_targets"
            color={MAP_LAYER_COLORS[0]}
            areaSearchesGeoJson={searchGeoJson}
            stateOptions={[]}
          />
        ),
        name: "Kohteet",
      },
    ],
    [searchGeoJson],
  );
  const bounds = useMemo(() => {
    const searchQuery = getUrlParams(location.search);
    return searchQuery?.search
      ? (getBoundsFromFeatures(searchGeoJson) as unknown as
          LatLngBounds | undefined)
      : getMapBounds(location.search);
  }, [location.search, searchGeoJson]);
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
      center={getMapCenter(location.search) || undefined}
      isLoading={isLoading}
      onViewportChanged={handleViewportChanged}
      overlayLayers={overlayLayers}
      showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES}
      zoom={zoom}
      zoomLevelWarningText="Tarkenna lähemmäksi kartalla hakeaksesi hakemusten kohteet"
    />
  );
};

export default AreaSearchListMap;
