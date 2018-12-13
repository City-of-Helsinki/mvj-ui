// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormTextTitle from '$components/form/FormTextTitle';
import {getContentLeaseInfo, getContentLeaseStatus} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

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
          <FormTextTitle title='Vuokratunnus' />
          <h1 className='lease-info__identifier'>{leaseInfo.identifier || '-'}</h1>
        </Column>
        <Column>
          <FormTextTitle title='Tyyppi' />
          <p className='lease-info__text'>{getLabelOfOption(stateOptions, leaseInfo.state) || '-'}</p>
        </Column>
        <Column>
          <FormTextTitle title='Alkupvm' />
          <p className='lease-info__text'>{formatDate(leaseInfo.start_date) || '-'}</p>
        </Column>
        <Column>
          <FormTextTitle title='Loppupvm' />
          <p className='lease-info__text'>{formatDate(leaseInfo.end_date) || '-'}</p>
        </Column>
        <Column>
          <FormTextTitle title='Olotila' />
          <p className='lease-info__text'>{getContentLeaseStatus(currentLease) || '-'}</p>
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
