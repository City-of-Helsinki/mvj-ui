// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import Authorization from '$components/authorization/Authorization';
import ContractFileModal from './ContractFileModal';
import ContractItemEdit from './ContractItemEdit';
import FormText from '$components/form/FormText';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {validateContractForm} from '$src/leases/formValidators';
import {getContentContracts, getDecisionOptions} from '$src/leases/helpers';
import {hasPermissions} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type ContractsProps = {
  decisionOptions: Array<Object>,
  fields: any,
  onShowContractFileModal: Function,
  savedContracts: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const renderContracts = ({
  decisionOptions,
  fields,
  onShowContractFileModal,
  savedContracts,
  usersPermissions,
}: ContractsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACT) &&
              (!fields || !fields.length) &&
              <FormText className='no-margin'>Ei sopimuksia</FormText>
            }

            {fields && !!fields.length && fields.map((contract, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_CONTRACT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_CONTRACT.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_CONTRACT.TITLE,
                });
              };

              return <ContractItemEdit
                key={index}
                decisionOptions={decisionOptions}
                field={contract}
                index={index}
                onRemove={handleRemove}
                onShowContractFileModal={onShowContractFileModal}
                savedContracts={savedContracts}
              />;
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACT)}>
              <Row>
                <Column>
                  <AddButton
                    label='Lisää sopimus'
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

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  receiveFormValidFlags: Function,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

type State = {
  contractId: number,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  savedContracts: Array<Object>,
  showContractModal: boolean,
}

class ContractsEdit extends PureComponent<Props, State> {
  state = {
    contractId: -1,
    currentLease: {},
    decisionOptions: [],
    savedContracts: [],
    showContractModal: false,
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease,
      newState.decisionOptions = getDecisionOptions(props.currentLease);
      newState.savedContracts = getContentContracts(props.currentLease);
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  handleShowContractFileModal = (contractId: number) => {
    this.setState({
      contractId,
      showContractModal: true,
    });
  }

  handleCloseContractFileModal = () => {
    this.setState({
      contractId: -1,
      showContractModal: false,
    });
  }

  render() {
    const {usersPermissions} = this.props;
    const {contractId, decisionOptions, savedContracts, showContractModal} = this.state;

    return (
      <form>
        <ContractFileModal
          contractId={contractId}
          onClose={this.handleCloseContractFileModal}
          open={showContractModal}
        />

        <FieldArray
          component={renderContracts}
          decisionOptions={decisionOptions}
          name="contracts"
          onShowContractFileModal={this.handleShowContractFileModal}
          savedContracts={savedContracts}
          usersPermissions={usersPermissions}
        />
      </form>
    );
  }
}

const formName = FormNames.LEASE_CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateContractForm,
  }),
)(ContractsEdit);
