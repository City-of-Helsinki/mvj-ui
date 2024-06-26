import React from "react";
import { withRouter } from "react-router";
import { FeatureGroup, GeoJSON, Popup } from "react-leaflet";
import flowRight from "lodash/flowRight";
import { Link } from "react-router-dom";
import { getRouteById, Routes } from "root/routes";
import type { Attributes, LeafletGeoJson } from "types";
import { withAreaSearchAttributes } from "/src/components/attributes/AreaSearchAttributes";
import { formatDate, getFieldOptions, getLabelOfOption } from "util/helpers";
type OwnProps = {
  color: string;
  areaSearchesGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
};
type Props = OwnProps & {
  location: Record<string, any>;
  areaSearchAttributes: Attributes;
};

const AreaSearchLayer = ({
  color,
  areaSearchesGeoJson,
  areaSearchAttributes
}: Props) => {
  const intendedUseOptions = getFieldOptions(areaSearchAttributes, 'intended_use');
  const stateOptions = getFieldOptions(areaSearchAttributes, 'state');
  const lessorOptions = getFieldOptions(areaSearchAttributes, 'lessor');

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

  const getSearchLink = (id: number) => {
    return `${getRouteById(Routes.AREA_SEARCH)}/${id}`;
  };

  return <>
    {areaSearchesGeoJson.features.map(feature => {
      const {
        search
      } = feature.properties;
      return <FeatureGroup key={search.id}>
        <GeoJSON data={feature.geometry} style={{
          color: color
        }} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
        <Popup>
          <p className='title'><strong>
            <Link to={`${getSearchLink(search.id)}`}>{search.identifier}</Link>
          </strong></p>

          <p>
            {search.address ? search.address + ', ' : ''}
            {search.district ? search.district : ''}
          </p>
          <p>
            {formatDate(search.start_date) || '??.??.????'}–{formatDate(search.end_date) || ''}
          </p>
          <p>
            <strong>Käyttötarkoitus: </strong>
            {getLabelOfOption(intendedUseOptions, search.intended_use) || '-'}
          </p>
          <p>
            <strong>Vuokranantaja: </strong>
            {getLabelOfOption(lessorOptions, search.lessor) || '-'}
          </p>
          <p>
            <strong>Tila: </strong>
            {getLabelOfOption(stateOptions, search.state) || '-'}
          </p>
        </Popup>
      </FeatureGroup>;
    })}
  </>;
};

export default (flowRight(withRouter, withAreaSearchAttributes)(AreaSearchLayer) as React.ComponentType<OwnProps>);