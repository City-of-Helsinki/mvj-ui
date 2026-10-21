import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { LatLngBounds } from "leaflet";
import { useAppSelector } from "@/root/hooks";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import LeaseListLayer from "./LeaseListLayer";
import { DEFAULT_ZOOM } from "@/util/constants";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "@/leases/constants";
import { LeaseFieldPaths } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentLeasesGeoJson } from "@/leases/helpers";
import {
  getApiResponseResults,
  getFieldOptions,
  getUrlParams,
  hasPermissions,
} from "@/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "@/util/map";
import { getAreaNoteList } from "@/areaNote/selectors";
import {
  getAttributes as getLeaseAttributes,
  getLeasesByBBox,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Lease } from "@/leases/types";

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

type Props = {
  isLoading?: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
const LeaseListMap = ({ isLoading, onViewportChanged }: Props) => {
  const location = useLocation();
  const areaNotes = useAppSelector(getAreaNoteList);
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const leasesData = useAppSelector(getLeasesByBBox);
  const usersPermissions = useAppSelector(getUsersPermissions);
  const [zoom, setZoom] = useState(() => getMapZoom(location.search));
  const leasesGeoJson = useMemo(
    () => getContentLeasesGeoJson(getApiResponseResults(leasesData) as Lease[]),
    [leasesData],
  );
  const stateOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE),
    [leaseAttributes],
  );
  const overlayLayers = useMemo(() => {
    const layers = [];

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      layers.push({
        checked: false,
        component: (
          <AreaNotesLayer
            key="area_notes"
            allowToEdit={false}
            areaNotes={areaNotes}
          />
        ),
        name: "Muistettavat ehdot",
      });
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
  }, [
    areaNotes,
    leasesGeoJson,
    location.search,
    stateOptions,
    usersPermissions,
  ]);
  const bounds = useMemo(() => {
    const searchQuery = getUrlParams(location.search);
    return searchQuery?.search?.length > 6
      ? (getBoundsFromFeatures(leasesGeoJson) as unknown as
          LatLngBounds | undefined)
      : getMapBounds(location.search);
  }, [leasesGeoJson, location.search]);
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
      zoomLevelWarningText="Tarkenna lähemmäksi kartalla hakeaksesi vuokraukset"
    />
  );
};

export default LeaseListMap;
