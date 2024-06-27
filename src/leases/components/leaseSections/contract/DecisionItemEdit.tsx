import React, { Fragment } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import Collapse from "/src/components/collapse/Collapse";
import DecisionConditionsEdit from "./DecisionConditionsEdit";
import FormField from "/src/components/form/FormField";
import { receiveCollapseStates } from "/src/leases/actions";
import { FieldTypes, FormNames, ViewModes } from "enums";
import { LeaseDecisionConditionsFieldPaths, LeaseDecisionsFieldPaths, LeaseDecisionsFieldTitles } from "/src/leases/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { getDecisionById } from "/src/leases/helpers";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { formatDate, getFieldAttributes, getFieldOptions, getLabelOfOption, hasPermissions, isFieldAllowedToRead } from "util/helpers";
import { getAttributes, getCollapseStateByKey, getCurrentLease, getErrorsByFormName, getIsSaveClicked } from "/src/leases/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { referenceNumber } from "/src/components/form/validations";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type Props = {
  attributes: Attributes;
  conditionsCollapseState: boolean;
  currentLease: Lease;
  decisionCollapseState: boolean;
  decisionId: number;
  errors: Record<string, any> | null | undefined;
  field: string;
  isSaveClicked: boolean;
  onAttach: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const DecisionItemEdit = ({
  attributes,
  conditionsCollapseState,
  currentLease,
  decisionCollapseState,
  decisionId,
  errors,
  field,
  isSaveClicked,
  onAttach,
  onRemove,
  receiveCollapseStates,
  usersPermissions
}: Props) => {
  const handleCollapseToggle = (key: string, val: boolean) => {
    if (!decisionId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_DECISIONS]: {
          [decisionId]: {
            [key]: val
          }
        }
      }
    });
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    handleCollapseToggle('decision', val);
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    handleCollapseToggle('conditions', val);
  };

  const handleAttach = () => {
    onAttach(decisionId);
  };

  const sectionReadOnlyRenderer = (value: string | null | undefined) => value ? `${value} §` : '-';

  const decisionMakerOptions = getFieldOptions(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER);
  const typeOptions = getFieldOptions(attributes, LeaseDecisionsFieldPaths.TYPE);
  const decisionErrors = get(errors, field),
        savedDecision = getDecisionById(currentLease, decisionId);
  return <Collapse defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true} hasErrors={isSaveClicked && !isEmpty(decisionErrors)} headerTitle={savedDecision ? <Fragment>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
            {getLabelOfOption(decisionMakerOptions, get(savedDecision, 'decision_maker')) || '-'}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
            {savedDecision.decision_date ? <span>&nbsp;&nbsp;{formatDate(savedDecision.decision_date)}</span> : ''}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
            {savedDecision.section ? <span>&nbsp;&nbsp;{savedDecision.section} §</span> : ''}
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
            {savedDecision.type ? <span>&nbsp;&nbsp;{getLabelOfOption(typeOptions, savedDecision.type)}</span> : ''}
          </Authorization>
          {!!savedDecision.conditions && !!savedDecision.conditions.length && ` (${savedDecision.conditions.length} ${savedDecision.conditions.length === 1 ? 'ehto' : 'ehtoa'})`}
        </Fragment> : '-'} onAttach={decisionId && hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION) ? handleAttach : null} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_DECISION) ? onRemove : null} onToggle={handleDecisionCollapseToggle}>
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DECISION_MAKER)} name={`${field}.decision_maker`} overrideValues={{
              label: LeaseDecisionsFieldTitles.DECISION_MAKER
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISION_MAKER)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DECISION_DATE)} name={`${field}.decision_date`} overrideValues={{
              label: LeaseDecisionsFieldTitles.DECISION_DATE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISION_DATE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={1}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.SECTION)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.SECTION)} name={`${field}.section`} unit='§' readOnlyValueRenderer={sectionReadOnlyRenderer} overrideValues={{
              label: LeaseDecisionsFieldTitles.SECTION
            }} enableUiDataEdit tooltipStyle={{
              right: 12
            }} uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.SECTION)} />
            </Authorization>
          </Column>
          <Column small={6} medium={8} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.TYPE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
              label: LeaseDecisionsFieldTitles.TYPE
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.TYPE)} />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)} name={`${field}.reference_number`} validate={referenceNumber} overrideValues={{
              label: LeaseDecisionsFieldTitles.REFERENCE_NUMBER,
              fieldType: FieldTypes.REFERENCE_NUMBER
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.REFERENCE_NUMBER)} />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DESCRIPTION)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionsFieldPaths.DESCRIPTION)} name={`${field}.description`} overrideValues={{
              label: LeaseDecisionsFieldTitles.DESCRIPTION
            }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DESCRIPTION)} />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.CONDITIONS)}>
        <FieldArray collapseState={conditionsCollapseState} component={DecisionConditionsEdit} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.conditions`} onCollapseToggle={handleConditionsCollapseToggle} />
      </Authorization>
    </Collapse>;
};

const formName = FormNames.LEASE_DECISIONS;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  const newProps: any = {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state),
    decisionId: id,
    errors: getErrorsByFormName(state, formName),
    isSaveClicked: getIsSaveClicked(state),
    usersPermissions: getUsersPermissions(state)
  };

  if (id) {
    newProps.conditionsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`);
    newProps.decisionCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`);
  }

  return newProps;
}, {
  receiveCollapseStates
})(DecisionItemEdit);