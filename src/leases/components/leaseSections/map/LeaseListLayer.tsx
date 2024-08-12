import React from "react";
import { withRouter } from "react-router";
import { GeoJSON } from "react-leaflet";
import flowRight from "lodash/flowRight";
import { LeaseFieldTitles } from "@/leases/enums";
import { formatDate, getLabelOfOption } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import type { LeafletGeoJson } from "types";
type Props = {
  color: string;
  defaultPlot?: number;
  leasesGeoJson: LeafletGeoJson;
  location: Record<string, any>;
  stateOptions: Array<Record<string, any>>;
};

const LeaseListLayer = ({
  color,
  defaultPlot,
  leasesGeoJson,
  location: {
    search
  },
  stateOptions
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

  return <GeoJSON key={JSON.stringify(leasesGeoJson)} data={leasesGeoJson} onEachFeature={(feature, layer) => {
    if (feature.properties) {
      const {
        end_date,
        id,
        identifier,
        start_date,
        state
      } = feature.properties;

      const getLeaseLink = () => {
        return `${getRouteById(Routes.LEASES)}/${id}/${search}`;
      };

      const popupContent = `<p class='title'><strong>${getLabelOfOption(stateOptions, state) || '-'}</strong></p>
            <p><strong>Id:</strong> ${id}</p>
            <p><strong>${LeaseFieldTitles.IDENTIFIER}:</strong> <a href=${getLeaseLink()}>${identifier}</a></p>
            <p><strong>${LeaseFieldTitles.START_DATE}:</strong> ${formatDate(start_date) || '-'}</p>
            <p><strong>${LeaseFieldTitles.END_DATE}:</strong> ${formatDate(end_date) || '-'}</p>`;
      layer.bindPopup(popupContent);

      if (id === defaultPlot) {
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

export default flowRight(withRouter)(LeaseListLayer);