// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getContentLeaseInfo, getContentLeaseStatus} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const LeaseInfo = ({attributes, currentLease}: Props) => {
  const leaseInfo = getContentLeaseInfo(currentLease);
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
        <Column>
          <label className='mvj-form-field-label'>Olotila</label>
          <p>{getContentLeaseStatus(leaseInfo) || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  }
)(LeaseInfo);
