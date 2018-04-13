// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import moment from 'moment';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import ContractItem from './ContractItem';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contracts: Array<Object>,
  decisionOptions: Array<Object>,
}
const Contracts = ({attributes, contracts, decisionOptions}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.type');

  const isContractActive = (item) => {
    const start_date = item.collateral_start_date;
    const end_date = item.collateral_end_date;
    if(!start_date && !end_date) {
      return false;
    }
    const now = moment();
    if(!!start_date && moment(start_date).isAfter(now)) {
      return false;
    } else if (!!start_date && !moment(start_date).isAfter(now)){
      if(!end_date) {
        return true;
      } else if(!now.isAfter(moment(end_date))) {
        return true;
      }
      return false;
    } else {
      if(now.isAfter(moment(end_date))) {
        return false;
      }
      return true;
    }
  };

  return (
    <div>
      {(!contracts || !contracts.length) && <p>Ei sopimuksia</p>}
      {contracts && !!contracts.length && contracts.map((contract, index) =>
        <Collapse
          key={index}
          defaultOpen={false}
          header={
            <Row>
              <Column small={3}>
                <h3 className='collapse__header-title'>
                  {getLabelOfOption(typeOptions, contract.type)} {get(contract, 'contract_number')}
                </h3>
              </Column>
              <Column small={3}>
                <span className='collapse__header-subtitle'>
                  {formatDate(contract.signing_date) || '-'}
                </span>
              </Column>
              <Column small={3}>
                <span className='collapse__header-subtitle'>
                  {isContractActive(contract) ? 'Voimassa' : 'Ei voimassa'}
                </span>
              </Column>
            </Row>
          }
        >
          <ContractItem
            attributes={attributes}
            contract={contract}
            decisionOptions={decisionOptions}
          />
        </Collapse>
      )}
    </div>
  );
};

export default Contracts;
