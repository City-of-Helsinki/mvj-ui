// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  fields: any,
  decisions: Array<Object>,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
}

type State = {
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
}

class RentAdjustmentsEdit extends PureComponent<Props, State> {
  state = {
    decisions: [],
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if(props.decisions !== state.decisions) {
      return {
        decisions: props.decisions,
        decisionOptions: getDecisionOptions(props.decisions),
      };
    }

    return null;
  }

  handleAdd = () => {
    const {fields} = this.props;

    fields.push({});
  };

  render() {
    const {fields, isSaveClicked, leaseAttributes} = this.props;
    const {decisionOptions} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          return(
            <Fragment>
              <BoxItemContainer>
                {fields && !!fields.length && fields.map((discount, index) => {
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

                  return (
                    <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}>
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
                                  />
                                </Authorization>
                              </Column>
                            </Row>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                              <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                                {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                              </FormTextTitle>
                              <Row>
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
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}
                                name={`${discount}.decision`}
                                overrideValues={{
                                  label: LeaseRentAdjustmentsFieldTitles.DECISION,
                                  options: decisionOptions,

                                }}
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
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                })}
              </BoxItemContainer>

              <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS)}>
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

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      decisions: getDecisionsByLease(state, currentLease.id),
      leaseAttributes: getLeaseAttributes(state),
    };
  },
)(RentAdjustmentsEdit);
