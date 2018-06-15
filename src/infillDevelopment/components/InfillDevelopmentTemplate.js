// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import LeaseItem from './LeaseItem';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getAttributes} from '$src/infillDevelopment/selectors';

import type {Attributes, InfillDevelopment} from '../types';

type Props = {
  attributes: Attributes,
  infillDevelopment: InfillDevelopment,
}

const InfillDevelopmentTemplate = ({attributes, infillDevelopment}: Props) => {
  const leases = get(infillDevelopment, 'leases', []);
  const stateOptions = getAttributeFieldOptions(attributes, 'state');
  const decisionTypeOptions = getAttributeFieldOptions(attributes, 'decision_type');
  const nagotiationStateOptions = getAttributeFieldOptions(attributes, 'nagotiation_state');

  return (
    <GreenBox>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Hankkeen nimi</FormFieldLabel>
          <p>{infillDevelopment.project_name || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Asemakaavan nro</FormFieldLabel>
          <p>{infillDevelopment.plan_number || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Asemakaavan diaarinumero</FormFieldLabel>
          <p>{infillDevelopment.plan_reference_number || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Käsittelyvaihe</FormFieldLabel>
          <p>{getLabelOfOption(stateOptions, infillDevelopment.state) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Käsittelyvaiheen päätöslaji</FormFieldLabel>
          <p>{getLabelOfOption(decisionTypeOptions, infillDevelopment.decision_type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Kaavan vaihe pvm</FormFieldLabel>
          <p>{formatDate(infillDevelopment.state_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vastuuhenkilö</FormFieldLabel>
          <p>{getUserFullName(infillDevelopment.responsible_person) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Neuvotteluvaihe</FormFieldLabel>
          <p>{getLabelOfOption(nagotiationStateOptions, infillDevelopment.nagotiation_state) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokrasopimuksen muutos pvm</FormFieldLabel>
          <p>{formatDate(infillDevelopment.change_of_lease_date) || '-'}</p>
        </Column>
        <Column small={12} medium={12} large={6}>
          <FormFieldLabel>Huomautus</FormFieldLabel>
          <p>{infillDevelopment.note || '-'}</p>
        </Column>
      </Row>
      {!!leases.length &&
        leases.map((lease) =>
          <LeaseItem
            key={lease.id}
            id={lease.id}
            leaseData={lease}
          />
        )
      }
    </GreenBox>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(InfillDevelopmentTemplate);
