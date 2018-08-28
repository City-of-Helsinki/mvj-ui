// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import DecisionConditions from './DecisionConditions';
import ExternalLink from '$components/links/ExternalLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import type {Attributes} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  decision: Object,
  receiveCollapseStates: Function,
}

const DecisionItem = ({
  attributes,
  collapseState,
  decision,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decision.id]: {
            decision: val,
          },
        },
      },
    });
  };

  const decisionMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker'),
    typeOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.type');

  return (
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</h3>}
      onToggle={handleCollapseToggle}
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
            ? <ExternalLink
              href={getReferenceNumberLink(decision.reference_number)}
              label={decision.reference_number}
            />
            : <p>-</p>
          }
        </Column>
      </Row>

      <DecisionConditions
        attributes={attributes}
        conditions={decision.conditions}
        decisionId={decision.id}
      />
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.decision.id;

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.decision`),
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionItem);
