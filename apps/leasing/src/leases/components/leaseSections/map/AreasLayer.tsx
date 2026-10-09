import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { formatNumber, getLabelOfOption } from "@/util/helpers";
import type { LeafletGeoJson } from "types";
type Props = {
  areasGeoJson: LeafletGeoJson;
  color: string;
  defaultArea?: number;
  locationOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

const AreasLayer = ({
  areasGeoJson,
  color,
  defaultArea,
  locationOptions,
  typeOptions,
}: Props) => {
  const getPopupContent = useCallback(
    (feature: GeoJSON.Feature) => {
      const { area, id, identifier, location, type } = feature.properties ?? {};
      return `<p class='title'><strong>Vuokrakohde</strong></p>
          <p><strong>Id:</strong> ${id}</p>
          <p><strong>Tunnus:</strong> ${identifier}</p>
          <p><strong>Määritelmä:</strong> ${getLabelOfOption(typeOptions, type) || "-"}</p>
          <p><strong>Kokonaisala:</strong> ${area || area === 0 ? `${formatNumber(area)} m²` : ""}</p>
          <p><strong>Sijainti:</strong> ${getLabelOfOption(locationOptions, location) || "-"}</p>`;
    },
    [locationOptions, typeOptions],
  );
  const onEachFeature = useGeoJsonFeatureInteractions({
    getPopupContent,
    isHighlighted: (feature) => feature.properties?.id === defaultArea,
  });

  return (
    <LeafletGeoJSONLayer
      data={areasGeoJson}
      onEachFeature={onEachFeature}
      style={{
        color: color,
      }}
    />
  );
};

export default AreasLayer;
