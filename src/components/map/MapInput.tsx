import React, { Component } from "react";
import { FeatureGroup, Polygon, Tooltip } from "react-leaflet";
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
import { LeaseAreaDraftGeometryItem } from "@/types";

const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";

type Props = {
  change?: (...args: Array<any>) => any;
  initialValues: Array<LeaseAreaDraftGeometryItem>;
  isAllowedToEdit: boolean;
  isEditMode?: boolean;
  center: Array<number>;
  bounds: Record<string, any> | null | undefined;
  overlayLayers?: Array<Record<string, any>>;
  hasError: boolean;
};
type State = {
  isValid: boolean;
  featureGroup: Record<string, any> | null | undefined;
};

const renderPopupOrTooltip = (identifier: string): string => {
  return `<div>
    <p><strong>${identifier || "-"}</strong></p>
    <p>Alueluonnos</p>
  </div>`;
};

class MapInput extends Component<Props, State> {
  state: State = {
    featureGroup: null,
    isValid: false,
  };
  setFeatureGroupRef: (el: Record<string, any> | null | undefined) => void = (
    el,
  ) => {
    this.setState({ featureGroup: el });
  };
  updateAllFeatures: () => void = throttle(
    () => {
      this.state.featureGroup?.leafletElement?.eachLayer((layer) => {
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
    this.state.featureGroup?.leafletElement.eachLayer((layer) =>
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
    this.state.featureGroup?.leafletElement.eachLayer((layer) => {
      layer.bindPopup(renderPopupOrTooltip(layer?.feature?.properties?.identifier));
      features.push(layer.toGeoJSON());
    });
    this.setState({
      isValid: features.length > 0,
    });
    change(convertFeatureCollectionToFeature(features).geometry);
  };
  initializeMap: () => void = () => {
    const { initialValues } = this.props;
    const featureGroup = this.state.featureGroup?.leafletElement;
    initialValues.forEach((feature) => {
      const coordinates = feature?.draft_geometry?.coordinates || [];
      if (featureGroup && coordinates.length > 0) {
        const tooltip = renderPopupOrTooltip(feature.identifier);
        polygon(convertGeoJSONArrayForLeaflet(coordinates))
          .bindTooltip(tooltip)
          .addTo(featureGroup);
      }
    });
    this.updateAllFeatures();
  };

  render(): JSX.Element {
    const {
      hasError,
      overlayLayers,
      center,
      bounds,
      isAllowedToEdit = false,
      isEditMode,
      initialValues,
    } = this.props;
    const { featureGroup } = this.state;
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
              {featureGroup && isEditMode && isAllowedToEdit ? (
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
              ) : initialValues.length ? (
                initialValues.map((feature) =>{
                  return feature.draft_geometry?.coordinates ? (
                    <Polygon
                      key={feature.id}
                      positions={convertGeoJSONArrayForLeaflet(
                        feature.draft_geometry.coordinates,
                      )}
                    color={SHAPE_COLOR}
                    fillColor={SHAPE_COLOR}
                    fillOpacity={SHAPE_FILL_OPACITY}
                    weight={2}
                  >
                    <Tooltip>
                      <p><strong>{feature.identifier || "-"}</strong></p>
                      <p>Alueluonnos</p>
                    </Tooltip>
                  </Polygon>
                ) : null;
                })
              ) : null}
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>
    );
  }
}

export default MapInput;
