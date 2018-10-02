// @ flow
import React from 'react';
import {GeoJSON} from 'react-leaflet';

import {getLabelOfOption} from '$util/helpers';

type Coordinate = Array<number>;

type AreasFeature = {
  geometry: {
    coordinates: Array<Coordinate>,
    type: string,
  },
  properties: Object,
  type: 'Feature',
}

export type AreasGeoJson = {
  crs?: {
    properties: {
      name: string,
    },
    type: string,
  },
  features: Array<AreasFeature>,
  type: 'FeatureCollection',
}

type Props = {
  color: string,
  areasGeoJson: AreasGeoJson,
  locationOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const AreasLayer = ({
  color,
  areasGeoJson,
  locationOptions,
  typeOptions,
}: Props) => {
  const onMouseOver = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7,
    });
    layer.openPopup();
  };

  const onMouseOut = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2,
    });
  };

  return (
    <GeoJSON
      data={areasGeoJson}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const {
            area,
            id,
            identifier,
            location,
            type,
          } = feature.properties;
          const popupContent = `<p class='title'><strong>Vuokrakohde</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Tunnus:</strong> ${identifier}</p>
            <p><strong>Määritelmä:</strong> ${getLabelOfOption(typeOptions, type) || '-'}</p>
            <p><strong>Pinta-ala:</strong> ${area}</p>
            <p><strong>Sijainti:</strong> ${getLabelOfOption(locationOptions, location) || '-'}</p>`;
          layer.bindPopup(popupContent);
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

export default AreasLayer;
