import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation } from "react-router";
import { get, isEmpty } from "lodash-es";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import InfillDevelopmentLeaseLayer from "./InfillDevelopmentLeaseLayer";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { fetchAreaNoteList } from "@/areaNote/actions";
import { fetchLeaseById } from "@/leases/actions";
import { MAP_COLORS } from "@/util/constants";
import {
  LeaseAreasFieldPaths,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getContentLeaseIdentifier,
  getLeaseCoordinates,
} from "@/leases/helpers";
import { getContentInfillDevelopmentLeaseGeoJson } from "@/infillDevelopment/helpers";
import { getFieldOptions, getUrlParams, hasPermissions } from "@/util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "@/util/map";
import { getAreaNoteList } from "@/areaNote/selectors";
import { getCurrentInfillDevelopment } from "@/infillDevelopment/selectors";
import {
  getAllLeases,
  getAttributes as getLeaseAttributes,
  getIsFetchingAllLeases,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { AreaNoteList } from "@/areaNote/types";
import type { InfillDevelopment } from "@/infillDevelopment/types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
const SingleInfillDevelopmentMap: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const allLeases: Array<Lease> = useAppSelector(getAllLeases);
  const areaNotes: AreaNoteList = useAppSelector(getAreaNoteList);
  const currentInfillDevelopment: InfillDevelopment = useAppSelector(
    getCurrentInfillDevelopment,
  );
  const isFetchingAllLeases: Array<boolean> = useAppSelector(
    getIsFetchingAllLeases,
  );
  const leaseAttributes: Attributes = useAppSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useAppSelector(getUsersPermissions);

  const [bounds, setBounds] = useState<any>();
  const [center, setCenter] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [layers, setLayers] = useState<Array<Record<string, any>>>([]);

  const infillDevelopmentLeases = useMemo(
    () =>
      get(
        currentInfillDevelopment,
        "infill_development_compensation_leases",
        [],
      ),
    [currentInfillDevelopment],
  );

  const areaLocationOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseAreasFieldPaths.TYPE),
    [leaseAttributes],
  );

  const areaTypeOptions = useMemo(() => [], []);

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

  useEffect(() => {
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      dispatch(fetchAreaNoteList({}));
    }
  }, [dispatch, usersPermissions]);

  useEffect(() => {
    let allFetched = true;

    infillDevelopmentLeases.forEach((lease) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];

      if (isEmpty(leaseData)) {
        if (!isFetchingAllLeases[leaseId]) {
          dispatch(fetchLeaseById(leaseId));
        }

        allFetched = false;
      }
    });

    if (!allFetched) {
      setIsLoading(true);
      return;
    }

    const coordinates = [];
    infillDevelopmentLeases.forEach((lease) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];
      coordinates.push(...getLeaseCoordinates(leaseData));
    });

    setBounds(
      coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined,
    );
    setCenter(
      coordinates.length ? getCenterFromCoordinates(coordinates) : undefined,
    );

    const query = getUrlParams(location.search);
    const nextLayers = infillDevelopmentLeases.map((lease, index) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];
      const identifier = getContentLeaseIdentifier(leaseData);

      return {
        checked: true,
        component: (
          <InfillDevelopmentLeaseLayer
            areaLocationOptions={areaLocationOptions}
            areaTypeOptions={areaTypeOptions}
            color={MAP_COLORS[index % MAP_COLORS.length]}
            geoJSONData={getContentInfillDevelopmentLeaseGeoJson(leaseData)}
            highlighted={Boolean(
              query.lease && Number(query.lease) === leaseId,
            )}
            leaseIdentifier={identifier}
            planUnitIntendedUseOptions={planUnitIntendedUseOptions}
            planUnitStateOptions={planUnitStateOptions}
            planUnitTypeOptions={planUnitTypeOptions}
            plotDivisionStateOptions={plotDivisionStateOptions}
            plotTypeOptions={plotTypeOptions}
          />
        ),
        name: identifier,
      };
    });

    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) &&
        !isEmpty(areaNotes) &&
        nextLayers.push({
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

    setLayers(nextLayers);
    setIsLoading(false);
  }, [
    allLeases,
    areaLocationOptions,
    areaNotes,
    areaTypeOptions,
    dispatch,
    infillDevelopmentLeases,
    isFetchingAllLeases,
    location.search,
    planUnitIntendedUseOptions,
    planUnitStateOptions,
    planUnitTypeOptions,
    plotDivisionStateOptions,
    plotTypeOptions,
    usersPermissions,
  ]);

  return (
    <>
      {isLoading && (
        <LoaderWrapper className="relative-overlay-wrapper">
          <Loader isLoading={isLoading} />
        </LoaderWrapper>
      )}
      <AreaNotesEditMap
        allowToEdit={false}
        bounds={bounds}
        center={center}
        overlayLayers={layers}
      />
    </>
  );
};

export default SingleInfillDevelopmentMap;
