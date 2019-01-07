// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import RentBasisLayer from './RentBasisLayer';
import {mapColors} from '$src/constants';
import {RentBasisFieldPaths} from '$src/rentbasis/enums';
import {getContentRentBasisGeoJson} from '$src/rentbasis/helpers';
import {getAttributeFieldOptions, isFieldAllowedToRead} from '$util/helpers';
import {getCoordinatesBounds, getCoordinatesCenter, getCoordinatesOfGeometry} from '$util/map';
import {
  getAttributes as getRentBasisAttributes,
  getRentBasis,
} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';
import type {RentBasis} from '$src/rentbasis/types';

type Props = {
  rentBasis: RentBasis,
  rentBasisAttributes: Attributes,
}

type State = {
  bounds?: ?Object,
  center: ?Array<Object>,
  financingOptions: Array<Object>,
  geoJSON: Object,
  indexOptions: Array<Object>,
  managementOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
  rentBasis: RentBasis,
  rentBasisAttributes: Attributes,
}

class SingleRentBasisMap extends Component<Props, State> {
  state = {
    bounds: undefined,
    center: undefined,
    financingOptions: [],
    geoJSON: {
      type: 'FeatureCollection',
      features: [],
    },
    indexOptions: [],
    managementOptions: [],
    overlayLayers: [],
    plotTypeOptions: [],
    rentBasis: {},
    rentBasisAttributes: {},
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

    if(props.rentBasisAttributes !== state.rentBasisAttributes) {
      newState.rentBasisAttributes = props.rentBasisAttributes;
      newState.financingOptions = getAttributeFieldOptions(props.rentBasisAttributes, 'financing');
      newState.indexOptions = getAttributeFieldOptions(props.rentBasisAttributes, 'index');
      newState.managementOptions = getAttributeFieldOptions(props.rentBasisAttributes, 'management');
      newState.plotTypeOptions = getAttributeFieldOptions(props.rentBasisAttributes, 'plot_type');
    }

    return newState;
  }

  getOverlayLayers = () => {
    const {financingOptions, geoJSON, indexOptions, managementOptions, plotTypeOptions} = this.state;
    const {rentBasisAttributes} = this.props;
    const layers = [];

    if(isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)) {
      layers.push({
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
      });
    }

    return layers;
  }

  render() {
    const {
      bounds,
      center,
    } = this.state;
    const overlayLayers = this.getOverlayLayers();

    return(
      <ContentContainer>
        <h2>Kartta</h2>
        <Divider />

        <AreaNotesEditMap
          bounds={bounds}
          center={center}
          overlayLayers={overlayLayers}
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
        rentBasis: getRentBasis(state),
        rentBasisAttributes: getRentBasisAttributes(state),
      };
    }
  )
)(SingleRentBasisMap);
