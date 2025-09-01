import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import MapInput from "@/components/map/MapInput";
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
import type { Attributes, LeafletFeatureGeometry, LeafletGeoJson, LeaseAreaDraftGeometryItem } from "types";
import type { Lease, LeaseArea } from "@/leases/types";
import type { AreaNoteList } from "@/areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { change, formValueSelector, reduxForm } from "redux-form";
import { FormNames } from "@/enums";

type Props = OwnProps & {
  leaseAreaDraftGeometryItemsFromForm: Array<LeaseAreaDraftGeometryItem>;
  leaseAreaDraftGeometryItemsFromState: Array<LeaseAreaDraftGeometryItem>;
};

type OwnProps = {
  areaNotes: AreaNoteList;
  change: (...args: Array<any>) => any;
  currentLease: Lease;
  fetchAreaNoteList: (...args: Array<any>) => any;
  isEditMode: boolean;
  leaseAttributes: Attributes;
  location: Record<string, any>;
  usersPermissions: UsersPermissionsType;
}

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

  getAreaId = () => {
    const { location } = this.props;
    const query = getUrlParams(location.search);
    return query.lease_area ? Number(query.lease_area) : undefined;
  };

  render() {
    const {
      isEditMode,
      change,
      leaseAreaDraftGeometryItemsFromForm,
      leaseAreaDraftGeometryItemsFromState,
    } = this.props;
    const { bounds, center } = this.state;
    const overlayLayers = this.getOverlayLayers();
    const initialValues = isEditMode
      ? leaseAreaDraftGeometryItemsFromForm
      : leaseAreaDraftGeometryItemsFromState || [];
    const areaId = this.getAreaId();
    const isAllowedToEdit = areaId && isFieldAllowedToEdit(
      this.state.leaseAttributes,
      LeaseAreasFieldPaths.DRAFT_GEOMETRY,
    );
    return (
      <Fragment>
        <Title
          enableUiDataEdit={isEditMode}
          uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MAP)}
        >
          {LeaseFieldTitles.MAP}
        </Title>
        <Divider />
        <MapInput
          change={(features: LeafletFeatureGeometry) => {
            const index = leaseAreaDraftGeometryItemsFromForm.findIndex(
              (area) => area.id === areaId,
            );
            if (index !== -1) {
              change(`lease_areas_active[${index}].draft_geometry`, features);
            }
          }}
          initialValues={initialValues}
          isAllowedToEdit={isAllowedToEdit}
          bounds={bounds}
          center={center}
          overlayLayers={overlayLayers}
          hasError={false}
        />
      </Fragment>
    );
  }
}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        areaNotes: getAreaNoteList(state),
        currentLease: currentLease,
        isEditMode: getIsEditMode(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
        leaseAreaDraftGeometryItemsFromForm:
          selector(state, "lease_areas_active")?.map((area: LeaseArea) => {
            return {
              id: area.id,
              identifier: area.identifier,
              draft_geometry: area.draft_geometry || null,
            };
          }) || [],
        leaseAreaDraftGeometryItemsFromState: currentLease?.lease_areas?.map((area) => {
          return {
            id: area.id,
            identifier: area.identifier,
            draft_geometry: area.draft_geometry || null,
          };
        }) || [],
      };
    },
    {
      fetchAreaNoteList,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  }),
)(SingleLeaseMap) as React.ComponentType<OwnProps>;
