// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormTextTitle from '$components/form/FormTextTitle';
import {LeaseInfoFieldPaths, LeaseInfoFieldTitles} from '$src/leases/enums';
import {getContentLeaseInfo, getContentLeaseStatus} from '$src/leases/helpers';
import {formatDate, getFieldAttributes, getFieldOptions, getLabelOfOption, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const LeaseInfo = ({attributes, currentLease}: Props) => {
  const leaseInfo = getContentLeaseInfo(currentLease);
  const stateOptions = getFieldOptions(getFieldAttributes(attributes, LeaseInfoFieldPaths.STATE));

  if(!LeaseInfo) return null;

  return (
    <div className='lease-info'>
      <Row>
        <Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.IDENTIFIER)}>
            <FormTextTitle>{LeaseInfoFieldTitles.IDENTIFIER}</FormTextTitle>
            <h1 className='lease-info__identifier'>{leaseInfo.identifier || '-'}</h1>
          </Authorization>
        </Column>
        <Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.STATE)}>
            <FormTextTitle>{LeaseInfoFieldTitles.STATE}</FormTextTitle>
            <p className='lease-info__text'>{getLabelOfOption(stateOptions, leaseInfo.state) || '-'}</p>
          </Authorization>
        </Column>
        <Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.START_DATE)}>
            <FormTextTitle>{LeaseInfoFieldTitles.START_DATE}</FormTextTitle>
            <p className='lease-info__text'>{formatDate(leaseInfo.start_date) || '-'}</p>
          </Authorization>
        </Column>
        <Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseInfoFieldTitles.END_DATE}</FormTextTitle>
            <p className='lease-info__text'>{formatDate(leaseInfo.end_date) || '-'}</p>
          </Authorization>
        </Column>
        <Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.START_DATE) && isFieldAllowedToRead(attributes, LeaseInfoFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseInfoFieldTitles.STATUS}</FormTextTitle>
            <p className='lease-info__text'>{getContentLeaseStatus(currentLease) || '-'}</p>
          </Authorization>
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
