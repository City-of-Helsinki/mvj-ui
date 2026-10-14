import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { getRouteById, Routes } from "@/root/routes";
import { html } from "@/util/html";
import type { LeafletGeoJson } from "types";

type Props = {
  color: string;
  targetsGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
};

const TargetListLayer: React.FC<Props> = ({ color, targetsGeoJson }) => {
  const getApplicationsLink = (identifier: string) => {
    return `${getRouteById(Routes.PLOT_APPLICATIONS)}/?visualization=table&identifier=${identifier}`;
  };
  const getPopupContent = useCallback((feature: GeoJSON.Feature) => {
    const target = feature.properties?.target;
    if (!target) return;

    return html`<a href="${getApplicationsLink(target.identifier)}"
        >${target.identifier}</a
      ><br /><strong>Osoite:</strong> ${target.address.address}`;
  }, []);
  const onEachFeature = useGeoJsonFeatureInteractions({ getPopupContent });

  return (
    <LeafletGeoJSONLayer
      data={targetsGeoJson}
      style={{ color }}
      onEachFeature={onEachFeature}
    />
  );
};

export default TargetListLayer as React.ComponentType<Props>;
