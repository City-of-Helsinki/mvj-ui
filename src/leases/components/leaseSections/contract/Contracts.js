// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import ContractItem from './ContractItem';
import FormText from '$components/form/FormText';
import {LeaseContractsFieldPaths} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getContentContracts} from '$src/leases/helpers';
import {getFieldOptions} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisions: Array<Object>,
}

type State = {
  attributes: Attributes,
  contracts: Array<Object>,
  currentLease: Lease,
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Contracts extends PureComponent<Props, State> {
  state = {
    attributes: {},
    contracts: [],
    currentLease: {},
    decisions: [],
    decisionOptions: [],
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

    if(props.decisions !== state.decisions) {
      newState.decisions = props.decisions;
      newState.decisionOptions = getDecisionOptions(props.decisions);
    }

    return newState;
  }

  render() {
    const {contracts, decisionOptions, typeOptions} = this.state;

    return (
      <div>
        {(!contracts || !contracts.length) && <FormText className='no-margin'>Ei sopimuksia</FormText>}
        {contracts && !!contracts.length && contracts.map((contract, index) =>
          <ContractItem
            key={index}
            contract={contract}
            decisionOptions={decisionOptions}
            typeOptions={typeOptions}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  },
)(Contracts);
