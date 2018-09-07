// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  conditions: Array<Object>,
  decisionId: number,
  receiveCollapseStates: Function,
}

const DecisionConditions = ({
  attributes,
  collapseState,
  conditions,
  decisionId,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            conditions: val,
          },
        },
      },
    });
  };

  const typeOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.conditions.child.children.type');

  return (
    <Collapse
      className='collapse__secondary'
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
      onToggle={handleCollapseToggle}
    >
      <BoxItemContainer>
        {!conditions.length && <p>Ei ehtoja</p>}
        {!!conditions.length && conditions.map((condition, index) => {
          return (
            <BoxItem key={index} className='no-border-on-last-child'>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Käyttötarkoitusehto</FormFieldLabel>
                  <p>{getLabelOfOption(typeOptions, condition.type) || '–'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Valvontapvm</FormFieldLabel>
                  {condition.supervision_date
                    ? <p className={classNames({'alert': condition.supervision_date && !condition.supervised_date})}><i/>{formatDate(condition.supervision_date)}</p>
                    : <p>–</p>
                  }
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Valvottu pvm</FormFieldLabel>
                  {condition.supervised_date
                    ? <p className={classNames({'success': condition.supervised_date})}><i/>{formatDate(condition.supervised_date)}</p>
                    : <p>–</p>
                  }
                </Column>
                <Column small={12} medium={12} large={6}>
                  <FormFieldLabel>Huomautus</FormFieldLabel>
                  <p>{condition.description || '–'}</p>
                </Column>
              </Row>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const decisionId = props.decisionId;

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${decisionId}.conditions`),
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionConditions);
