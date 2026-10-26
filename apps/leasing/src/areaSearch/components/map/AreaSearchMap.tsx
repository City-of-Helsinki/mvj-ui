import React, { useCallback } from "react";
import classNames from "classnames";
import MapContainer from "@/areaNote/components/MapContainer";
import LeafletDrawControl, {
  DRAFT_DRAW_OPTIONS,
} from "@/components/map/LeafletDrawControl";
import useDrawnFeatureGroup from "@/components/map/useDrawnFeatureGroup";
import { showMeasurements } from "@/components/map/measurements";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import { mergePolygonFeaturesToMultiPolygon } from "@/components/map/geojson";
type Props = {
  change: (...args: Array<any>) => any;
  hasError: boolean;
};
const AreaSearchMap = ({ change, hasError }: Props) => {
  const {
    featureGroup,
    getDrawnFeatures,
    handleMapReady,
    handleNonCommittedChange,
    map,
  } = useDrawnFeatureGroup();
  const handleAction = useCallback(() => {
    change(mergePolygonFeaturesToMultiPolygon(getDrawnFeatures()));
  }, [change, getDrawnFeatures]);
  const handleCreated = useCallback(
    (e: Record<string, any>) => {
      showMeasurements(e.layer, map);
      handleAction();
    },
    [handleAction, map],
  );

  return (
    <div
      className={classNames("AreaSearchMap", {
        "AreaSearchMap--has-error": hasError,
      })}
    >
      <div className="map">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          onMapReady={handleMapReady}
        />
        <LeafletDrawControl
          map={map}
          featureGroup={featureGroup}
          onCreated={handleCreated}
          onDeleted={handleAction}
          onEdited={handleAction}
          onNonCommittedChange={handleNonCommittedChange}
          draw={DRAFT_DRAW_OPTIONS}
        />
      </div>
    </div>
  );
};

export default AreaSearchMap;
