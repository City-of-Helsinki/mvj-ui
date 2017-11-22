// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {capitalize} from 'lodash';

type Props = {
  item: Object,
}


const PropertyUnitPlotItem = (props: Props) => {
  const {item} = props;

  return (
    <div className='property-unit-premise__plot'>
      <Row>
        <Column medium={12}>
          <svg className='property-unit-premise__map-icon' viewBox="0 0 30 30">
            <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
          </svg>
          <p className='property-unit-premise__subtitle'>{`${capitalize(item.explanation)} ${item.municipality}-${item.district}-${item.sequence}`}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <p className='property-unit-premise__label'>Osoite</p>
          <p className='property-unit-premise__text'>{`${capitalize(item.address)}, ${item.zip_code} ${item.town}`}</p>
          <p className='property-unit-premise__label'>Rekisteröintipäivä</p>
          <p className='property-unit-premise__text'>{item.registration_date}</p>
        </Column>
        <Column medium={4}>
          <p className='property-unit-premise__label'>Kokonaisala</p>
          <p className='property-unit-premise__text'>{item.full_area}</p>
          <p className='property-unit-premise__label'>Leikkausala</p>
          <p className='property-unit-premise__text'>{item.intersection_area}</p>
        </Column>
        <Column medium={4}>
          <p className='property-unit-premise__label'>KTJ-dokumentit</p>
          <p className='property-unit-premise__text-ktj'>Lainhuutotodistus</p>
          <p className='property-unit-premise__text-ktj'>Kiinteistörekisteriote</p>
          <p className='property-unit-premise__text-ktj'>Rasitustodistus</p>
        </Column>
      </Row>
    </div>
  );
};

export default PropertyUnitPlotItem;
