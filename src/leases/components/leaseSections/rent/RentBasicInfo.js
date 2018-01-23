// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

const RentBasicInfo = () => {
  return (
    <div className={'green-box no-margin'}>
      <Row>
        <Column medium={10}>
          <Row>
            <Column medium={3}>
              <label>Vuokralaji</label>
            </Column>
            <Column medium={3}>
              <label>Vuokrakausi</label>
            </Column>
            <Column medium={6}>
              <label>Indeksin tunnusnumero (laskentalaji)</label>
            </Column>
          </Row>
          <Row>
            <Column medium={3}>
              <label>Perusindeksi/pyöristys</label>
            </Column>
            <Column medium={3}>
              <Row>
                <Column medium={6}>
                  <label>X-luku</label>
                </Column>
                <Column medium={6}>
                  <label>Y-luku</label>
                </Column>
              </Row>
            </Column>
            <Column medium={3}>
              <label>Y-alkaen</label>
            </Column>
            <Column medium={3}>
              <label>Tasaus pvm</label>
            </Column>
          </Row>
          <Row>
            <Column medium={3}>
              <label>Kiinteä alkuvuosivuokra</label>
            </Column>
            <Column medium={6}>
              <label>Alkuvuosivuokra-aika</label>
            </Column>
            <Column medium={3}>
              <label>Kommentti</label>
            </Column>
          </Row>
        </Column>
        <Column medium={2}>
          <label>Eräpäivät</label>
        </Column>
      </Row>
    </div>
  );
};

export default RentBasicInfo;
