import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { isEmpty } from "lodash-es";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreasLayer from "./AreasLayer";
import Divider from "@/components/content/Divider";
import PlanUnitsLayer from "./PlanUnitsLayer";
import PlotsLayer from "./PlotsLayer";
import Title from "@/components/content/Title";
import { fetchAreaNoteList } from "@/areaNote/slice";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import {
  LeaseAreasFieldPaths,
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getContentAreasGeoJson,
  getContentPlanUnitsGeoJson,
  getContentPlotsGeoJson,
  getLeaseCoordinates,
} from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldOptions,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "@/util/map";
import { getAreaNoteList } from "@/areaNote/selectors";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getIsEditMode,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
const SingleLeaseMap = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const areaNotes = useAppSelector(getAreaNoteList);
  const currentLease = useAppSelector(getCurrentLease);
  const isEditMode = useAppSelector(getIsEditMode);
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const usersPermissions = useAppSelector(getUsersPermissions);

  useEffect(() => {
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      dispatch(fetchAreaNoteList({}));
    }
  }, [dispatch, usersPermissions]);

  const coordinates = useMemo(
    () => getLeaseCoordinates(currentLease),
    [currentLease],
  );
  const bounds = useMemo(
    () =>
      coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined,
    [coordinates],
  );
  const center = useMemo(
    () =>
      coordinates.length ? getCenterFromCoordinates(coordinates) : undefined,
    [coordinates],
  );
  const areasGeoJson = useMemo(
    () => getContentAreasGeoJson(currentLease),
    [currentLease],
  );
  const planUnitsGeoJson = useMemo(
    () => getContentPlanUnitsGeoJson(currentLease, false),
    [currentLease],
  );
  const planUnitsContractGeoJson = useMemo(
    () => getContentPlanUnitsGeoJson(currentLease, true),
    [currentLease],
  );
  const plotsGeoJson = useMemo(
    () => getContentPlotsGeoJson(currentLease, false),
    [currentLease],
  );
  const plotsContractGeoJson = useMemo(
    () => getContentPlotsGeoJson(currentLease, true),
    [currentLease],
  );
  const areaLocationOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseAreasFieldPaths.LOCATION),
    [leaseAttributes],
  );
  const areaTypeOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseAreasFieldPaths.TYPE),
    [leaseAttributes],
  );
  const plotTypeOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeasePlotsFieldPaths.TYPE),
    [leaseAttributes],
  );
  const plotDivisionStateOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
      ),
    [leaseAttributes],
  );
  const planUnitTypeOptions = useMemo(
    () =>
      getFieldOptions(leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE),
    [leaseAttributes],
  );
  const planUnitStateOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
      ),
    [leaseAttributes],
  );
  const planUnitIntendedUseOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
      ),
    [leaseAttributes],
  );
  const overlayLayers = useMemo(() => {
    const layers = [];
    const query = getUrlParams(location.search);

    if (
      isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.GEOMETRY)
    ) {
      layers.push({
        checked: true,
        component: (
          <PlanUnitsLayer
            key="plan_units"
            color={MAP_LAYER_COLORS[0 % MAP_LAYER_COLORS.length]}
            defaultPlanUnit={
              query.plan_unit ? Number(query.plan_unit) : undefined
            }
            planUnitsGeoJson={planUnitsGeoJson}
            planUnitIntendedUseOptions={planUnitIntendedUseOptions}
            planUnitStateOptions={planUnitStateOptions}
            planUnitTypeOptions={planUnitTypeOptions}
            plotDivisionStateOptions={plotDivisionStateOptions}
          />
        ),
        name: "Kaavayksiköt",
      });
      layers.push({
        checked: false,
        component: (
          <PlanUnitsLayer
            key="plan_units"
            color={MAP_LAYER_COLORS[1 % MAP_LAYER_COLORS.length]}
            defaultPlanUnit={
              query.plan_unit ? Number(query.plan_unit) : undefined
            }
            planUnitsGeoJson={planUnitsContractGeoJson}
            planUnitIntendedUseOptions={planUnitIntendedUseOptions}
            planUnitStateOptions={planUnitStateOptions}
            planUnitTypeOptions={planUnitTypeOptions}
            plotDivisionStateOptions={plotDivisionStateOptions}
          />
        ),
        name: "Kaavayksiköt sopimuksessa",
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: (
          <PlotsLayer
            key="plots"
            color={MAP_LAYER_COLORS[2 % MAP_LAYER_COLORS.length]}
            defaultPlot={query.plot ? Number(query.plot) : undefined}
            plotsGeoJson={plotsGeoJson}
            typeOptions={plotTypeOptions}
          />
        ),
        name: "Kiinteistöt/määräalat",
      });
      layers.push({
        checked: false,
        component: (
          <PlotsLayer
            key="plots"
            color={MAP_LAYER_COLORS[3 % MAP_LAYER_COLORS.length]}
            defaultPlot={query.plot ? Number(query.plot) : undefined}
            plotsGeoJson={plotsContractGeoJson}
            typeOptions={plotTypeOptions}
          />
        ),
        name: "Kiinteistöt/määräalat sopimuksessa",
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: (
          <AreasLayer
            key="areas"
            areasGeoJson={areasGeoJson}
            color={MAP_LAYER_COLORS[4 % MAP_LAYER_COLORS.length]}
            defaultArea={
              query.lease_area ? Number(query.lease_area) : undefined
            }
            locationOptions={areaLocationOptions}
            typeOptions={areaTypeOptions}
          />
        ),
        name: "Vuokrakohteet",
      });
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) &&
      !isEmpty(areaNotes)
    ) {
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

    return layers;
  }, [
    areaLocationOptions,
    areaNotes,
    areaTypeOptions,
    areasGeoJson,
    leaseAttributes,
    location.search,
    planUnitIntendedUseOptions,
    planUnitStateOptions,
    planUnitTypeOptions,
    planUnitsContractGeoJson,
    planUnitsGeoJson,
    plotDivisionStateOptions,
    plotTypeOptions,
    plotsContractGeoJson,
    plotsGeoJson,
    usersPermissions,
  ]);

  return (
    <>
      <Title
        enableUiDataEdit={isEditMode}
        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MAP)}
      >
        {LeaseFieldTitles.MAP}
      </Title>
      <Divider />
      <AreaNotesEditMap
        allowToEdit={false}
        bounds={bounds}
        center={center}
        overlayLayers={overlayLayers}
      />
    </>
  );
};

export default SingleLeaseMap;
