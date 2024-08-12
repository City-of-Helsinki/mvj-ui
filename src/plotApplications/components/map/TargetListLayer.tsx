import React from "react";
import { withRouter } from "react-router";
import { FeatureGroup, GeoJSON, Popup } from "react-leaflet";
import flowRight from "lodash/flowRight";
import { Link } from "react-router-dom";
import { getRouteById, Routes } from "@/root/routes";
import type { LeafletGeoJson } from "types";
type OwnProps = {
  color: string;
  targetsGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
};
type Props = OwnProps & {
  location: Record<string, any>;
};

const TargetListLayer = ({
  color,
  targetsGeoJson
}: Props) => {
  const onMouseOver = e => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7
    });
  };

  const onMouseOut = e => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2
    });
  };

  const getApplicationsLink = (identifier: string) => {
    return `${getRouteById(Routes.PLOT_APPLICATIONS)}/?visualization=table&identifier=${identifier}`;
  };

  return <>
    {targetsGeoJson.features.map(feature => {
      const {
        target
      } = feature.properties;
      return <FeatureGroup key={target.identifier}>
        <GeoJSON data={target.geometry} style={{
          color: color
        }} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
        <Popup>
          <Link to={`${getApplicationsLink(target.identifier)}`}>{target.identifier}</Link>
          <br />
          <strong>Osoite:</strong> {target.address.address}
        </Popup>
      </FeatureGroup>;
    })}
  </>;
};

export default (flowRight(withRouter)(TargetListLayer) as React.ComponentType<OwnProps>);