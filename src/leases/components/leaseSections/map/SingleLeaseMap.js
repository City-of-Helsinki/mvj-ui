// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import AreasLayer from './AreasLayer';
import Divider from '$components/content/Divider';
import PlanUnitsLayer from './PlanUnitsLayer';
import PlotsLayer from './PlotsLayer';
import {mapColors} from '$src/constants';
import {
  LeaseAreasFieldPaths,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
} from '$src/leases/enums';
import {
  getContentAreasGeoJson,
  getContentPlanUnitsGeoJson,
  getContentPlotsGeoJson,
  getLeaseCoordinates,
} from '$src/leases/helpers';
import {
  getFieldOptions,
  getUrlParams,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getCoordinatesBounds, getCoordinatesCenter} from '$util/map';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {AreasGeoJson} from './AreasLayer';
import type {PlanUnitsGeoJson} from './PlanUnitsLayer';
import type {PlotsGeoJson} from './PlotsLayer';

type Props = {
  currentLease: Lease,
  leaseAttributes: Attributes,
  location: Object,
}

type State = {
  areasGeoJson: AreasGeoJson,
  areaLocationOptions: Array<Object>,
  areaTypeOptions: Array<Object>,
  bounds?: ?Object,
  center: ?Array<Object>,
  currentLease: Lease,
  leaseAttributes: Attributes,
  planUnitsGeoJson: PlanUnitsGeoJson,
  planUnitsContractGeoJson: PlanUnitsGeoJson,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotsGeoJson: PlotsGeoJson,
  plotsContractGeoJson: PlotsGeoJson,
  plotDivisionStateOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
}

class SingleLeaseMap extends PureComponent<Props, State> {
  state = {
    areasGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    areaLocationOptions: [],
    areaTypeOptions: [],
    bounds: null,
    center: null,
    currentLease: {},
    leaseAttributes: {},
    planUnitsGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    planUnitsContractGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    planUnitIntendedUseOptions: [],
    planUnitStateOptions: [],
    planUnitTypeOptions: [],
    plotsGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    plotsContractGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    plotDivisionStateOptions: [],
    plotTypeOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      const coordinates = getLeaseCoordinates(props.currentLease);

      newState.bounds = coordinates.length ? getCoordinatesBounds(coordinates) : undefined;
      newState.center = coordinates.length ? getCoordinatesCenter(coordinates) : undefined;
      newState.currentLease = props.currentLease;
      newState.areasGeoJson = getContentAreasGeoJson(props.currentLease);
      newState.planUnitsGeoJson = getContentPlanUnitsGeoJson(props.currentLease, false);
      newState.planUnitsContractGeoJson = getContentPlanUnitsGeoJson(props.currentLease, true);
      newState.plotsGeoJson = getContentPlotsGeoJson(props.currentLease, false);
      newState.plotsContractGeoJson = getContentPlotsGeoJson(props.currentLease, true);
    }
    if(props.leaseAttributes !== state.leaseAttributes) {
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
    const {leaseAttributes, location: {search}} = this.props;
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

    if(isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <PlanUnitsLayer
          key='plan_units'
          color={mapColors[0 % mapColors.length]}
          defaultPlanUnit={query.plan_unit ? Number(query.plan_unit) : undefined}
          planUnitsGeoJson={planUnitsGeoJson}
          planUnitIntendedUseOptions={planUnitIntendedUseOptions}
          planUnitStateOptions={planUnitStateOptions}
          planUnitTypeOptions={planUnitTypeOptions}
          plotDivisionStateOptions={plotDivisionStateOptions}
        />,
        name: 'Kaavayksiköt',
      });

      layers.push({
        checked: false,
        component: <PlanUnitsLayer
          key='plan_units'
          color={mapColors[1 % mapColors.length]}
          defaultPlanUnit={query.plan_unit ? Number(query.plan_unit) : undefined}
          planUnitsGeoJson={planUnitsContractGeoJson}
          planUnitIntendedUseOptions={planUnitIntendedUseOptions}
          planUnitStateOptions={planUnitStateOptions}
          planUnitTypeOptions={planUnitTypeOptions}
          plotDivisionStateOptions={plotDivisionStateOptions}
        />,
        name: 'Kaavayksiköt sopimuksessa',
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <PlotsLayer
          key='plots'
          color={mapColors[2 % mapColors.length]}
          defaultPlot={query.plot ? Number(query.plot) : undefined}
          plotsGeoJson={plotsGeoJson}
          typeOptions={plotTypeOptions}/>,
        name: 'Kiinteistöt/määräalat',
      });

      layers.push({
        checked: false,
        component: <PlotsLayer
          key='plots'
          color={mapColors[3 % mapColors.length]}
          defaultPlot={query.plot ? Number(query.plot) : undefined}
          plotsGeoJson={plotsContractGeoJson}
          typeOptions={plotTypeOptions}/>,
        name: 'Kiinteistöt/määräalat sopimuksessa',
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <AreasLayer
          key='areas'
          areasGeoJson={areasGeoJson}
          color={mapColors[4 % mapColors.length]}
          defaultArea={query.lease_area ? Number(query.lease_area) : undefined}
          locationOptions={areaLocationOptions}
          typeOptions={areaTypeOptions}
        />,
        name: 'Vuokrakohteet',
      });
    }

    return layers;
  }

  render() {
    const {bounds, center} = this.state;
    const overlayLayers = this.getOverlayLayers();

    return(
      <Fragment>
        <h2>Kartta</h2>
        <Divider />

        <AreaNotesEditMap
          bounds={bounds}
          center={center}
          overlayLayers={overlayLayers}
          showEditTools={false}
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
        leaseAttributes: getLeaseAttributes(state),
        currentLease: getCurrentLease(state),
      };
    }
  ),
)(SingleLeaseMap);
