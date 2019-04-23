// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import AreaNotesLayer from '$src/areaNote/components/AreaNotesLayer';
import InfillDevelopmentLeaseLayer from './InfillDevelopmentLeaseLayer';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {fetchLeaseById} from '$src/leases/actions';
import {mapColors} from '$src/constants';
import {LeaseAreasFieldPaths, LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths} from '$src/leases/enums';
import {Methods} from '$src/enums';
import {getContentLeaseIdentifier, getLeaseCoordinates} from '$src/leases/helpers';
import {getContentInfillDevelopmentLeaseGeoJson} from '$src/infillDevelopment/helpers';
import {getFieldOptions, getUrlParams, isMethodAllowed} from '$util/helpers';
import {getCoordinatesBounds, getCoordinatesCenter} from '$util/map';
import {getAreaNoteList, getMethods as getAreaNoteMethods} from '$src/areaNote/selectors';
import {getCurrentInfillDevelopment} from '$src/infillDevelopment/selectors';
import {
  getAllLeases,
  getAttributes as getLeaseAttributes,
  getIsFetchingAllLeases,
} from '$src/leases/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {InfillDevelopment} from '$src/infillDevelopment/types';
import type {Lease} from '$src/leases/types';

type Props = {
  allLeases: Array<Lease>,
  areaNoteMethods: MethodsType,
  areaNotes: AreaNoteList,
  currentInfillDevelopment: InfillDevelopment,
  fetchLeaseById: Function,
  isFetchingAllLeases: Array<boolean>,
  leaseAttributes: Attributes,
  location: Object,
}

type State = {
  areaLocationOptions: Array<Object>,
  areaTypeOptions: Array<Object>,
  bounds: ?Array<Object>,
  center: ?Array<number>,
  currentInfillDevelopment: InfillDevelopment,
  infillDevelopmentLeases: Array<Object>,
  isLoading: boolean,
  layers: Array<Object>,
  leaseAttributes: Attributes,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotDivisionStateOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
}

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
    plotTypeOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentInfillDevelopment !== state.currentInfillDevelopment) {
      newState.currentInfillDevelopment = props.currentInfillDevelopment;
      newState.infillDevelopmentLeases = get(props.currentInfillDevelopment, 'infill_development_compensation_leases', []);
    }

    if(props.leaseAttributes !== state.leaseAttributes) {
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
    this.fetchLeasesOrUpdateLayers();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevProps.allLeases !== this.props.allLeases
      || prevState.infillDevelopmentLeases !== this.state.infillDevelopmentLeases) {
      this.fetchLeasesOrUpdateLayers();
    }
  }

  fetchLeasesOrUpdateLayers = () => {
    const {infillDevelopmentLeases} = this.state;
    const {allLeases, fetchLeaseById, isFetchingAllLeases} = this.props;

    let allFetched = true;

    infillDevelopmentLeases.forEach((lease) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];

      if(isEmpty(leaseData)) {
        if(!isFetchingAllLeases[leaseId]) {
          fetchLeaseById(leaseId);
        }
        allFetched = false;
      }
    });

    if(allFetched) {
      this.setMapCenterAndBounds();
      this.setInfillDevelopmentLayers();
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        isLoading: true,
      });
    }
  }

  setMapCenterAndBounds = () => {
    const coordinates = [];
    const {allLeases} = this.props;
    const {infillDevelopmentLeases} = this.state;

    infillDevelopmentLeases.forEach((lease) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];

      coordinates.push(...getLeaseCoordinates(leaseData));
    });

    this.setState({
      bounds: coordinates.length ? getCoordinatesBounds(coordinates) : undefined,
      center: coordinates.length ? getCoordinatesCenter(coordinates) : undefined,
    });
  }

  setInfillDevelopmentLayers = () => {
    const {
      allLeases,
      areaNoteMethods,
      areaNotes,
      location: {search},
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
      plotTypeOptions,
    } = this.state;

    const layers = infillDevelopmentLeases.map((lease, index) => {
      const leaseId = lease.lease.id;
      const leaseData = allLeases[leaseId];
      const identifier = getContentLeaseIdentifier(leaseData);

      return {
        checked: true,
        component: <InfillDevelopmentLeaseLayer
          areaLocationOptions={areaLocationOptions}
          areaTypeOptions={areaTypeOptions}
          color={mapColors[index % mapColors.length]}
          geoJSONData={getContentInfillDevelopmentLeaseGeoJson(leaseData)}
          highlighted={Boolean(query.lease && Number(query.lease) === leaseId)}
          leaseIdentifier={identifier}
          planUnitIntendedUseOptions={planUnitIntendedUseOptions}
          planUnitStateOptions={planUnitStateOptions}
          planUnitTypeOptions={planUnitTypeOptions}
          plotDivisionStateOptions={plotDivisionStateOptions}
          plotTypeOptions={plotTypeOptions}
        />,
        name: identifier,
      };
    });

    {isMethodAllowed(areaNoteMethods, Methods.GET) && !isEmpty(areaNotes) &&
      layers.push({
        checked: false,
        component: <AreaNotesLayer
          key='area_notes'
          allowToEdit={false}
          areaNotes={areaNotes}
        />,
        name: 'Muistettavat ehdot',
      });
    }

    this.setState({
      layers: layers,
    });
  }

  render() {
    const {
      bounds,
      center,
      isLoading,
      layers,
    } = this.state;

    return(
      <Fragment>
        {isLoading &&
          <LoaderWrapper className='relative-overlay-wrapper'>
            <Loader isLoading={isLoading} />
          </LoaderWrapper>
        }
        <AreaNotesEditMap
          allowToEdit={false}
          bounds={bounds}
          center={center}
          overlayLayers={layers}
        />
      </Fragment>
    );
  }
}

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    (state) => {
      return {
        allLeases: getAllLeases(state),
        areaNoteMethods: getAreaNoteMethods(state),
        areaNotes: getAreaNoteList(state),
        currentInfillDevelopment: getCurrentInfillDevelopment(state),
        isFetchingAllLeases: getIsFetchingAllLeases(state),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      fetchLeaseById,
    },
  ),
)(SingleInfillDevelopmentMap);
