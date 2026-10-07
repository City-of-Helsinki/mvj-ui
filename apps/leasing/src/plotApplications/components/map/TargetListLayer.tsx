import React from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
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
    <LeafletGeoJSONLayer
      data={targetsGeoJson}
      style={{ color }}
      onEachFeature={(feature, layer) => {
        const target = feature.properties?.target;
        if (!target) return;
        layer.bindPopup(
          `<a href="${getApplicationsLink(target.identifier)}">${target.identifier}</a><br/><strong>Osoite:</strong> ${target.address.address}`,
        );
        layer.on({
          mouseover: onMouseOver,
          mouseout: onMouseOut,
        });
      }}
    />
  );
};

export default TargetListLayer as React.ComponentType<Props>;
