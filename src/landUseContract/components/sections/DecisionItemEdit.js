// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ConfirmationModalTexts, FormNames, ViewModes} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';
import {getFieldAttributes, getFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type DecisionConditionsProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  largeScreen: boolean,
  onCollapseToggle: Function,
}

const renderDecisionConditions = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  largeScreen,
  onCollapseToggle,
}: DecisionConditionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const decisionConditionsErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)}
            headerTitle='Ehdot'
            onToggle={onCollapseToggle}
          >
            <BoxItemContainer>
              {largeScreen &&
                <Row>
                  <Column large={2}>
                    <FormTextTitle
                      title='Ehtotyyppi'
                      required={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.type.required')}
                    />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle
                      title='Valvontapvm'
                      required={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervision_date.required')}
                    />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle
                      title='Valvottu pvm'
                      required={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervised_date.required')}
                    />
                  </Column>
                  <Column large={6}>
                    <FormTextTitle
                      title='Huomautus'
                      required={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.description.required')}
                    />
                  </Column>
                </Row>
              }
              {fields && !!fields.length && fields.map((condition, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_CONDITION.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_CONDITION.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_CONDITION.TITLE,
                  });
                };
                if(largeScreen) {
                  return (
                    <Row key={index}>
                      <Column large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.type')}
                          invisibleLabel
                          name={`${condition}.type`}
                          overrideValues={{
                            label: 'Ehtotyyppi',
                          }}
                        />
                      </Column>
                      <Column large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervision_date')}
                          invisibleLabel
                          name={`${condition}.supervision_date`}
                          overrideValues={{
                            label: 'Valvontapvm',
                          }}
                        />
                      </Column>
                      <Column large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervised_date')}
                          invisibleLabel
                          name={`${condition}.supervised_date`}
                          overrideValues={{
                            label: 'Valvottu pvm',
                          }}
                        />
                      </Column>
                      <Column large={6}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.description')}
                              invisibleLabel
                              name={`${condition}.description`}
                              overrideValues={{
                                label: 'Huomautus',
                              }}
                            />
                          }
                          removeButton={
                            <RemoveButton
                              className='third-level'
                              onClick={handleRemove}
                              title="Poista ehto"
                            />
                          }
                        />
                      </Column>
                    </Row>
                  );
                } else {
                  return(
                    <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <RemoveButton
                            onClick={handleRemove}
                            title="Poista ehto"
                          />
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={4}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.type')}
                              name={`${condition}.type`}
                              overrideValues={{
                                label: 'Ehtotyyppi',
                              }}
                            />
                          </Column>
                          <Column small={6} medium={4}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervision_date')}
                              name={`${condition}.supervision_date`}
                              overrideValues={{
                                label: 'Valvontapvm',
                              }}
                            />
                          </Column>
                          <Column small={12} medium={4}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervised_date')}
                              name={`${condition}.supervised_date`}
                              overrideValues={{
                                label: 'Valvottu pvm',
                              }}
                            />
                          </Column>
                          <Column small={12} medium={12}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.description')}
                              name={`${condition}.description`}
                              overrideValues={{
                                label: 'Huomautus',
                              }}
                            />
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                }
              })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  className={!fields.length ? 'no-top-margin' : '-'}
                  label='Lisää ehto'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionsData: Array<Object>,
  decisionId: number,
  errors: ?Object,
  field: string,
  index: number,
  isSaveClicked: boolean,
  largeScreen: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
};

const DecisionItemEdit = ({
  attributes,
  conditionsCollapseState,
  decisionCollapseState,
  decisionsData,
  decisionId,
  errors,
  field,
  index,
  isSaveClicked,
  largeScreen,
  onRemove,
  receiveCollapseStates,
}: Props) => {
  const handleRemove = () => {
    onRemove(index);
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    if(!decisionId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [decisionId]: {
            decision: val,
          },
        },
      },
    });
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    if(!decisionId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [decisionId]: {
            conditions: val,
          },
        },
      },
    });
  };

  const getDecisionById = (decisions: Array<Object>, decisionId: number) => decisions && decisions.length && decisionId
    ? decisions.find((decision) => decision.id === decisionId)
    : {};

  const decisionMakerOptions = getFieldOptions(attributes, 'decisions.child.children.decision_maker'),
    decisionErrors = get(errors, field),
    savedDecision = getDecisionById(decisionsData, decisionId);

  return (
    <Collapse
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
      headerTitle={savedDecision ? (getLabelOfOption(decisionMakerOptions, savedDecision.decision_maker) || '-') : '-'}
      onRemove={handleRemove}
      onToggle={handleDecisionCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.decision_maker')}
              name={`${field}.decision_maker`}
              overrideValues={{
                label: 'Päättäjä',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.decision_date')}
              name={`${field}.decision_date`}
              overrideValues={{
                label: 'Päätöspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.section')}
              name={`${field}.section`}
              unit='§'
              overrideValues={{
                label: 'Pykälä',
              }}
            />
          </Column>
          <Column small={6} medium={8} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.type')}
              name={`${field}.type`}
              overrideValues={{
                label: 'Päätöksen tyyppi',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.reference_number')}
              name={`${field}.reference_number`}
              validate={referenceNumber}
              overrideValues={{
                label: 'Diaarinumero',
                fieldType: FieldTypes.REFERENCE_NUMBER,
              }}
            />
          </Column>
        </Row>
      </BoxContentWrapper>

      <FieldArray
        attributes={attributes}
        collapseState={conditionsCollapseState}
        component={renderDecisionConditions}
        errors={errors}
        isSaveClicked={isSaveClicked}
        largeScreen={largeScreen}
        name={`${field}.conditions`}
        onCollapseToggle={handleConditionsCollapseToggle}
      />
    </Collapse>
  );
};

const formName = FormNames.LAND_USE_CONTRACT_DECISIONS;
const selector = formValueSelector(formName);

export default flowRight(
  withWindowResize,
  connect(
    (state, props) => {
      const id = selector(state, `${props.field}.id`);

      return {
        conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`),
        decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`),
        decisionId: id,
      };
    },
    {
      receiveCollapseStates,
    }
  )
)(DecisionItemEdit);
