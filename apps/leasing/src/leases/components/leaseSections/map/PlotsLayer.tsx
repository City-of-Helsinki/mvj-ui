import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { formatDate, formatNumber, getLabelOfOption } from "@/util/helpers";
import type { LeafletGeoJson } from "types";
type Props = {
  color: string;
  defaultPlot?: number;
  plotsGeoJson: LeafletGeoJson;
  typeOptions: Array<Record<string, any>>;
};

const PlotsLayer = ({
  color,
  defaultPlot,
  plotsGeoJson,
  typeOptions,
}: Props) => {
  const getPopupContent = useCallback(
    (feature: GeoJSON.Feature) => {
      const {
        area,
        id,
        identifier,
        registration_date,
        repeal_date,
        section_area,
        type,
      } = feature.properties ?? {};
      return `<p class='title'><strong>${getLabelOfOption(typeOptions, type) || "-"}</strong></p>
        <p><strong>Id:</strong> ${id}</p>
        <p><strong>Tunnus:</strong> ${identifier}</p>
        <p><strong>Kokonaisala:</strong> ${area || area === 0 ? `${formatNumber(area)} m²` : ""}</p>
        <p><strong>Leikkausala:</strong> ${section_area || section_area === 0 ? `${formatNumber(section_area)} m²` : ""}</p>
        <p><strong>Rekisteröintipvm:</strong> ${formatDate(registration_date) || "-"}</p>
        <p><strong>Kumoamispvm:</strong> ${formatDate(repeal_date) || "-"}</p>`;
    },
    [typeOptions],
  );
  const onEachFeature = useGeoJsonFeatureInteractions({
    getPopupContent,
    isHighlighted: (feature) => feature.properties?.id === defaultPlot,
  });

  return (
    <LeafletGeoJSONLayer
      data={plotsGeoJson}
      onEachFeature={onEachFeature}
      style={{
        color: color,
      }}
    />
  );
};

export default PlotsLayer;
