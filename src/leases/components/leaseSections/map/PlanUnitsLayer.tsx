import React from "react";
import { GeoJSON } from "react-leaflet";
import { LeasePlanUnitsFieldTitles } from "@/leases/enums";
import { formatDate, formatNumber, getLabelOfOption } from "@/util/helpers";
import type { LeafletGeoJson } from "types";
type Props = {
  color: string;
  defaultPlanUnit?: number;
  planUnitsGeoJson: LeafletGeoJson;
  planUnitIntendedUseOptions: Array<Record<string, any>>;
  planUnitStateOptions: Array<Record<string, any>>;
  planUnitTypeOptions: Array<Record<string, any>>;
  plotDivisionStateOptions: Array<Record<string, any>>;
};

const PlanUnitsLayer = ({
  color,
  defaultPlanUnit,
  planUnitsGeoJson,
  planUnitIntendedUseOptions,
  planUnitStateOptions,
  planUnitTypeOptions,
  plotDivisionStateOptions,
}: Props) => {
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

  return (
    <GeoJSON
      data={planUnitsGeoJson}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const {
            area,
            detailed_plan_identifier,
            detailed_plan_latest_processing_date,
            detailed_plan_latest_processing_date_note,
            id,
            identifier,
            plan_unit_intended_use,
            plan_unit_state,
            plan_unit_type,
            plot_division_effective_date,
            plot_division_identifier,
            plot_division_state,
            section_area,
          } = feature.properties;
          const popupContent = `<p class='title'><strong>Kaavayksikkö</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.IDENTIFIER}:</strong> ${identifier}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.AREA}:</strong> ${area || area === 0 ? `${formatNumber(area)} m²` : ""}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.SECTION_AREA}:</strong> ${section_area || section_area === 0 ? `${formatNumber(section_area)} m²` : ""}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}:</strong> ${detailed_plan_identifier || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}:</strong> ${formatDate(detailed_plan_latest_processing_date) || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}:</strong> ${detailed_plan_latest_processing_date_note || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}:</strong> ${plot_division_identifier || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}:</strong> ${getLabelOfOption(plotDivisionStateOptions, plot_division_state) || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}:</strong> ${formatDate(plot_division_effective_date) || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}:</strong> ${getLabelOfOption(planUnitTypeOptions, plan_unit_type) || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}:</strong> ${getLabelOfOption(planUnitStateOptions, plan_unit_state) || "-"}</p>
            <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}:</strong> ${getLabelOfOption(planUnitIntendedUseOptions, plan_unit_intended_use) || "-"}</p>`;
          layer.bindPopup(popupContent);

          if (id === defaultPlanUnit) {
            layer.setStyle({
              fillOpacity: 0.9,
            });
            setTimeout(() => {
              layer.openPopup();
            }, 100);
          }
        }

        layer.on({
          mouseover: onMouseOver,
          mouseout: onMouseOut,
        });
      }}
      style={{
        color: color,
      }}
    />
  );
};

export default PlanUnitsLayer;
