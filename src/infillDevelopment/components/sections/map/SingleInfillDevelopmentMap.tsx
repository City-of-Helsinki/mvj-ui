import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import AreaNotesEditMap from "src/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "src/areaNote/components/AreaNotesLayer";
import InfillDevelopmentLeaseLayer from "./InfillDevelopmentLeaseLayer";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import { fetchAreaNoteList } from "src/areaNote/actions";
import { fetchLeaseById } from "src/leases/actions";
import { MAP_COLORS } from "src/constants";
import { LeaseAreasFieldPaths, LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getContentLeaseIdentifier, getLeaseCoordinates } from "src/leases/helpers";
import { getContentInfillDevelopmentLeaseGeoJson } from "src/infillDevelopment/helpers";
import { getFieldOptions, getUrlParams, hasPermissions } from "src/util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "src/util/map";
import { getAreaNoteList } from "src/areaNote/selectors";
import { getCurrentInfillDevelopment } from "src/infillDevelopment/selectors";
import { getAllLeases, getAttributes as getLeaseAttributes, getIsFetchingAllLeases } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import type { Attributes } from "src/types";
import type { AreaNoteList } from "src/areaNote/types";
import type { InfillDevelopment } from "src/infillDevelopment/types";
import type { Lease } from "src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  allLeases: Array<Lease>;
  areaNotes: AreaNoteList;
  currentInfillDevelopment: InfillDevelopment;
  fetchAreaNoteList: (...args: Array<any>) => any;
  fetchLeaseById: (...args: Array<any>) => any;
  isFetchingAllLeases: Array<boolean>;
  leaseAttributes: Attributes;
  location: Record<string, any>;
  usersPermissions: UsersPermissionsType;
};
type State = {
  areaLocationOptions: Array<Record<string, any>>;
  areaTypeOptions: Array<Record<string, any>>;
  bounds: Array<Record<string, any>> | null | undefined;
  center: Array<number> | null | undefined;
  currentInfillDevelopment: InfillDevelopment;
  infillDevelopmentLeases: Array<Record<string, any>>;
  isLoading: boolean;
  layers: Array<Record<string, any>>;
  leaseAttributes: Attributes;
  planUnitIntendedUseOptions: Array<Record<string, any>>;
  planUnitStateOptions: Array<Record<string, any>>;
  planUnitTypeOptions: Array<Record<string, any>>;
  plotDivisionStateOptions: Array<Record<string, any>>;
  plotTypeOptions: Array<Record<string, any>>;
};

