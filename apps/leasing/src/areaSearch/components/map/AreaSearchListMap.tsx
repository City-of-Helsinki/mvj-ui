import React, { useMemo } from "react";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import useMapViewport from "@/components/map/useMapViewport";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { getApiResponseResults } from "@/util/helpers";
import AreaSearchLayer from "@/areaSearch/components/map/AreaSearchLayer";
import { getAreaSearchListByBBox } from "@/areaSearch/selectors";
import { getAreaSearchGeoJson } from "@/areaSearch/helpers";
import { MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES } from "@/areaSearch/constants";

const hasSearch = (searchQuery: Record<string, any>) =>
  Boolean(searchQuery.search);

type OwnProps = {
  isLoading: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
const AreaSearchListMap = ({ isLoading, onViewportChanged }: OwnProps) => {
  const searchData = useAppSelector(getAreaSearchListByBBox);
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
  const { bounds, center, handleViewportChanged, zoom } = useMapViewport({
    fitToResults: hasSearch,
    geoJson: searchGeoJson,
    onViewportChanged,
  });

  return (
    <AreaNotesEditMap
      allowToEdit={false}
      bounds={bounds}
      center={center}
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
