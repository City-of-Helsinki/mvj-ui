// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';

type Props = {
  conditionTypeOptions: Array<Object>,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionMakerOptions: Array<Object>,
  decision: Object,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const DecisionItem = ({
  conditionTypeOptions,
  conditionsCollapseState,
  decisionCollapseState,
  decisionMakerOptions,
  decision,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleDecisionCollapseToggle = (val: boolean) => {
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

  const handleConditionsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decision.id]: {
            conditions: val,
          },
        },
      },
    });
  };

  return (
    <Collapse
      key={decision.id}
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : false}
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
      onToggle={handleDecisionCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Päättäjä</FormFieldLabel>
          <p>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Päätöspvm</FormFieldLabel>
          <p>{formatDate(decision.decision_date) || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Pykälä</FormFieldLabel>
          <p>{decision.section ? `${decision.section} §` : '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Päätöksen tyyppi</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, decision.type) || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Diaarinumero</FormFieldLabel>
          {decision.reference_number
            ? <a target='_blank' href={getReferenceNumberLink(decision.reference_number)}>{decision.reference_number}</a>
            : <p>-</p>
          }
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <FormFieldLabel>Huomautus</FormFieldLabel>
          <p>{decision.description || '–'}</p>
        </Column>
      </Row>

      <Collapse
        className='collapse__secondary'
        defaultOpen={conditionsCollapseState !== undefined ? conditionsCollapseState : true}
        headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
        onToggle={handleConditionsCollapseToggle}
      > {!decision.conditions || !decision.conditions.length && <p>Ei ehtoja</p>}
        {decision.conditions && !!decision.conditions.length &&
          <BoxItemContainer>
            {decision.conditions.map((condition) =>
              <BoxItem key={condition.id} className='no-border-on-first-child'>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Käyttötarkoitusehto</FormFieldLabel>
                    <p>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</p>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Valvontapvm</FormFieldLabel>
                    {condition.supervision_date
                      ? (
                        <p className={classNames({'alert': condition.supervision_date && !condition.supervised_date})}>
                          <i/>{formatDate(condition.supervision_date)}
                        </p>
                      ) : <p>–</p>
                    }
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Valvottu pvm</FormFieldLabel>
                    {condition.supervised_date
                      ? (
                        <p className={classNames({'success': condition.supervised_date})}>
                          <i/>{formatDate(condition.supervised_date)}
                        </p>
                      ) : <p>–</p>
                    }
                  </Column>
                  <Column small={12} medium={12} large={6}>
                    <FormFieldLabel>Huomautus</FormFieldLabel>
                    <p>{condition.description || '–'}</p>
                  </Column>
                </Row>
              </BoxItem>
            )}
          </BoxItemContainer>
        }
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.decision.id;
    return {
      conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.conditions`),
      decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.decision`),
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionItem);
