// @flow
import React, {PureComponent} from 'react';
import {GeoJSON} from 'react-leaflet';

import {MAP_COLORS} from '$src/constants';
import {
  LeaseAreasFieldTitles,
  LeasePlanUnitsFieldTitles,
  LeasePlotsFieldTitles,
} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
} from '$util/helpers';

type Props = {
  areaLocationOptions: Array<Object>,
  areaTypeOptions: Array<Object>,
  color: string,
  geoJSONData: Object,
  highlighted: boolean,
  leaseIdentifier: string,
  planUnitIntendedUseOptions: Array<Object>,
  planUnitStateOptions: Array<Object>,
  planUnitTypeOptions: Array<Object>,
  plotDivisionStateOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
};

class InfillDevelopmentLeaseLayer extends PureComponent<Props> {
  component: any

  static defaultProps = {
    color: MAP_COLORS[0],
  }

  componentDidMount() {
    const {highlighted, leaseIdentifier} = this.props;

    if(highlighted) {
      let popupContent = `<p class='title'><strong>${leaseIdentifier}</strong></p>`;
      this.component.leafletElement.bindPopup(popupContent);
      try {
        setTimeout(() => {
          this.component.leafletElement.openPopup();
        }, 100);
      } catch(e) {
        console.error(`Failed to open lease popup with error ${e}`);
      }

      this.component.leafletElement._events.click = [];
    }
  }

  onMouseOver = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7,
    });
  };

  onMouseOut = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2,
    });
  };

  render() {
    const {
      areaLocationOptions,
      areaTypeOptions,
      color,
      geoJSONData,
      highlighted,
      leaseIdentifier,
      planUnitIntendedUseOptions,
      planUnitStateOptions,
      planUnitTypeOptions,
      plotDivisionStateOptions,
      plotTypeOptions,
    } = this.props;

    return(
      <GeoJSON
        key={JSON.stringify(geoJSONData)}
        ref={(ref) => this.component = ref}
        data={geoJSONData}
        onEachFeature={(feature, layer) => {
          if (feature.properties) {
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
            } = feature.properties;
            let popupContent = '';
            switch(feature_type) {
              case 'area':
                popupContent = `<p class='title'><strong>${leaseIdentifier}: Vuokrakohde</strong></p>
                  <p><strong>Id:</strong> ${id}</p>
                  <p><strong>${LeaseAreasFieldTitles.IDENTIFIER}:</strong> ${identifier}</p>
                  <p><strong>${LeaseAreasFieldTitles.TYPE}:</strong> ${getLabelOfOption(areaTypeOptions, type) || '-'}</p>
                  <p><strong>${LeaseAreasFieldTitles.AREA}:</strong> ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ''}</p>
                  <p><strong>${LeaseAreasFieldTitles.LOCATION}:</strong> ${getLabelOfOption(areaLocationOptions, location) || '-'}</p>`;
                break;
              case 'plan_unit':
                popupContent = `<p class='title'><strong>${leaseIdentifier}: Kaavayksikkö</strong></p>
                  <p><strong>Id:</strong> ${id}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.IDENTIFIER}:</strong> ${identifier}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.AREA}:</strong> ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ''}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.SECTION_AREA}:</strong> ${!isEmptyValue(section_area) ? `${formatNumber(section_area)} m²` : ''}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}:</strong> ${detailed_plan_identifier || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}:</strong> ${formatDate(detailed_plan_latest_processing_date) || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}:</strong> ${detailed_plan_latest_processing_date_note || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}:</strong> ${plot_division_identifier || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}:</strong> ${getLabelOfOption(plotDivisionStateOptions, plot_division_state) || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}:</strong> ${formatDate(plot_division_effective_date) || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}:</strong> ${getLabelOfOption(planUnitTypeOptions, plan_unit_type) || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}:</strong> ${getLabelOfOption(planUnitStateOptions, plan_unit_state) || '-'}</p>
                  <p><strong>${LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}:</strong> ${getLabelOfOption(planUnitIntendedUseOptions, plan_unit_intended_use) || '-'}</p>`;
                break;
              case 'plot':
                popupContent = `<p class='title'><strong>${leaseIdentifier}: ${getLabelOfOption(plotTypeOptions, type) || '-'}</strong></p>
                  <p><strong>Id:</strong> ${id}</p>
                  <p><strong>${LeasePlotsFieldTitles.IDENTIFIER}:</strong> ${identifier}</p>
                  <p><strong>${LeasePlotsFieldTitles.AREA}:</strong> ${!isEmptyValue(area) ? `${formatNumber(area)} m²` : ''}</p>
                  <p><strong>${LeasePlotsFieldTitles.SECTION_AREA}:</strong> ${!isEmptyValue(section_area) ? `${formatNumber(section_area)} m²` : ''}</p>
                  <p><strong>${LeasePlotsFieldTitles.REGISTRATION_DATE}:</strong> ${formatDate(registration_date) || '-'}</p>
                  <p><strong>${LeasePlotsFieldTitles.REPEAL_DATE}:</strong> ${formatDate(repeal_date) || '-'}</p>`;
                break;
            }

            if(highlighted) {
              layer.setStyle({
                fillOpacity: 0.9,
              });
            }

            layer.bindPopup(popupContent);
          }

          layer.on({
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
          });
        }}
        style={{
          color: color,
        }}
      />
    );
  }
}

export default InfillDevelopmentLeaseLayer;
