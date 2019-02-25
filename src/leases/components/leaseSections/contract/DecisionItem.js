// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseDecisionConditionsFieldPaths,
  LeaseDecisionConditionsFieldTitles,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
} from '$src/leases/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {formatDate, getLabelOfOption, getReferenceNumberLink, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
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
  attributes,
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
      headerTitle={<Fragment>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
          {getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
          {decision.decision_date ? <span>&nbsp;&nbsp;{formatDate(decision.decision_date)}</span> : ''}
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
          {decision.section ? <span>&nbsp;&nbsp;{decision.section}§</span> : ''}
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
          {decision.type ? <span>&nbsp;&nbsp;{getLabelOfOption(typeOptions, decision.type)}</span> : ''}
        </Authorization>
      </Fragment>}
      onToggle={handleDecisionCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISION_MAKER)}>
              {LeaseDecisionsFieldTitles.DECISION_MAKER}
            </FormTextTitle>
            <FormText>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISION_DATE)}>
              {LeaseDecisionsFieldTitles.DECISION_DATE}
            </FormTextTitle>
            <FormText>{formatDate(decision.decision_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={1}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.SECTION)}>
              {LeaseDecisionsFieldTitles.SECTION}
            </FormTextTitle>
            <FormText>{decision.section ? `${decision.section} §` : '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={8} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.TYPE)}>
              {LeaseDecisionsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, decision.type) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
              {LeaseDecisionsFieldTitles.REFERENCE_NUMBER}
            </FormTextTitle>
            {decision.reference_number
              ? <ExternalLink
                href={getReferenceNumberLink(decision.reference_number)}
                text={decision.reference_number}
              />
              : <FormText>-</FormText>
            }
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DESCRIPTION)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DESCRIPTION)}>
              {LeaseDecisionsFieldTitles.DESCRIPTION}
            </FormTextTitle>
            <FormText>{decision.description || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.CONDITIONS)}>
        <Collapse
          className='collapse__secondary'
          defaultOpen={conditionsCollapseState !== undefined ? conditionsCollapseState : true}
          headerTitle={LeaseDecisionConditionsFieldTitles.CONDITIONS}
          onToggle={handleConditionsCollapseToggle}
        >
          {!decision.conditions || !decision.conditions.length && <FormText>Ei ehtoja</FormText> }
          {decision.conditions && !!decision.conditions.length &&
            <BoxItemContainer>
              {largeScreen &&
                <Row>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                      <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.TYPE)}>
                        {LeaseDecisionConditionsFieldTitles.TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                      <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                        {LeaseDecisionConditionsFieldTitles.SUPERVISION_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                      <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                        {LeaseDecisionConditionsFieldTitles.SUPERVISED_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={6}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                      <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                        {LeaseDecisionConditionsFieldTitles.DESCRIPTION}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
              }
              {decision.conditions.map((condition, index) => {
                if(largeScreen) {
                  return(
                    <Row key={index}>
                      <Column large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                          <FormText>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                          <FormText className={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}>
                            {condition.supervision_date
                              ? <span><i/>{formatDate(condition.supervision_date)}</span>
                              : '–'
                            }
                          </FormText>
                        </Authorization>
                      </Column>
                      <Column large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                          <FormText className={condition.supervised_date ? 'success' : ''}>
                            {condition.supervised_date
                              ? <span><i/>{formatDate(condition.supervised_date)}</span>
                              : '–'
                            }
                          </FormText>
                        </Authorization>
                      </Column>
                      <Column large={6}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                          <FormText>{condition.description || '–'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                  );
                } else {
                  return(
                    <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                      <Row>
                        <Column small={6} medium={4}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.TYPE)}>
                              {LeaseDecisionConditionsFieldTitles.TYPE}
                            </FormTextTitle>
                            <FormText>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                              {LeaseDecisionConditionsFieldTitles.SUPERVISION_DATE}
                            </FormTextTitle>
                            <FormText className={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}>
                              {condition.supervision_date
                                ? <span><i/>{formatDate(condition.supervision_date)}</span>
                                : '–'
                              }
                            </FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                              {LeaseDecisionConditionsFieldTitles.SUPERVISED_DATE}
                            </FormTextTitle>
                            <FormText className={condition.supervised_date ? 'success' : ''}>
                              {condition.supervised_date
                                ? <span><i/>{formatDate(condition.supervised_date)}</span>
                                : '–'
                              }
                            </FormText>
                          </Authorization>
                        </Column>
                        <Column small={12} medium={12}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                              {LeaseDecisionConditionsFieldTitles.DESCRIPTION}
                            </FormTextTitle>
                            <FormText>{condition.description || '–'}</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    </BoxItem>
                  );
                }
              })}
            </BoxItemContainer>
          }
        </Collapse>
      </Authorization>
    </Collapse>
  );
};

export default flowRight(
  withWindowResize,
  connect(
    (state, props) => {
      const id = props.decision.id;
      return {
        attributes: getAttributes(state),
        conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.conditions`),
        decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.decision`),
      };
    },
    {
      receiveCollapseStates,
    }
  )
)(DecisionItem);
