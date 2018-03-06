// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

import {formatDate} from '$util/helpers';
import GreenBoxItem from '$components/content/GreenBoxItem';
import MapLink from '$components/content/MapLink';

type Props = {
  item: Object,
}

const PropertyUnitPlotItem = (props: Props) => {
  const {item} = props;

  const getIdentifier = () => {
    if(item.explanation === 'määräala') {
      return `${capitalize(get(item, 'explanation', ''))} ${get(item, 'municipality', '')}-${get(item, 'district', '')}-${get(item, 'group_number', '')}-${get(item, 'unit_number', '')}-M${get(item, 'unseparate_parcel_number', '')}`;
    }
    return `${capitalize(get(item, 'explanation', ''))} ${get(item, 'municipality', '')}-${get(item, 'district', '')}-${get(item, 'group_number', '')}-${get(item, 'unit_number', '')}`;
  };

  return (
    <GreenBoxItem>
      <Row>
        <Column medium={12}>
          <MapLink
            label={getIdentifier()}
            onClick={() => console.log('Open map')}
            title={getIdentifier()}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={6}>
          <label>Osoite</label>
          <p>{`${capitalize(item.address)}, ${item.zip_code} ${item.town}`}</p>

          <label>Rekisteröintipäivä</label>
          <p>{formatDate(item.registration_date) || '-'}</p>

          <label>KTJ-dokumentit</label>
          <p className='no-margin'>Lainhuutotodistus</p>
          <p className='no-margin'>Kiinteistörekisteriote</p>
          <p className='no-margin'>Rasitustodistus</p>
        </Column>
        <Column medium={6}>
          <label>Kokonaisala</label>
          <p>{item.full_area} m<sup>2</sup></p>

          <label>Leikkausala</label>
          <p>{item.intersection_area} m<sup>2</sup></p>

          <label>Kumoamispäivä</label>
          <p className='no-margin'>{formatDate(item.abolishment_date) || '-'}</p>

        </Column>
      </Row>
    </GreenBoxItem>
  );
};

export default PropertyUnitPlotItem;
