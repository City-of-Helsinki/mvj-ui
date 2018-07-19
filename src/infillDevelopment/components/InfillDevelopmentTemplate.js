// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import LeaseItem from './LeaseItem';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/SubTitle';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getAttributes, getIsFetching} from '$src/infillDevelopment/selectors';

import type {Attributes, InfillDevelopment} from '../types';

type Props = {
  attributes: Attributes,
  infillDevelopment: InfillDevelopment,
  isFetching: boolean,
}

const InfillDevelopmentTemplate = ({attributes, infillDevelopment, isFetching}: Props) => {
  const leases = get(infillDevelopment, 'infill_development_compensation_leases', []);
  const stateOptions = getAttributeFieldOptions(attributes, 'state');
  if(isFetching) {
    return (
      <GreenBox>
        <LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper>
      </GreenBox>
    );
  }
  return (
    <GreenBox>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Hankkeen nimi</FormFieldLabel>
          <p>{infillDevelopment.name || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Asemakaavan nro.</FormFieldLabel>
          <p>{infillDevelopment.detailed_plan_identifier || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Diaarinumero</FormFieldLabel>
          {infillDevelopment.reference_number
            ? <p className='no-margin'>
              <a
                className='no-margin'
                target='_blank'
                href={getReferenceNumberLink(infillDevelopment.reference_number)}
              >
                {infillDevelopment.reference_number}
              </a>
            </p>
            : <p className='no-margin'>-</p>
          }
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Neuvotteluvaihe</FormFieldLabel>
          <p>{getLabelOfOption(stateOptions, infillDevelopment.state) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vastuuhenkilö</FormFieldLabel>
          <p>{getUserFullName(infillDevelopment.user) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokrasopimuksen muutos pvm</FormFieldLabel>
          <p>{formatDate(infillDevelopment.lease_contract_change_date) || '-'}</p>
        </Column>
        <Column small={12} medium={4} large={8}>
          <FormFieldLabel>Huomautus</FormFieldLabel>
          <p>{infillDevelopment.note || '-'}</p>
        </Column>
      </Row>
      <SubTitle>Vuokraukset</SubTitle>
      {!leases.length && <p>Ei vuokrauksia</p>}
      {!!leases.length &&
        <div style={{marginBottom: 10}}>
          {leases.map((lease) =>
            <LeaseItem
              key={lease.id}
              id={get(lease, 'lease.value')}
              leaseData={lease}
            />
          )}
        </div>
      }
    </GreenBox>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      isFetching: getIsFetching(state),
    };
  }
)(InfillDevelopmentTemplate);
