import React, { ReactElement } from "react";
import { Row, Column } from "react-foundation";
import { FieldArray, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import ActionButtonWrapper from "/src/components/form/ActionButtonWrapper";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItem from "/src/components/content/BoxItem";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import Collapse from "/src/components/collapse/Collapse";
import FieldAndRemoveButtonWrapper from "/src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "/src/components/form/FormField";
import FormTextTitle from "/src/components/form/FormTextTitle";
import RemoveButton from "/src/components/form/RemoveButton";
import { receiveCollapseStates } from "landUseContract/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, ViewModes } from "enums";
import { ButtonColors } from "/src/components/enums";
import { getFieldAttributes, getFieldOptions, getLabelOfOption, isFieldRequired } from "util/helpers";
import { getCollapseStateByKey } from "landUseContract/selectors";
import { referenceNumber } from "/src/components/form/validations";
import { withWindowResize } from "/src/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
type DecisionConditionsProps = {
  attributes: Attributes;
  collapseState: boolean;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  largeScreen: boolean;
  onCollapseToggle: (...args: Array<any>) => any;
};

const renderDecisionConditions = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {
    name
  },
  isSaveClicked,
  largeScreen,
  onCollapseToggle
}: DecisionConditionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  const decisionConditionsErrors = get(errors, name);
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)} headerTitle='Ehdot' onToggle={onCollapseToggle}>
            <BoxItemContainer>
              {largeScreen && <Row>
                  <Column large={2}>
                    <FormTextTitle title='Ehtotyyppi' required={isFieldRequired(attributes, 'decisions.child.children.conditions.child.children.type')} />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle title='Valvontapvm' required={isFieldRequired(attributes, 'decisions.child.children.conditions.child.children.supervision_date')} />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle title='Valvottu pvm' required={isFieldRequired(attributes, 'decisions.child.children.conditions.child.children.supervised_date')} />
                  </Column>
                  <Column large={6}>
                    <FormTextTitle title='Huomautus' required={isFieldRequired(attributes, 'decisions.child.children.conditions.child.children.description')} />
                  </Column>
                </Row>}
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
                confirmationModalTitle: ConfirmationModalTexts.DELETE_CONDITION.TITLE
              });
            };

            if (largeScreen) {
              return <Row key={index}>
                      <Column large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.type')} invisibleLabel name={`${condition}.type`} overrideValues={{
                    label: 'Ehtotyyppi'
                  }} />
                      </Column>
                      <Column large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervision_date')} invisibleLabel name={`${condition}.supervision_date`} overrideValues={{
                    label: 'Valvontapvm'
                  }} />
                      </Column>
                      <Column large={2}>
                        <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervised_date')} invisibleLabel name={`${condition}.supervised_date`} overrideValues={{
                    label: 'Valvottu pvm'
                  }} />
                      </Column>
                      <Column large={6}>
                        <FieldAndRemoveButtonWrapper field={<FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.description')} invisibleLabel name={`${condition}.description`} overrideValues={{
                    label: 'Huomautus',
                    fieldType: FieldTypes.TEXTAREA
                  }} />} removeButton={<RemoveButton className='third-level' onClick={handleRemove} title="Poista ehto" />} />
                      </Column>
                    </Row>;
            } else {
              return <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <RemoveButton onClick={handleRemove} title="Poista ehto" />
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={4}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.type')} name={`${condition}.type`} overrideValues={{
                        label: 'Ehtotyyppi'
                      }} />
                          </Column>
                          <Column small={6} medium={4}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervision_date')} name={`${condition}.supervision_date`} overrideValues={{
                        label: 'Valvontapvm'
                      }} />
                          </Column>
                          <Column small={12} medium={4}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.supervised_date')} name={`${condition}.supervised_date`} overrideValues={{
                        label: 'Valvottu pvm'
                      }} />
                          </Column>
                          <Column small={12} medium={12}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.conditions.child.children.description')} name={`${condition}.description`} overrideValues={{
                        label: 'Huomautus'
                      }} />
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>;
            }
          })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary className={!fields.length ? 'no-top-margin' : '-'} label='Lisää ehto' onClick={handleAdd} />
              </Column>
            </Row>
          </Collapse>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  conditionsCollapseState: boolean;
  decisionCollapseState: boolean;
  decisionsData: Array<Record<string, any>>;
  decisionId: number;
  errors: Record<string, any> | null | undefined;
  field: string;
  index: number;
  isSaveClicked: boolean;
  largeScreen: boolean;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
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
  receiveCollapseStates
}: Props) => {
  const handleRemove = () => {
    onRemove(index);
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    if (!decisionId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [decisionId]: {
            decision: val
          }
        }
      }
    });
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    if (!decisionId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [decisionId]: {
            conditions: val
          }
        }
      }
    });
  };

  const getDecisionById = (decisions: Array<Record<string, any>>, decisionId: number) => decisions && decisions.length && decisionId ? decisions.find(decision => decision.id === decisionId) : {};

  const decisionMakerOptions = getFieldOptions(attributes, 'decisions.child.children.decision_maker'),
        decisionErrors = get(errors, field),
        savedDecision = getDecisionById(decisionsData, decisionId);
  return <Collapse defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true} hasErrors={isSaveClicked && !isEmpty(decisionErrors)} headerTitle={savedDecision ? getLabelOfOption(decisionMakerOptions, savedDecision.decision_maker) || '-' : '-'} onRemove={handleRemove} onToggle={handleDecisionCollapseToggle}>
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.decision_maker')} name={`${field}.decision_maker`} overrideValues={{
            label: 'Päättäjä'
          }} />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.decision_date')} name={`${field}.decision_date`} overrideValues={{
            label: 'Päätöspvm'
          }} />
          </Column>
          <Column small={6} medium={4} large={1}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.section')} name={`${field}.section`} unit='§' overrideValues={{
            label: 'Pykälä'
          }} />
          </Column>
          <Column small={6} medium={8} large={3}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.type')} name={`${field}.type`} overrideValues={{
            label: 'Päätöksen tyyppi'
          }} />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.reference_number')} name={`${field}.reference_number`} validate={referenceNumber} overrideValues={{
            label: 'Diaarinumero',
            fieldType: FieldTypes.REFERENCE_NUMBER
          }} />
          </Column>
          <Column small={12}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, 'decisions.child.children.description')} name={`${field}.description`} overrideValues={{
            label: 'Huomautus'
          }} />
          </Column>
        </Row>
      </BoxContentWrapper>

      <FieldArray attributes={attributes} collapseState={conditionsCollapseState} component={renderDecisionConditions} errors={errors} isSaveClicked={isSaveClicked} largeScreen={largeScreen} name={`${field}.conditions`} onCollapseToggle={handleConditionsCollapseToggle} />
    </Collapse>;
};

const formName = FormNames.LAND_USE_CONTRACT_DECISIONS;
const selector = formValueSelector(formName);
export default flowRight(withWindowResize, connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  return {
    conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`),
    decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`),
    decisionId: id
  };
}, {
  receiveCollapseStates
}))(DecisionItemEdit);