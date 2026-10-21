import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import {
  LeaseAreasFieldTitles,
  LeasePlanUnitsFieldTitles,
  LeasePlotsFieldTitles,
} from "@/leases/enums";
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
} from "@/util/helpers";
import { html } from "@/util/html";
import type { LeafletGeoJson } from "types";
type Props = {
  areaLocationOptions: Array<Record<string, any>>;
  areaTypeOptions: Array<Record<string, any>>;
  color?: string;
  geoJSONData: LeafletGeoJson;
  highlighted: boolean;
  leaseIdentifier: string;
  planUnitIntendedUseOptions: Array<Record<string, any>>;
  planUnitStateOptions: Array<Record<string, any>>;
  planUnitTypeOptions: Array<Record<string, any>>;
  plotDivisionStateOptions: Array<Record<string, any>>;
  plotTypeOptions: Array<Record<string, any>>;
};

const InfillDevelopmentLeaseLayer = ({
  areaLocationOptions,
  areaTypeOptions,
  color = MAP_LAYER_COLORS[0],
  geoJSONData,
  highlighted,
  leaseIdentifier,
  planUnitIntendedUseOptions,
  planUnitStateOptions,
  planUnitTypeOptions,
  plotDivisionStateOptions,
  plotTypeOptions,
}: Props) => {
  const getPopupContent = useCallback(
    (feature: GeoJSON.Feature) => {
      const {
        area,
        detailed_plan_identifier,
        detailed_plan_latest_processing_date,
        detailed_plan_latest_processing_date_note,
        feature_type,
        id,
        identifier,
        plan_unit_intended_use,
        plan_unit_state,
        plan_unit_type,
        plot_division_effective_date,
        plot_division_identifier,
        plot_division_state,
        registration_date,
        repeal_date,
        section_area,
        type,
      } = feature.properties ?? {};

      switch (feature_type) {
        case "area":
          return html`<p class="title">
              <strong>${leaseIdentifier}: Vuokrakohde</strong>
            </p>
            <p><strong>Id:</strong> ${id}</p>
            <p>
              <strong>${LeaseAreasFieldTitles.IDENTIFIER}:</strong>
              ${identifier}
            </p>
            <p>
              <strong>${LeaseAreasFieldTitles.TYPE}:</strong>
              ${getLabelOfOption(areaTypeOptions, type) || "-"}
            </p>
            <p>
              <strong>${LeaseAreasFieldTitles.AREA}:</strong>
              ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ""}
            </p>
            <p>
              <strong>${LeaseAreasFieldTitles.LOCATION}:</strong>
              ${getLabelOfOption(areaLocationOptions, location) || "-"}
            </p>`;
        case "plan_unit":
          return html`<p class="title">
              <strong>${leaseIdentifier}: Kaavayksikkö</strong>
            </p>
            <p><strong>Id:</strong> ${id}</p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.IDENTIFIER}:</strong>
              ${identifier}
            </p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.AREA}:</strong>
              ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ""}
            </p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.SECTION_AREA}:</strong>
              ${!isEmptyValue(section_area) ? `${formatNumber(section_area)} m²` : ""}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}:</strong
              >
              ${detailed_plan_identifier || "-"}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}:</strong
              >
              ${formatDate(detailed_plan_latest_processing_date) || "-"}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}:</strong
              >
              ${detailed_plan_latest_processing_date_note || "-"}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}:</strong
              >
              ${plot_division_identifier || "-"}
            </p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}:</strong>
              ${getLabelOfOption(plotDivisionStateOptions, plot_division_state) || "-"}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}:</strong
              >
              ${formatDate(plot_division_effective_date) || "-"}
            </p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}:</strong>
              ${getLabelOfOption(planUnitTypeOptions, plan_unit_type) || "-"}
            </p>
            <p>
              <strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}:</strong>
              ${getLabelOfOption(planUnitStateOptions, plan_unit_state) || "-"}
            </p>
            <p>
              <strong
                >${LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}:</strong
              >
              ${getLabelOfOption(planUnitIntendedUseOptions, plan_unit_intended_use) || "-"}
            </p>`;
        case "plot":
          return html`<p class="title">
              <strong
                >${leaseIdentifier}:
                ${getLabelOfOption(plotTypeOptions, type) || "-"}</strong
              >
            </p>
            <p><strong>Id:</strong> ${id}</p>
            <p>
              <strong>${LeasePlotsFieldTitles.IDENTIFIER}:</strong>
              ${identifier}
            </p>
            <p>
              <strong>${LeasePlotsFieldTitles.AREA}:</strong>
              ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ""}
            </p>
            <p>
              <strong>${LeasePlotsFieldTitles.SECTION_AREA}:</strong>
              ${!isEmptyValue(section_area) ? `${formatNumber(section_area)} m²` : ""}
            </p>
            <p>
              <strong>${LeasePlotsFieldTitles.REGISTRATION_DATE}:</strong>
              ${formatDate(registration_date) || "-"}
            </p>
            <p>
              <strong>${LeasePlotsFieldTitles.REPEAL_DATE}:</strong>
              ${formatDate(repeal_date) || "-"}
            </p>`;
        default:
          return;
      }
    },
    [
      areaLocationOptions,
      areaTypeOptions,
      leaseIdentifier,
      planUnitIntendedUseOptions,
      planUnitStateOptions,
      planUnitTypeOptions,
      plotDivisionStateOptions,
      plotTypeOptions,
    ],
  );
  const isHighlighted = useCallback(() => highlighted, [highlighted]);
  const onEachFeature = useGeoJsonFeatureInteractions({
    getPopupContent,
    isHighlighted,
    openHighlightedPopup: false,
  });

  return (
    <LeafletGeoJSONLayer
      key={JSON.stringify(geoJSONData)}
      data={geoJSONData}
      onEachFeature={onEachFeature}
      style={{
        color: color,
      }}
    />
  );
};

export default InfillDevelopmentLeaseLayer;
