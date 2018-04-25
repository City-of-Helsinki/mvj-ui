// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import ContractItem from './ContractItem';
import {getContentContracts} from '$src/leases/helpers';
import {isContractActive} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisionOptions: Array<Object>,
}
const Contracts = ({attributes, currentLease}: Props) => {
  const contracts = getContentContracts(currentLease);
  const typeOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.type');

  return (
    <div>
      {(!contracts || !contracts.length) && <p>Ei sopimuksia</p>}
      {contracts && !!contracts.length && contracts.map((contract, index) =>
        <Collapse
          key={index}
          defaultOpen={false}
          header={
            <div>
              <Column>
                <span className='collapse__header-subtitle'>
                  {formatDate(contract.signing_date) || '-'}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {isContractActive(contract) ? 'Voimassa' : 'Ei voimassa'}
                </span>
              </Column>
            </div>
          }
          headerTitle={
            <h3 className='collapse__header-title'>
              {getLabelOfOption(typeOptions, contract.type)} {get(contract, 'contract_number')}
            </h3>
          }
        >
          <ContractItem
            contract={contract}
          />
        </Collapse>
      )}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(Contracts);
