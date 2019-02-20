// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import AddButton from '$components/form/AddButton';
import ContractFileModal from './ContractFileModal';
import ContractItemEdit from './ContractItemEdit';
import FormText from '$components/form/FormText';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {Methods} from '$src/enums';
import {validateContractForm} from '$src/leases/formValidators';
import {getContentContracts, getDecisionOptions} from '$src/leases/helpers';
import {hasPermissions, isMethodAllowed} from '$util/helpers';
import {getMethods as getContractFileMethods} from '$src/contractFile/selectors';
import {getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
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
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.CONTRACT,
                  confirmationModalTitle: DeleteModalTitles.CONTRACT,
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
  contractFileMethods: MethodsType,
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
        [FormNames.CONTRACTS]: this.props.valid,
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
    const {contractFileMethods, usersPermissions} = this.props;
    const {contractId, decisionOptions, savedContracts, showContractModal} = this.state;

    return (
      <form>
        <Authorization allow={isMethodAllowed(contractFileMethods, Methods.GET)}>
          <ContractFileModal
            contractId={contractId}
            onClose={this.handleCloseContractFileModal}
            open={showContractModal}
          />
        </Authorization>

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

const formName = FormNames.CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      return {
        contractFileMethods: getContractFileMethods(state),
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
