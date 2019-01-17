// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {Breakpoints} from '$src/foundation/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  LeaseRentFixedInitialYearRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldTitles,
} from '$src/leases/enums';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  fields: any,
  isSaveClicked: boolean,
  largeScreen: boolean,
  leaseAttributes: Attributes,
}

const FixedInitialYearRentsEdit = ({fields, isSaveClicked, largeScreen, leaseAttributes}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  if(!isFieldAllowedToEdit(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS) && (!fields || !fields.length)) {
    return <FormText>Ei sopimusvuokria</FormText>;
  }

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <BoxItemContainer>
              {fields && !!fields.length && largeScreen &&
                <Row>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                        {LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                        {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                        {LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                        {LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
              }
              {fields && !!fields.length && fields.map((rent, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.FIXED_INITIAL_YEAR_RENT,
                    confirmationModalTitle: DeleteModalTitles.FIXED_INITIAL_YEAR_RENT,
                  });
                };

                if(largeScreen) {
                  return (
                    <Row key={index}>
                      <Column large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}
                            invisibleLabel={true}
                            name={`${rent}.intended_use`}
                            overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}}
                          />
                        </Authorization>
                      </Column>
                      <Column large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}
                            invisibleLabel={true}
                            name={`${rent}.amount`}
                            unit='€'
                            overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}}
                          />
                        </Authorization>
                      </Column>
                      <Column large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}
                            invisibleLabel={true}
                            name={`${rent}.start_date`}
                            overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}}
                          />
                        </Authorization>
                      </Column>
                      <Column large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}
                            invisibleLabel={true}
                            name={`${rent}.end_date`}
                            overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}}
                          />
                        </Authorization>
                      </Column>
                      <Column>
                        <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista alennus/korotus"
                          />
                        </Authorization>
                      </Column>
                    </Row>
                  );
                } else {
                  return (
                    <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
                            <RemoveButton
                              hideFor={Breakpoints.LARGE}
                              onClick={handleRemove}
                              title="Poista kiinteä alkuvuosivuokra"
                            />
                          </Authorization>
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={3}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}
                                name={`${rent}.intended_use`}
                                overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={3}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}
                                name={`${rent}.amount`}
                                unit='€'
                                overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={3}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}
                                name={`${rent}.start_date`}
                                overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={3}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}
                                name={`${rent}.end_date`}
                                overrideValues={{label: LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}}
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                }
              })}
            </BoxItemContainer>

            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                    label='Lisää kiinteä alkuvuosivuokra'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        leaseAttributes: getLeaseAttributes(state),
      };
    },
  ),
)(FixedInitialYearRentsEdit);
