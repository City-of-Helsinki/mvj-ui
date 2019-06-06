// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxItemContainer from '$components/content/BoxItemContainer';
import DecisionLink from '$components/links/DecisionLink';
import FormText from '$components/form/FormText';
import RentAdjustmentEdit from './RentAdjustmentEdit';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseRentAdjustmentsFieldPaths,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getDecisionById, getDecisionOptions} from '$src/leases/helpers';
import {
  getFieldOptions,
  hasPermissions,
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
    const {fields, isSaveClicked, usersPermissions} = this.props;
    const {amountTypeOptions, decisionOptions} = this.state;

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
                  {fields.map((field, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.BUTTON,
                        confirmationModalLabel: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.LABEL,
                        confirmationModalTitle: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.TITLE,
                      });
                    };

                    return (
                      <RentAdjustmentEdit
                        key={index}
                        amountTypeOptions={amountTypeOptions}
                        decisionOptions={decisionOptions}
                        field={field}
                        isSaveClicked={isSaveClicked}
                        onRemove={handleRemove}
                      />
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
