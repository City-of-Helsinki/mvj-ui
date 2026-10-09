import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { LeaseFieldTitles } from "@/leases/enums";
import { formatDate, getLabelOfOption } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import type { LeafletGeoJson } from "types";

type Props = {
  color: string;
  defaultPlot?: number;
  leasesGeoJson: LeafletGeoJson;
  search: string;
  stateOptions: Array<Record<string, any>>;
};

const LeaseListLayer: React.FC<Props> = ({
  color,
  defaultPlot,
  leasesGeoJson,
  search,
  stateOptions,
}) => {
  const getPopupContent = useCallback(
    (feature: GeoJSON.Feature) => {
      const { end_date, id, identifier, start_date, state } =
        feature.properties ?? {};
      const getLeaseLink = () => {
        return `${getRouteById(Routes.LEASES)}/${id}/${search}`;
      };

      return `<p class='title'><strong>${getLabelOfOption(stateOptions, state) || "-"}</strong></p>
        <p><strong>Id:</strong> ${id}</p>
        <p><strong>${LeaseFieldTitles.IDENTIFIER}:</strong> <a href=${getLeaseLink()}>${identifier}</a></p>
        <p><strong>${LeaseFieldTitles.START_DATE}:</strong> ${formatDate(start_date) || "-"}</p>
        <p><strong>${LeaseFieldTitles.END_DATE}:</strong> ${formatDate(end_date) || "-"}</p>`;
    },
    [search, stateOptions],
  );
  const onEachFeature = useGeoJsonFeatureInteractions({
    getPopupContent,
    isHighlighted: (feature) => feature.properties?.id === defaultPlot,
  });

  return (
    <LeafletGeoJSONLayer
      key={JSON.stringify(leasesGeoJson)}
      data={leasesGeoJson}
      onEachFeature={onEachFeature}
      style={{
        color: color,
      }}
    />
  );
};

export default LeaseListLayer;
