// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

type Props = {
  attributes: Object,
  leaseInfo: Object,
}

const LeaseInfo = ({attributes, leaseInfo}: Props) => {
  if(!LeaseInfo) {
    return null;
  }
  const stateOptions = getAttributeFieldOptions(attributes, 'state');

  return (
    <div className='lease-info'>
      <Row>
        <Column>
          <label className='mvj-form-field-label'>Vuokratunnus</label>
          <h1 className='lease-info-edit__number'>{leaseInfo.identifier || '-'}</h1>
        </Column>
        <Column>
          <label className='mvj-form-field-label'>Tyyppi</label>
          <p>{getLabelOfOption(stateOptions, leaseInfo.state) || '-'}</p>
        </Column>
        <Column>
          <label className='mvj-form-field-label'>Alkupäivämäärä</label>
          <p>{formatDate(leaseInfo.start_date) || '-'}</p>
        </Column>
        <Column>
          <label className='mvj-form-field-label'>Loppupäivämäärä</label>
          <p>{formatDate(leaseInfo.end_date) || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default LeaseInfo;
