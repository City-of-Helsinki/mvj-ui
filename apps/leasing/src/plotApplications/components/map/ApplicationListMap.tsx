import React, { useMemo } from "react";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import TargetListLayer from "@/plotApplications/components/map/TargetListLayer";
import useMapViewport from "@/components/map/useMapViewport";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "@/leases/constants";
import { getApplicationTargetGeoJson } from "@/plotApplications/helpers";
import { getApiResponseResults } from "@/util/helpers";
import { getApplicationsByBBox } from "@/plotApplications/selectors";

const hasSearch = (searchQuery: Record<string, any>) =>
  Boolean(searchQuery.search);

type OwnProps = {
  isLoading: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
const ApplicationListMap = ({ isLoading, onViewportChanged }: OwnProps) => {
  const applicationsData = useAppSelector(getApplicationsByBBox);
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
            color={MAP_LAYER_COLORS[0]}
            targetsGeoJson={applicationsGeoJson}
            stateOptions={[]}
          />
        ),
        name: "Kohteet",
      },
    ],
    [applicationsGeoJson],
  );
  const { bounds, center, handleViewportChanged, zoom } = useMapViewport({
    fitToResults: hasSearch,
    geoJson: applicationsGeoJson,
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
      showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES}
      zoom={zoom}
      zoomLevelWarningText="Tarkenna lähemmäksi kartalla hakeaksesi hakemusten kohteet"
    />
  );
};

export default ApplicationListMap;
