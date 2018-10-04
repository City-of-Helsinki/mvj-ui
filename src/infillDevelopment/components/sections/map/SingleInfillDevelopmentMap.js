// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import Divider from '$components/content/Divider';
import InfillDevelopmentLeaseLayer from './InfillDevelopmentLeaseLayer';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {fetchLeaseById} from '$src/leases/actions';
import {mapColors} from '$src/constants';
import {getContentLeaseIdentifier, getLeaseCoordinates} from '$src/leases/helpers';
import {getContentInfillDevelopmentLeaseGeoJson} from '$src/infillDevelopment/helpers';
import {getAttributeFieldOptions, getCoordinatesBounds, getCoordinatesCenter} from '$util/helpers';
import {getCurrentInfillDevelopment} from '$src/infillDevelopment/selectors';
import {
  getAllLeases,
  getAttributes as getLeaseAttributes,
  getIsFetchingAllLeases,
} from '$src/leases/selectors';

import type {InfillDevelopment} from '$src/infillDevelopment/types';
import type {Attributes as LeaseAttributes, Lease} from '$src/leases/types';

type Props = {
  allLeases: Array<Lease>,
  currentInfillDevelopment: InfillDevelopment,
  fetchLeaseById: Function,
  isFetchingAllLeases: Array<boolean>,
  leaseAttributes: LeaseAttributes,
  location: Object,
  router: Object,
}

type State = {
  areaLocationOptions: Array<Object>,
  areaTypeOptions: Array<Object>,
  bounds?: ?Object,
  center: ?Array<Object>,
  currentInfillDevelopment: InfillDevelopment,
  infillDevelopmentLeases: Array<Object>,
  isLoading: boolean,
  layers: Array<Object>,
  leaseAttributes: LeaseAttributes,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotDivisionStateOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
}

class SingleInfillDevelopmentMap extends Component<Props, State> {
  state = {
    areaLocationOptions: [],
    areaTypeOptions: [],
    bounds: undefined,
    center: undefined,
    currentInfillDevelopment: {},
    infillDevelopmentLeases: [],
    isLoading: false,
    layers: [],
    leaseAttributes: {},
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
      newState.areaLocationOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.location');
      newState.areaTypeOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.type');
      newState.plotTypeOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.plots.child.children.type');
      newState.plotDivisionStateOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.plan_units.child.children.plot_division_state');
      newState.planUnitTypeOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_type');
      newState.planUnitStateOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_state');
      newState.planUnitIntendedUseOptions = getAttributeFieldOptions(props.leaseAttributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use');
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
    const {allLeases, location: {query}} = this.props;
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

      const component = <InfillDevelopmentLeaseLayer
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
      />;

      return {
        checked: true,
        component: component,
        name: identifier,
      };
    });

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
      <div>
        <h2>Kartta</h2>
        <Divider />
        <div>
          {isLoading &&
            <LoaderWrapper className='relative-overlay-wrapper'>
              <Loader isLoading={isLoading} />
            </LoaderWrapper>
          }
          <AreaNotesEditMap
            bounds={bounds}
            center={center}
            overlayLayers={layers}
            showEditTools={false}
          />
        </div>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        allLeases: getAllLeases(state),
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
