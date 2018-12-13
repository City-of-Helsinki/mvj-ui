// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import GreenBox from '$components/content/GreenBox';
import LeaseItem from './LeaseItem';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubTitle from '$components/content/SubTitle';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getAttributes, getIsFetching} from '$src/infillDevelopment/selectors';

import type {Attributes} from '$src/types';
import type {InfillDevelopment} from '$src/infillDevelopment/types';

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
      <div>
        <h2>Perustiedot</h2>
        <Divider />

        <GreenBox>
          <LoaderWrapper><Loader isLoading={isFetching} /></LoaderWrapper>
        </GreenBox>
      </div>
    );
  }
  return (
    <div>
      <h2>Perustiedot</h2>
      <Divider />

      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Hankkeen nimi'
              text={infillDevelopment.name || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaavan nro.'
              text={infillDevelopment.detailed_plan_identifier || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Diaarinumero'
              text={infillDevelopment.reference_number
                ? <ExternalLink
                  href={getReferenceNumberLink(infillDevelopment.reference_number)}
                  text={infillDevelopment.reference_number}
                />
                : '-'
              }
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Neuvotteluvaihe'
              text={getLabelOfOption(stateOptions, infillDevelopment.state) || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Vastuuhenkilö'
              text={getUserFullName(infillDevelopment.user) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Vuokrasopimuksen muutos pvm'
              text={formatDate(infillDevelopment.lease_contract_change_date) || '-'}
            />
          </Column>
          <Column small={12} medium={4} large={8}>
            <FormTitleAndText
              title='Huomautus'
              text={infillDevelopment.note || '-'}
            />
          </Column>
        </Row>
        <SubTitle>Vuokraukset</SubTitle>
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
      </GreenBox>
    </div>
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
