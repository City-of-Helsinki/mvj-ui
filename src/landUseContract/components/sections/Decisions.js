// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import DecisionConditions from './DecisionConditions';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {getContentLandUseContractDecisions} from '$src/landUseContract/helpers';
import {formatDate} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
}

const Decisions = ({attributes, currentLandUseContract}: Props) => {
  const decisions = getContentLandUseContractDecisions(currentLandUseContract);
  return (
    <div>
      {!!decisions.length && decisions.map((decision, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>{decision.decision_maker || '-'}</h3>
            }
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päättäjä</FormFieldLabel>
                <p>{decision.decision_maker || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päätöspvm</FormFieldLabel>
                <p>{formatDate(decision.decision_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Pykälä</FormFieldLabel>
                <p>{decision.section ? `${decision.section} §` : '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päätöksen tyyppi</FormFieldLabel>
                <p>{decision.type || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Diaarinumero</FormFieldLabel>
                <p>{decision.reference_number || '-'}</p>
              </Column>
            </Row>

            <DecisionConditions
              attributes={attributes}
              conditions={decision.conditions}
            />
          </Collapse>
        );
      })}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Decisions);
