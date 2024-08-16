import React, { Component } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
// This is a hack to get react-leaflet-draw, the issue and solution described at:
// https://github.com/Leaflet/Leaflet.draw/issues/1026#issuecomment-986702652
// @ts-ignore
window.type = true; 
import throttle from "lodash/throttle";
import classNames from "classnames";
import MapContainer from "@/areaNote/components/MapContainer";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import { convertFeatureCollectionToFeature } from "@/areaNote/helpers";
const SHAPE_COLOR = '#9c27b0';
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = '#bd2719';
type Props = {
  change: (...args: Array<any>) => any;
  hasError: boolean;
};
type State = {
  isValid: boolean;
};

class AreaSearchMap extends Component<Props, State> {
  featureGroup: Record<string, any> | null | undefined;
  state: State = {
    isValid: false
  };
  setFeatureGroupRef: (el: Record<string, any> | null | undefined) => void = el => {
    this.featureGroup = el;
  };
  updateAllFeatures: () => void = throttle(() => {
    this.featureGroup?.leafletElement?.eachLayer(layer => {
      layer.showMeasurements();
      layer.updateMeasurements();
    });
  }, 1000 / 60, {
    leading: true,
    trailing: true
  });
  handleNonCommittedChange: () => void = () => {
    this.updateAllFeatures();
  };
  handleAction: () => void = () => {
    const {
      change
    } = this.props;
    const features = [];
    this.featureGroup?.leafletElement.eachLayer(layer => features.push(layer.toGeoJSON()));
    this.setState({
      isValid: features.length > 0
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };
  handleCreated: (arg0: Record<string, any>) => void = e => {
    const {
      change
    } = this.props;
    const {
      layer
    } = e;
    layer.showMeasurements();
    const features = [];
    this.featureGroup?.leafletElement.eachLayer(layer => features.push(layer.toGeoJSON()));
    this.setState({
      isValid: features.length > 0
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };

  render(): JSX.Element {
    const {
      hasError
    } = this.props;
    return <div className={classNames('AreaSearchMap', {
      'AreaSearchMap--has-error': hasError
    })}>
        <div className="map">
          <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
            <FeatureGroup ref={this.setFeatureGroupRef}>
              <EditControl position='topright' onCreated={this.handleCreated} onDeleted={this.handleAction} onEdited={this.handleAction} onEditMove={this.handleNonCommittedChange} onEditVertex={this.handleNonCommittedChange} onEditStop={this.handleNonCommittedChange} onDeleteStop={this.handleNonCommittedChange} draw={{
              circlemarker: false,
              circle: false,
              marker: false,
              polyline: false,
              polygon: {
                allowIntersection: false,
                showArea: true,
                drawError: {
                  color: SHAPE_ERROR_COLOR,
                  timeout: 1000
                },
                shapeOptions: {
                  color: SHAPE_COLOR,
                  fillOpacity: SHAPE_FILL_OPACITY
                }
              },
              rectangle: {
                shapeOptions: {
                  color: SHAPE_COLOR,
                  fillOpacity: SHAPE_FILL_OPACITY
                }
              }
            }} />
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>;
  }

}

export default AreaSearchMap;