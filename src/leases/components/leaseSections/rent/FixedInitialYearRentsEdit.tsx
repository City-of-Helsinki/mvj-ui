import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import ActionButtonWrapper from "/src/components/form/ActionButtonWrapper";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItem from "/src/components/content/BoxItem";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import RemoveButton from "/src/components/form/RemoveButton";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { Breakpoints } from "/src/foundation/enums";
import { LeaseRentFixedInitialYearRentsFieldPaths, LeaseRentFixedInitialYearRentsFieldTitles } from "/src/leases/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getFieldAttributes, hasPermissions, isFieldAllowedToRead, isFieldRequired } from "util/helpers";
import { getAttributes as getLeaseAttributes } from "/src/leases/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { withWindowResize } from "/src/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type Props = {
  fields: any;
  isSaveClicked: boolean;
  largeScreen: boolean;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const FixedInitialYearRentsEdit = ({
  fields,
  isSaveClicked,
  largeScreen,
  leaseAttributes,
  usersPermissions
}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.ADD_FIXEDINITIALYEARRENT) && (!fields || !fields.length)) {
    return <FormText>Ei sopimusvuokria</FormText>;
  }

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {fields && !!fields.length && <BoxItemContainer>
                {largeScreen && <Row>
                    <Column large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                        <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                          {LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                        <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                          {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={1}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                        <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                          {LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column large={1}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                        <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                          {LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>}
                {fields.map((rent, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_FIXED_INITIAL_YEAR_RENT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_FIXED_INITIAL_YEAR_RENT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_FIXED_INITIAL_YEAR_RENT.TITLE
              });
            };

            if (largeScreen) {
              return <Row key={index}>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)} invisibleLabel name={`${rent}.intended_use`} overrideValues={{
                      label: LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)} invisibleLabel name={`${rent}.amount`} unit='€' overrideValues={{
                      label: LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={1}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)} invisibleLabel name={`${rent}.start_date`} overrideValues={{
                      label: LeaseRentFixedInitialYearRentsFieldTitles.START_DATE
                    }} />
                          </Authorization>
                        </Column>
                        <Column large={1}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)} invisibleLabel name={`${rent}.end_date`} overrideValues={{
                      label: LeaseRentFixedInitialYearRentsFieldTitles.END_DATE
                    }} />
                          </Authorization>
                        </Column>
                        <Column>
                          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_FIXEDINITIALYEARRENT)}>
                            <RemoveButton className='third-level' onClick={handleRemove} title="Poista alennus/korotus" />
                          </Authorization>
                        </Column>
                      </Row>;
            } else {
              return <BoxItem key={index}>
                        <BoxContentWrapper>
                          <ActionButtonWrapper>
                            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_FIXEDINITIALYEARRENT)}>
                              <RemoveButton onClick={handleRemove} title="Poista kiinteä alkuvuosivuokra" />
                            </Authorization>
                          </ActionButtonWrapper>
                          <Row>
                            <Column small={6} medium={3}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)} name={`${rent}.intended_use`} overrideValues={{
                          label: LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)} />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={3}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)} name={`${rent}.amount`} unit='€' overrideValues={{
                          label: LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)} />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={3}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)} name={`${rent}.start_date`} overrideValues={{
                          label: LeaseRentFixedInitialYearRentsFieldTitles.START_DATE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)} />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={3}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)} name={`${rent}.end_date`} overrideValues={{
                          label: LeaseRentFixedInitialYearRentsFieldTitles.END_DATE
                        }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)} />
                              </Authorization>
                            </Column>
                          </Row>
                        </BoxContentWrapper>
                      </BoxItem>;
            }
          })}
              </BoxItemContainer>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_FIXEDINITIALYEARRENT)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={!fields || !fields.length ? 'no-top-margin' : ''} label='Lisää kiinteä alkuvuosivuokra' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

export default flowRight(withWindowResize, connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}))(FixedInitialYearRentsEdit);