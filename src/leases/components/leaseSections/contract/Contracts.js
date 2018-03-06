// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import {contractTypeOptions} from '$src/constants';
import {formatDate, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import ContractItem from './ContractItem';
import DocIcon from '$components/icons/DocIcon';

type Props = {
  contracts: Array<Object>,
}
const Contracts = ({contracts}: Props) => {

  return (
    <div>
      {contracts && contracts.length > 0 && contracts.map((contract, index) =>
        <Collapse key={index}
          defaultOpen={false}
          header={
            <Row>
              <Column small={3}>
                <DocIcon />
                <span className='collapse__header-title'>{getLabelOfOption(contractTypeOptions, contract.contract_type)} {get(contract, 'contract_number')}</span></Column>
              <Column small={3}><span className='collapse__header-subtitle'>{formatDate(contract.signing_date)}</span></Column>
              <Column small={3}><span className='collapse__header-subtitle'>{contract.active ? 'Voimassa' : 'Ei voimassa'}</span></Column>
            </Row>
          }
        >
          <ContractItem contract={contract} />
        </Collapse>
      )}
    </div>
  );
};

export default Contracts;
