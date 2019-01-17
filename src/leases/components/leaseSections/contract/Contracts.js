// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import ContractItem from './ContractItem';
import FormText from '$components/form/FormText';
import {LeaseContractsFieldPaths} from '$src/leases/enums';
import {getContentContracts} from '$src/leases/helpers';
import {getFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  attributes: Attributes,
  contracts: Array<Object>,
  currentLease: Lease,
  typeOptions: Array<Object>,
}

class Contracts extends PureComponent<Props, State> {
  state = {
    attributes: {},
    contracts: [],
    currentLease: {},
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

  render() {
    const {contracts, typeOptions} = this.state;

    return (
      <Fragment>
        {(!contracts || !contracts.length) && <FormText className='no-margin'>Ei sopimuksia</FormText>}
        {contracts && !!contracts.length && contracts.map((contract, index) =>
          <ContractItem
            key={index}
            contract={contract}
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
      currentLease: getCurrentLease(state),
    };
  },
)(Contracts);
