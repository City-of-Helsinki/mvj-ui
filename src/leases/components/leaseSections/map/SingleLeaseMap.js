// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import AreasLayer from './AreasLayer';
import Divider from '$components/content/Divider';
import PlanUnitsLayer from './PlanUnitsLayer';
import PlotsLayer from './PlotsLayer';
import {
  getContentAreasGeoJson,
  getContentPlanUnitsGeoJson,
  getContentPlotsGeoJson,
  getLeaseCoordinates,
} from '$src/leases/helpers';
import {getAttributeFieldOptions, getCoordinatesBounds, getCoordinatesCenter} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';
import type {AreasGeoJson} from './AreasLayer';
import type {PlanUnitsGeoJson} from './PlanUnitsLayer';
import type {PlotsGeoJson} from './PlotsLayer';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  router: Object,
}

type State = {
  areasGeoJson: AreasGeoJson,
  areaLocationOptions: Array<Object>,
  areaTypeOptions: Array<Object>,
  attributes: Attributes,
  bounds?: ?Object,
  center: ?Array<Object>,
  currentLease: Lease,
  planUnitsGeoJson: PlanUnitsGeoJson,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotsGeoJson: PlotsGeoJson,
  plotDivisionStateOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
}

class SingleLeaseMap extends Component<Props, State> {
  state = {
    areasGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    areaLocationOptions: [],
    areaTypeOptions: [],
    attributes: {},
    bounds: null,
    center: null,
    currentLease: {},
    planUnitsGeoJson: {
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
      newState.planUnitsGeoJson = getContentPlanUnitsGeoJson(props.currentLease);
      newState.plotsGeoJson = getContentPlotsGeoJson(props.currentLease);
    }
    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.areaLocationOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.location');
      newState.areaTypeOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.type');
      newState.plotTypeOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.plots.child.children.type');
      newState.plotDivisionStateOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.plan_units.child.children.plot_division_state');
      newState.planUnitTypeOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_type');
      newState.planUnitStateOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_state');
      newState.planUnitIntendedUseOptions = getAttributeFieldOptions(props.attributes,
        'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use');
    }

    return newState;
  }

  render() {
    const {router: {location: {query}}} = this.props;
    const {
      areasGeoJson,
      areaLocationOptions,
      areaTypeOptions,
      bounds,
      center,
      planUnitsGeoJson,
      planUnitIntendedUseOptions,
      planUnitStateOptions,
      planUnitTypeOptions,
      plotDivisionStateOptions,
      plotsGeoJson,
      plotTypeOptions,
    } = this.state;

    return(
      <div>
        <h2>Kartta</h2>
        <Divider />

        <AreaNotesEditMap
          bounds={bounds}
          center={center}
          overlayLayers={[
            {
              checked: true,
              component: <PlanUnitsLayer
                key='plan_units'
                color='#0F0'
                defaultPlanUnit={query.plan_unit ? Number(query.plan_unit) : undefined}
                planUnitsGeoJson={planUnitsGeoJson}
                planUnitIntendedUseOptions={planUnitIntendedUseOptions}
                planUnitStateOptions={planUnitStateOptions}
                planUnitTypeOptions={planUnitTypeOptions}
                plotDivisionStateOptions={plotDivisionStateOptions}
              />,
              name: 'Kaavayksiköt',
            },
            {
              checked: true,
              component: <PlotsLayer
                key='plots'
                color='#F00'
                defaultPlot={query.plot ? Number(query.plot) : undefined}
                plotsGeoJson={plotsGeoJson}
                typeOptions={plotTypeOptions}/>,
              name: 'Kiinteistöt/määräalat',
            },
            {
              checked: true,
              component: <AreasLayer
                key='areas'
                areasGeoJson={areasGeoJson}
                color='#00F'
                defaultArea={query.lease_area ? Number(query.lease_area) : undefined}
                locationOptions={areaLocationOptions}
                typeOptions={areaTypeOptions}
              />,
              name: 'Vuokrakohteet',
            },
          ]}
          showEditTools={false}
        />
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
      };
    }
  ),
)(SingleLeaseMap);
