import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import ActionButtonWrapper from "src/components/form/ActionButtonWrapper";
import Authorization from "src/components/authorization/Authorization";
import AddButtonSecondary from "src/components/form/AddButtonSecondary";
import BoxContentWrapper from "src/components/content/BoxContentWrapper";
import BoxItem from "src/components/content/BoxItem";
import BoxItemContainer from "src/components/content/BoxItemContainer";
import Collapse from "src/components/collapse/Collapse";
import FieldAndRemoveButtonWrapper from "src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "src/components/form/FormField";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
import RemoveButton from "src/components/form/RemoveButton";
import { ConfirmationModalTexts, FieldTypes } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { LeaseDecisionConditionsFieldPaths, LeaseDecisionConditionsFieldTitles } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getUiDataLeaseKey } from "src/uiData/helpers";
import { getFieldAttributes, hasPermissions, isFieldAllowedToRead, isFieldRequired } from "src/util/helpers";
import { getAttributes } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import { withWindowResize } from "src/components/resize/WindowResizeHandler";
import type { Attributes } from "src/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  attributes: Attributes;
  collapseState: boolean;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  largeScreen: boolean;
  onCollapseToggle: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const DecisionConditionsEdit = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {
    name
  },
  isSaveClicked,
  largeScreen,
  onCollapseToggle,
  usersPermissions
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const decisionConditionsErrors = get(errors, name);
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)} headerTitle={LeaseDecisionConditionsFieldTitles.CONDITIONS} onToggle={handleCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.CONDITIONS)}>

            {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONDITION) && (!fields || !fields.length) && <FormText>Ei ehtoja</FormText>}

            {fields && !!fields.length && <BoxItemContainer>
                {largeScreen && <Row>
                    <Column large={2}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                        <FormTextTitle required={isFieldRequired(attributes, LeaseDecisionConditionsFieldPaths.TYPE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.TYPE)}>
                          {LeaseDecisionConditionsFieldTitles.TYPE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={2}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                        <FormTextTitle required={isFieldRequired(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                          {LeaseDecisionConditionsFieldTitles.SUPERVISION_DATE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={2}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                        <FormTextTitle required={isFieldRequired(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                          {LeaseDecisionConditionsFieldTitles.SUPERVISED_DATE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={6}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                        <FormTextTitle required={isFieldRequired(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)} enableUiDataEdit tooltipStyle={{
                  right: 20
                }} uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                          {LeaseDecisionConditionsFieldTitles.DESCRIPTION}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>}
                {fields.map((condition, index) => {
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
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.TYPE)} invisibleLabel name={`${condition}.type`} overrideValues={{
                      label: LeaseDecisionConditionsFieldTitles.TYPE
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)} invisibleLabel name={`${condition}.supervision_date`} overrideValues={{
                      label: LeaseDecisionConditionsFieldTitles.SUPERVISION_DATE
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)} invisibleLabel name={`${condition}.supervised_date`} overrideValues={{
                      label: LeaseDecisionConditionsFieldTitles.SUPERVISED_DATE
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={6}>
                          <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)} invisibleLabel name={`${condition}.description`} overrideValues={{
                      label: LeaseDecisionConditionsFieldTitles.DESCRIPTION,
                      fieldType: FieldTypes.TEXTAREA
                    }} />
                              </Authorization>} removeButton={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_CONDITION)}>
                                <RemoveButton className='third-level' onClick={handleRemove} title="Poista ehto" />
                              </Authorization>} />
                        </Column>
                      </Row>;
            } else {
              return <BoxItem key={index}>
                        <BoxContentWrapper>
                          <ActionButtonWrapper>
                            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_CONDITION)}>
                              <RemoveButton onClick={handleRemove} title="Poista ehto" />
                            </Authorization>
                          </ActionButtonWrapper>
                          <Row>
                            <Column small={6} medium={4}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.TYPE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.TYPE)} name={`${condition}.type`} overrideValues={{
                          label: LeaseDecisionConditionsFieldTitles.TYPE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.TYPE)} />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)} name={`${condition}.supervision_date`} overrideValues={{
                          label: LeaseDecisionConditionsFieldTitles.SUPERVISION_DATE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISION_DATE)} />
                              </Authorization>
                            </Column>
                            <Column small={12} medium={4}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)} name={`${condition}.supervised_date`} overrideValues={{
                          label: LeaseDecisionConditionsFieldTitles.SUPERVISED_DATE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.SUPERVISED_DATE)} />
                              </Authorization>
                            </Column>
                            <Column small={12} medium={12}>
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseDecisionConditionsFieldPaths.DESCRIPTION)} name={`${condition}.description`} overrideValues={{
                          label: LeaseDecisionConditionsFieldTitles.DESCRIPTION,
                          fieldType: FieldTypes.TEXTAREA
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionConditionsFieldPaths.DESCRIPTION)} />
                              </Authorization>
                            </Column>
                          </Row>
                        </BoxContentWrapper>
                      </BoxItem>;
            }
          })}
              </BoxItemContainer>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONDITION)}>
              <Row>
                <Column>
                  <AddButtonSecondary label='Lisää ehto' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Collapse>;
    }}
    </AppConsumer>;
};

export default flowRight(withWindowResize, connect(state => {
  return {
    attributes: getAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}))(DecisionConditionsEdit);