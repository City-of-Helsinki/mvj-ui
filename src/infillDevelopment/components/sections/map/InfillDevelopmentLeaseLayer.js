// @ flow
import React, {PureComponent} from 'react';
import {GeoJSON} from 'react-leaflet';

import {formatDate, formatNumber, getLabelOfOption} from '$util/helpers';


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
    color: '#F00',
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
              plot_division_date_of_approval,
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
                  <p><strong>Tunnus:</strong> ${identifier}</p>
                  <p><strong>Määritelmä:</strong> ${getLabelOfOption(areaTypeOptions, type) || '-'}</p>
                  <p><strong>Kokonaisala:</strong> ${(area || area === 0) ? `${formatNumber(area)} m²` : ''}</p>
                  <p><strong>Sijainti:</strong> ${getLabelOfOption(areaLocationOptions, location) || '-'}</p>`;
                break;
              case 'plan_unit':
                popupContent = `<p class='title'><strong>${leaseIdentifier}: Kaavayksikkö</strong></p>
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
                break;
              case 'plot':
                popupContent = `<p class='title'><strong>${leaseIdentifier}: ${getLabelOfOption(plotTypeOptions, type) || '-'}</strong></p>
                  <p><strong>Id:</strong> ${id}</p>
                  <p><strong>Tunnus:</strong> ${identifier}</p>
                  <p><strong>Kokonaisala:</strong> ${(area || area === 0) ? `${formatNumber(area)} m²` : ''}</p>
                  <p><strong>Leikkausala:</strong> ${(section_area || section_area === 0) ? `${formatNumber(section_area)} m²` : ''}</p>
                  <p><strong>Rekisteröintipvm:</strong> ${formatDate(registration_date) || '-'}</p>
                  <p><strong>Kumoamispvm:</strong> ${formatDate(repeal_date) || '-'}</p>`;
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
