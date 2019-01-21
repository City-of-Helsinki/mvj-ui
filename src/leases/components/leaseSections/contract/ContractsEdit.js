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
import {DeleteModalLabels, DeleteModalTitles, FormNames, LeaseContractsFieldPaths} from '$src/leases/enums';
import {validateContractForm} from '$src/leases/formValidators';
import {getContentContracts, getDecisionOptions} from '$src/leases/helpers';
import {isFieldAllowedToEdit} from '$util/helpers';
import {getMethods as getContractFileMethods} from '$src/contractFile/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Methods} from '$src/types';
import type {Lease} from '$src/leases/types';

type ContractsProps = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  fields: any,
  onShowContractFileModal: Function,
  savedContracts: Array<Object>,
}

const renderContracts = ({
  attributes,
  decisionOptions,
  fields,
  onShowContractFileModal,
  savedContracts,
}: ContractsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(attributes, LeaseContractsFieldPaths.CONTRACTS) && (!fields || !fields.length) &&
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
                attributes={attributes}
                decisionOptions={decisionOptions}
                field={contract}
                index={index}
                onRemove={handleRemove}
                onShowContractFileModal={onShowContractFileModal}
                savedContracts={savedContracts}
              />;
            })}

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
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
  contractFileMethods: Methods,
  currentLease: Lease,
  receiveFormValidFlags: Function,
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
    const {attributes, contractFileMethods} = this.props;
    const {contractId, decisionOptions, savedContracts, showContractModal} = this.state;

    return (
      <form>
        <Authorization allow={contractFileMethods.GET}>
          <ContractFileModal
            contractId={contractId}
            onClose={this.handleCloseContractFileModal}
            open={showContractModal}
          />
        </Authorization>

        <FieldArray
          attributes={attributes}
          component={renderContracts}
          decisionOptions={decisionOptions}
          name="contracts"
          onShowContractFileModal={this.handleShowContractFileModal}
          savedContracts={savedContracts}
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
        attributes: getAttributes(state),
        contractFileMethods: getContractFileMethods(state),
        currentLease: getCurrentLease(state),
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
