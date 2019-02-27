// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import LeaseItem from './LeaseItem';
import SubTitle from '$components/content/SubTitle';
import {
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationFieldTitles,
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
} from '$src/infillDevelopment/enums';
import {getUiDataInfillDevelopmentKey} from '$src/uiData/helpers';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  getAttributes as getInfillDevelopmentAttributes,
} from '$src/infillDevelopment/selectors';

import type {Attributes} from '$src/types';
import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  infillDevelopment: InfillDevelopment,
  infillDevelopmentAttributes: Attributes,
  isFetching: boolean,
}

const InfillDevelopmentTemplate = ({
  infillDevelopment,
  infillDevelopmentAttributes,
}: Props) => {
  const leases = get(infillDevelopment, 'infill_development_compensation_leases', []);
  const stateOptions = getFieldOptions(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.STATE);

  return (
    <Fragment>
      <h2>Perustiedot</h2>
      <Divider />

      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.NAME)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.NAME)}>
                {InfillDevelopmentCompensationFieldTitles.NAME}
              </FormTextTitle>
              <FormText>{infillDevelopment.name || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
                {InfillDevelopmentCompensationFieldTitles.DETAILED_PLAN_IDENTIFIER}
              </FormTextTitle>
              <FormText>{infillDevelopment.detailed_plan_identifier || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER)}>
                {InfillDevelopmentCompensationFieldTitles.REFERENCE_NUMBER}
              </FormTextTitle>
              <FormText>{infillDevelopment.reference_number
                ? <ExternalLink
                  href={getReferenceNumberLink(infillDevelopment.reference_number)}
                  text={infillDevelopment.reference_number}
                  className='no-margin'
                />
                : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.STATE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.STATE)}>
                {InfillDevelopmentCompensationFieldTitles.STATE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stateOptions, infillDevelopment.state) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.USER)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.USER)}>
                {InfillDevelopmentCompensationFieldTitles.USER}
              </FormTextTitle>
              <FormText>{getUserFullName(infillDevelopment.user) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE)}>
                {InfillDevelopmentCompensationFieldTitles.LEASE_CONTRACT_CHANGE_DATE}
              </FormTextTitle>
              <FormText>{formatDate(infillDevelopment.lease_contract_change_date) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationFieldPaths.NOTE)}>
              <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.NOTE)}>
                {InfillDevelopmentCompensationFieldTitles.NOTE}
              </FormTextTitle>
              <FormText>{infillDevelopment.note || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES)}>
          <SubTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES)}>
            {InfillDevelopmentCompensationLeasesFieldTitles.INFILL_DEVELOPMENT_COMPENSATION_LEASES}
          </SubTitle>

          {!leases.length && <FormText>Ei vuokrauksia</FormText>}
          {!!leases.length &&
            <div style={{marginBottom: 10}}>
              {leases.map((lease) =>
                <LeaseItem
                  id={lease.id}
                  key={lease.id}
                  leaseData={lease}
                  leaseId={get(lease, 'lease.value')}
                />
              )}
            </div>
          }
        </Authorization>
      </GreenBox>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
    };
  }
)(InfillDevelopmentTemplate);
