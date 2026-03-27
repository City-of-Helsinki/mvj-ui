import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  withRouterLegacy,
  type WithRouterProps,
} from "@/root/withRouterLegacy";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreasLayer from "./AreasLayer";
import Divider from "@/components/content/Divider";
import PlanUnitsLayer from "./PlanUnitsLayer";
import PlotsLayer from "./PlotsLayer";
import Title from "@/components/content/Title";
import { fetchAreaNoteList } from "@/areaNote/actions";
import { MAP_COLORS } from "@/util/constants";
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
import type { Attributes, LeafletGeoJson } from "@/types";
import type { Lease } from "@/leases/types";
import type { AreaNoteList } from "@/areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type Props = {
  areaNotes: AreaNoteList;
  change: (...args: Array<any>) => any;
  currentLease: Lease;
  fetchAreaNoteList: (...args: Array<any>) => any;
  isEditMode: boolean;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

type State = {
  areasGeoJson: LeafletGeoJson;
  areaLocationOptions: Array<Record<string, any>>;
  areaTypeOptions: Array<Record<string, any>>;
  bounds: Record<string, any> | null | undefined;
  center: Array<Record<string, any>> | null | undefined;
  currentLease: Lease;
  leaseAttributes: Attributes;
  planUnitsGeoJson: LeafletGeoJson;
  planUnitsContractGeoJson: LeafletGeoJson;
  planUnitIntendedUseOptions: Array<Record<string, any>>;
  planUnitStateOptions: Array<Record<string, any>>;
  planUnitTypeOptions: Array<Record<string, any>>;
  plotsGeoJson: LeafletGeoJson;
  plotsContractGeoJson: LeafletGeoJson;
  plotDivisionStateOptions: Array<Record<string, any>>;
  plotTypeOptions: Array<Record<string, any>>;
};

class SingleLeaseMap extends PureComponent<Props & WithRouterProps, State> {
  state = {
    areasGeoJson: {
      features: [],
      type: "FeatureCollection",
    },
    areaLocationOptions: [],
    areaTypeOptions: [],
    bounds: null,
    center: null,
    currentLease: {},
    leaseAttributes: null,
    planUnitsGeoJson: {
      features: [],
      type: "FeatureCollection",
    },
    planUnitsContractGeoJson: {
      features: [],
      type: "FeatureCollection",
    },
    planUnitIntendedUseOptions: [],
    planUnitStateOptions: [],
    planUnitTypeOptions: [],
    plotsGeoJson: {
      features: [],
      type: "FeatureCollection",
    },
    plotsContractGeoJson: {
      features: [],
      type: "FeatureCollection",
    },
    plotDivisionStateOptions: [],
    plotTypeOptions: [],
  };

  componentDidMount() {
    const { fetchAreaNoteList, usersPermissions } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.currentLease !== state.currentLease) {
      const coordinates = getLeaseCoordinates(props.currentLease);
      newState.bounds = coordinates.length
        ? getBoundsFromCoordinates(coordinates)
        : undefined;
      newState.center = coordinates.length
        ? getCenterFromCoordinates(coordinates)
        : undefined;
      newState.currentLease = props.currentLease;
      newState.areasGeoJson = getContentAreasGeoJson(props.currentLease);
      newState.planUnitsGeoJson = getContentPlanUnitsGeoJson(
        props.currentLease,
        false,
      );
      newState.planUnitsContractGeoJson = getContentPlanUnitsGeoJson(
        props.currentLease,
        true,
      );
      newState.plotsGeoJson = getContentPlotsGeoJson(props.currentLease, false);
      newState.plotsContractGeoJson = getContentPlotsGeoJson(
        props.currentLease,
        true,
      );
    }

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaLocationOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseAreasFieldPaths.LOCATION,
      );
      newState.areaTypeOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseAreasFieldPaths.TYPE,
      );
      newState.plotTypeOptions = getFieldOptions(
        props.leaseAttributes,
        LeasePlotsFieldPaths.TYPE,
      );
      newState.plotDivisionStateOptions = getFieldOptions(
        props.leaseAttributes,
        LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
      );
      newState.planUnitTypeOptions = getFieldOptions(
        props.leaseAttributes,
        LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
      );
      newState.planUnitStateOptions = getFieldOptions(
        props.leaseAttributes,
        LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
      );
      newState.planUnitIntendedUseOptions = getFieldOptions(
        props.leaseAttributes,
        LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
      );
    }

    return newState;
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      areaNotes,
      leaseAttributes,
      location: { search },
      usersPermissions,
    } = this.props;
    const {
      areasGeoJson,
      areaLocationOptions,
      areaTypeOptions,
      planUnitsGeoJson,
      planUnitsContractGeoJson,
      planUnitIntendedUseOptions,
      planUnitStateOptions,
      planUnitTypeOptions,
      plotDivisionStateOptions,
      plotsGeoJson,
      plotsContractGeoJson,
      plotTypeOptions,
    } = this.state;
    const query = getUrlParams(search);

    if (
      isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.GEOMETRY)
    ) {
      layers.push({
        checked: true,
        component: (
          <PlanUnitsLayer
            key="plan_units"
            color={MAP_COLORS[0 % MAP_COLORS.length]}
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
            color={MAP_COLORS[1 % MAP_COLORS.length]}
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
            color={MAP_COLORS[2 % MAP_COLORS.length]}
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
            color={MAP_COLORS[3 % MAP_COLORS.length]}
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
            color={MAP_COLORS[4 % MAP_COLORS.length]}
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
  };

  render() {
    const { isEditMode } = this.props;
    const { bounds, center } = this.state;
    const overlayLayers = this.getOverlayLayers();

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
  }
}

export default flowRight(
  withRouterLegacy,
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        currentLease: getCurrentLease(state),
        isEditMode: getIsEditMode(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchAreaNoteList,
    },
  ),
)(SingleLeaseMap) as React.ComponentType<Props>;
