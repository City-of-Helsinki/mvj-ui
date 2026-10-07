import React, { Component } from "react";
import L from "leaflet";
// This is a hack for Leaflet Draw, the issue and solution described at:
// https://github.com/Leaflet/Leaflet.draw/issues/1026#issuecomment-986702652
// @ts-ignore
window.type = true;
import { throttle } from "lodash-es";
import classNames from "classnames";
import MapContainer from "@/areaNote/components/MapContainer";
import LeafletDrawControl from "@/components/map/LeafletDrawControl";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import { convertFeatureCollectionToFeature } from "@/areaNote/helpers";
const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";
type Props = {
  change: (...args: Array<any>) => any;
  hasError: boolean;
};
type State = {
  isValid: boolean;
  map: L.Map | null;
  featureGroup: L.FeatureGroup | null;
};

class AreaSearchMap extends Component<Props, State> {
  state: State = {
    isValid: false,
    map: null,
    featureGroup: null,
  };
  handleMapReady = (map: L.Map) => {
    const featureGroup = L.featureGroup().addTo(map);
    this.setState({ map, featureGroup });
  };
  updateAllFeatures: () => void = throttle(
    () => {
      this.state.featureGroup?.eachLayer((layer: any) => {
        showMeasurements(layer);
        updateMeasurements(layer);
      });
    },
    1000 / 60,
    {
      leading: true,
      trailing: true,
    },
  );
  handleNonCommittedChange: () => void = () => {
    this.updateAllFeatures();
  };
  handleAction: () => void = () => {
    const { change } = this.props;
    const features = [];
    this.state.featureGroup?.eachLayer((layer: any) =>
      features.push(layer.toGeoJSON()),
    );
    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };
  handleCreated: (arg0: Record<string, any>) => void = (e) => {
    const { change } = this.props;
    const { layer } = e;
    showMeasurements(layer);
    const features = [];
    this.state.featureGroup?.eachLayer((layer: any) =>
      features.push(layer.toGeoJSON()),
    );
    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };

  render(): JSX.Element {
    const { hasError } = this.props;
    const { map, featureGroup } = this.state;
    return (
      <div
        className={classNames("AreaSearchMap", {
          "AreaSearchMap--has-error": hasError,
        })}
      >
        <div className="map">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            onMapReady={this.handleMapReady}
          />
          <LeafletDrawControl
            map={map}
            featureGroup={featureGroup}
            onCreated={this.handleCreated}
            onDeleted={this.handleAction}
            onEdited={this.handleAction}
            onNonCommittedChange={this.handleNonCommittedChange}
            draw={{
              circlemarker: false,
              circle: false,
              marker: false,
              polyline: false,
              polygon: {
                allowIntersection: false,
                showArea: true,
                drawError: { color: SHAPE_ERROR_COLOR, timeout: 1000 },
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
        </div>
      </div>
    );
  }
}

export default AreaSearchMap;
