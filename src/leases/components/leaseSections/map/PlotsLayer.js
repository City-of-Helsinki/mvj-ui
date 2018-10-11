// @ flow
import React from 'react';
import {GeoJSON} from 'react-leaflet';

import {formatDate, formatNumber, getLabelOfOption} from '$util/helpers';

type Coordinate = Array<number>;

type PlotFeature = {
  geometry: {
    coordinates: Array<Coordinate>,
    type: string,
  },
  properties: {
    area: ?number,
    id: number,
    identifier: ?string,
    registration_date: ?string,
    repeal_date: ?string,
    section_area: ?number,
  },
  type: 'Feature',
}

export type PlotsGeoJson = {
  features: Array<PlotFeature>,
  type: 'FeatureCollection',
}

type Props = {
  color: string,
  defaultPlot?: number,
  plotsGeoJson: PlotsGeoJson,
  typeOptions: Array<Object>,

}

const PlotsLayer = ({
  color,
  defaultPlot,
  plotsGeoJson,
  typeOptions,
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
      data={plotsGeoJson}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const {area, id, identifier, registration_date, repeal_date, section_area, type} = feature.properties;
          const popupContent = `<p class='title'><strong>${getLabelOfOption(typeOptions, type) || '-'}</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Tunnus:</strong> ${identifier}</p>
            <p><strong>Kokonaisala:</strong> ${(area || area === 0) ? `${formatNumber(area)} m²` : ''}</p>
            <p><strong>Leikkausala:</strong> ${(section_area || section_area === 0) ? `${formatNumber(section_area)} m²` : ''}</p>
            <p><strong>Rekisteröintipvm:</strong> ${formatDate(registration_date) || '-'}</p>
            <p><strong>Kumoamispvm:</strong> ${formatDate(repeal_date) || '-'}</p>`;
          layer.bindPopup(popupContent);

          if(id === defaultPlot) {
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

export default PlotsLayer;
