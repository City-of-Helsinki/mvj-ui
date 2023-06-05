// @flow
import React, {Component} from 'react';
import {FeatureGroup, GeoJSON} from 'react-leaflet';

import {DEFAULT_CENTER, DEFAULT_ZOOM} from '$src/constants';
import MapContainer from '$src/areaNote/components/MapContainer';
import {getBoundsFromFeatures, getCenterFromCoordinates, getCoordinatesOfGeometry} from '$util/map';
import type {LeafletFeatureGeometry} from '$src/types';
import {getAreaSearchFeatures} from '$src/areaSearch/helpers';

type Props = {
  geometry: LeafletFeatureGeometry,
};

class AreaSearchSelectedAreaMiniMap extends Component<Props> {
  featureGroup: any = null;
  mapInstance: any = null;

  initialize: (any) => void = () => {
    if (!this.mapInstance || !this.featureGroup) {
      return;
    }

    this.mapInstance.leafletElement.fitBounds(this.getMapBounds());
    /* TODO: This doesn't work as expected, but should be pretty close to what we need.
        It appears the function actually only exists on the polygon level, yet nothing
        happens when it is called.
    this.featureGroup.leafletElement.eachLayer((feature) => {
      feature.showMeasurements?.();
      feature.eachLayer((polygon) => {
        polygon.showMeasurements?.();
      });
    }); */
  };

  getMapBounds: () => Object = () => {
    const {geometry} = this.props;

    return getBoundsFromFeatures({
      features: getAreaSearchFeatures([{
        geometry,
      }]),
    });
  }

  getMapCenter: () => Object = () => {
    const {geometry} = this.props;

    return getCenterFromCoordinates(getCoordinatesOfGeometry(geometry));
  };

  setMapInstanceRef: (any) => void = (mapInstance) => {
    this.mapInstance = mapInstance;
    this.initialize();
  };

  setFeatureGroupRef: (any) => void = (group) => {
    this.featureGroup = group;
    this.initialize();
  };

  render(): React$Node {
    const {geometry} = this.props;
    const center = this.getMapCenter();
    const bounds = this.getMapBounds();

    return (
      <div className="AreaSearchSelectedAreaMiniMap">
        <MapContainer
          bounds={bounds}
          center={center ?? DEFAULT_CENTER}
          overlayLayers={[]}
          zoom={DEFAULT_ZOOM}
          enableSearch={false}
          onMapRefAvailable={this.setMapInstanceRef}
        >
          <FeatureGroup ref={this.setFeatureGroupRef}>
            <GeoJSON
              data={geometry}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    );
  }
}

export default AreaSearchSelectedAreaMiniMap;
