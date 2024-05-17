import React from "react";
import { GeoJSON } from "react-leaflet";
import { formatNumber, getLabelOfOption } from "src/util/helpers";
import type { LeafletGeoJson } from "src/types";
type Props = {
  areasGeoJson: LeafletGeoJson;
  color: string;
  defaultArea?: number;
  locationOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

const AreasLayer = ({
  areasGeoJson,
  color,
  defaultArea,
  locationOptions,
  typeOptions
}: Props) => {
  const onMouseOver = e => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.7
    });
  };

  const onMouseOut = e => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.2
    });
  };

  return <GeoJSON data={areasGeoJson} onEachFeature={(feature, layer) => {
    if (feature.properties) {
      const {
        area,
        id,
        identifier,
        location,
        type
      } = feature.properties;
      const popupContent = `<p class='title'><strong>Vuokrakohde</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>Tunnus:</strong> ${identifier}</p>
            <p><strong>Määritelmä:</strong> ${getLabelOfOption(typeOptions, type) || '-'}</p>
            <p><strong>Kokonaisala:</strong> ${area || area === 0 ? `${formatNumber(area)} m²` : ''}</p>
            <p><strong>Sijainti:</strong> ${getLabelOfOption(locationOptions, location) || '-'}</p>`;
      layer.bindPopup(popupContent);

      if (id === defaultArea) {
        layer.setStyle({
          fillOpacity: 0.9
        });
        setTimeout(() => {
          layer.openPopup();
        }, 100);
      }
    }

    layer.on({
      mouseover: onMouseOver,
      mouseout: onMouseOut
    });
  }} style={{
    color: color
  }} />;
};

export default AreasLayer;