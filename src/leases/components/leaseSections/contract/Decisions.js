// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import DecisionItem from './DecisionItem';
import {getContentDecisions} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const Decisions = ({attributes, currentLease}: Props) => {
  const decisions = getContentDecisions(currentLease);
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
            decision={decision}
          />
        </Collapse>
      )}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(Decisions);
