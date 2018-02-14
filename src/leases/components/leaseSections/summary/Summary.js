// @flow
import React from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

import {getLabelOfOption} from '../../../../util/helpers';
import {summaryFinancialMethodOptions,
  summaryHitasOptions,
  summaryLeaseStatisticalUseOptions,
  summaryLeaseUseOptions,
  summaryLessorOptions,
  summaryManagementMethodOptions,
  summaryNoticePeriodOptions,
  summaryRegulatoryOptions,
  summaryRegulatoryMethodOptions,
  summarySpecialApartmentsOptions,
  summaryTransferRightOptions} from '../constants';

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
              <p>{summary.lessor ? getLabelOfOption(summaryLessorOptions, summary.lessor) : ''}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Vuokrauksen käyttötarkoitus</label>
              <p>{summary.lease_use ? getLabelOfOption(summaryLeaseUseOptions, summary.lease_use) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Erityisasunnot</label>
              <p>{summary.special_apartments ? getLabelOfOption(summarySpecialApartmentsOptions, summary.special_apartments) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Tilastollinen pääkäyttötarkoitus</label>
              <p>{summary.lease_statistical_use ? getLabelOfOption(summaryLeaseStatisticalUseOptions, summary.lease_statistical_use) : '-'}</p>
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
              <p>{summary.financing_method ? getLabelOfOption(summaryFinancialMethodOptions, summary.financing_method) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Hallintamuoto</label>
              <p>{summary.management_method ? getLabelOfOption(summaryManagementMethodOptions, summary.management_method) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Siirto-oikeus</label>
              <p>{summary.transfer_right ? getLabelOfOption(summaryTransferRightOptions, summary.transfer_right) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Sääntely</label>
              <p>{summary.regulatory ? getLabelOfOption(summaryRegulatoryOptions, summary.regulatory) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Sääntelymuoto</label>
              <p>{summary.regulatory_method ? getLabelOfOption(summaryRegulatoryMethodOptions, summary.regulatory_method) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Hitas</label>
              <p>{summary.hitas ? getLabelOfOption(summaryHitasOptions, summary.hitas) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Irtisanomisaika</label>
              <p>{summary.notice_period ? getLabelOfOption(summaryNoticePeriodOptions, summary.notice_period) : '-'}</p>
            </Column>
            <Column medium={8}>
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
