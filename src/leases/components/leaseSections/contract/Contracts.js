// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import ContractFileModal from './ContractFileModal';
import ContractItem from './ContractItem';
import FormText from '$components/form/FormText';
import {LeaseContractsFieldPaths} from '$src/leases/enums';
import {Methods} from '$src/enums';
import {getContentContracts} from '$src/leases/helpers';
import {getFieldOptions, isMethodAllowed} from '$util/helpers';
import {getMethods as getContractFileMethods} from '$src/contractFile/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractFileMethods: MethodsType,
  currentLease: Lease,
}

type State = {
  attributes: Attributes,
  contractId: number,
  contracts: Array<Object>,
  currentLease: Lease,
  showContractModal: boolean,
  typeOptions: Array<Object>,
}

class Contracts extends PureComponent<Props, State> {
  state = {
    attributes: null,
    contractId: -1,
    contracts: [],
    currentLease: {},
    showContractModal: false,
    typeOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.typeOptions = getFieldOptions(props.attributes, LeaseContractsFieldPaths.TYPE);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.contracts = getContentContracts(props.currentLease);
    }

    return newState;
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
    const {contractFileMethods} = this.props;
    const {contractId, contracts, showContractModal, typeOptions} = this.state;

    return (
      <Fragment>
        <Authorization allow={isMethodAllowed(contractFileMethods, Methods.GET)}>
          <ContractFileModal
            contractId={contractId}
            onClose={this.handleCloseContractFileModal}
            open={showContractModal}
          />
        </Authorization>
        {(!contracts || !contracts.length) && <FormText className='no-margin'>Ei sopimuksia</FormText>}
        {contracts && !!contracts.length && contracts.map((contract, index) =>
          <ContractItem
            key={index}
            contract={contract}
            onShowContractFileModal={this.handleShowContractFileModal}
            typeOptions={typeOptions}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      contractFileMethods: getContractFileMethods(state),
      currentLease: getCurrentLease(state),
    };
  },
)(Contracts);
