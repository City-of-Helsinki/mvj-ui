// @flow
import React, {Component} from 'react';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import throttle from 'lodash/throttle';

import MapContainer from '$src/areaNote/components/MapContainer';
import {DEFAULT_CENTER, DEFAULT_ZOOM} from '$src/constants';
import {convertFeatureCollectionToFeature} from '$src/areaNote/helpers';

const SHAPE_COLOR = '#9c27b0';
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = '#bd2719';

type Props = {
  change: Function,
};

type State = {
  isValid: boolean,
};

class AreaSearchMap extends Component<Props, State> {
  featureGroup: ?Object;

  state: State = {
    isValid: false,
  };

  setFeatureGroupRef: (el: ?Object) => void = (el) => {
    this.featureGroup = el;
  }

  updateAllFeatures: () => void = throttle(() => {
    this.featureGroup?.leafletElement?.eachLayer((layer) => {
      layer.showMeasurements();
      layer.updateMeasurements();
    });
  }, 1000 / 60, {
    leading: true,
    trailing: true,
  });

  handleNonCommittedChange: () => void = () => {
    this.updateAllFeatures();
  }

  handleAction: () => void = () => {
    const {change} = this.props;

    const features = [];
    this.featureGroup?.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));

    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  }

  handleCreated: (Object) => void = (e) => {
    const {change} = this.props;
    const {layer} = e;
    layer.showMeasurements();

    const features = [];
    this.featureGroup?.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));

    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  }

  render(): React$Node {
    return (
      <div className='map'>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
        >
          <FeatureGroup ref={this.setFeatureGroupRef}>
            <EditControl
              position='topright'
              onCreated={this.handleCreated}
              onDeleted={this.handleAction}
              onEdited={this.handleAction}
              onEditMove={this.handleNonCommittedChange}
              onEditVertex={this.handleNonCommittedChange}
              onEditStop={this.handleNonCommittedChange}
              onDeleteStop={this.handleNonCommittedChange}
              draw={{
                circlemarker: false,
                circle: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  drawError: {
                    color: SHAPE_ERROR_COLOR,
                    timeout: 1000,
                  },
                  shapeOptions: {
                    color: SHAPE_COLOR,
                    fillOpacity: SHAPE_FILL_OPACITY,
                  },
                },
                rectangle: {
                  shapeOptions: {
                    color: SHAPE_COLOR,
                    fillOpacity: SHAPE_FILL_OPACITY,
                  },
                },
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    );
  }
}

export default AreaSearchMap;
