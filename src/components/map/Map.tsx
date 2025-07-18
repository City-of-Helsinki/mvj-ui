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
import L from "leaflet";
// import { convertFeatureCollectionToFeature } from "@/areaNote/helpers";

const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";

type Props = {
  change?: (...args: Array<any>) => any;
  center: Array<number>;
  bounds: Record<string, any> | null | undefined;
  overlayLayers?: Array<Record<string, any>>;
  initialValues?: Record<string, any> | null | undefined;
  hasError: boolean;
};
type State = {
  isValid: boolean;
};

const geoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [60.25911821674784, 25.22271210778808],
              [60.25901821674784, 25.22361210758808],
              [60.25901351579114, 25.22316156950953],
              [60.25881071608995, 25.22381711377226],
              [60.25871781036856, 25.22411510235728],
              [60.25901361274479, 25.22451906216664],
              [60.2591768140618, 25.224316160063175],
              [60.25931681938204, 25.22310183305657],
              [60.25911821674784, 25.22371107758808],
            ],
          ],
        ],
      },
      properties: {
        id: 24561,
        feature_type: "area",
        area: 1660,
        identifier: "Luonnos",
        location: "surface",
        type: "real_property",
      },
    },
  ],
};

class MapComponent extends Component<Props, State> {
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
    // const { change } = this.props;
    const features = [];
    this.featureGroup?.leafletElement.eachLayer((layer) =>
      features.push(layer.toGeoJSON()),
    );
    this.setState({
      isValid: features.length > 0,
    });
    // change(convertFeatureCollectionToFeature(features).geometry);
  };
  handleCreated: (arg0: Record<string, any>) => void = (e) => {
    // const { change } = this.props;
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
    // change(convertFeatureCollectionToFeature(features).geometry);
  };

  render(): JSX.Element {
    const { hasError, overlayLayers, center, bounds } = this.props;
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
              <EditControl
                position="topright"
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
      </div>
    );
  }
}

export default MapComponent;
