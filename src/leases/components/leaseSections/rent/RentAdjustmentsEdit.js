// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import DecisionLink from '$components/links/DecisionLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getDecisionById, getDecisionOptions} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  adjustments: Array<Object>,
  currentLease:Lease,
  fields: any,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

type State = {
  amountTypeOptions: Array<Object>,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  leaseAttributes: Attributes,
}

class RentAdjustmentsEdit extends PureComponent<Props, State> {
  state = {
    amountTypeOptions: [],
    currentLease: {},
    decisionOptions: [],
    leaseAttributes: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.decisionOptions = getDecisionOptions(props.currentLease);
    }

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.amountTypeOptions = getFieldOptions(props.leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE);
    }

    return newState;
  }

  decisionReadOnlyRenderer = (value: ?number) => {
    const {currentLease, decisionOptions} = this.state;

    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
  };

  handleAdd = () => {
    const {fields} = this.props;

    fields.push({});
  };

  render() {
    const {fields, isSaveClicked, leaseAttributes, usersPermissions} = this.props;
    const {decisionOptions} = this.state;

    if(!hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT) &&
      (!fields || !fields.length)) {
      return <FormText>Ei alennuksia tai korotuksia</FormText>;
    }

    return (
      <AppConsumer>
        {({dispatch}) => {
          return(
            <Fragment>
              {fields && !!fields.length &&
                <BoxItemContainer>
                  {fields.map((discount, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: 'Poista',
                        confirmationModalLabel: DeleteModalLabels.RENT_ADJUSTMENT,
                        confirmationModalTitle: DeleteModalTitles.RENT_ADJUSTMENT,
                      });
                    };

                    const getFullAmountText = () => {
                      const {adjustments} = this.props;
                      const {amountTypeOptions} = this.state;
                      const adjustment = adjustments[index];

                      if(!adjustment.full_amount) return null;

                      return `${formatNumber(adjustment.full_amount)} ${getLabelOfOption(amountTypeOptions, adjustment.amount_type)}`;
                    };

                    const fullAmountText = getFullAmountText();

                    return (
                      <BoxItem key={index}>
                        <BoxContentWrapper>
                          <ActionButtonWrapper>
                            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_RENTADJUSTMENT)}>
                              <RemoveButton
                                onClick={handleRemove}
                                title="Poista alennus/korotus"
                              />
                            </Authorization>
                          </ActionButtonWrapper>
                          <Row>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}
                                  name={`${discount}.type`}
                                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.TYPE}}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.TYPE)}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
                                  name={`${discount}.intended_use`}
                                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE}}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Row>
                                <Column small={6}>
                                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                                    <FormField
                                      disableTouched={isSaveClicked}
                                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}
                                      name={`${discount}.start_date`}
                                      overrideValues={{label: LeaseRentAdjustmentsFieldTitles.START_DATE}}
                                      enableUiDataEdit
                                      uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}
                                    />
                                  </Authorization>
                                </Column>
                                <Column small={6}>
                                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                                    <FormField
                                      disableTouched={isSaveClicked}
                                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}
                                      name={`${discount}.end_date`}
                                      overrideValues={{label: LeaseRentAdjustmentsFieldTitles.END_DATE}}
                                      enableUiDataEdit
                                      uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}
                                    />
                                  </Authorization>
                                </Column>
                              </Row>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                                <FormTextTitle
                                  required={isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                                >
                                  {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                                </FormTextTitle>

                                <Row>
                                  <Authorization
                                    allow={
                                      isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT) ||
                                      isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)
                                    }
                                    errorComponent={<Column><FormText>{fullAmountText}</FormText></Column>}
                                  >
                                    <Column small={6}>
                                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                                        <FormField
                                          disableTouched={isSaveClicked}
                                          fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                                          invisibleLabel
                                          name={`${discount}.full_amount`}
                                          overrideValues={{label: LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}}
                                        />
                                      </Authorization>
                                    </Column>
                                    <Column small={6}>
                                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}>
                                        <FormField
                                          disableTouched={isSaveClicked}
                                          fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}
                                          invisibleLabel
                                          name={`${discount}.amount_type`}
                                          overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_TYPE}}
                                        />
                                      </Authorization>
                                    </Column>
                                  </Authorization>
                                </Row>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                                  name={`${discount}.amount_left`}
                                  unit='€'
                                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}}
                                  enableUiDataEdit
                                  tooltipStyle={{right: 12}}
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}
                                  name={`${discount}.decision`}
                                  readOnlyValueRenderer={this.decisionReadOnlyRenderer}
                                  overrideValues={{
                                    label: LeaseRentAdjustmentsFieldTitles.DECISION,
                                    options: decisionOptions,

                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}
                                />
                              </Authorization>
                            </Column>
                          </Row>
                          <Row>
                            <Column medium={12}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}
                                  name={`${discount}.note`}
                                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.NOTE}}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.NOTE)}
                                />
                              </Authorization>
                            </Column>
                          </Row>
                        </BoxContentWrapper>
                      </BoxItem>
                    );
                  })}
                </BoxItemContainer>
              }

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT)}>
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                      label='Lisää alennus/korotus'
                      onClick={this.handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      adjustments: selector(state, props.fields.name),
      currentLease: getCurrentLease(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(RentAdjustmentsEdit);
