// @ flow
import React from 'react';
import {withRouter} from 'react-router';
import {GeoJSON} from 'react-leaflet';
import flowRight from 'lodash/flowRight';

import {getRouteById, Routes} from '$src/root/routes';

import type {LeafletGeoJson} from '$src/types';

type Props = {
  color: string,
  defaultPlot?: number,
  targetsGeoJson: LeafletGeoJson,
  location: Object,
  stateOptions: Array<Object>,
}

const TargetListLayer = ({
  color,
  defaultPlot,
  targetsGeoJson,
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
      key={JSON.stringify(targetsGeoJson)}
      data={targetsGeoJson}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const {id, targets} = feature.properties;
          
          const getApplicationsLink = (identifier: string) => {
            return `${getRouteById(Routes.PLOT_APPLICATIONS)}/?visualization=table&identifier=${identifier}`;
          };

          targets.forEach(target => {
            const popupContent = `<p><strong>Osoite:</strong> <a href=${getApplicationsLink(target.identifier)}>${target.address.address}</a></p>`;
            layer.bindPopup(popupContent);

            if(id === defaultPlot) {
              layer.setStyle({
                fillOpacity: 0.9,
              });

              setTimeout(() => {
                layer.openPopup();
              }, 100);
            }
          });
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

export default flowRight(
  withRouter,
)(TargetListLayer);
