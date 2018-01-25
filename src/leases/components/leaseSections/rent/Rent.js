// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContractRent from './ContractRent';
import Discounts from './Discounts';
import RentCriteria from './RentCriteria';
import RentCharged from './RentCharged';
import RentIndexAdjusted from './RentIndexAdjusted';
import RentBasicInfo from './RentBasicInfo';

type Props = {
  rents: Object,
}

const Rent = ({rents}: Props) => {
  return (
    <div className="lease-section rent-section">
      <Row><Column><h1>Vuokra</h1></Column></Row>
      <Row><Column><div className="separator-line no-margin"></div></Column></Row>
      <Row><Column><h2>Vuokranperusteet</h2></Column></Row>
      <Row><Column><RentCriteria
        criterias={get(rents, 'criterias', {})}
      /> </Column></Row>
      <Row><Column><h2>Alennukset ja korotukset</h2></Column></Row>
      <Row><Column><Discounts discounts={get(rents, 'discounts', [])}/></Column></Row>
      <Row><Column><h2>Vuokran perustiedot</h2></Column></Row>
      <Row>
        <Column>
          <RentBasicInfo />
        </Column>
      </Row>
      <Row><Column><h2>Sopimusvuokra</h2></Column></Row>
      <Row><Column><ContractRent contractRents={get(rents, 'contract_rents', [])} /></Column></Row>
      <Row>
        <Column medium={6}>
          <h2>Indeksitarkistettu vuokra</h2>
          <RentIndexAdjusted indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}/>
        </Column>
        <Column medium={6}>
          <h2>Perittävä vuokra</h2>
          <RentCharged chargedRents={get(rents, 'charged_rents', [])} />
        </Column>
      </Row>
    </div>
  );
};

export default Rent;
