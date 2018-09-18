// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import DecisionConditions from './DecisionConditions';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
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
          <FormTitleAndText
            title='Päättäjä'
            text={getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöspvm'
            text={formatDate(decision.decision_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Pykälä'
            text={decision.section ? `${decision.section} §` : '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöksen tyyppi'
            text={getLabelOfOption(typeOptions, decision.type) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Diaarinumero'
            text={decision.reference_number
              ? <ExternalLink
                href={getReferenceNumberLink(decision.reference_number)}
                text={decision.reference_number}
              />
              : '-'
            }
          />
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
