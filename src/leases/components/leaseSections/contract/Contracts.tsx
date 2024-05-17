import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import ContractFileModal from "./ContractFileModal";
import ContractItem from "./ContractItem";
import FormText from "src/components/form/FormText";
import { LeaseContractsFieldPaths } from "src/leases/enums";
import { getContentContracts } from "src/leases/helpers";
import { getFieldOptions } from "src/util/helpers";
import { getAttributes, getCurrentLease } from "src/leases/selectors";
import type { Attributes } from "src/types";
import type { Lease } from "src/leases/types";
type Props = {
  attributes: Attributes;
  currentLease: Lease;
};
type State = {
  attributes: Attributes;
  contractId: number;
  contracts: Array<Record<string, any>>;
  currentLease: Lease;
  showContractModal: boolean;
  typeOptions: Array<Record<string, any>>;
};

class Contracts extends PureComponent<Props, State> {
  state = {
    attributes: null,
    contractId: -1,
    contracts: [],
    currentLease: {},
    showContractModal: false,
    typeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.typeOptions = getFieldOptions(props.attributes, LeaseContractsFieldPaths.TYPE);
    }

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.contracts = getContentContracts(props.currentLease);
    }

    return newState;
  }

  handleShowContractFileModal = (contractId: number) => {
    this.setState({
      contractId,
      showContractModal: true
    });
  };
  handleCloseContractFileModal = () => {
    this.setState({
      contractId: -1,
      showContractModal: false
    });
  };

  render() {
    const {
      contractId,
      contracts,
      showContractModal,
      typeOptions
    } = this.state;
    return <Fragment>
        <ContractFileModal contractId={contractId} onClose={this.handleCloseContractFileModal} open={showContractModal} />

        {(!contracts || !contracts.length) && <FormText className='no-margin'>Ei sopimuksia</FormText>}
        {contracts && !!contracts.length && contracts.map((contract, index) => <ContractItem key={index} contract={contract} onShowContractFileModal={this.handleShowContractFileModal} typeOptions={typeOptions} />)}
      </Fragment>;
  }

}

export default connect(state => {
  return {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state)
  };
})(Contracts);