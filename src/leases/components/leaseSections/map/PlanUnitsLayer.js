// @ flow
import React from 'react';
import {GeoJSON} from 'react-leaflet';

import {formatDate, formatNumber, getLabelOfOption} from '$util/helpers';

type Coordinate = Array<number>;

type PlanUnitsFeature = {
  geometry: {
    coordinates: Array<Coordinate>,
    type: string,
  },
  properties: Object,
  type: 'Feature',
}

export type PlanUnitsGeoJson = {
  crs?: {
    properties: {
      name: string,
    },
    type: string,
  },
  features: Array<PlanUnitsFeature>,
  type: 'FeatureCollection',
}

type Props = {
  color: string,
  defaultPlanUnit?: number,
  planUnitsGeoJson: PlanUnitsGeoJson,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotDivisionStateOptions: Array<Object>,
}

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
            plot_division_date_of_approval,
            plot_division_identifier,
            plot_division_state,
            section_area,
          } = feature.properties;
          const popupContent = `<p class='title'><strong>Kaavayksikkö</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Tunnus:</strong> ${identifier}</p>
            <p><strong>Kokonaisala:</strong> ${(area || area === 0) ? `${formatNumber(area)} m²` : ''}</p>
            <p><strong>Leikkausala:</strong> ${(section_area || section_area === 0) ? `${formatNumber(section_area)} m²` : ''}</p>
            <p><strong>Asemakaava:</strong> ${detailed_plan_identifier || '-'}</p>
            <p><strong>Asemakaavan viimeisin käsittelypvm:</strong> ${formatDate(detailed_plan_latest_processing_date) || '-'}</p>
            <p><strong>Asemakaavan viimeisin käsittelypvm huomautus:</strong> ${detailed_plan_latest_processing_date_note || '-'}</p>
            <p><strong>Tonttijaon tunnus:</strong> ${plot_division_identifier || '-'}</p>
            <p><strong>Tonttijaon olotila:</strong> ${getLabelOfOption(plotDivisionStateOptions, plot_division_state) || '-'}</p>
            <p><strong>Tonttijaon hyväksymispvm:</strong> ${formatDate(plot_division_date_of_approval) || '-'}</p>
            <p><strong>Kaavayksikön laji:</strong> ${getLabelOfOption(planUnitTypeOptions, plan_unit_type) || '-'}</p>
            <p><strong>Kaavayksikön olotila:</strong> ${getLabelOfOption(planUnitStateOptions, plan_unit_state) || '-'}</p>
            <p><strong>Kaavayksikön käyttötarkoitus:</strong> ${getLabelOfOption(planUnitIntendedUseOptions, plan_unit_intended_use) || '-'}</p>`;
          layer.bindPopup(popupContent);

          if(id === defaultPlanUnit) {
            layer.setStyle({
              fillOpacity: 0.7,
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
