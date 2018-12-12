// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

type Props = {
  conditionTypeOptions: Array<Object>,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionMakerOptions: Array<Object>,
  decision: Object,
  largeScreen: boolean,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const DecisionItem = ({
  conditionTypeOptions,
  conditionsCollapseState,
  decisionCollapseState,
  decisionMakerOptions,
  decision,
  largeScreen,
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
      headerTitle={<CollapseHeaderTitle>
        {getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}
        {decision.decision_date ? <span>&nbsp;&nbsp;{formatDate(decision.decision_date)}</span> : ''}
        {decision.section ? <span>&nbsp;&nbsp;{decision.section}§</span> : ''}
        {decision.type ? <span>&nbsp;&nbsp;{getLabelOfOption(typeOptions, decision.type)}</span> : ''}
      </CollapseHeaderTitle>}
      onToggle={handleDecisionCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päättäjä'
            text={getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöspvm'
            text={formatDate(decision.decision_date) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={1}>
          <FormTitleAndText
            title='Pykälä'
            text={decision.section ? `${decision.section} §` : '–'}
          />
        </Column>
        <Column small={6} medium={8} large={3}>
          <FormTitleAndText
            title='Päätöksen tyyppi'
            text={getLabelOfOption(typeOptions, decision.type) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle title='Diaarinumero' />
          {decision.reference_number
            ? <ExternalLink
              href={getReferenceNumberLink(decision.reference_number)}
              text={decision.reference_number}
            />
            : <FormText>-</FormText>
          }
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <FormTitleAndText
            title='Huomautus'
            text={decision.description || '–'}
          />
        </Column>
      </Row>

      <Collapse
        className='collapse__secondary'
        defaultOpen={conditionsCollapseState !== undefined ? conditionsCollapseState : true}
        headerTitle={<CollapseHeaderTitle>Ehdot</CollapseHeaderTitle>}
        onToggle={handleConditionsCollapseToggle}
      >
        {!decision.conditions || !decision.conditions.length &&
          <FormText>Ei ehtoja</FormText>
        }
        {decision.conditions && !!decision.conditions.length &&
          <BoxItemContainer>
            {largeScreen &&
              <Row>
                <Column large={2}>
                  <FormTextTitle title='Ehtotyyppi' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvontapvm' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvottu pvm' />
                </Column>
                <Column large={6}>
                  <FormTextTitle title='Huomautus' />
                </Column>
              </Row>
            }
            {decision.conditions.map((condition, index) => {
              if(largeScreen) {
                return(
                  <Row key={index}>
                    <Column large={2}>
                      <FormText>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</FormText>
                    </Column>
                    <Column large={2}>
                      <FormText className={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}>
                        {condition.supervision_date
                          ? <span><i/>{formatDate(condition.supervision_date)}</span>
                          : '–'
                        }
                      </FormText>
                    </Column>
                    <Column large={2}>
                      <FormText className={condition.supervised_date ? 'success' : ''}>
                        {condition.supervised_date
                          ? <span><i/>{formatDate(condition.supervised_date)}</span>
                          : '–'
                        }
                      </FormText>
                    </Column>
                    <Column large={6}>
                      <FormText>{condition.description || '–'}</FormText>
                    </Column>
                  </Row>
                );
              } else {
                return(
                  <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                    <Row>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Ehtotyyppi'
                          text={getLabelOfOption(conditionTypeOptions, condition.type) || '–'}
                        />
                      </Column>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Valvontapvm'
                          text={condition.supervision_date
                            ? <span><i/>{formatDate(condition.supervision_date)}</span>
                            : '–'
                          }
                          textClassName={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}
                        />
                      </Column>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Valvottu pvm'
                          text={condition.supervised_date
                            ? <span><i/>{formatDate(condition.supervised_date)}</span>
                            : '–'
                          }
                          textClassName={condition.supervised_date ? 'success' : ''}
                        />
                      </Column>
                      <Column small={12} medium={12}>
                        <FormTitleAndText
                          title='Huomautus'
                          text={condition.description || '–'}
                        />
                      </Column>
                    </Row>
                  </BoxItem>
                );
              }
            })}
          </BoxItemContainer>
        }
      </Collapse>
    </Collapse>
  );
};

export default flowRight(
  withWindowResize,
  connect(
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
  )
)(DecisionItem);
