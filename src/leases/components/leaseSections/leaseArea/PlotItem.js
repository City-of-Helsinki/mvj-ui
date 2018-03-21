// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import GreenBoxItem from '$components/content/GreenBoxItem';
import MapLink from '$components/content/MapLink';

type Props = {
  attributes: Object,
  plot: Object,
}

const PlotItem = ({attributes, plot}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');
  const getFullAddress = (item: Object) => {
    return `${capitalize(item.address)}, ${item.postal_code} ${item.city}`;
  };

  const getIdentifier = (item: Object) => {
    return `${getLabelOfOption(typeOptions, item.type)} ${item.identifier || '-'}`;

  };

  return (
    <GreenBoxItem>
      <Row>
        <Column medium={12}>
          <MapLink
            label={getIdentifier(plot)}
            onClick={() => console.log('Open map')}
            title={getIdentifier(plot)}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={6}>
          <label>Osoite</label>
          <p>{getFullAddress(plot)}</p>

          <label>Rekisteröintipäivä</label>
          <p>{formatDate(plot.registration_date) || '-'}</p>

          <label>KTJ-dokumentit</label>
          <p className='no-margin'>Lainhuutotodistus</p>
          <p className='no-margin'>Kiinteistörekisteriote</p>
          <p className='no-margin'>Rasitustodistus</p>
        </Column>
        <Column medium={6}>
          <label>Kokonaisala</label>
          <p>{plot.area} m<sup>2</sup></p>

          <label>Leikkausala</label>
          <p>{plot.section_area} m<sup>2</sup></p>

          <label>Kumoamispäivä</label>
          <p className='no-margin'>{formatDate(plot.abolishment_date) || '-'}</p>

        </Column>
      </Row>
    </GreenBoxItem>
  );
};

export default PlotItem;
