// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {getLabelOfOption} from '$util/helpers';
import {summaryHitasOptions,
  summaryLeaseStatisticalUseOptions,
  summaryLessorOptions,
  summaryNoticePeriodOptions,
  summaryRegulatoryOptions,
  summaryRegulatoryMethodOptions,
  summarySpecialApartmentsOptions,
  summaryTransferRightOptions} from '../constants';
import {financialMethodOptions, managementMethodOptions, purposeOptions} from '../../../../constants';
import GreenBox from '$components/content/GreenBox';

type Props = {
  summary: Object,
}

const Summary = ({summary}: Props) => {
  return (
    <GreenBox>
      <Row>
        <Column>
          <label>Vuokranantaja</label>
          <p>{summary.lessor ? getLabelOfOption(summaryLessorOptions, summary.lessor) : ''}</p>
        </Column>
      </Row>

      <Row>
        <Column medium={4}>
          <label>Vuokrauksen käyttötarkoitus</label>
          <p>{summary.lease_use ? getLabelOfOption(purposeOptions, summary.lease_use) : '-'}</p>
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
          <p>{summary.financing_method ? getLabelOfOption(financialMethodOptions, summary.financing_method) : '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Hallintamuoto</label>
          <p>{summary.management_method ? getLabelOfOption(managementMethodOptions, summary.management_method) : '-'}</p>
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
          <p className='no-margin'>{summary.notice_period ? getLabelOfOption(summaryNoticePeriodOptions, summary.notice_period) : '-'}</p>
        </Column>
        <Column medium={8}>
          <label>Irtisanomisajan selite</label>
          <p className='no-margin'>{summary.notice_period_description ? summary.notice_period_description : '-'}</p>
        </Column>
      </Row>
    </GreenBox>
  );
};

export default Summary;
