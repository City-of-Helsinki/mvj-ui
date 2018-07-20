// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import DecisionConditions from './DecisionConditions';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {getContentDecisions} from '$src/landUseContract/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
}

const Decisions = ({attributes, currentLandUseContract}: Props) => {
  const decisions = getContentDecisions(currentLandUseContract),
    decisionMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker'),
    typeOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.type');

  return (
    <div>
      {!!decisions.length && decisions.map((decision, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</h3>
            }
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päättäjä</FormFieldLabel>
                <p>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</p>
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
                <p>{getLabelOfOption(typeOptions, decision.type) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Diaarinumero</FormFieldLabel>
                {decision.reference_number
                  ? <a target='_blank' href={getReferenceNumberLink(decision.reference_number)}>{decision.reference_number}</a>
                  : <p>-</p>
                }
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
