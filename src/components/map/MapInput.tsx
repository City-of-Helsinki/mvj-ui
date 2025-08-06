import React, { Component } from "react";
import { FeatureGroup, Polygon, Popup } from "react-leaflet";
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
import { polygon } from "leaflet";
import { convertGeoJSONArrayForLeaflet } from "./helpers";

const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";

type Props = {
  change?: (...args: Array<any>) => any;
  initialValues: Record<string, any> | null | undefined;
  isEditMode: boolean;
  center: Array<number>;
  bounds: Record<string, any> | null | undefined;
  overlayLayers?: Array<Record<string, any>>;
  hasError: boolean;
};
type State = {
  isValid: boolean;
};

class MapInput extends Component<Props, State> {
  featureGroup: Record<string, any> | null | undefined;
  state: State = {
    isValid: false,
  };
  setFeatureGroupRef: (el: Record<string, any> | null | undefined) => void = (
    el,
  ) => {
    this.featureGroup = el;
  };
  updateAllFeatures: () => void = throttle(
    () => {
      this.featureGroup?.leafletElement?.eachLayer((layer) => {
        layer.showMeasurements();
        layer.updateMeasurements();
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
    this.featureGroup?.leafletElement.eachLayer((layer) =>
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
    layer.showMeasurements();
    const features = [];
    this.featureGroup?.leafletElement.eachLayer((layer) => {
      layer.bindPopup("Alueluonnos");
      features.push(layer.toGeoJSON());
    });
    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };
  initializeMap: () => void = () => {
    const { initialValues } = this.props;
    const featureGroup = this.featureGroup?.leafletElement;
    const coordinates = initialValues?.geometry?.coordinates || [];
    if (featureGroup && coordinates.length > 0) {
      coordinates.map((selectedArea) => {
        polygon(convertGeoJSONArrayForLeaflet(selectedArea))
          .bindTooltip("Alueluonnos")
          .addTo(featureGroup);
      });
    }
    // this.updateAllFeatures();
  };

  render(): JSX.Element {
    const {
      hasError,
      overlayLayers,
      center,
      bounds,
      isEditMode,
      initialValues,
    } = this.props;
    return (
      <div
        className={classNames("AreaSearchMap", {
          "AreaSearchMap--has-error": hasError,
        })}
      >
        <div className="map">
          <MapContainer
            center={center || DEFAULT_CENTER}
            bounds={bounds}
            zoom={DEFAULT_ZOOM}
            overlayLayers={overlayLayers}
          >
            <FeatureGroup ref={this.setFeatureGroupRef}>
              {this.featureGroup && isEditMode ? (
                <EditControl
                  position="topright"
                  onCreated={this.handleCreated}
                  onDeleted={this.handleAction}
                  onEdited={this.handleAction}
                  onEditMove={this.handleNonCommittedChange}
                  onEditVertex={this.handleNonCommittedChange}
                  onEditStop={this.handleNonCommittedChange}
                  onDeleteStop={this.handleNonCommittedChange}
                  onMounted={this.initializeMap}
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
              ) : initialValues?.geometry ? (
                <Polygon
                  positions={convertGeoJSONArrayForLeaflet(
                    initialValues.geometry.coordinates,
                  )}
                >
                  <Popup>Alueluonnos</Popup>
                </Polygon>
              ) : null}
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>
    );
  }
}

export default MapInput;
