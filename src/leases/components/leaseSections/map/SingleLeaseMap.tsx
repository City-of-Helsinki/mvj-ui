import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesLayer from "/src/areaNote/components/AreaNotesLayer";
import AreaNotesEditMap from "/src/areaNote/components/AreaNotesEditMap";
import AreasLayer from "./AreasLayer";
import Divider from "/src/components/content/Divider";
import PlanUnitsLayer from "./PlanUnitsLayer";
import PlotsLayer from "./PlotsLayer";
import Title from "/src/components/content/Title";
import { fetchAreaNoteList } from "/src/areaNote/actions";
import { MAP_COLORS } from "util/constants";
import { LeaseAreasFieldPaths, LeaseFieldPaths, LeaseFieldTitles, LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentAreasGeoJson, getContentPlanUnitsGeoJson, getContentPlotsGeoJson, getLeaseCoordinates } from "/src/leases/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getFieldOptions, getUrlParams, hasPermissions, isFieldAllowedToRead } from "util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "util/map";
import { getAreaNoteList } from "/src/areaNote/selectors";
import { getAttributes as getLeaseAttributes, getCurrentLease, getIsEditMode } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes, LeafletGeoJson } from "types";
import type { Lease } from "/src/leases/types";
import type { AreaNoteList } from "/src/areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  areaNotes: AreaNoteList;
  currentLease: Lease;
  fetchAreaNoteList: (...args: Array<any>) => any;
  isEditMode: boolean;
  leaseAttributes: Attributes;
  location: Record<string, any>;
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

class SingleLeaseMap extends PureComponent<Props, State> {
  state = {
    areasGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    areaLocationOptions: [],
    areaTypeOptions: [],
    bounds: null,
    center: null,
    currentLease: {},
    leaseAttributes: null,
    planUnitsGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    planUnitsContractGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    planUnitIntendedUseOptions: [],
    planUnitStateOptions: [],
    planUnitTypeOptions: [],
    plotsGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    plotsContractGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    plotDivisionStateOptions: [],
    plotTypeOptions: []
  };

  componentDidMount() {
    const {
      fetchAreaNoteList,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.currentLease !== state.currentLease) {
      const coordinates = getLeaseCoordinates(props.currentLease);
      newState.bounds = coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined;
      newState.center = coordinates.length ? getCenterFromCoordinates(coordinates) : undefined;
      newState.currentLease = props.currentLease;
      newState.areasGeoJson = getContentAreasGeoJson(props.currentLease);
      newState.planUnitsGeoJson = getContentPlanUnitsGeoJson(props.currentLease, false);
      newState.planUnitsContractGeoJson = getContentPlanUnitsGeoJson(props.currentLease, true);
      newState.plotsGeoJson = getContentPlotsGeoJson(props.currentLease, false);
      newState.plotsContractGeoJson = getContentPlotsGeoJson(props.currentLease, true);
    }

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaLocationOptions = getFieldOptions(props.leaseAttributes, LeaseAreasFieldPaths.LOCATION);
      newState.areaTypeOptions = getFieldOptions(props.leaseAttributes, LeaseAreasFieldPaths.TYPE);
      newState.plotTypeOptions = getFieldOptions(props.leaseAttributes, LeasePlotsFieldPaths.TYPE);
      newState.plotDivisionStateOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE);
      newState.planUnitTypeOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE);
      newState.planUnitStateOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE);
      newState.planUnitIntendedUseOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE);
    }

    return newState;
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      areaNotes,
      leaseAttributes,
      location: {
        search
      },
      usersPermissions
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
      plotTypeOptions
    } = this.state;
    const query = getUrlParams(search);

    if (isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <PlanUnitsLayer key='plan_units' color={MAP_COLORS[0 % MAP_COLORS.length]} defaultPlanUnit={query.plan_unit ? Number(query.plan_unit) : undefined} planUnitsGeoJson={planUnitsGeoJson} planUnitIntendedUseOptions={planUnitIntendedUseOptions} planUnitStateOptions={planUnitStateOptions} planUnitTypeOptions={planUnitTypeOptions} plotDivisionStateOptions={plotDivisionStateOptions} />,
        name: 'Kaavayksiköt'
      });
      layers.push({
        checked: false,
        component: <PlanUnitsLayer key='plan_units' color={MAP_COLORS[1 % MAP_COLORS.length]} defaultPlanUnit={query.plan_unit ? Number(query.plan_unit) : undefined} planUnitsGeoJson={planUnitsContractGeoJson} planUnitIntendedUseOptions={planUnitIntendedUseOptions} planUnitStateOptions={planUnitStateOptions} planUnitTypeOptions={planUnitTypeOptions} plotDivisionStateOptions={plotDivisionStateOptions} />,
        name: 'Kaavayksiköt sopimuksessa'
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <PlotsLayer key='plots' color={MAP_COLORS[2 % MAP_COLORS.length]} defaultPlot={query.plot ? Number(query.plot) : undefined} plotsGeoJson={plotsGeoJson} typeOptions={plotTypeOptions} />,
        name: 'Kiinteistöt/määräalat'
      });
      layers.push({
        checked: false,
        component: <PlotsLayer key='plots' color={MAP_COLORS[3 % MAP_COLORS.length]} defaultPlot={query.plot ? Number(query.plot) : undefined} plotsGeoJson={plotsContractGeoJson} typeOptions={plotTypeOptions} />,
        name: 'Kiinteistöt/määräalat sopimuksessa'
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <AreasLayer key='areas' areasGeoJson={areasGeoJson} color={MAP_COLORS[4 % MAP_COLORS.length]} defaultArea={query.lease_area ? Number(query.lease_area) : undefined} locationOptions={areaLocationOptions} typeOptions={areaTypeOptions} />,
        name: 'Vuokrakohteet'
      });
    }

    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) && !isEmpty(areaNotes) && layers.push({
        checked: false,
        component: <AreaNotesLayer key='area_notes' allowToEdit={false} areaNotes={areaNotes} />,
        name: 'Muistettavat ehdot'
      });
    }
    return layers;
  };

  render() {
    const {
      isEditMode
    } = this.props;
    const {
      bounds,
      center
    } = this.state;
    const overlayLayers = this.getOverlayLayers();
    return <Fragment>
        <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MAP)}>
          {LeaseFieldTitles.MAP}
        </Title>
        <Divider />

        <AreaNotesEditMap allowToEdit={false} bounds={bounds} center={center} overlayLayers={overlayLayers} />
      </Fragment>;
  }

}

export default flowRight(withRouter, connect(state => {
  return {
    areaNotes: getAreaNoteList(state),
    currentLease: getCurrentLease(state),
    isEditMode: getIsEditMode(state),
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchAreaNoteList
}))(SingleLeaseMap) as React.ComponentType<any>;