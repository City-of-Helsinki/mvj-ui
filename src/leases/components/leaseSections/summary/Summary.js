// @flow
import React from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

type Props = {
  summary: Object,
}

const Summary = ({summary}: Props) => {
  return (
    <div className="lease-section">
      <div className={classNames('green-box', 'no-margin')}>
        <div className="section-item">
          <Row>
            <Column>
              <label>Vuokranantaja</label>
              <p>{summary.lessor ? summary.lessor : ''}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Vuokrauksen käyttötarkoitus</label>
              <p>{summary.lease_use ? summary.lease_use : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Erityisasunnot</label>
              <p>{summary.special_apartments ? summary.special_apartments : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Tilastollinen pääkäyttötarkoitus</label>
              <p>{summary.lease_statistical_use ? summary.lease_statistical_use : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column>
              <label>Vuokrauksen käyttötarkoitus selite</label>
              <p>{summary.lease_use_description ? summary.lease_use_description : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Rahoitusmuoto</label>
              <p>{summary.financing_method ? summary.financing_method : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Hallintamuoto</label>
              <p>{summary.management_method ? summary.management_method : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Siirto-oikeus</label>
              <p>{summary.transfer_right ? summary.transfer_right : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Sääntely</label>
              <p>{summary.regulatory ? summary.regulatory : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Sääntelymuoto</label>
              <p>{summary.regulatory_method ? summary.regulatory_method : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Hitas</label>
              <p>{summary.hitas ? summary.hitas : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Irtisanomisaika</label>
              <p>{summary.notice_period ? summary.notice_period : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Irtisanomisajan selite</label>
              <p>{summary.notice_period_description ? summary.notice_period_description : '-'}</p>
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Summary;
