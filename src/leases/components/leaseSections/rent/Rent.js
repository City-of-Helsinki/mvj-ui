// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import RentBasicInfo from './RentBasicInfo';

const Rent = () => {
  return (
    <div className="lease-section">
      <Row><Column><h1>Vuokra</h1></Column></Row>
      <Row><Column><div className="separator-line no-margin"></div></Column></Row>
      <Row><Column><h2>Vuokranperusteet</h2></Column></Row>
      <Row><Column><h2>Alennukset ja korotukset</h2></Column></Row>
      <Row><Column><h2>Vuokran perustiedot</h2></Column></Row>
      <Row>
        <Column>
          <RentBasicInfo />
        </Column>
      </Row>
      <Row><Column><h2>Sopimusvuokra</h2></Column></Row>
      <Row>
        <Column medium={6}>
          <h2>Indeksitarkistettu vuokra</h2>
        </Column>
        <Column medium={6}>
          <h2>Perittävä vuokra</h2>
        </Column>
      </Row>
    </div>
  );
};

export default Rent;