class SingleInfillDevelopmentMap extends PureComponent<Props, State> {
  state = {
    areaLocationOptions: [],
    areaTypeOptions: [],
    bounds: undefined,
    center: undefined,
    currentInfillDevelopment: {},
    infillDevelopmentLeases: [],
    isLoading: false,
    layers: [],
    leaseAttributes: null,
    planUnitIntendedUseOptions: [],
    planUnitStateOptions: [],
    planUnitTypeOptions: [],
    plotDivisionStateOptions: [],
    plotTypeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.currentInfillDevelopment !== state.currentInfillDevelopment) {
      newState.currentInfillDevelopment = props.currentInfillDevelopment;
      newState.infillDevelopmentLeases = get(props.currentInfillDevelopment, 'infill_development_compensation_leases', []);
    }

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaLocationOptions = getFieldOptions(props.leaseAttributes, LeaseAreasFieldPaths.TYPE);
      newState.plotTypeOptions = getFieldOptions(props.leaseAttributes, LeasePlotsFieldPaths.TYPE);
      newState.plotDivisionStateOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE);
      newState.planUnitTypeOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE);
      newState.planUnitStateOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE);
      newState.planUnitIntendedUseOptions = getFieldOptions(props.leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE);
    }

    return newState;
  }

  componentDidMount() {
    const {
      fetchAreaNoteList,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }

    this.fetchLeasesOrUpdateLayers();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.allLeases !== this.props.allLeases || prevProps.areaNotes !== this.props.areaNotes || prevState.infillDevelopmentLeases !== this.state.infillDevelopmentLeases) {
      this.fetchLeasesOrUpdateLayers();
    }
  }

  fetchLeasesOrUpdateLayers = () => {
    const {
      infillDevelopmentLeases
    } = this.state;
    const {
      allLeases,
      fetchLeaseById,
      isFetchingAllLeases
    } = this.props;
    let allFetched = true;
    infillDevelopmentLeases.forEach(lease => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];

      if (isEmpty(leaseData)) {
        if (!isFetchingAllLeases[leaseId]) {
          fetchLeaseById(leaseId);
        }

        allFetched = false;
      }
    });

    if (allFetched) {
      this.setMapCenterAndBounds();
      this.setInfillDevelopmentLayers();
      this.setState({
        isLoading: false
      });
    } else {
      this.setState({
        isLoading: true
      });
    }
  };
  setMapCenterAndBounds = () => {
    const coordinates = [];
    const {
      allLeases
    } = this.props;
    const {
      infillDevelopmentLeases
    } = this.state;
    infillDevelopmentLeases.forEach(lease => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];
      coordinates.push(...getLeaseCoordinates(leaseData));
    });
    this.setState({
      bounds: coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined,
      center: coordinates.length ? getCenterFromCoordinates(coordinates) : undefined
    });
  };
  setInfillDevelopmentLayers = () => {
    const {
      allLeases,
      areaNotes,
      location: {
        search
      },
      usersPermissions
    } = this.props;
    const query = getUrlParams(search);
    const {
      areaLocationOptions,
      areaTypeOptions,
      infillDevelopmentLeases,
      planUnitIntendedUseOptions,
      planUnitStateOptions,
      planUnitTypeOptions,
      plotDivisionStateOptions,
      plotTypeOptions
    } = this.state;
    const layers = infillDevelopmentLeases.map((lease, index) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];
      const identifier = getContentLeaseIdentifier(leaseData);
      return {
        checked: true,
        component: <InfillDevelopmentLeaseLayer areaLocationOptions={areaLocationOptions} areaTypeOptions={areaTypeOptions} color={MAP_COLORS[index % MAP_COLORS.length]} geoJSONData={getContentInfillDevelopmentLeaseGeoJson(leaseData)} highlighted={Boolean(query.lease && Number(query.lease) === leaseId)} leaseIdentifier={identifier} planUnitIntendedUseOptions={planUnitIntendedUseOptions} planUnitStateOptions={planUnitStateOptions} planUnitTypeOptions={planUnitTypeOptions} plotDivisionStateOptions={plotDivisionStateOptions} plotTypeOptions={plotTypeOptions} />,
        name: identifier
      };
    });
    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) && !isEmpty(areaNotes) && layers.push({
        checked: false,
        component: <AreaNotesLayer key='area_notes' allowToEdit={false} areaNotes={areaNotes} />,
        name: 'Muistettavat ehdot'
      });
    }
    this.setState({
      layers: layers
    });
  };

  render() {
    const {
      bounds,
      center,
      isLoading,
      layers
    } = this.state;
    return <Fragment>
        {isLoading && <LoaderWrapper className='relative-overlay-wrapper'>
            <Loader isLoading={isLoading} />
          </LoaderWrapper>}
        <AreaNotesEditMap allowToEdit={false} bounds={bounds} center={center} overlayLayers={layers} />
      </Fragment>;
  }

}

export default flowRight(withRouter, connect(state => {
  return {
    allLeases: getAllLeases(state),
    areaNotes: getAreaNoteList(state),
    currentInfillDevelopment: getCurrentInfillDevelopment(state),
    isFetchingAllLeases: getIsFetchingAllLeases(state),
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchAreaNoteList,
  fetchLeaseById
}))(SingleInfillDevelopmentMap);