import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { formatDate, getLabelOfOption } from "@/util/helpers";
import type { LeafletGeoJson } from "types";
type Props = {
  color: string;
  financingOptions: Array<Record<string, any>>;
  geoJSON: LeafletGeoJson;
  indexOptions: Array<Record<string, any>>;
  managementOptions: Array<Record<string, any>>;
  plotTypeOptions: Array<Record<string, any>>;
};

const RentBasisLayer = ({
  color,
  financingOptions,
  geoJSON,
  indexOptions,
  managementOptions,
  plotTypeOptions,
}: Props) => {
  const getPopupContent = useCallback(
    (feature: GeoJSON.Feature) => {
      const {
        detailed_plan_identifier,
        end_date,
        financing,
        id,
        index,
        lease_rights_end_date,
        management,
        plot_type,
        property_identifiers,
        start_date,
      } = feature.properties ?? {};
      const identifierText = property_identifiers?.length
        ? property_identifiers
            .map((identifier) => identifier.identifier)
            .join(", ")
        : "-";

      return `<p class='title'><strong>Vuokrausperiaatteet</strong></p>
        <p><strong>Id:</strong> ${id}</p>
        <p><strong>Tonttityyppi:</strong> ${getLabelOfOption(plotTypeOptions, plot_type) || "-"}</p>
        <p><strong>Alkupvm:</strong> ${formatDate(start_date) || "-"}</p>
        <p><strong>Loppupvm:</strong> ${formatDate(end_date) || "-"}</p>
        <p><strong>Kiinteistötunnukset:</strong> ${identifierText}</p>
        <p><strong>Asemakaava:</strong> ${detailed_plan_identifier || "-"}</p>
        <p><strong>Hallintamuoto:</strong> ${getLabelOfOption(managementOptions, management) || "-"}</p>
        <p><strong>Rahoitusmuoto:</strong> ${getLabelOfOption(financingOptions, financing) || "-"}</p>
        <p><strong>Vuokraoikeuspäättyy:</strong> ${formatDate(lease_rights_end_date) || "-"}</p>
        <p><strong>Indeksi:</strong> ${getLabelOfOption(indexOptions, index) || "-"}</p>`;
    },
    [financingOptions, indexOptions, managementOptions, plotTypeOptions],
  );
  const onEachFeature = useGeoJsonFeatureInteractions({ getPopupContent });

  return (
    <LeafletGeoJSONLayer
      data={geoJSON}
      onEachFeature={onEachFeature}
      style={{
        color: color,
      }}
    />
  );
};

export default RentBasisLayer;
