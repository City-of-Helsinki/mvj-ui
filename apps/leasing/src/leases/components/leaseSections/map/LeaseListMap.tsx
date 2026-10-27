import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import LeaseListLayer from "@/leases/components/leaseSections/map/LeaseListLayer";
import useAreaNotesOverlay from "@/components/map/useAreaNotesOverlay";
import useMapViewport from "@/components/map/useMapViewport";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "@/leases/constants";
import { LeaseFieldPaths } from "@/leases/enums";
import { getContentLeasesGeoJson } from "@/leases/helpers";
import { getApiResponseResults, getFieldOptions } from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getLeasesByBBox,
} from "@/leases/selectors";
import type { Lease } from "@/leases/types";

const fitToResultsUntilViewportKnown = (searchQuery: Record<string, any>) =>
  !searchQuery.in_bbox;

type Props = {
  isLoading?: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
const LeaseListMap = ({ isLoading, onViewportChanged }: Props) => {
  const location = useLocation();
  const areaNotesOverlay = useAreaNotesOverlay({ showWhenEmpty: true });
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const leasesData = useAppSelector(getLeasesByBBox);
  const leasesGeoJson = useMemo(
    () => getContentLeasesGeoJson(getApiResponseResults(leasesData) as Lease[]),
    [leasesData],
  );
  const { bounds, center, handleViewportChanged, zoom } = useMapViewport({
    fitToResults: fitToResultsUntilViewportKnown,
    geoJson: leasesGeoJson,
    onViewportChanged,
  });
  const stateOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE),
    [leaseAttributes],
  );
  const overlayLayers = useMemo(() => {
    const layers = [];

    if (areaNotesOverlay) {
      layers.push(areaNotesOverlay);
    }
    layers.push({
      checked: true,
      component: (
        <LeaseListLayer
          key="leases"
          color={MAP_LAYER_COLORS[0 % MAP_LAYER_COLORS.length]}
          leasesGeoJson={leasesGeoJson}
          search={location.search}
          stateOptions={stateOptions}
        />
      ),
      name: "Vuokraukset",
    });
    return layers;
  }, [areaNotesOverlay, leasesGeoJson, location.search, stateOptions]);

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
      zoomLevelWarningText="Tarkenna lähemmäksi kartalla hakeaksesi vuokraukset"
    />
  );
};

export default LeaseListMap;
