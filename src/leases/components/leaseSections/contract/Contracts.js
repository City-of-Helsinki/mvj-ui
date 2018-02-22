// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../../components/collapse/Collapse';
import * as helpers from '../../../../util/helpers';
import ContractItem from './ContractItem';
import {Row, Column} from 'react-foundation';

type Props = {
  contracts: Array<Object>,
}
const Contracts = ({contracts}: Props) => {

  return (
    <div className='lease-section'>
      {contracts && contracts.length > 0 && contracts.map((contract, index) =>
        <Collapse key={index}
          defaultOpen={false}
          header={
            <Row>
              <Column small={4}>
                <svg className='doc-icon' viewBox="0 0 30 30">
                  <path d="M3.75.38H18.8l.42.28L26 7.41l.28.42v21.79H3.75V.38zM6 2.62v24.76h18v-18h-6.75V2.62zm3.38 9h11.24v2.26H9.38zm0 4.5h11.24v2.26H9.38zm0 4.5h11.24v2.26H9.38zM19.5 4.24v2.88h2.88z"/>
                </svg>
                <span className='collapse__header-title'>{get(contract, 'contract_type')} {get(contract, 'contract_number')}</span></Column>
              <Column small={4}><span className='collapse__header-subtitle'>{helpers.formatDate(contract.signing_date)}</span></Column>
              <Column small={4}><span className='collapse__header-subtitle'>{contract.active ? 'Voimassa' : 'Ei voimassa'}</span></Column>
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
