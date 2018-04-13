// @flow
import React from 'react';
import {Column} from 'react-foundation';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import DecisionItem from './DecisionItem';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisions: Array<Object>,
}

const Decisions = ({attributes, decisions}: Props) => {
  const decisionMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker');
  const typeOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.type');
  return (
    <div>
      {!decisions || !decisions.length && <p className='no-margin'>Ei päätöksiä</p>}
      {decisions && !!decisions.length && decisions.map((decision) =>
        <Collapse
          key={decision.id}
          defaultOpen={false}
          header={
            <div>
              <Column>
                <span className='collapse__header-subtitle'>
                  {formatDate(decision.decision_date) || '-'}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {decision.section ? `${decision.section} §` : '-'}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {getLabelOfOption(typeOptions, decision.type) || '-'}
                </span>
              </Column>
            </div>
          }
          headerTitle={
            <h3 className='collapse__header-title'>
              {getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}
            </h3>
          }
        >
          <DecisionItem
            attributes={attributes}
            decision={decision}
          />
        </Collapse>
      )}
    </div>
  );
};

export default Decisions;
