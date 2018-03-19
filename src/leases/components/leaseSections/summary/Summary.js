// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import GreenBox from '$components/content/GreenBox';

type Props = {
  attributes: Object,
  summary: Object,
}

const Summary = ({attributes, summary}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes, 'intended_use');
  const supportiveHousingOptions = getAttributeFieldOptions(attributes, 'supportive_housing');
  const statisticalUseOptions = getAttributeFieldOptions(attributes, 'statistical_use');
  const financingOptions = getAttributeFieldOptions(attributes, 'financing');
  const managementOptions = getAttributeFieldOptions(attributes, 'management');
  const regulationOptions = getAttributeFieldOptions(attributes, 'regulation');
  const hitasOptions = getAttributeFieldOptions(attributes, 'hitas');
  const noticePeriodOptions = getAttributeFieldOptions(attributes, 'notice_period');

  return (
    <GreenBox>
      <Row>
        <Column>
          <label>Vuokranantaja</label>
          <p>{getLabelOfOption([], summary.lessor) || '-'}</p>
        </Column>
      </Row>

      <Row>
        <Column medium={4}>
          <label>Vuokrauksen käyttötarkoitus</label>
          <p>{getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Erityisasunnot</label>
          <p>{getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Tilastollinen pääkäyttötarkoitus</label>
          <p>{getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}</p>
        </Column>
      </Row>

      <Row>
        <Column>
          <label>Vuokrauksen käyttötarkoitus selite</label>
          <p>{summary.intended_use_note || '-'}</p>
        </Column>
      </Row>

      <Row>
        <Column medium={4}>
          <label>Rahoitusmuoto</label>
          <p>{getLabelOfOption(financingOptions, summary.financing) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Hallintamuoto</label>
          <p>{getLabelOfOption(managementOptions, summary.management) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Siirto-oikeus</label>
          <p>{summary.transferable ? 'Kyllä' : 'Ei'}</p>
        </Column>
      </Row>

      <Row>
        <Column medium={4}>
          <label>Sääntely</label>
          <p>{summary.regulated ? 'Kyllä' : 'Ei'}</p>
        </Column>
        <Column medium={4}>
          <label>Sääntelymuoto</label>
          <p>{getLabelOfOption(regulationOptions, summary.regulation) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Hitas</label>
          <p>{getLabelOfOption(hitasOptions, summary.hitas) || '-'}</p>
        </Column>
      </Row>

      <Row>
        <Column medium={4}>
          <label>Irtisanomisaika</label>
          <p className='no-margin'>{getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}</p>
        </Column>
        <Column medium={8}>
          <label>Irtisanomisajan selite</label>
          <p className='no-margin'>{summary.notice_note || '-'}</p>
        </Column>
      </Row>
    </GreenBox>
  );
};

export default Summary;
