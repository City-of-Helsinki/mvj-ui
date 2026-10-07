import React, { Component } from "react";
import L from "leaflet";
import classNames from "classnames";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import MapContainer from "@/areaNote/components/MapContainer";
import {
  getBoundsFromFeatures,
  getCenterFromCoordinates,
  getCoordinatesOfGeometry,
} from "@/util/map";
import type { LeafletFeatureGeometry } from "types";
import { getAreaSearchFeatures } from "@/areaSearch/helpers";
type Props = {
  geometry: LeafletFeatureGeometry;
  minimap?: boolean;
};

class SingleAreaSearchMap extends Component<Props> {
  map: L.Map | null = null;
  geoJsonLayer: L.GeoJSON | null = null;

  getMapBounds: () => Record<string, any> = () => {
    const { geometry } = this.props;
    return getBoundsFromFeatures({
      features: getAreaSearchFeatures([
        {
          geometry,
        },
      ]),
    });
  };
  getMapCenter: () => Record<string, any> = () => {
    const { geometry } = this.props;
    return getCenterFromCoordinates(getCoordinatesOfGeometry(geometry));
  };
  handleMapReady = (map: L.Map) => {
    this.map = map;
    this.geoJsonLayer = L.geoJSON(
      this.props.geometry as GeoJSON.GeoJsonObject,
    ).addTo(map);
    map.fitBounds(this.getMapBounds() as L.LatLngBoundsExpression);
  };

  componentDidUpdate(previousProps: Props) {
    if (previousProps.geometry !== this.props.geometry && this.geoJsonLayer) {
      this.geoJsonLayer.clearLayers();
      this.geoJsonLayer.addData(this.props.geometry as GeoJSON.GeoJsonObject);
      this.map?.fitBounds(this.getMapBounds() as L.LatLngBoundsExpression);
    }
  }

  render(): JSX.Element {
    const { geometry, minimap = false } = this.props;

    if (!geometry) {
      return <p>{"Ei geometriaa."}</p>;
    }

    const center = this.getMapCenter() as L.LatLngExpression;
    const bounds = this.getMapBounds() as L.LatLngBoundsExpression;
    return (
      <div
        className={classNames("SingleAreaSearchMap", {
          map: !minimap,
          "SingleAreaSearchMap--minimap": minimap,
        })}
      >
        <MapContainer
          bounds={bounds}
          center={center ?? DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          enableSearch={false}
          onMapReady={this.handleMapReady}
        />
      </div>
    );
  }
}

export default SingleAreaSearchMap;
