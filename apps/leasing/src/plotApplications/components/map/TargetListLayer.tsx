import React from "react";
import { FeatureGroup, GeoJSON, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { getRouteById, Routes } from "@/root/routes";
import type { LeafletGeoJson } from "types";

type Props = {
  color: string;
  targetsGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
};

const TargetListLayer: React.FC<Props> = ({ color, targetsGeoJson }) => {
  const onMouseOver = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7,
    });
  };

  const onMouseOut = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2,
    });
  };

  const getApplicationsLink = (identifier: string) => {
    return `${getRouteById(Routes.PLOT_APPLICATIONS)}/?visualization=table&identifier=${identifier}`;
  };

  return (
    <>
      {targetsGeoJson.features.map((feature) => {
        const { target } = feature.properties;
        return (
          <FeatureGroup key={target.identifier}>
            <GeoJSON
              data={target.geometry}
              style={{
                color: color,
              }}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
            />
            <Popup>
              <Link to={`${getApplicationsLink(target.identifier)}`}>
                {target.identifier}
              </Link>
              <br />
              <strong>Osoite:</strong> {target.address.address}
            </Popup>
          </FeatureGroup>
        );
      })}
    </>
  );
};

export default TargetListLayer as React.ComponentType<Props>;
