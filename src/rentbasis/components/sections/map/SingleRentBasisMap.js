// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import RentBasisLayer from './RentBasisLayer';
import {mapColors} from '$src/constants';
import {getContentRentBasisGeoJson} from '$src/rentbasis/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getCoordinatesBounds, getCoordinatesCenter, getCoordinatesOfGeometry} from '$util/map';
import {getAttributes, getRentBasis} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';
import type {RentBasis} from '$src/rentbasis/types';

type Props = {
  attributes: Attributes,
  rentBasis: RentBasis,
}

type State = {
  attributes: Attributes,
  bounds?: ?Object,
  center: ?Array<Object>,
  financingOptions: Array<Object>,
  geoJSON: Object,
  indexOptions: Array<Object>,
  managementOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
  rentBasis: RentBasis,
}

class SingleRentBasisMap extends Component<Props, State> {
  state = {
    attributes: {},
    bounds: undefined,
    center: undefined,
    financingOptions: [],
    geoJSON: {
      type: 'FeatureCollection',
      features: [],
    },
    indexOptions: [],
    managementOptions: [],
    plotTypeOptions: [],
    rentBasis: {},
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.rentBasis !== state.rentBasis) {
      const coordinates = getCoordinatesOfGeometry(props.rentBasis.geometry);

      newState.rentBasis = props.rentBasis;
      newState.bounds = coordinates.length ? getCoordinatesBounds(coordinates) : undefined;
      newState.center = coordinates.length ? getCoordinatesCenter(coordinates) : undefined;
      newState.geoJSON = getContentRentBasisGeoJson(props.rentBasis);
    }

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.financingOptions = getAttributeFieldOptions(props.attributes, 'financing');
      newState.indexOptions = getAttributeFieldOptions(props.attributes, 'index');
      newState.managementOptions = getAttributeFieldOptions(props.attributes, 'management');
      newState.plotTypeOptions = getAttributeFieldOptions(props.attributes, 'plot_type');
    }

    return newState;
  }
  render() {
    const {
      bounds,
      center,
      financingOptions,
      geoJSON,
      indexOptions,
      managementOptions,
      plotTypeOptions,
    } = this.state;

    return(
      <ContentContainer>
        <h2>Kartta</h2>
        <Divider />

        <AreaNotesEditMap
          bounds={bounds}
          center={center}
          overlayLayers={[
            {
              checked: true,
              component: <RentBasisLayer
                color={mapColors[0]}
                financingOptions={financingOptions}
                geoJSON={geoJSON}
                indexOptions={indexOptions}
                managementOptions={managementOptions}
                plotTypeOptions={plotTypeOptions}
              />,
              name: 'Vuokrausperusteet',
            },
          ]}
          showEditTools={false}
        />
      </ContentContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        rentBasis: getRentBasis(state),
      };
    }
  )
)(SingleRentBasisMap);
